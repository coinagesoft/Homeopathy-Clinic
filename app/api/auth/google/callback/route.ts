import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/google';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (error || !code) {
    return NextResponse.redirect(
      `${appUrl}/appointment?google_error=${encodeURIComponent(
        error || 'Authorization was cancelled or code was missing.'
      )}`
    );
  }

  try {
    await exchangeCodeForTokens(code);
    return NextResponse.redirect(`${appUrl}/appointment?google_connected=true`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to exchange token';
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(
      `${appUrl}/appointment?google_error=${encodeURIComponent(message)}`
    );
  }
}

