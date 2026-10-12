import { NextResponse } from 'next/server';
import { getGoogleAuthUrl, DOCTOR_EMAIL } from '@/lib/google';

export async function GET() {
  const authUrl = getGoogleAuthUrl();

  if (!authUrl) {
    return NextResponse.json(
      {
        error:
          'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local.',
        doctorEmail: DOCTOR_EMAIL,
      },
      { status: 400 }
    );
  }

  return NextResponse.redirect(authUrl);
}

