'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Appointment } from '@/lib/storage';
import { DoctorOverride } from '@/lib/availability';
import RevenueChart from '@/components/admin/RevenueChart';
import PatientHistoryModal from '@/components/admin/PatientHistoryModal';
import DoctorAvailabilityManager from '@/components/admin/DoctorAvailabilityManager';

// Standardized Feather/Lucide SVG icon system with uniform 2px stroke and currentColor
function IconOverview({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconCalendar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconUsers({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconPayments({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconAvailability({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconWallet({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 7h-7" />
      <path d="M14 17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
      <rect x="16" y="11" width="6" height="8" rx="2" />
    </svg>
  );
}

function IconClock({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconLogOut() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconCross() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// Customer identity resolution: same email = same customer
function getCustomerKey(email?: string, phone?: string): string {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (cleanEmail) {
    return cleanEmail;
  }
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '').slice(-10) : '';
  return cleanPhone ? `phone:${cleanPhone}` : 'unknown';
}

function pickBestName(existing: string, candidate: string): string {
  if (!existing) return candidate;
  if (!candidate) return existing;
  if (candidate.trim().length > existing.trim().length) {
    return candidate.trim();
  }
  return existing;
}

function pickBestPhone(existing: string, candidate: string): string {
  if (!existing) return candidate;
  if (!candidate) return existing;
  if (candidate.startsWith('+') && !existing.startsWith('+')) {
    return candidate;
  }
  return candidate.length > existing.length ? candidate : existing;
}

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

  // Group Appointments by Unique Customer (Same email = same customer)
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
      const key = getCustomerKey(appt.email, appt.phone);
      const existing = map.get(key);
      if (existing) {
        existing.appointments.push(appt);
        existing.fullName = pickBestName(existing.fullName, appt.fullName);
        existing.phone = pickBestPhone(existing.phone, appt.phone);
        if (!existing.age && appt.age) existing.age = appt.age;
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

  const findPatientGroup = useCallback(
    (appt: Appointment) => {
      const key = getCustomerKey(appt.email, appt.phone);
      return patientDirectory.find((p) => getCustomerKey(p.email, p.phone) === key);
    },
    [patientDirectory]
  );

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
      {/* Admin Top Header Bar - Centered and aligned via container admin-topbar-inner */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
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
              <IconPlus />
              <span>Set Doctor Leave / Blackout</span>
            </button>

            <Link href="/appointment" className="btn-portal-view" target="_blank">
              <span>Open Booking Portal</span>
              <IconExternalLink />
            </Link>

            <button type="button" className="btn-logout" onClick={handleLogout}>
              <IconLogOut />
              <span>Logout</span>
            </button>
          </div>
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
            <IconOverview />
            <span>Overview &amp; Analytics</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <IconCalendar />
            <span>Appointments &amp; Bookings</span>
            <span className="tab-counter">{stats.totalCount}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <IconUsers />
            <span>Patients Directory</span>
            <span className="tab-counter">{patientDirectory.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <IconPayments />
            <span>Payments &amp; Revenue</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            <IconAvailability />
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
              <div className="kpi-card">
                <div className="kpi-icon-box">
                  <IconWallet size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Revenue</span>
                  <strong className="kpi-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</strong>
                  <span className="kpi-meta">
                    Paid consultations: {stats.completedCount + stats.confirmedCount}
                  </span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box">
                  <IconCalendar size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Appointments</span>
                  <strong className="kpi-value">{stats.totalCount}</strong>
                  <span className="kpi-meta">
                    {stats.confirmedCount} confirmed &bull; {stats.completedCount} completed
                  </span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box">
                  <IconUsers size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Registered Patients</span>
                  <strong className="kpi-value">{patientDirectory.length}</strong>
                  <span className="kpi-meta">Unique contact profiles</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box">
                  <IconClock size={22} />
                </div>
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
                <IconRefresh />
                <span>Refresh</span>
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
                                  const group = findPatientGroup(appt);
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
                                  const group = findPatientGroup(appt);
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
                                <IconCross />
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
                  {patientDirectory.length} individual patient{patientDirectory.length === 1 ? '' : 's'} registered. Click on any patient to view their complete consultation &amp; prescription history.
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
                  <div key={patient.email || patient.phone} className="patient-card">
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
                        <span>View Full History &amp; Rx Notes</span>
                        <IconArrowRight />
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
                <div className="kpi-icon-box">
                  <IconWallet size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Today&apos;s Collection</span>
                  <strong className="kpi-value">
                    ₹{revenueData?.summary.todayRevenue.toLocaleString('en-IN') || 0}
                  </strong>
                  <span className="kpi-meta">Cleared receipts today</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-box">
                  <IconCalendar size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">This Month&apos;s Collection</span>
                  <strong className="kpi-value">
                    ₹{revenueData?.summary.thisMonthRevenue.toLocaleString('en-IN') || 0}
                  </strong>
                  <span className="kpi-meta">Current month total</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-box">
                  <IconOverview size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Annual Revenue</span>
                  <strong className="kpi-value">
                    ₹{revenueData?.summary.thisYearRevenue.toLocaleString('en-IN') || 0}
                  </strong>
                  <span className="kpi-meta">Year {new Date().getFullYear()}</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-box">
                  <IconClock size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Pending Receivables</span>
                  <strong className="kpi-value">
                    ₹{revenueData?.summary.pendingReceivables.toLocaleString('en-IN') || 0}
                  </strong>
                  <span className="kpi-meta">Awaiting payment settlement</span>
                </div>
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

