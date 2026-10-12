import { google } from 'googleapis';
import {
  getGoogleTokens,
  saveGoogleTokens,
  getGoogleConfig,
  Appointment,
} from './storage';

export const DOCTOR_EMAIL = process.env.DOCTOR_EMAIL || 'shivrajrbabar@gmail.com';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar',
];

export function getOAuth2Client(customRedirectUri?: string) {
  const config = getGoogleConfig();
  let defaultAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!defaultAppUrl) {
    defaultAppUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
  }
  const redirectUri = customRedirectUri || `${defaultAppUrl}/api/auth/google/callback`;

  if (!config?.clientId || !config?.clientSecret) {
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    redirectUri
  );

  // Set tokens if available
  const tokens = getGoogleTokens();
  if (tokens) {
    oauth2Client.setCredentials(tokens);

    // Save refreshed tokens automatically
    oauth2Client.on('tokens', (newTokens) => {
      saveGoogleTokens(newTokens);
    });
  }

  return oauth2Client;
}

export function getGoogleAuthUrl(customRedirectUri?: string): string | null {
  const oauth2Client = getOAuth2Client(customRedirectUri);
  if (!oauth2Client) return null;

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Forces refresh token return
    scope: SCOPES,
    login_hint: DOCTOR_EMAIL,
  });
}

export async function exchangeCodeForTokens(code: string, customRedirectUri?: string) {
  const oauth2Client = getOAuth2Client(customRedirectUri);
  if (!oauth2Client) {
    throw new Error('Google OAuth credentials not configured in environment.');
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  saveGoogleTokens(tokens);
  return tokens;
}

export function isGoogleConnected(): boolean {
  const tokens = getGoogleTokens();
  return Boolean(tokens && (tokens.refresh_token || tokens.access_token));
}

/**
 * Calculates start and end Date objects in Indian Standard Time (Asia/Kolkata).
 * Default slot length is 45 minutes.
 */
function getStartAndEndTime(date: string, time: string, durationMinutes = 45) {
  // Format: YYYY-MM-DDTHH:mm:00+05:30
  const startIso = `${date}T${time}:00+05:30`;
  const [hours, minutes] = time.split(':').map(Number);
  
  const endMinutesTotal = minutes + durationMinutes;
  const endHours = hours + Math.floor(endMinutesTotal / 60);
  const endMinutes = endMinutesTotal % 60;

  const endHoursFormatted = String(endHours).padStart(2, '0');
  const endMinutesFormatted = String(endMinutes).padStart(2, '0');
  const endIso = `${date}T${endHoursFormatted}:${endMinutesFormatted}:00+05:30`;

  return { startIso, endIso };
}

export interface CalendarEventResult {
  meetLink: string;
  eventId: string;
}

export async function createCalendarMeeting(
  appointment: Appointment
): Promise<CalendarEventResult> {
  const oauth2Client = getOAuth2Client();
  if (!oauth2Client || !isGoogleConnected()) {
    throw new Error(
      'Google Calendar is not connected. Please authorize at /api/auth/google first.'
    );
  }

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const { startIso, endIso } = getStartAndEndTime(appointment.date, appointment.time);

  const eventPayload = {
    summary: `Homeopathy Consultation: ${appointment.fullName} & Dr. Aarav Mehta`,
    description: `Homeopathy Consultation
--------------------------------------------------
Patient Name: ${appointment.fullName}
Phone: ${appointment.phone}
Email: ${appointment.email}
Age: ${appointment.age}
Reason: ${appointment.reason}
Notes: ${appointment.message || 'No additional notes'}

Clinic Details:
Dr. Aarav Homeopathy Clinic
123 Green Park Road, Pune, Maharashtra
Doctor Contact: +91 98765 43210
Doctor Email: ${DOCTOR_EMAIL}`,
    start: {
      dateTime: startIso,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: endIso,
      timeZone: 'Asia/Kolkata',
    },
    attendees: [
      {
        email: DOCTOR_EMAIL,
        displayName: 'Dr. Aarav Mehta (Admin/Doctor)',
        responseStatus: 'accepted',
      },
      {
        email: appointment.email,
        displayName: appointment.fullName,
      },
    ],
    conferenceData: {
      createRequest: {
        requestId: `appt-${appointment.id}-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 },      // 30 mins before
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    sendUpdates: 'all', // Send calendar invitation email to both doctor and patient
    requestBody: eventPayload,
  });

  const eventData = response.data;
  let meetLink = eventData.hangoutLink || '';

  if (!meetLink && eventData.conferenceData?.entryPoints) {
    const videoPoint = eventData.conferenceData.entryPoints.find(
      (ep) => ep.entryPointType === 'video'
    );
    if (videoPoint?.uri) {
      meetLink = videoPoint.uri;
    }
  }

  if (!meetLink) {
    meetLink = `https://meet.google.com/lookup/${appointment.id}`;
  }

  return {
    meetLink,
    eventId: eventData.id || '',
  };
}

/**
 * Queries Google Calendar for booked events on a given date (Asia/Kolkata).
 * Returns array of booked time slot strings (e.g. ['09:00', '09:45']).
 */
export async function getBookedSlotsFromCalendar(date: string): Promise<string[]> {
  const oauth2Client = getOAuth2Client();
  if (!oauth2Client || !isGoogleConnected()) {
    return [];
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const timeMin = new Date(`${date}T00:00:00+05:30`).toISOString();
    const timeMax = new Date(`${date}T23:59:59+05:30`).toISOString();

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const bookedSlots = new Set<string>();
    for (const item of response.data.items || []) {
      if (item.status === 'cancelled') continue;
      const startDateTime = item.start?.dateTime;
      if (startDateTime) {
        const d = new Date(startDateTime);
        const istTime = d.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        bookedSlots.add(istTime);
      }
    }

    return Array.from(bookedSlots);
  } catch (err) {
    console.error('Failed to query Google Calendar for booked slots:', err);
    return [];
  }
}

/**
 * Generates an instant 1-Click "Add to Google Calendar" web URL prefilled with
 * doctor and client attendees, Google Meet link, and date/time.
 */
export function generateGoogleCalendarUrl(
  appointment: Appointment,
  durationMinutes = 45
): string {
  const start = new Date(`${appointment.date}T${appointment.time}:00+05:30`);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatUtc = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dates = `${formatUtc(start)}/${formatUtc(end)}`;

  const title = `Homeopathy Consultation: ${appointment.fullName} & Dr. Aarav Mehta`;
  const details = `Homeopathy Clinic Consultation
--------------------------------------------------
Patient Name: ${appointment.fullName}
Phone: ${appointment.phone}
Email: ${appointment.email}
Age: ${appointment.age}
Reason: ${appointment.reason}
Notes: ${appointment.message || 'No additional notes'}

Google Meet: ${appointment.meetLink || 'Will be shared'}

Clinic Details:
Dr. Aarav Homeopathy Clinic
123 Green Park Road, Pune, Maharashtra
Doctor Contact: +91 98765 43210
Doctor Email: ${DOCTOR_EMAIL}`;

  const location = appointment.meetLink || 'Dr. Aarav Homeopathy Clinic, Pune';
  const addGuests = `${DOCTOR_EMAIL},${appointment.email}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates,
    details,
    location,
    add: addGuests,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an iCalendar (.ics) formatted string for calendar import.
 */
export function generateIcsContent(
  appointment: Appointment,
  durationMinutes = 45
): string {
  const start = new Date(`${appointment.date}T${appointment.time}:00+05:30`);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const formatUtc = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dr. Aarav Homeopathy Clinic//Appointment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:appt-${appointment.id}@aaravhomeopathy.com`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:Homeopathy Consultation: ${appointment.fullName} & Dr. Aarav Mehta`,
    `DESCRIPTION:Patient: ${appointment.fullName}\\nPhone: ${appointment.phone}\\nReason: ${appointment.reason}\\nGoogle Meet: ${appointment.meetLink || ''}`,
    `LOCATION:${appointment.meetLink || 'Dr. Aarav Homeopathy Clinic, Pune'}`,
    `ORGANIZER;CN=Dr. Aarav Mehta:mailto:${DOCTOR_EMAIL}`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=Dr. Aarav Mehta:mailto:${DOCTOR_EMAIL}`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;CN=${appointment.fullName}:mailto:${appointment.email}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}


