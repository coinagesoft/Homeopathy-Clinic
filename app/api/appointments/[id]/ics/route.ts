import { NextRequest, NextResponse } from 'next/server';
import { getAllAppointments } from '@/lib/storage';
import { generateIcsContent } from '@/lib/google';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointments = getAllAppointments();
  const appointment = appointments.find((a) => a.id === id);

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  const ics = generateIcsContent(appointment);

  return new NextResponse(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="consultation-${appointment.date}.ics"`,
    },
  });
}

