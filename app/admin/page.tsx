'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Appointment } from '@/lib/storage';
import { DoctorOverride } from '@/lib/availability';
import RevenueChart from '@/components/admin/RevenueChart';
import PatientHistoryModal from '@/components/admin/PatientHistoryModal';
import DoctorAvailabilityManager from '@/components/admin/DoctorAvailabilityManager';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'patients' | 'payments' | 'availability'>('overview');

  // Appointments Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    noShowCount: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    uniquePatients: 0,
  });
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  // Filters for Appointments Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Revenue Analytics Data
  const [revenueData, setRevenueData] = useState<{
    summary: {
      totalAllTime: number;
      todayRevenue: number;
      thisMonthRevenue: number;
      thisYearRevenue: number;
      pendingReceivables: number;
      totalPaidAppointments: number;
    };
    dailyData: { date: string; label: string; revenue: number; bookings: number }[];
    monthlyData: { month: string; monthIndex: number; revenue: number; bookings: number }[];
    yearlyData: { year: number; revenue: number; bookings: number }[];
    reasonBreakdown: { reason: string; count: number; revenue: number }[];
    paymentMethodBreakdown: { method: string; count: number; amount: number }[];
  } | null>(null);

  // Doctor Availability Overrides
  const [overrides, setOverrides] = useState<DoctorOverride[]>([]);

  // Selected Patient for History Modal
  const [selectedPatient, setSelectedPatient] = useState<{
    fullName: string;
    phone: string;
    email: string;
    age: number;
    appointments: Appointment[];
  } | null>(null);

  // Check login session on mount
  useEffect(() => {
    const session = localStorage.getItem('clinic_doctor_logged_in');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (enteredPin === '1234' || enteredPin === 'aarav2026') {
      setIsAuthenticated(true);
      localStorage.setItem('clinic_doctor_logged_in', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Clinic PIN. (Default demo PIN is 1234)');
    }
  };

  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('clinic_doctor_logged_in', 'true');
    setLoginError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('clinic_doctor_logged_in');
  };

  // Fetch Appointments & Stats
  const loadAppointments = useCallback(() => {
    setIsLoadingAppointments(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (timeFilter !== 'all') params.set('time', timeFilter);

    fetch(`/api/admin/appointments?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error('Failed to load admin appointments:', err))
      .finally(() => setIsLoadingAppointments(false));
  }, [searchQuery, statusFilter, timeFilter]);

  // Fetch Revenue Analytics
  const loadRevenue = useCallback(() => {
    fetch('/api/admin/revenue')
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) setRevenueData(data);
      })
      .catch((err) => console.error('Failed to load revenue analytics:', err));
  }, []);

  // Fetch Doctor Overrides
  const loadOverrides = useCallback(() => {
    fetch('/api/availability')
      .then((res) => res.json())
      .then((data) => {
        if (data.overrides) setOverrides(data.overrides);
      })
      .catch((err) => console.error('Failed to load doctor availability:', err));
  }, []);

  // Initial Data Load
  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
      loadRevenue();
      loadOverrides();
    }
  }, [isAuthenticated, loadAppointments, loadRevenue, loadOverrides]);

  // Update Appointment Status
  const handleUpdateStatus = async (
    id: string,
    status: 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  ) => {
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        loadAppointments();
        loadRevenue();
        // Update selected patient if open
        if (selectedPatient) {
          setSelectedPatient((prev) =>
            prev
              ? {
                  ...prev,
                  appointments: prev.appointments.map((a) =>
                    a.id === id ? { ...a, status } : a
                  ),
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Update Payment Status
  const handleUpdatePayment = async (
    id: string,
    paymentStatus: 'paid' | 'pending' | 'refunded'
  ) => {
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, paymentStatus }),
      });
      if (res.ok) {
        loadAppointments();
        loadRevenue();
      }
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  // Update Notes
  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, notes }),
      });
      if (res.ok) {
        loadAppointments();
        if (selectedPatient) {
          setSelectedPatient((prev) =>
            prev
              ? {
                  ...prev,
                  appointments: prev.appointments.map((a) =>
                    a.id === id ? { ...a, notes } : a
                  ),
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error('Failed to update notes:', err);
    }
  };

  // Delete Appointment
  const handleDeleteAppointment = async (id: string, patientName: string) => {
    if (!confirm(`Are you sure you want to cancel and remove the appointment for ${patientName}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadAppointments();
        loadRevenue();
      }
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    }
  };

  // Group Appointments by Unique Patient
  const patientDirectory = useMemo(() => {
    const map = new Map<
      string,
      {
        fullName: string;
        phone: string;
        email: string;
        age: number;
        appointments: Appointment[];
      }
    >();

    appointments.forEach((appt) => {
      const key = appt.phone.replace(/[^0-9]/g, '') || appt.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.appointments.push(appt);
      } else {
        map.set(key, {
          fullName: appt.fullName,
          phone: appt.phone,
          email: appt.email,
          age: appt.age,
          appointments: [appt],
        });
      }
    });

    return Array.from(map.values());
  }, [appointments]);

  // If Not Authenticated, Render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-logo">
            <span className="clinic-symbol">&#x271A;</span>
            <h2>Dr. Aarav Mehta Clinic</h2>
            <p>Doctor &amp; Administrative Management Portal</p>
          </div>

          {loginError && <div className="admin-alert alert-error">{loginError}</div>}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="pin-input">Doctor Access PIN</label>
              <input
                type="password"
                id="pin-input"
                maxLength={8}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="Enter 4-digit PIN (1234)"
                className="admin-input pin-input"
                autoFocus
              />
            </div>

            <button type="submit" className="btn btn-login-submit">
              Sign In to Admin Portal
            </button>

            <button
              type="button"
              className="btn btn-demo-login"
              onClick={handleDemoLogin}
            >
              Demo Sign In as Doctor (PIN: 1234)
            </button>
          </form>

          <div className="login-footer-link">
            <Link href="/">&#x2190; Return to Public Clinic Website</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal-wrapper">
      {/* Admin Top Header Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link href="/" className="admin-brand-link" title="Visit Public Website">
            <strong>Dr. Aarav Mehta</strong>
            <span>Admin Portal</span>
          </Link>
          <span className="admin-badge-doctor">BHMS, MD (Homeopathy) &bull; Pune</span>
        </div>

        <div className="admin-topbar-right">
          <button
            type="button"
            className="btn-quick-leave"
            onClick={() => setActiveTab('availability')}
          >
            + Set Doctor Leave / Blackout
          </button>

          <Link href="/appointment" className="btn-portal-view" target="_blank">
            Open Booking Portal &#x2197;
          </Link>

          <button type="button" className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Admin Tabs Navigation */}
      <nav className="admin-nav-tabs">
        <div className="container nav-tabs-container">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-icon">📈</span>
            <span>Overview &amp; Analytics</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <span className="tab-icon">📅</span>
            <span>Appointments &amp; Bookings</span>
            <span className="tab-counter">{stats.totalCount}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <span className="tab-icon">👥</span>
            <span>Patients Directory</span>
            <span className="tab-counter">{patientDirectory.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span className="tab-icon">💳</span>
            <span>Payments &amp; Revenue</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            <span className="tab-icon">👨‍⚕️</span>
            <span>Doctor Availability</span>
            <span className="tab-counter counter-amber">{overrides.length}</span>
          </button>
        </div>
      </nav>

      {/* Main Admin Content */}
      <main className="admin-main-container container">
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="tab-pane-fade">
            {/* 4 Top KPI Metric Cards */}
            <div className="admin-kpi-grid">
              <div className="kpi-card card-revenue">
                <div className="kpi-icon-box">₹</div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Revenue</span>
                  <strong className="kpi-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</strong>
                  <span className="kpi-meta">
                    Paid consultations: {stats.completedCount + stats.confirmedCount}
                  </span>
                </div>
              </div>

              <div className="kpi-card card-appointments">
                <div className="kpi-icon-box">📅</div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Appointments</span>
                  <strong className="kpi-value">{stats.totalCount}</strong>
                  <span className="kpi-meta">
                    {stats.confirmedCount} confirmed &bull; {stats.completedCount} completed
                  </span>
                </div>
              </div>

              <div className="kpi-card card-patients">
                <div className="kpi-icon-box">👥</div>
                <div className="kpi-info">
                  <span className="kpi-label">Registered Patients</span>
                  <strong className="kpi-value">{patientDirectory.length}</strong>
                  <span className="kpi-meta">Unique contact profiles</span>
                </div>
              </div>

              <div className="kpi-card card-pending">
                <div className="kpi-icon-box">⏳</div>
                <div className="kpi-info">
                  <span className="kpi-label">Pending Receivables</span>
                  <strong className="kpi-value">₹{stats.pendingRevenue.toLocaleString('en-IN')}</strong>
                  <span className="kpi-meta">Awaiting payment settlement</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Revenue Trends Chart */}
            {revenueData && (
              <RevenueChart
                dailyData={revenueData.dailyData}
                monthlyData={revenueData.monthlyData}
                yearlyData={revenueData.yearlyData}
              />
            )}

            {/* Two Side Breakdown Widgets */}
            <div className="overview-widgets-grid">
              {/* Consultation Reasons Breakdown */}
              <div className="admin-widget-card">
                <h3 className="widget-title">Consultations by Health Concern</h3>
                <p className="widget-subtitle">Primary symptoms treated at Dr. Aarav clinic</p>

                <div className="widget-list">
                  {revenueData?.reasonBreakdown.map((item) => {
                    const percent = stats.totalCount > 0 ? Math.round((item.count / stats.totalCount) * 100) : 0;
                    return (
                      <div key={item.reason} className="widget-breakdown-row">
                        <div className="breakdown-labels">
                          <strong>{item.reason}</strong>
                          <span>
                            {item.count} patients ({percent}%)
                          </span>
                        </div>
                        <div className="breakdown-bar-track">
                          <div
                            className="breakdown-bar-fill"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods & Clinic Status Breakdown */}
              <div className="admin-widget-card">
                <h3 className="widget-title">Payment Methods &amp; Status</h3>
                <p className="widget-subtitle">Breakdown of patient transactions</p>

                <div className="payment-methods-grid">
                  {revenueData?.paymentMethodBreakdown.map((m) => (
                    <div key={m.method} className="method-tile">
                      <span className="method-name">{m.method}</span>
                      <strong className="method-amt">₹{m.amount.toLocaleString('en-IN')}</strong>
                      <span className="method-count">{m.count} payments</span>
                    </div>
                  ))}
                </div>

                <div className="clinic-status-box">
                  <h4>Doctor Schedule Highlights:</h4>
                  <ul>
                    <li>
                      <strong>Active Leave Overrides:</strong> {overrides.length} dates configured
                    </li>
                    <li>
                      <strong>Cancellation Rate:</strong>{' '}
                      {stats.totalCount > 0
                        ? `${Math.round((stats.cancelledCount / stats.totalCount) * 100)}%`
                        : '0%'}
                    </li>
                    <li>
                      <strong>Average Consultation Fee:</strong> ₹800
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS & BOOKINGS */}
        {activeTab === 'appointments' && (
          <div className="tab-pane-fade">
            <div className="table-controls-bar">
              {/* Search Box */}
              <div className="search-box-wrap">
                <input
                  type="text"
                  placeholder="Search by patient name, phone, email, reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
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

              {/* Time Filter */}
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

              <button type="button" onClick={loadAppointments} className="btn-reload" title="Refresh">
                &#x21bb; Refresh
              </button>
            </div>

            {/* Appointments Table */}
            <div className="admin-table-card">
              {isLoadingAppointments ? (
                <div className="admin-loading-state">Loading appointments...</div>
              ) : appointments.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No appointments match the chosen filter.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date &amp; Time</th>
                        <th>Patient Details</th>
                        <th>Health Concern</th>
                        <th>Google Meet</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt.id}>
                          <td>
                            <div className="cell-datetime">
                              <strong>{appt.date}</strong>
                              <span>{appt.time}</span>
                            </div>
                          </td>
                          <td>
                            <div className="cell-patient">
                              <button
                                type="button"
                                className="patient-name-link"
                                onClick={() => {
                                  const group = patientDirectory.find(
                                    (p) =>
                                      p.phone === appt.phone ||
                                      p.email.toLowerCase() === appt.email.toLowerCase()
                                  );
                                  setSelectedPatient(group || {
                                    fullName: appt.fullName,
                                    phone: appt.phone,
                                    email: appt.email,
                                    age: appt.age,
                                    appointments: [appt],
                                  });
                                }}
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
                            {appt.meetLink ? (
                              <a
                                href={appt.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="meet-pill-link"
                              >
                                Join Meet &#x2197;
                              </a>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            <select
                              value={appt.status || 'confirmed'}
                              onChange={(e) =>
                                handleUpdateStatus(
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
                                  ? `Paid ₹${appt.amount || 800}`
                                  : appt.paymentStatus === 'refunded'
                                  ? 'Refunded'
                                  : 'Pending'}
                              </span>
                              {appt.paymentStatus !== 'paid' && (
                                <button
                                  type="button"
                                  className="btn-mark-paid"
                                  onClick={() => handleUpdatePayment(appt.id, 'paid')}
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
                                className="action-btn-record"
                                title="View Patient Details & Notes"
                                onClick={() => {
                                  const group = patientDirectory.find(
                                    (p) =>
                                      p.phone === appt.phone ||
                                      p.email.toLowerCase() === appt.email.toLowerCase()
                                  );
                                  setSelectedPatient(group || {
                                    fullName: appt.fullName,
                                    phone: appt.phone,
                                    email: appt.email,
                                    age: appt.age,
                                    appointments: [appt],
                                  });
                                }}
                              >
                                Notes
                              </button>
                              <button
                                type="button"
                                className="action-btn-del"
                                title="Delete Appointment"
                                onClick={() => handleDeleteAppointment(appt.id, appt.fullName)}
                              >
                                &times;
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
          </div>
        )}

        {/* TAB 3: PATIENT DIRECTORY & BOOKING HISTORY */}
        {activeTab === 'patients' && (
          <div className="tab-pane-fade">
            <div className="directory-header">
              <div>
                <h3 className="section-title">Patient Directory &amp; Records</h3>
                <p className="section-subtitle">
                  {patientDirectory.length} individual patients registered. Click on any patient to view their complete consultation &amp; prescription history.
                </p>
              </div>
            </div>

            <div className="patients-grid">
              {patientDirectory.map((patient) => {
                const totalSpent = patient.appointments
                  .filter((a) => a.paymentStatus === 'paid' && a.status !== 'cancelled')
                  .reduce((sum, a) => sum + (a.amount || 800), 0);

                const latestAppt = patient.appointments[0];

                return (
                  <div key={patient.phone} className="patient-card">
                    <div className="patient-card-header">
                      <div className="patient-avatar-circle">
                        {patient.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="patient-header-details">
                        <h4 className="patient-card-name">{patient.fullName}</h4>
                        <span className="patient-card-age">Age: {patient.age || '—'}</span>
                      </div>
                    </div>

                    <div className="patient-card-body">
                      <div className="card-detail-item">
                        <span>Phone:</span>
                        <strong>{patient.phone}</strong>
                      </div>
                      <div className="card-detail-item">
                        <span>Email:</span>
                        <strong className="truncate-text">{patient.email}</strong>
                      </div>
                      <div className="card-detail-item">
                        <span>Total Consultations:</span>
                        <strong>{patient.appointments.length} Visits</strong>
                      </div>
                      <div className="card-detail-item">
                        <span>Lifetime Spend:</span>
                        <strong className="highlight-green">₹{totalSpent.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="card-detail-item">
                        <span>Latest Visit:</span>
                        <span>{latestAppt?.date || '—'}</span>
                      </div>
                    </div>

                    <div className="patient-card-footer">
                      <button
                        type="button"
                        className="btn-view-history"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        View Full History &amp; Rx Notes &#x2192;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS & REVENUE MANAGEMENT */}
        {activeTab === 'payments' && (
          <div className="tab-pane-fade">
            <div className="admin-kpi-grid">
              <div className="kpi-card">
                <span className="kpi-label">Today&apos;s Collection</span>
                <strong className="kpi-value">
                  ₹{revenueData?.summary.todayRevenue.toLocaleString('en-IN') || 0}
                </strong>
                <span className="kpi-meta">Cleared receipts today</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">This Month&apos;s Collection</span>
                <strong className="kpi-value">
                  ₹{revenueData?.summary.thisMonthRevenue.toLocaleString('en-IN') || 0}
                </strong>
                <span className="kpi-meta">October 2026 total</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Annual Revenue</span>
                <strong className="kpi-value">
                  ₹{revenueData?.summary.thisYearRevenue.toLocaleString('en-IN') || 0}
                </strong>
                <span className="kpi-meta">Year 2026</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Pending Receivables</span>
                <strong className="kpi-value">
                  ₹{revenueData?.summary.pendingReceivables.toLocaleString('en-IN') || 0}
                </strong>
                <span className="kpi-meta">Awaiting payment settlement</span>
              </div>
            </div>

            {/* Payments History Table */}
            <div className="admin-table-card">
              <div className="card-table-title-bar">
                <h3>Payment Transactions &amp; Receipts Log</h3>
                <span className="text-muted">
                  Standard consultation fee: ₹800 per appointment
                </span>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Patient Name</th>
                      <th>Appointment Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Payment Status</th>
                      <th>Paid At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td>
                          <code>{appt.paymentId || `PAY-${appt.id.slice(0, 8).toUpperCase()}`}</code>
                        </td>
                        <td>
                          <strong>{appt.fullName}</strong>
                          <span className="cell-sub">{appt.phone}</span>
                        </td>
                        <td>
                          {appt.date} ({appt.time})
                        </td>
                        <td>
                          <strong>₹{appt.amount || 800}</strong>
                        </td>
                        <td>
                          <span className="method-pill">{appt.paymentMethod || 'UPI'}</span>
                        </td>
                        <td>
                          <span className={`payment-pill pill-${appt.paymentStatus || 'paid'}`}>
                            {appt.paymentStatus || 'paid'}
                          </span>
                        </td>
                        <td>
                          <span className="cell-sub">
                            {appt.paidAt ? new Date(appt.paidAt).toLocaleDateString('en-IN') : '—'}
                          </span>
                        </td>
                        <td>
                          {appt.paymentStatus !== 'paid' ? (
                            <button
                              type="button"
                              className="btn-mark-paid"
                              onClick={() => handleUpdatePayment(appt.id, 'paid')}
                            >
                              Record Payment
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-refund-action"
                              onClick={() => {
                                if (confirm(`Issue refund for ${appt.fullName} (₹${appt.amount || 800})?`)) {
                                  handleUpdatePayment(appt.id, 'refunded');
                                }
                              }}
                            >
                              Issue Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOCTOR AVAILABILITY & BLACKOUT */}
        {activeTab === 'availability' && (
          <div className="tab-pane-fade">
            <DoctorAvailabilityManager
              overrides={overrides}
              onRefresh={() => {
                loadOverrides();
                loadAppointments();
              }}
            />
          </div>
        )}
      </main>

      {/* Patient History Modal */}
      {selectedPatient && (
        <PatientHistoryModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdateNotes={handleUpdateNotes}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
