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
const TOKENS_FILE = path.join(DATA_DIR, 'google-tokens.json');

// Initial realistic seed appointments for clinic records, clinical histories, and revenue analytics
const INITIAL_SEED_APPOINTMENTS: Appointment[] = [
  {
    id: "6a2a9b4e-43f5-4e2b-88a8-ee575f2c9d6d",
    fullName: "Shivraj Rajendra Babar",
    phone: "+91 93591 38592",
    email: "shivrajrbabar14@gmail.com",
    age: 25,
    reason: "Digestive Concerns",
    date: "2026-10-14",
    time: "10:30",
    message: "Frequent bloating and acidity after meals for 3 weeks.",
    meetLink: "https://meet.google.com/qgr-ssmg-zjp",
    createdAt: "2026-10-12T05:29:44.851Z",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "UPI",
    paymentId: "PAY-UPI-9359101",
    paidAt: "2026-10-12T05:30:10.000Z",
    notes: "Follow-up consultation booked. Primary focus on constitutional remedies for gut dysbiosis."
  },
  {
    id: "78e0afdb-54f0-4893-ab08-778bc16425e0",
    fullName: "Shivraj Rajendra Babar",
    phone: "+91 93591 38592",
    email: "shivrajrbabar14@gmail.com",
    age: 25,
    reason: "Digestive Concerns",
    date: "2026-09-18",
    time: "16:30",
    message: "Initial consultation for GERD and seasonal sneezing.",
    meetLink: "https://meet.google.com/qgr-ssmg-zjp",
    googleEventId: "8jogt28qnpgo4n3vhj3jp1j7k4",
    createdAt: "2026-09-15T06:29:04.381Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "UPI",
    paymentId: "PAY-UPI-8849120",
    paidAt: "2026-09-15T06:30:00.000Z",
    notes: "Patient reported substantial 70% relief in morning acid reflux. Advised Nux Vomica 200CH and Natrum Phos 6X. Dietary guidelines reinforced."
  },
  {
    id: "f9082472-0c8d-4eb2-9e44-44c34dc8d101",
    fullName: "Priya Sharma",
    phone: "+91 98220 44321",
    email: "priya.sharma91@gmail.com",
    age: 32,
    reason: "Migraine & Headaches",
    date: "2026-10-11",
    time: "11:15",
    message: "Severe one-sided throbbing headache triggered by screen fatigue.",
    meetLink: "https://meet.google.com/mtg-gtqa-usc",
    createdAt: "2026-10-09T07:39:49.649Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "Card",
    paymentId: "PAY-CRD-4928172",
    paidAt: "2026-10-09T07:41:00.000Z",
    notes: "Hemicrania with photophobia. Prescribed Belladonna 200CH for acute episodes and Sanguinaria 30C twice weekly."
  },
  {
    id: "seed-priya-prev",
    fullName: "Priya Sharma",
    phone: "+91 98220 44321",
    email: "priya.sharma91@gmail.com",
    age: 32,
    reason: "Migraine & Headaches",
    date: "2026-08-20",
    time: "14:00",
    message: "First appointment for chronic migraines.",
    meetLink: "https://meet.google.com/pri-meht-882",
    createdAt: "2026-08-18T10:00:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "Card",
    paymentId: "PAY-CRD-3190284",
    paidAt: "2026-08-18T10:05:00.000Z",
    notes: "Initial detailed case history. Calcarea Carbonica 200 indicated constitutionally."
  },
  {
    id: "seed-rajesh-1",
    fullName: "Rajesh Kulkarni",
    phone: "+91 94225 11094",
    email: "rajesh.kulkarni@rediffmail.com",
    age: 51,
    reason: "Joint & Arthritis Pain",
    date: "2026-10-10",
    time: "10:30",
    message: "Knee pain worse in mornings and during cold weather.",
    meetLink: "https://meet.google.com/raj-klk-991",
    createdAt: "2026-10-08T09:20:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "Cash",
    paymentId: "PAY-CSH-104921",
    paidAt: "2026-10-10T11:00:00.000Z",
    notes: "Bilateral osteoarthritic changes. Morning stiffness improved by 60% with Rhus Tox 200CH. Advised gentle knee flexion exercises."
  },
  {
    id: "seed-rajesh-prev",
    fullName: "Rajesh Kulkarni",
    phone: "+91 94225 11094",
    email: "rajesh.kulkarni@rediffmail.com",
    age: 51,
    reason: "Joint & Arthritis Pain",
    date: "2026-07-16",
    time: "15:45",
    message: "Follow-up checkup for stiffness.",
    meetLink: "https://meet.google.com/raj-klk-991",
    createdAt: "2026-07-14T08:15:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "Cash",
    paymentId: "PAY-CSH-098231",
    paidAt: "2026-07-16T16:15:00.000Z",
    notes: "Bryonia Alba 30C prescribed along with Rhus Tox for joint friction."
  },
  {
    id: "seed-ananya-1",
    fullName: "Ananya Deshmukh",
    phone: "+91 97654 32109",
    email: "ananya.deshmukh@outlook.com",
    age: 28,
    reason: "Skin & Eczema",
    date: "2026-10-08",
    time: "12:00",
    message: "Dry, flaky red patches on hands and elbow folds.",
    meetLink: "https://meet.google.com/ana-dsh-443",
    createdAt: "2026-10-06T14:10:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "UPI",
    paymentId: "PAY-UPI-7712391",
    paidAt: "2026-10-06T14:12:00.000Z",
    notes: "Aggravated by synthetic soaps. Prescribed Sulphur 30C single dose followed by Graphites 200CH."
  },
  {
    id: "seed-ananya-prev",
    fullName: "Ananya Deshmukh",
    phone: "+91 97654 32109",
    email: "ananya.deshmukh@outlook.com",
    age: 28,
    reason: "Skin & Eczema",
    date: "2026-06-25",
    time: "16:30",
    message: "Initial consultation for eczema flare-up.",
    meetLink: "https://meet.google.com/ana-dsh-443",
    createdAt: "2026-06-23T11:45:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "UPI",
    paymentId: "PAY-UPI-5521094",
    paidAt: "2026-06-23T11:46:00.000Z",
    notes: "Chronic atopic dermatitis case taken in detail."
  },
  {
    id: "seed-rohan-1",
    fullName: "Rohan Patel",
    phone: "+91 98901 23456",
    email: "rohan.patel@gmail.com",
    age: 38,
    reason: "Anxiety & Sleep Issues",
    date: "2026-10-05",
    time: "17:15",
    message: "Restless sleep, waking at 3 AM with anxious thoughts.",
    meetLink: "https://meet.google.com/roh-pat-102",
    createdAt: "2026-10-03T18:00:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "UPI",
    paymentId: "PAY-UPI-9943210",
    paidAt: "2026-10-03T18:02:00.000Z",
    notes: "Prescribed Passiflora Incarnata Q mother tincture 15 drops at bedtime and Arsenicum Album 200CH."
  },
  {
    id: "seed-vikram-1",
    fullName: "Vikram Malhotra",
    phone: "+91 99203 88471",
    email: "vikram.m@corporatesolutions.in",
    age: 44,
    reason: "Hair & Scalp Treatment",
    date: "2026-09-29",
    time: "09:45",
    message: "Excessive hair shedding after high-stress project.",
    meetLink: "https://meet.google.com/vik-mal-881",
    createdAt: "2026-09-27T12:00:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "Card",
    paymentId: "PAY-CRD-7728190",
    paidAt: "2026-09-27T12:03:00.000Z",
    notes: "Telogen effluvium noted. Prescribed Wiesbaden 30C and Arnica external application."
  },
  {
    id: "seed-sneha-1",
    fullName: "Sneha Verma",
    phone: "+91 98112 33445",
    email: "sneha.verma.art@gmail.com",
    age: 26,
    reason: "Respiratory & Asthma",
    date: "2026-10-15",
    time: "11:15",
    message: "Seasonal wheezing and allergic bronchospasm in transition weather.",
    meetLink: "https://meet.google.com/snh-vrm-992",
    createdAt: "2026-10-12T08:00:00.000Z",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "UPI",
    paymentId: "PAY-UPI-3349182",
    paidAt: "2026-10-12T08:02:00.000Z",
    notes: "Advance appointment scheduled. Previous records requested for chest auscultation review."
  },
  {
    id: "seed-sneha-prev",
    fullName: "Sneha Verma",
    phone: "+91 98112 33445",
    email: "sneha.verma.art@gmail.com",
    age: 26,
    reason: "Respiratory & Asthma",
    date: "2026-08-04",
    time: "14:45",
    message: "Dust allergy and nocturnal cough.",
    meetLink: "https://meet.google.com/snh-vrm-992",
    createdAt: "2026-08-01T15:30:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "UPI",
    paymentId: "PAY-UPI-1192847",
    paidAt: "2026-08-01T15:32:00.000Z",
    notes: "Prescribed Blatta Orientalis Q and Arsenic Iod 30C. Significant decrease in night bouts reported."
  },
  {
    id: "seed-amit-1",
    fullName: "Amit Joshi",
    phone: "+91 93245 67890",
    email: "amit.joshi@techcorp.com",
    age: 36,
    reason: "Digestive Concerns",
    date: "2026-05-22",
    time: "10:30",
    message: "Chronic sluggish liver and indigestion.",
    meetLink: "https://meet.google.com/amt-jsh-301",
    createdAt: "2026-05-20T10:15:00.000Z",
    status: "completed",
    paymentStatus: "paid",
    amount: 800,
    paymentMethod: "Card",
    paymentId: "PAY-CRD-2291048",
    paidAt: "2026-05-20T10:20:00.000Z",
    notes: "Chelidonium Majus 30C twice daily. Bowel regularity restored."
  }
];

// In-memory fallback stores to guarantee zero crashes on read-only environments
let inMemoryAppointments: Appointment[] = [...INITIAL_SEED_APPOINTMENTS];
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
      if (fs.existsSync(APPOINTMENTS_FILE)) {
        const raw = fs.readFileSync(APPOINTMENTS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge disk appointments with seed records so baseline history is always available
          const ids = new Set(parsed.map((a: Appointment) => a.id));
          const seedRemaining = inMemoryAppointments.filter(
            (a) => !ids.has(a.id) && !deletedAppointmentIds.has(a.id)
          );
          list = [...parsed, ...seedRemaining];
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
