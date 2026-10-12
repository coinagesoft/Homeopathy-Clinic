import { NextRequest, NextResponse } from 'next/server';
import {
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  Appointment,
} from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';
    const statusFilter = searchParams.get('status') || 'all';
    const timeFilter = searchParams.get('time') || 'all';

    let appointments = getAllAppointments();

    // Sort by date descending (latest first)
    appointments.sort((a, b) => {
      const dateA = `${a.date}T${a.time}`;
      const dateB = `${b.date}T${b.time}`;
      return dateB.localeCompare(dateA);
    });

    const nowIso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

    // Compute aggregate summary before filtering
    const totalCount = appointments.length;
    const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
    const completedCount = appointments.filter((a) => a.status === 'completed').length;
    const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;
    const noShowCount = appointments.filter((a) => a.status === 'no-show').length;

    const totalRevenue = appointments
      .filter((a) => a.status !== 'cancelled' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.amount || 800), 0);

    const pendingRevenue = appointments
      .filter((a) => a.status !== 'cancelled' && a.paymentStatus === 'pending')
      .reduce((sum, a) => sum + (a.amount || 800), 0);

    const uniquePatients = new Set(
      appointments.map((a) => {
        const cleanEmail = a.email ? a.email.trim().toLowerCase() : '';
        if (cleanEmail) return cleanEmail;
        const cleanPhone = a.phone ? a.phone.replace(/[^0-9]/g, '').slice(-10) : '';
        return cleanPhone ? `phone:${cleanPhone}` : a.id;
      })
    ).size;

    // Apply Filters
    if (query) {
      appointments = appointments.filter(
        (a) =>
          a.fullName.toLowerCase().includes(query) ||
          a.phone.includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.reason.toLowerCase().includes(query) ||
          (a.paymentId && a.paymentId.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      appointments = appointments.filter((a) => a.status === statusFilter);
    }

    if (timeFilter === 'today') {
      appointments = appointments.filter((a) => a.date === nowIso);
    } else if (timeFilter === 'upcoming') {
      appointments = appointments.filter((a) => a.date >= nowIso && a.status !== 'cancelled');
    } else if (timeFilter === 'past') {
      appointments = appointments.filter((a) => a.date < nowIso);
    }

    return NextResponse.json({
      appointments,
      stats: {
        totalCount,
        confirmedCount,
        completedCount,
        cancelledCount,
        noShowCount,
        totalRevenue,
        pendingRevenue,
        uniquePatients,
      },
    });
  } catch (err: unknown) {
    console.error('Error fetching admin appointments:', err);
    return NextResponse.json(
      { error: 'Failed to fetch appointments.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus, paymentMethod, amount, notes } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Appointment ID is required.' },
        { status: 400 }
      );
    }

    const updates: Partial<Appointment> = {};
    if (status) updates.status = status;
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid' && !updates.paidAt) {
        updates.paidAt = new Date().toISOString();
      }
    }
    if (paymentMethod) updates.paymentMethod = paymentMethod;
    if (typeof amount === 'number') updates.amount = amount;
    if (typeof notes === 'string') updates.notes = notes;

    const updated = updateAppointment(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: 'Appointment not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Appointment updated successfully.',
      appointment: updated,
    });
  } catch (err: unknown) {
    console.error('Error updating appointment:', err);
    return NextResponse.json(
      { error: 'Failed to update appointment.' },
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
        { error: 'Appointment ID is required.' },
        { status: 400 }
      );
    }

    deleteAppointment(id);

    return NextResponse.json({
      message: 'Appointment removed successfully.',
    });
  } catch (err: unknown) {
    console.error('Error deleting appointment:', err);
    return NextResponse.json(
      { error: 'Failed to delete appointment.' },
      { status: 500 }
    );
  }
}

