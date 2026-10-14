'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Appointment } from '@/lib/storage';
import { DoctorOverride } from '@/lib/availability';
import {
  AdminTabType,
  AdminUser,
  AdminStats,
  PatientGroup,
  RevenueData,
} from '@/components/admin/types';

// Admin Modular Components & Tabs
import AdminLoginView from '@/components/admin/AdminLoginView';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverviewTab from '@/components/admin/tabs/AdminOverviewTab';
import AdminAppointmentsTab from '@/components/admin/tabs/AdminAppointmentsTab';
import AdminPatientsTab from '@/components/admin/tabs/AdminPatientsTab';
import AdminPaymentsTab from '@/components/admin/tabs/AdminPaymentsTab';
import DoctorAvailabilityManager from '@/components/admin/DoctorAvailabilityManager';
import PatientHistoryModal from '@/components/admin/PatientHistoryModal';
import AdminBookAppointmentModal from '@/components/admin/AdminBookAppointmentModal';
import AdminRescheduleModal from '@/components/admin/AdminRescheduleModal';

// Customer identity resolution helpers
function getCustomerKey(email?: string, phone?: string): string {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (cleanEmail) return cleanEmail;
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '').slice(-10) : '';
  return cleanPhone ? `phone:${cleanPhone}` : 'unknown';
}

function pickBestName(existing: string, candidate: string): string {
  if (!existing) return candidate;
  if (!candidate) return existing;
  return candidate.trim().length > existing.trim().length ? candidate.trim() : existing;
}

function pickBestPhone(existing: string, candidate: string): string {
  if (!existing) return candidate;
  if (!candidate) return existing;
  if (candidate.startsWith('+') && !existing.startsWith('+')) return candidate;
  return candidate.length > existing.length ? candidate : existing;
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');

  // Appointments Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AdminStats>({
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
  const [modeFilter, setModeFilter] = useState<'all' | 'offline' | 'online'>('all');
  const [apptViewMode, setApptViewMode] = useState<'table' | 'calendar'>('table');

  // Admin Book Appointment Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');

  // Admin Reschedule Appointment Drawer State
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);

  // Revenue Analytics Data
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);

  // Doctor Availability Overrides
  const [overrides, setOverrides] = useState<DoctorOverride[]>([]);

  // Selected Patient for History Modal
  const [selectedPatient, setSelectedPatient] = useState<PatientGroup | null>(null);

  // Refresh JWT tokens using /api/admin/auth/refresh
  const refreshAdminTokens = useCallback(async (): Promise<string | null> => {
    try {
      const storedRefreshToken = localStorage.getItem('admin_refresh_token');
      const res = await fetch('/api/admin/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!res.ok) {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        setIsAuthenticated(false);
        setAdminUser(null);
        return null;
      }

      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem('admin_access_token', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('admin_refresh_token', data.refreshToken);
        }
        if (data.user) {
          setAdminUser(data.user);
        }
        setIsAuthenticated(true);
        return data.accessToken;
      }
      return null;
    } catch (err) {
      console.error('Failed to refresh admin JWT token:', err);
      setIsAuthenticated(false);
      setAdminUser(null);
      return null;
    }
  }, []);

  // Authorized fetch wrapper for Admin API endpoints
  const adminFetch = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
      let token = localStorage.getItem('admin_access_token');
      const headers = new Headers(init.headers || {});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      init.headers = headers;
      init.credentials = 'same-origin';

      let res = await fetch(input, init);

      if (res.status === 401) {
        const refreshedToken = await refreshAdminTokens();
        if (refreshedToken) {
          const retryHeaders = new Headers(init.headers || {});
          retryHeaders.set('Authorization', `Bearer ${refreshedToken}`);
          init.headers = retryHeaders;
          res = await fetch(input, init);
        }
      }
      return res;
    },
    [refreshAdminTokens]
  );

  // Verify Active Session on Mount
  useEffect(() => {
    async function checkExistingSession() {
      setIsCheckingSession(true);
      try {
        const token = localStorage.getItem('admin_access_token');
        const res = await fetch('/api/admin/auth/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: 'same-origin',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setAdminUser(data.user);
            setIsAuthenticated(true);
          }
        } else {
          const refreshedToken = await refreshAdminTokens();
          if (refreshedToken) {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkExistingSession();
  }, [refreshAdminTokens]);

  // Handle Login Form Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Invalid email or password.');
        return;
      }

      if (data.accessToken) {
        localStorage.setItem('admin_access_token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('admin_refresh_token', data.refreshToken);
      }
      if (data.user) {
        setAdminUser(data.user);
      }

      setIsAuthenticated(true);
      setPassword('');
      setLoginError('');
    } catch (err) {
      console.error('Admin login error:', err);
      setLoginError('Network error while connecting to authentication server.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('clinic_doctor_logged_in');
      setIsAuthenticated(false);
      setAdminUser(null);
    }
  };

  // Fetch Appointments & Stats (Fast In-Memory Cache)
  const loadAppointments = useCallback(() => {
    setIsLoadingAppointments(true);
    adminFetch('/api/admin/appointments')
      .then((res) => res.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error('Failed to load admin appointments:', err))
      .finally(() => setIsLoadingAppointments(false));
  }, [adminFetch]);

  // Fetch Revenue Analytics
  const loadRevenue = useCallback(() => {
    adminFetch('/api/admin/revenue')
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) setRevenueData(data);
      })
      .catch((err) => console.error('Failed to load revenue analytics:', err));
  }, [adminFetch]);

  // Fetch Doctor Overrides
  const loadOverrides = useCallback(() => {
    return adminFetch('/api/availability')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.overrides)) setOverrides(data.overrides);
      })
      .catch((err) => console.error('Failed to load doctor availability:', err));
  }, [adminFetch]);

  // Initial Data Load on Authentication
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
      const res = await adminFetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        loadAppointments();
        loadRevenue();
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
      const res = await adminFetch('/api/admin/appointments', {
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
      const res = await adminFetch('/api/admin/appointments', {
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
      const res = await adminFetch(`/api/admin/appointments?id=${id}`, {
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
    const map = new Map<string, PatientGroup>();

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
    (appt: Appointment): PatientGroup => {
      const key = getCustomerKey(appt.email, appt.phone);
      const found = patientDirectory.find((p) => getCustomerKey(p.email, p.phone) === key);
      return (
        found || {
          fullName: appt.fullName,
          phone: appt.phone,
          email: appt.email,
          age: appt.age,
          appointments: [appt],
        }
      );
    },
    [patientDirectory]
  );

  // If Not Authenticated, Render Dedicated Login Component
  if (!isAuthenticated) {
    return (
      <AdminLoginView
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isSubmittingLogin={isSubmittingLogin}
        isCheckingSession={isCheckingSession}
        loginError={loginError}
        onSubmit={handleLogin}
      />
    );
  }

  // Render Authenticated Admin Dashboard
  return (
    <div className="admin-portal-wrapper">
      {/* Topbar & Tab Navigation Header */}
      <AdminHeader
        adminUser={adminUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalAppointments={stats.totalCount}
        totalPatients={patientDirectory.length}
        totalOverrides={overrides.length}
        onQuickBook={() => {
          setBookingDate('');
          setShowBookModal(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Admin Content Tab Panes */}
      <main className="admin-main-container container">
        {activeTab === 'overview' && (
          <AdminOverviewTab
            stats={stats}
            patientCount={patientDirectory.length}
            revenueData={revenueData}
            overridesCount={overrides.length}
          />
        )}

        {activeTab === 'appointments' && (
          <AdminAppointmentsTab
            appointments={appointments}
            stats={stats}
            overrides={overrides}
            isLoading={isLoadingAppointments}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            modeFilter={modeFilter}
            setModeFilter={setModeFilter}
            apptViewMode={apptViewMode}
            setApptViewMode={setApptViewMode}
            onRefresh={loadAppointments}
            onQuickBook={(dateIso) => {
              setBookingDate(dateIso || '');
              setShowBookModal(true);
            }}
            onSelectPatient={(appt) => setSelectedPatient(findPatientGroup(appt))}
            onReschedule={(appt) => setRescheduleAppointment(appt)}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePayment={handleUpdatePayment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}

        {activeTab === 'patients' && (
          <AdminPatientsTab
            patients={patientDirectory}
            onSelectPatient={(patient) => setSelectedPatient(patient)}
          />
        )}

        {activeTab === 'payments' && (
          <AdminPaymentsTab
            appointments={appointments}
            revenueData={revenueData}
          />
        )}

        {activeTab === 'availability' && (
          <div className="tab-pane-fade">
            <DoctorAvailabilityManager
              overrides={overrides}
              appointments={appointments}
              onOverridesChange={setOverrides}
              onRefresh={async () => {
                await loadOverrides();
                loadAppointments();
              }}
            />
          </div>
        )}
      </main>

      {/* Patient Consultation History Modal */}
      {selectedPatient && (
        <PatientHistoryModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdateNotes={handleUpdateNotes}
          onUpdateStatus={handleUpdateStatus}
          onReschedule={(appt) => setRescheduleAppointment(appt)}
        />
      )}

      {/* Admin Book Appointment & Cash Collection Slide-Over Drawer */}
      <AdminBookAppointmentModal
        isOpen={showBookModal}
        initialDate={bookingDate}
        appointments={appointments}
        overrides={overrides}
        onClose={() => setShowBookModal(false)}
        onSuccess={() => {
          loadAppointments();
          loadRevenue();
        }}
      />

      {/* Admin Reschedule Appointment Slide-Over Drawer */}
      <AdminRescheduleModal
        appointment={rescheduleAppointment}
        appointments={appointments}
        overrides={overrides}
        onClose={() => setRescheduleAppointment(null)}
        onSuccess={() => {
          loadAppointments();
          loadRevenue();
        }}
      />
    </div>
  );
}
