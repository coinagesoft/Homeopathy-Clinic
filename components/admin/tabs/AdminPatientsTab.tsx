'use client';

import React from 'react';
import { IconUsers, IconArrowRight } from '@/components/admin/AdminIcons';
import { PatientGroup } from '@/components/admin/types';

interface AdminPatientsTabProps {
  patients: PatientGroup[];
  onSelectPatient: (patient: PatientGroup) => void;
}

export default function AdminPatientsTab({
  patients,
  onSelectPatient,
}: AdminPatientsTabProps) {
  return (
    <div className="tab-pane-fade">
      <div className="directory-header">
        <div>
          <h3 className="section-title">Patient Directory &amp; Records</h3>
          <p className="section-subtitle">
            {patients.length} individual patient{patients.length === 1 ? '' : 's'} registered.
            Click on any patient to view their complete consultation &amp; prescription history.
          </p>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="admin-table-card">
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <IconUsers size={28} />
            </div>
            <h4>No Registered Patients Yet</h4>
            <p>
              Patient profiles are automatically created and grouped by email as soon as an appointment is booked.
            </p>
          </div>
        </div>
      ) : (
        <div className="patients-grid">
          {patients.map((patient) => {
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
                    <strong className="highlight-green">
                      ₹{totalSpent.toLocaleString('en-IN')}
                    </strong>
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
                    onClick={() => onSelectPatient(patient)}
                  >
                    <span>View Full History &amp; Rx Notes</span>
                    <IconArrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

