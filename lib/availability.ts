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

// In-memory fallback
let inMemoryOverrides: DoctorOverride[] = [];

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
          // Merge with any in-memory additions
          const ids = new Set(parsed.map((o: DoctorOverride) => o.id));
          const additions = inMemoryOverrides.filter((o) => !ids.has(o.id));
          return [...parsed, ...additions];
        }
      }
    } catch (err) {
      console.warn('[availability] Failed to read availability file, using fallback:', err);
    }
  }
  return inMemoryOverrides;
}

export function saveDoctorOverride(override: DoctorOverride): DoctorOverride {
  inMemoryOverrides = [
    ...inMemoryOverrides.filter((o) => o.id !== override.id),
    override,
  ];

  if (ensureDataDir()) {
    try {
      const all = getAllDoctorOverrides();
      // Deduplicate by ID
      const map = new Map<string, DoctorOverride>();
      all.forEach((item) => map.set(item.id, item));
      map.set(override.id, override);
      const list = Array.from(map.values());
      fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[availability] Failed to write availability to disk, saved in-memory:', err);
    }
  }

  return override;
}

export function deleteDoctorOverride(id: string): boolean {
  inMemoryOverrides = inMemoryOverrides.filter((o) => o.id !== id);

  if (ensureDataDir()) {
    try {
      if (fs.existsSync(AVAILABILITY_FILE)) {
        const raw = fs.readFileSync(AVAILABILITY_FILE, 'utf-8');
        const parsed: DoctorOverride[] = JSON.parse(raw);
        const filtered = parsed.filter((o) => o.id !== id);
        fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
      }
      return true;
    } catch (err) {
      console.warn('[availability] Failed to delete override from disk:', err);
    }
  }
  return true;
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

