'use client';

import React from 'react';
import Link from 'next/link';
import {
  IconOverview,
  IconCalendar,
  IconUsers,
  IconPayments,
  IconAvailability,
  IconPlus,
  IconExternalLink,
  IconLogOut,
} from './AdminIcons';
import { AdminTabType, AdminUser } from './types';

interface AdminHeaderProps {
  adminUser: AdminUser | null;
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  totalAppointments: number;
  totalPatients: number;
  totalOverrides: number;
  onQuickBook: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  adminUser,
  activeTab,
  setActiveTab,
  totalAppointments,
  totalPatients,
  totalOverrides,
  onQuickBook,
  onLogout,
}: AdminHeaderProps) {
  return (
    <>
      {/* Top Header Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-left">
            <Link href="/" className="admin-brand-link" title="Visit Public Website">
              <strong>Dr. Aarav Mehta</strong>
              <span>Admin Portal</span>
            </Link>
            {/* <span className="admin-badge-doctor">
              {adminUser?.email ? `${adminUser.email} • Verified` : 'BHMS, MD (Homeopathy) • Pune'}
            </span> */}
          </div>

          <div className="admin-topbar-right">
            {/* <button
              type="button"
              className="btn-quick-book"
              onClick={onQuickBook}
              title="Schedule In-Clinic Walk-in or Online Consultation with Cash/UPI payment"
            >
              <IconPlus />
              <span>Book Appointment</span>
            </button> */}

            {/* <button
              type="button"
              className="btn-quick-leave"
              onClick={() => setActiveTab('availability')}
              title="Configure doctor leaves or schedule blackout dates"
            >
              <IconPlus />
              <span>Set Doctor Leave</span>
            </button> */}

            {/* <Link href="/appointment" className="btn-portal-view" target="_blank">
              <span>Open Booking Portal</span>
              <IconExternalLink />
            </Link> */}

            <button type="button" className="btn-logout" onClick={onLogout}>
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
            <span className="tab-counter">{totalAppointments}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <IconUsers />
            <span>Patients Directory</span>
            <span className="tab-counter">{totalPatients}</span>
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
            <span className="tab-counter counter-amber">{totalOverrides}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

