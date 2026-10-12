# Dr. Aarav Homeopathy Clinic

Modern Next.js web application for Dr. Aarav Mehta's Homeopathy Clinic in Pune with automated appointment booking, Google Meet generation, and Google Calendar synchronization.

## Features

- **Next.js App Router**: Built with modern Next.js (`app/` directory) and TypeScript.
- **Interactive Appointment Booking & Slot Locking**:
  - Real-time client-side and server-side validation.
  - Clinic operating hours: 9:00 AM – 6:00 PM, Monday to Saturday.
  - Sunday detection with closure notice.
  - Real-time slot locking: booked slots are stored in backend data and marked as disabled (`booked`) across users.
  - Instant double-booking prevention with HTTP 409 Conflict checks.
- **Google Calendar & Google Meet Integration**:
  - Doctor Email (Organizer / Admin): `shivrajrbabar@gmail.com`.
  - Generates live **Google Meet** video conference links on the doctor's calendar.
  - Dispatches calendar invites with the Google Meet link to both the doctor (`shivrajrbabar@gmail.com`) and the patient (`patient@example.com`).
  - **1-Click Doctor Authorization**: The doctor can connect their Google Calendar with one click via `/api/auth/google`.

---

## Google Calendar Setup Instructions

To enable automatic Google Calendar event creation and Google Meet link generation:

### 1. Create Google Cloud Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `Homeopathy-Clinic`).
3. Enable the **Google Calendar API**:
   - Go to **APIs & Services** > **Library**.
   - Search for **Google Calendar API** and click **Enable**.
4. Configure the **OAuth Consent Screen**:
   - Select **External** user type.
   - Fill in App name (`Homeopathy Clinic`) and User support email (`shivrajrbabar@gmail.com`).
   - Under **Scopes**, add `https://www.googleapis.com/auth/calendar.events` and `https://www.googleapis.com/auth/calendar`.
   - Under **Test Users**, add `shivrajrbabar@gmail.com`.
5. Create OAuth Credentials:
   - Go to **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Authorized redirect URIs:
     ```text
     http://localhost:3000/api/auth/google/callback
     ```
   - Click **Create** and copy your **Client ID** and **Client Secret**.

### 2. Add to `.env.local`
Open [.env.local](file:///Users/CoinageMac/next-js/Homeopathy-Clinic/.env.local) and paste your credentials:
```env
DOCTOR_EMAIL=shivrajrbabar@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 3. Connect the Doctor's Calendar (1-Click)
1. Run `npm run dev` and open [http://localhost:3000/appointment](http://localhost:3000/appointment).
2. Click **"Connect Google Calendar (1-Click)"** at the top of the booking form.
3. Sign in with `shivrajrbabar@gmail.com` and approve permissions.
4. Your calendar is now linked! All upcoming bookings will automatically create calendar events with Google Meet links on your calendar and invite patients.

---

## Project Structure

```text
├── app/
│   ├── api/
│   │   ├── appointments/route.ts      # GET booked slots & POST new appointment
│   │   └── auth/google/
│   │       ├── route.ts               # Initiates Google OAuth consent
│   │       ├── callback/route.ts      # Handles Google OAuth callback & token save
│   │       └── status/route.ts        # Returns connection status for doctor
│   ├── globals.css                    # Styling, meet boxes, CSS variables
│   ├── layout.tsx                     # Root layout with fonts, header, footer
│   ├── page.tsx                       # Home page
│   ├── about/page.tsx                 # Doctor biography & qualifications
│   └── appointment/page.tsx           # Booking page
├── components/
│   ├── Header.tsx                     # Responsive navigation header
│   ├── Footer.tsx                     # Site footer
│   └── AppointmentForm.tsx            # Form with slot locking & Google Meet display
├── lib/
│   ├── storage.ts                     # Persistent file storage for appointments & tokens
│   └── google.ts                      # Google Calendar & Meet API service
├── data/
│   └── appointments.json              # Saved appointments data
├── public/assets/                     # Clinic imagery and doctor portraits
├── .env.local                         # Local environment configuration
└── package.json
```

## Running the Application

```bash
# Development
npm run dev

# Production
npm run build
npm run start
```
