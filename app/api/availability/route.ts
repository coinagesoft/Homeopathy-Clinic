import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  getAllDoctorOverrides,
  saveDoctorOverride,
  deleteDoctorOverride,
  getDoctorBlockedDates,
  DoctorOverride,
} from '@/lib/availability';

export async function GET() {
  const overrides = getAllDoctorOverrides();
  const blockedDates = getDoctorBlockedDates();

  return NextResponse.json({
    overrides,
    blockedDates,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, type, blockedSlots, reason } = body;

    if (!date || typeof date !== 'string') {
      return NextResponse.json(
        { error: 'Date is required (YYYY-MM-DD).' },
        { status: 400 }
      );
    }

    if (type !== 'full_day' && type !== 'specific_slots') {
      return NextResponse.json(
        { error: 'Type must be either "full_day" or "specific_slots".' },
        { status: 400 }
      );
    }

    if (type === 'specific_slots' && (!Array.isArray(blockedSlots) || blockedSlots.length === 0)) {
      return NextResponse.json(
        { error: 'At least one time slot must be selected for specific_slots blackout.' },
        { status: 400 }
      );
    }

    const override: DoctorOverride = {
      id: crypto.randomUUID(),
      date,
      type,
      blockedSlots: type === 'specific_slots' ? blockedSlots : undefined,
      reason: (reason && typeof reason === 'string' && reason.trim()) || 'Doctor unavailable',
      createdAt: new Date().toISOString(),
    };

    saveDoctorOverride(override);

    return NextResponse.json(
      { message: 'Doctor availability override saved successfully.', override },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Error saving doctor availability override:', err);
    return NextResponse.json(
      { error: 'Failed to save doctor availability override.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Override ID is required.' },
        { status: 400 }
      );
    }

    deleteDoctorOverride(id);

    return NextResponse.json({
      message: 'Doctor availability override removed successfully.',
    });
  } catch (err: unknown) {
    console.error('Error removing doctor availability override:', err);
    return NextResponse.json(
      { error: 'Failed to remove availability override.' },
      { status: 500 }
    );
  }
}

