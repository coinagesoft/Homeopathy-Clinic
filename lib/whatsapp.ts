import path from 'path';
import fs from 'fs';
import pino from 'pino';
import QRCode from 'qrcode';
import type { WASocket } from '@whiskeysockets/baileys';

/**
 * Free, automatic WhatsApp sending using a linked device (like WhatsApp Web).
 * The clinic scans a QR code once; the session is stored in AUTH_DIR.
 *
 * NOTE: this uses the unofficial WhatsApp Web protocol (Baileys). It needs a
 * long-running Node server (npm run dev / npm start on a VPS), NOT serverless hosting.
 */

const AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || path.join(process.cwd(), '.whatsapp-auth');

export type WhatsAppStatus = 'disconnected' | 'connecting' | 'qr' | 'connected';

interface WaState {
  sock: WASocket | null;
  status: WhatsAppStatus;
  qr: string | null; // data URL of the QR image
  phone: string | null;
  starting: Promise<void> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __waState: WaState | undefined;
}

function state(): WaState {
  if (!global.__waState) {
    global.__waState = { sock: null, status: 'disconnected', qr: null, phone: null, starting: null };
  }
  return global.__waState;
}

export class WhatsAppNotConnectedError extends Error {
  constructor() {
    super('WhatsApp is not connected. Scan the QR code to link the clinic WhatsApp.');
    this.name = 'WhatsAppNotConnectedError';
  }
}

async function connect(): Promise<void> {
  const s = state();
  const baileys = await import('@whiskeysockets/baileys');
  const makeWASocket = baileys.default;
  const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = baileys;

  const { state: auth, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const wasPaired = Boolean(auth.creds.registered);

  let version: [number, number, number] | undefined;
  try {
    version = (await fetchLatestBaileysVersion()).version;
  } catch {
    version = undefined; // fall back to the library's built-in version
  }

  s.status = 'connecting';
  const sock = makeWASocket({
    ...(version ? { version } : {}),
    auth,
    logger: pino({ level: 'silent' }),
    browser: Browsers.macOS('Desktop'),
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });
  s.sock = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    // Ignore events from an old socket that was already replaced
    if (s.sock !== sock) return;
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        s.qr = await QRCode.toDataURL(qr, { margin: 1, width: 280 });
        s.status = 'qr';
      } catch (err) {
        console.error('[whatsapp] QR generation failed:', err);
      }
    }

    if (connection === 'open') {
      s.status = 'connected';
      s.qr = null;
      s.phone = sock.user?.id ? sock.user.id.split(':')[0].split('@')[0] : null;
      console.log('[whatsapp] connected as', s.phone);
    }

    if (connection === 'close') {
      const code = (lastDisconnect?.error as { output?: { statusCode?: number } } | undefined)
        ?.output?.statusCode;
      s.sock = null;
      s.status = 'disconnected';
      s.qr = null;
      s.phone = null;
      console.log('[whatsapp] connection closed, code:', code);

      if (code === DisconnectReason.loggedOut) {
        // Phone unlinked the device -> wipe the old session so a new QR can be shown
        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      } else if (wasPaired) {
        // Temporary network drop on a paired session -> reconnect automatically
        setTimeout(() => {
          void ensureWhatsAppStarted();
        }, 3000);
      }
      // An unpaired session (QR expired) restarts the next time the admin opens the QR panel
    }
  });
}

/** Starts the WhatsApp connection if it isn't running yet (safe to call repeatedly). */
export async function ensureWhatsAppStarted(): Promise<void> {
  const s = state();
  if (s.sock || s.starting) return s.starting ?? undefined;
  s.starting = connect()
    .catch((err) => {
      console.error('[whatsapp] failed to start:', err);
      s.status = 'disconnected';
      s.sock = null;
    })
    .finally(() => {
      s.starting = null;
    });
  return s.starting;
}

export async function getWhatsAppStatus(): Promise<{
  status: WhatsAppStatus;
  qr: string | null;
  phone: string | null;
}> {
  await ensureWhatsAppStarted();
  const s = state();
  return { status: s.status, qr: s.qr, phone: s.phone };
}

async function waitUntilConnected(timeoutMs: number): Promise<void> {
  const s = state();
  const deadline = Date.now() + timeoutMs;
  while (s.status === 'connecting' && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 500));
  }
}

export function normalizeIndianPhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '').replace(/^0+/, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

export async function sendWhatsAppPdf(opts: {
  phone: string;
  pdf: Buffer;
  fileName: string;
  caption: string;
}): Promise<{ to: string }> {
  await ensureWhatsAppStarted();
  const s = state();
  await waitUntilConnected(15_000);

  if (s.status !== 'connected' || !s.sock) {
    throw new WhatsAppNotConnectedError();
  }

  const number = normalizeIndianPhone(opts.phone);
  if (number.length < 11) {
    throw new Error('The patient does not have a valid mobile number.');
  }

  const lookup = await s.sock.onWhatsApp(`${number}@s.whatsapp.net`);
  const match = lookup?.[0];
  if (!match?.exists) {
    throw new Error(`+${number} is not registered on WhatsApp.`);
  }

  await s.sock.sendMessage(match.jid, {
    document: opts.pdf,
    mimetype: 'application/pdf',
    fileName: opts.fileName,
    caption: opts.caption,
  });

  return { to: number };
}

export async function logoutWhatsApp(): Promise<void> {
  const s = state();
  try {
    await s.sock?.logout();
  } catch {
    // already disconnected
  }
  s.sock = null;
  s.status = 'disconnected';
  s.qr = null;
  s.phone = null;
  fs.rmSync(AUTH_DIR, { recursive: true, force: true });
}
