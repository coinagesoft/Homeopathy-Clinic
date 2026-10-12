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
const TOKENS_FILE = path.join(DATA_DIR, 'google-tokens.json');

// In-memory fallback stores to guarantee zero crashes on read-only environments
let inMemoryAppointments: Appointment[] = [];
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

export function getAllAppointments(): Appointment[] {
  if (ensureDataDir()) {
    try {
      if (fs.existsSync(APPOINTMENTS_FILE)) {
        const raw = fs.readFileSync(APPOINTMENTS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Merge disk appointments with any in-memory additions
          const ids = new Set(parsed.map((a: Appointment) => a.id));
          const additions = inMemoryAppointments.filter((a) => !ids.has(a.id));
          return [...parsed, ...additions];
        }
      }
    } catch (err) {
      console.warn('[storage] Failed to read appointments file, using in-memory fallback:', err);
    }
  }
  return inMemoryAppointments;
}

export function saveAppointment(appointment: Appointment): Appointment {
  inMemoryAppointments = [
    ...inMemoryAppointments.filter((a) => a.id !== appointment.id),
    appointment,
  ];

  if (ensureDataDir()) {
    try {
      const appointments = getAllAppointments();
      fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[storage] Failed to write appointment to disk, saved in-memory:', err);
    }
  }

  return appointment;
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
    let tokens: Credentials = {
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
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
          tokens = { ...tokens, ...parsed, refresh_token: process.env.GOOGLE_REFRESH_TOKEN };
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
      process.env.GOOGLE_REFRESH_TOKEN,
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
    return {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }
  return null;
}

export function saveGoogleConfig(config: GoogleConfig): void {
  // Populate process.env for current process runtime
  process.env.GOOGLE_CLIENT_ID = config.clientId;
  process.env.GOOGLE_CLIENT_SECRET = config.clientSecret;
}
