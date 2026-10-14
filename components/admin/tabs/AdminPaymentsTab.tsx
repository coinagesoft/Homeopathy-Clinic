'use client';

import React from 'react';
import { Appointment } from '@/lib/storage';
import {
  IconWallet,
  IconCalendar,
  IconOverview,
  IconClock,
  IconPayments,
} from '@/components/admin/AdminIcons';
import { RevenueData } from '@/components/admin/types';

interface AdminPaymentsTabProps {
  appointments: Appointment[];
  revenueData: RevenueData | null;
}

export default function AdminPaymentsTab({
  appointments,
  revenueData,
}: AdminPaymentsTabProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="tab-pane-fade">
      {/* 4 Financial KPI Cards */}
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
            <span className="kpi-meta">Year {currentYear}</span>
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

        {appointments.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <IconPayments size={28} />
            </div>
            <h4>No Payment Transactions Available</h4>
            <p>
              Completed consultation payments will be logged here automatically.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

