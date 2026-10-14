'use client';

import React from 'react';
import { Appointment } from '@/lib/storage';
import { DoctorOverride } from '@/lib/availability';
import AdminAppointmentCalendar from '@/components/admin/AdminAppointmentCalendar';
import {
  IconCalendar,
  IconRefresh,
  IconPlus,
  IconCross,
  IconTrash,
  IconFileText,
  IconVideo,
  IconBuilding,
} from '@/components/admin/AdminIcons';
import { AdminStats } from '@/components/admin/types';

interface AdminAppointmentsTabProps {
  appointments: Appointment[];
  stats: AdminStats;
  overrides: DoctorOverride[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  timeFilter: string;
  setTimeFilter: (val: string) => void;
  modeFilter: 'all' | 'offline' | 'online';
  setModeFilter: (val: 'all' | 'offline' | 'online') => void;
  apptViewMode: 'table' | 'calendar';
  setApptViewMode: (val: 'table' | 'calendar') => void;
  onRefresh: () => void;
  onQuickBook: (dateIso?: string) => void;
  onSelectPatient: (appt: Appointment) => void;
  onReschedule: (appt: Appointment) => void;
  onUpdateStatus: (
    id: string,
    status: 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  ) => void;
  onUpdatePayment: (
    id: string,
    paymentStatus: 'paid' | 'pending' | 'refunded'
  ) => void;
  onDeleteAppointment: (id: string, patientName: string) => void;
}

export default function AdminAppointmentsTab({
  appointments,
  stats,
  overrides,
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  timeFilter,
  setTimeFilter,
  modeFilter,
  setModeFilter,
  apptViewMode,
  setApptViewMode,
  onRefresh,
  onQuickBook,
  onSelectPatient,
  onReschedule,
  onUpdateStatus,
  onUpdatePayment,
  onDeleteAppointment,
}: AdminAppointmentsTabProps) {
  const hasActiveFilters =
    searchQuery || statusFilter !== 'all' || timeFilter !== 'all' || modeFilter !== 'all';

  const filteredAppointments = React.useMemo(() => {
    let result = appointments;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q) ||
          (a.paymentId && a.paymentId.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (timeFilter !== 'all') {
      const nowIso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
      if (timeFilter === 'today') {
        result = result.filter((a) => a.date === nowIso);
      } else if (timeFilter === 'upcoming') {
        result = result.filter((a) => a.date >= nowIso && a.status !== 'cancelled');
      } else if (timeFilter === 'past') {
        result = result.filter((a) => a.date < nowIso);
      }
    }
    if (modeFilter !== 'all') {
      result = result.filter((a) => a.consultationType === modeFilter);
    }
    return result;
  }, [appointments, searchQuery, statusFilter, timeFilter, modeFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTimeFilter('all');
    setModeFilter('all');
  };

  return (
    <div className="tab-pane-fade">
      {/* Controls & Filter Bar */}
      <div className="table-controls-bar">
        {/* Search Input */}
        <div className="search-box-wrap">
          <input
            type="text"
            placeholder="Search by patient name, phone, email, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {/* Consultation Mode Filter */}
        <div className="filter-select-wrap">
          <label>Mode:</label>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value as 'all' | 'offline' | 'online')}
            className="admin-select"
          >
            <option value="all">All Modes</option>
            <option value="offline">In-Clinic (Offline)</option>
            <option value="online">Online (Google Meet)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-select-wrap">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>

        {/* Timeframe Filter */}
        <div className="filter-select-wrap">
          <label>Timeframe:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* Table / Calendar View Toggle */}
        <div className="view-mode-tabs" role="tablist" aria-label="Appointment view format">
          <button
            type="button"
            className={`view-toggle-btn ${apptViewMode === 'table' ? 'active' : ''}`}
            onClick={() => setApptViewMode('table')}
            title="List / Table View"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>Table</span>
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${apptViewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setApptViewMode('calendar')}
            title="Interactive Calendar View"
          >
            <IconCalendar size={15} />
            <span>Calendar</span>
          </button>
        </div>

        {/* Quick Book Button */}
        <button
          type="button"
          className="btn-admin-primary"
          onClick={() => onQuickBook()}
          title="Book appointment and collect cash"
        >
          <IconPlus />
          <span>Book Appointment</span>
        </button>

        <button type="button" onClick={onRefresh} className="btn-reload" title="Refresh records">
          <IconRefresh />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main View Area: Calendar View vs Table View */}
      {apptViewMode === 'calendar' ? (
        <AdminAppointmentCalendar
          appointments={filteredAppointments}
          overrides={overrides}
          onSelectPatient={onSelectPatient}
          onBookDate={(dateIso) => onQuickBook(dateIso)}
        />
      ) : (
        /* Appointments Table Card */
        <div className="admin-table-card">
          {isLoading && appointments.length === 0 ? (
            <div className="admin-loading-state">
              <div className="admin-empty-icon">
                <IconRefresh size={24} />
              </div>
              <h4>Loading Appointments...</h4>
              <p>Fetching the latest appointment records from the database.</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <IconCalendar size={28} />
              </div>
              <h4>
                {stats.totalCount === 0 && !hasActiveFilters
                  ? 'No Appointments Available'
                  : 'No Appointments Match the Chosen Filter'}
              </h4>
              <p>
                {stats.totalCount === 0 && !hasActiveFilters
                  ? 'There are currently no booked appointments in the database. New patient bookings will appear here automatically.'
                  : 'No appointment records matched your current search or filter criteria. Try resetting the filters below.'}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date &amp; Time</th>
                    <th>Mode</th>
                    <th>Patient Details</th>
                    <th>Health Concern</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th className="th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>
                        <div className="cell-datetime">
                          <strong>{appt.date}</strong>
                          <span>{appt.time}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`mode-pill ${
                            appt.consultationType === 'offline' ? 'mode-offline' : 'mode-online'
                          }`}
                        >
                          {appt.consultationType === 'offline' ? 'In-Clinic' : 'Online Meet'}
                        </span>
                      </td>
                      <td>
                        <div className="cell-patient">
                          <button
                            type="button"
                            className="patient-name-link"
                            onClick={() => onSelectPatient(appt)}
                          >
                            {appt.fullName}
                          </button>
                          <span className="patient-meta">
                            Age {appt.age || '—'} &bull; {appt.phone}
                          </span>
                          <span className="patient-email">{appt.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="reason-pill">{appt.reason}</span>
                        {appt.message && (
                          <p className="cell-patient-note" title={appt.message}>
                            &ldquo;{appt.message}&rdquo;
                          </p>
                        )}
                      </td>
                      <td>
                        <select
                          value={appt.status || 'confirmed'}
                          onChange={(e) =>
                            onUpdateStatus(
                              appt.id,
                              e.target.value as 'confirmed' | 'completed' | 'cancelled' | 'no-show'
                            )
                          }
                          className={`status-dropdown status-${appt.status || 'confirmed'}`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no-show">No Show</option>
                        </select>
                      </td>
                      <td>
                        <div className="cell-payment-wrap">
                          <span className={`payment-pill pill-${appt.paymentStatus || 'paid'}`}>
                            {appt.paymentStatus === 'paid'
                              ? `${appt.paymentMethod === 'Cash' ? 'Cash Paid' : 'Paid'} ₹${
                                  appt.amount || 800
                                }`
                              : appt.paymentStatus === 'refunded'
                              ? 'Refunded'
                              : 'Pending'}
                          </span>
                          {appt.paymentStatus !== 'paid' && (
                            <button
                              type="button"
                              className="btn-mark-paid"
                              onClick={() => onUpdatePayment(appt.id, 'paid')}
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="cell-actions-wrap">
                          <button
                            type="button"
                            className="action-pill action-pill-notes"
                            title="View Patient Details & Clinical Notes"
                            onClick={() => onSelectPatient(appt)}
                          >
                            <IconFileText size={13} />
                            <span>Notes</span>
                          </button>

                          <button
                            type="button"
                            className="action-pill action-pill-reschedule"
                            title="Reschedule appointment date & time"
                            onClick={() => onReschedule(appt)}
                          >
                            <IconCalendar size={13} />
                            <span>Reschedule</span>
                          </button>

                          {appt.consultationType !== 'offline' && appt.meetLink ? (
                            <a
                              href={appt.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-pill action-pill-meet"
                              title="Join Google Meet Video Consultation"
                            >
                              <IconVideo size={13} />
                              <span>Meet</span>
                            </a>
                          ) : (
                            <span
                              className="action-pill action-pill-clinic"
                              title="In-Clinic Visit (Pune Clinic)"
                            >
                              <IconBuilding size={13} />
                              <span>In-Clinic</span>
                            </span>
                          )}

                          <button
                            type="button"
                            className="action-pill action-pill-del"
                            title="Cancel / Delete Appointment"
                            onClick={() => onDeleteAppointment(appt.id, appt.fullName)}
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

