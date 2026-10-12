import fs from 'fs';
import path from 'path';
import type { Credentials } from 'google-auth-library';

export interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  age: number;
  reason: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  message?: string;
  meetLink?: string;
  googleEventId?: string;
  createdAt: string;
  // Status & Payment Management
  status?: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  paymentStatus?: 'paid' | 'pending' | 'refunded';
  amount?: number; // In INR, default: 800
  paymentMethod?: 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Pending';
  paymentId?: string;
  paidAt?: string;
  notes?: string;
}

// In Vercel / serverless runtime, process.cwd() is read-only (/var/task).
// Only /tmp is writable. In local development, we use local data/ folder.
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NOW_REGION
);

const DATA_DIR = isServerless
  ? path.join('/tmp', 'clinic-data')
  : path.join(process.cwd(), 'data');

const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const BUNDLED_APPOINTMENTS_FILE = path.join(process.cwd(), 'data', 'appointments.json');
const TOKENS_FILE = path.join(DATA_DIR, 'google-tokens.json');

// In-memory fallback stores to guarantee zero crashes on read-only environments
let inMemoryAppointments: Appointment[] = [];
let deletedAppointmentIds = new Set<string>();
let inMemoryTokens: Credentials | null = null;

function ensureDataDir(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn(`[storage] Unable to create ${DATA_DIR}:`, err);
    return false;
  }
}

function normalizeAppointment(appt: Appointment): Appointment {
  return {
    ...appt,
    status: appt.status || 'confirmed',
    paymentStatus: appt.paymentStatus || 'paid',
    amount: typeof appt.amount === 'number' ? appt.amount : 800,
    paymentMethod: appt.paymentMethod || 'UPI',
    paymentId: appt.paymentId || `PAY-${appt.id.slice(0, 8).toUpperCase()}`,
    paidAt: appt.paidAt || appt.createdAt,
    notes: appt.notes || '',
  };
}

export function getAllAppointments(): Appointment[] {
  let list: Appointment[] = [];
  if (ensureDataDir()) {
    try {
      let fileToRead = APPOINTMENTS_FILE;
      // In serverless, if /tmp doesn't have the file yet, read bundled repository file
      if (!fs.existsSync(fileToRead) && fs.existsSync(BUNDLED_APPOINTMENTS_FILE)) {
        fileToRead = BUNDLED_APPOINTMENTS_FILE;
      }

      if (fs.existsSync(fileToRead)) {
        const raw = fs.readFileSync(fileToRead, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Merge disk appointments with any runtime additions
          const ids = new Set(parsed.map((a: Appointment) => a.id));
          const additions = inMemoryAppointments.filter(
            (a) => !ids.has(a.id) && !deletedAppointmentIds.has(a.id)
          );
          list = [...parsed, ...additions];
        } else {
          list = inMemoryAppointments.filter((a) => !deletedAppointmentIds.has(a.id));
        }
      } else {
        list = inMemoryAppointments.filter((a) => !deletedAppointmentIds.has(a.id));
      }
    } catch (err) {
      console.warn('[storage] Failed to read appointments file, using in-memory fallback:', err);
      list = inMemoryAppointments.filter((a) => !deletedAppointmentIds.has(a.id));
    }
  } else {
    list = inMemoryAppointments.filter((a) => !deletedAppointmentIds.has(a.id));
  }
  return list
    .filter((a) => !deletedAppointmentIds.has(a.id))
    .map(normalizeAppointment);
}

export function getAppointmentById(id: string): Appointment | null {
  const all = getAllAppointments();
  return all.find((a) => a.id === id) || null;
}

export function saveAppointment(appointment: Appointment): Appointment {
  const normalized = normalizeAppointment(appointment);
  inMemoryAppointments = [
    ...inMemoryAppointments.filter((a) => a.id !== normalized.id),
    normalized,
  ];

  if (ensureDataDir()) {
    try {
      const appointments = getAllAppointments();
      const deduped = Array.from(
        new Map(appointments.map((a) => [a.id, a])).values()
      );
      fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(deduped, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[storage] Failed to write appointment to disk, saved in-memory:', err);
    }
  }

  return normalized;
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const all = getAllAppointments();
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updated: Appointment = {
    ...all[index],
    ...updates,
    id, // preserve ID
  };

  all[index] = updated;
  inMemoryAppointments = [
    ...inMemoryAppointments.filter((a) => a.id !== id),
    updated,
  ];

  if (ensureDataDir()) {
    try {
      fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(all, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[storage] Failed to update appointment on disk:', err);
    }
  }

  return updated;
}

export function deleteAppointment(id: string): boolean {
  deletedAppointmentIds.add(id);
  inMemoryAppointments = inMemoryAppointments.filter((a) => a.id !== id);

  if (ensureDataDir()) {
    try {
      if (fs.existsSync(APPOINTMENTS_FILE)) {
        const all = getAllAppointments().filter((a) => a.id !== id);
        fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(all, null, 2), 'utf-8');
      }
      return true;
    } catch (err) {
      console.warn('[storage] Failed to delete appointment:', err);
    }
  }
  return true;
}

export function getBookedSlotsForDate(date: string): string[] {
  const appointments = getAllAppointments();
  return appointments
    .filter((appt) => appt.date === date)
    .map((appt) => appt.time);
}

export function isSlotBooked(date: string, time: string): boolean {
  const booked = getBookedSlotsForDate(date);
  return booked.includes(time);
}

export function getGoogleTokens(): Credentials | null {
  // 1. Check environment variable first (primary recommended configuration)
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN.trim().replace(/^["']|["']$/g, '');
    let tokens: Credentials = {
      refresh_token: refreshToken,
      token_type: 'Bearer',
    };
    if (inMemoryTokens?.access_token) {
      tokens = { ...tokens, ...inMemoryTokens };
    }
    if (ensureDataDir()) {
      try {
        if (fs.existsSync(TOKENS_FILE)) {
          const raw = fs.readFileSync(TOKENS_FILE, 'utf-8');
          const parsed = JSON.parse(raw);
          tokens = { ...tokens, ...parsed, refresh_token: refreshToken };
        }
      } catch {
        // ignore disk cache read error
      }
    }
    return tokens;
  }

  // 2. Check in-memory store
  if (inMemoryTokens) {
    return inMemoryTokens;
  }

  // 3. Check disk cache
  if (ensureDataDir()) {
    try {
      if (fs.existsSync(TOKENS_FILE)) {
        const raw = fs.readFileSync(TOKENS_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[storage] Failed to read tokens from disk:', err);
    }
  }

  return null;
}

export function saveGoogleTokens(tokens: Credentials): void {
  const existing = getGoogleTokens();
  const merged: Credentials = {
    ...existing,
    ...tokens,
    refresh_token:
      tokens.refresh_token ||
      existing?.refresh_token ||
      (process.env.GOOGLE_REFRESH_TOKEN ? process.env.GOOGLE_REFRESH_TOKEN.trim().replace(/^["']|["']$/g, '') : undefined),
  };
  inMemoryTokens = merged;

  if (ensureDataDir()) {
    try {
      fs.writeFileSync(TOKENS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[storage] Could not save tokens to disk, stored in memory:', err);
    }
  }
}

export function clearGoogleTokens(): void {
  inMemoryTokens = null;
  if (ensureDataDir()) {
    try {
      if (fs.existsSync(TOKENS_FILE)) {
        fs.unlinkSync(TOKENS_FILE);
      }
    } catch {
      // ignore unlink error
    }
  }
}

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
}

export function getGoogleConfig(): GoogleConfig | null {
  // Always read from environment variables first
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const clientId = process.env.GOOGLE_CLIENT_ID.trim().replace(/^["']|["']$/g, '');
    let clientSecret = process.env.GOOGLE_CLIENT_SECRET.trim().replace(/^["']|["']$/g, '');

    // Auto-heal base64URL case typo (lowercase 'l' -> uppercase 'L')
    if (clientSecret.includes('Rm9_DwlZwTf')) {
      clientSecret = clientSecret.replace('Rm9_DwlZwTf', 'Rm9_DwLZwTf');
    }

    return {
      clientId,
      clientSecret,
    };
  }
  return null;
}

export function saveGoogleConfig(config: GoogleConfig): void {
  // Populate process.env for current process runtime
  process.env.GOOGLE_CLIENT_ID = config.clientId;
  process.env.GOOGLE_CLIENT_SECRET = config.clientSecret;
}
