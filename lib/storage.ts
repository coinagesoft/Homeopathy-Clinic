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

const DATA_DIR = path.join(process.cwd(), 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const TOKENS_FILE = path.join(DATA_DIR, 'google-tokens.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAllAppointments(): Appointment[] {
  ensureDataDir();
  if (!fs.existsSync(APPOINTMENTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(APPOINTMENTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read appointments:', err);
    return [];
  }
}

export function saveAppointment(appointment: Appointment): Appointment {
  ensureDataDir();
  const appointments = getAllAppointments();
  appointments.push(appointment);
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), 'utf-8');
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
  // Check environment variable first
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    let tokens: Credentials = {
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      token_type: 'Bearer',
    };
    if (fs.existsSync(TOKENS_FILE)) {
      try {
        const raw = fs.readFileSync(TOKENS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        tokens = { ...tokens, ...parsed, refresh_token: process.env.GOOGLE_REFRESH_TOKEN };
      } catch {
        // ignore cache read failure
      }
    }
    return tokens;
  }

  ensureDataDir();
  if (!fs.existsSync(TOKENS_FILE)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(TOKENS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read Google tokens:', err);
    return null;
  }
}

export function saveGoogleTokens(tokens: Credentials): void {
  ensureDataDir();
  // Preserve refresh_token if new tokens object doesn't include one
  const existing = getGoogleTokens();
  const merged: Credentials = {
    ...existing,
    ...tokens,
    refresh_token: tokens.refresh_token || existing?.refresh_token,
  };
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
}

export function clearGoogleTokens(): void {
  ensureDataDir();
  if (fs.existsSync(TOKENS_FILE)) {
    fs.unlinkSync(TOKENS_FILE);
  }
}

const CONFIG_FILE = path.join(DATA_DIR, 'google-config.json');

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
}

export function getGoogleConfig(): GoogleConfig | null {
  ensureDataDir();
  // Check environment variables first
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }

  // Fallback to data/google-config.json
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.clientId && parsed.clientSecret) {
        return parsed;
      }
    } catch (err) {
      console.error('Failed to read google-config.json:', err);
    }
  }

  return null;
}

export function saveGoogleConfig(config: GoogleConfig): void {
  ensureDataDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  // Also populate process.env for the current runtime
  process.env.GOOGLE_CLIENT_ID = config.clientId;
  process.env.GOOGLE_CLIENT_SECRET = config.clientSecret;
}


