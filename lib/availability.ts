import fs from 'fs';
import path from 'path';

export interface DoctorOverride {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'full_day' | 'specific_slots';
  blockedSlots?: string[]; // e.g. ["10:30", "11:15"]
  reason: string;
  createdAt: string;
}

const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NOW_REGION
);

const DATA_DIR = isServerless
  ? path.join('/tmp', 'clinic-data')
  : path.join(process.cwd(), 'data');

const AVAILABILITY_FILE = path.join(DATA_DIR, 'doctor-availability.json');
const BUNDLED_AVAILABILITY_FILE = path.join(process.cwd(), 'data', 'doctor-availability.json');

// In-memory state for serverless resilience
let inMemoryOverrides: DoctorOverride[] | null = null;
const deletedOverrideIds = new Set<string>();

function ensureDataDir(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn(`[availability] Unable to create ${DATA_DIR}:`, err);
    return false;
  }
}

export function getAllDoctorOverrides(): DoctorOverride[] {
  if (ensureDataDir()) {
    try {
      let fileToRead = AVAILABILITY_FILE;
      if (!fs.existsSync(fileToRead) && fs.existsSync(BUNDLED_AVAILABILITY_FILE)) {
        fileToRead = BUNDLED_AVAILABILITY_FILE;
      }

      if (fs.existsSync(fileToRead)) {
        const raw = fs.readFileSync(fileToRead, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const baseList = parsed.filter((o: DoctorOverride) => !deletedOverrideIds.has(o.id));
          if (inMemoryOverrides) {
            const ids = new Set(baseList.map((o: DoctorOverride) => o.id));
            const additions = inMemoryOverrides.filter(
              (o) => !ids.has(o.id) && !deletedOverrideIds.has(o.id)
            );
            return [...baseList, ...additions];
          }
          return baseList;
        }
      }
    } catch (err) {
      console.warn('[availability] Failed to read availability file, using fallback:', err);
    }
  }
  return (inMemoryOverrides || []).filter((o) => !deletedOverrideIds.has(o.id));
}

export function saveDoctorOverride(override: DoctorOverride): DoctorOverride {
  deletedOverrideIds.delete(override.id);
  const current = getAllDoctorOverrides();

  // Deduplicate by ID
  const map = new Map<string, DoctorOverride>();
  current.forEach((item) => map.set(item.id, item));
  map.set(override.id, override);
  const updatedList = Array.from(map.values());

  inMemoryOverrides = updatedList;

  if (ensureDataDir()) {
    try {
      fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(updatedList, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[availability] Failed to write availability to disk, saved in-memory:', err);
    }
  }

  return override;
}

export function deleteDoctorOverride(id: string): DoctorOverride[] {
  const current = getAllDoctorOverrides();
  deletedOverrideIds.add(id);

  const filtered = current.filter((o) => o.id !== id);
  inMemoryOverrides = filtered;

  if (ensureDataDir()) {
    try {
      fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[availability] Failed to write updated overrides to disk:', err);
    }
  }

  return filtered;
}

/**
 * Checks if a whole date is blocked by the doctor
 */
export function isDateBlockedByDoctor(date: string): { blocked: boolean; reason?: string } {
  const overrides = getAllDoctorOverrides();
  const match = overrides.find((o) => o.date === date && o.type === 'full_day');
  if (match) {
    return { blocked: true, reason: match.reason || 'Doctor on leave' };
  }
  return { blocked: false };
}

/**
 * Returns any blocked slots for a specific date (includes all slots if full_day)
 */
export function getBlockedSlotsForDate(date: string, allPossibleSlots?: string[]): string[] {
  const overrides = getAllDoctorOverrides();
  const dateOverrides = overrides.filter((o) => o.date === date);

  const blocked = new Set<string>();

  for (const o of dateOverrides) {
    if (o.type === 'full_day') {
      if (allPossibleSlots) {
        allPossibleSlots.forEach((s) => blocked.add(s));
      }
    } else if (o.type === 'specific_slots' && Array.isArray(o.blockedSlots)) {
      o.blockedSlots.forEach((s) => blocked.add(s));
    }
  }

  return Array.from(blocked);
}

/**
 * Returns list of dates that have full-day doctor leave
 */
export function getDoctorBlockedDates(): { date: string; reason: string }[] {
  const overrides = getAllDoctorOverrides();
  return overrides
    .filter((o) => o.type === 'full_day')
    .map((o) => ({ date: o.date, reason: o.reason }));
}
