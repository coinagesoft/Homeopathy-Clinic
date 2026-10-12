import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  saveAppointment,
  getBookedSlotsForDate,
  isSlotBooked,
  Appointment,
} from '@/lib/storage';
import {
  isGoogleConnected,
  createCalendarMeeting,
  generateGoogleCalendarUrl,
  getBookedSlotsFromCalendar,
  DOCTOR_EMAIL,
} from '@/lib/google';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json(
      { error: 'Date query parameter is required (YYYY-MM-DD).' },
      { status: 400 }
    );
  }

  const localSlots = getBookedSlotsForDate(date);
  const calendarSlots = await getBookedSlotsFromCalendar(date);
  const allBookedSlots = Array.from(new Set([...localSlots, ...calendarSlots]));

  return NextResponse.json({
    date,
    bookedSlots: allBookedSlots,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, age, reason, date, time, message } = body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      return NextResponse.json(
        { error: 'Full name is required (minimum 3 characters).' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'A valid 10-digit phone number is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const ageNum = Number(age);
    if (!age || !Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
      return NextResponse.json(
        { error: 'Age must be an integer between 1 and 120.' },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json(
        { error: 'Reason for consultation is required.' },
        { status: 400 }
      );
    }

    if (!date || typeof date !== 'string') {
      return NextResponse.json(
        { error: 'Preferred date is required (YYYY-MM-DD).' },
        { status: 400 }
      );
    }

    const dateObj = new Date(`${date}T00:00:00`);
    if (isNaN(dateObj.getTime()) || dateObj.getDay() === 0) {
      return NextResponse.json(
        { error: 'Appointments cannot be booked on Sundays as clinic is closed.' },
        { status: 400 }
      );
    }

    if (!time || typeof time !== 'string') {
      return NextResponse.json(
        { error: 'An appointment time slot is required.' },
        { status: 400 }
      );
    }

    // Check if slot is already booked (local disk or Google Calendar)
    const localBooked = isSlotBooked(date, time);
    const calendarSlots = await getBookedSlotsFromCalendar(date);
    if (localBooked || calendarSlots.includes(time)) {
      return NextResponse.json(
        {
          error:
            `The time slot ${time} on ${date} is already booked. Please select another slot.`,
          isBooked: true,
        },
        { status: 409 }
      );
    }

    const appointmentId = crypto.randomUUID();
    const newAppointment: Appointment = {
      id: appointmentId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: ageNum,
      reason: reason.trim(),
      date,
      time,
      message: message ? String(message).trim() : '',
      createdAt: new Date().toISOString(),
    };

    let meetLink = '';
    let googleEventId = '';
    let calendarError = '';
    const googleConnected = isGoogleConnected();

    if (googleConnected) {
      try {
        const meetingResult = await createCalendarMeeting(newAppointment);
        meetLink = meetingResult.meetLink;
        googleEventId = meetingResult.eventId;
        newAppointment.meetLink = meetLink;
        newAppointment.googleEventId = googleEventId;
      } catch (calError) {
        console.error('Google Calendar event creation failed:', calError);
        calendarError = calError instanceof Error ? calError.message : 'Calendar sync failed';
        // Fallback meet link if Google Calendar call throws an error
        meetLink = `https://meet.google.com/lookup/aarav-${appointmentId.slice(0, 8)}`;
        newAppointment.meetLink = meetLink;
      }
    } else {
      // Fallback Google Meet link when Google OAuth is not yet completed
      meetLink = `https://meet.google.com/lookup/aarav-${appointmentId.slice(0, 8)}`;
      newAppointment.meetLink = meetLink;
    }

    saveAppointment(newAppointment);

    const googleCalendarUrl = generateGoogleCalendarUrl(newAppointment);
    const eventCreated = Boolean(googleEventId);

    return NextResponse.json(
      {
        success: true,
        appointment: newAppointment,
        meetLink,
        googleCalendarUrl,
        googleConnected: eventCreated,
        doctorEmail: DOCTOR_EMAIL,
        calendarError: calendarError || undefined,
        message: eventCreated
          ? 'Your consultation has been booked successfully! The appointment and Google Meet video link have been scheduled on your calendar.'
          : 'Your consultation has been booked! Use the button below to add it to your calendar.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error booking appointment:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

