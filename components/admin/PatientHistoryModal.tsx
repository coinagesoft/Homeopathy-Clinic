'use client';

import React, { useState } from 'react';
import { Appointment } from '@/lib/storage';

interface PatientHistoryModalProps {
  patient: {
    fullName: string;
    phone: string;
    email: string;
    age: number;
    appointments: Appointment[];
  } | null;
  onClose: () => void;
  onUpdateNotes: (appointmentId: string, notes: string) => Promise<void>;
  onUpdateStatus: (appointmentId: string, status: 'confirmed' | 'completed' | 'cancelled' | 'no-show') => Promise<void>;
}

export default function PatientHistoryModal({
  patient,
  onClose,
  onUpdateNotes,
  onUpdateStatus,
}: PatientHistoryModalProps) {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  if (!patient) return null;

  const totalSpent = patient.appointments
    .filter((a) => a.paymentStatus === 'paid' && a.status !== 'cancelled')
    .reduce((sum, a) => sum + (a.amount || 800), 0);

  const startEditNotes = (appt: Appointment) => {
    setEditingNotesId(appt.id);
    setNoteContent(appt.notes || '');
  };

  const handleSaveNotes = async (apptId: string) => {
    setSavingNotes(true);
    try {
      await onUpdateNotes(apptId, noteContent);
      setEditingNotesId(null);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-patient-info">
            <div className="patient-avatar-circle">
              {patient.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="modal-patient-name">{patient.fullName}</h2>
              <p className="modal-patient-sub">
                Age: {patient.age || '—'} &bull; Phone: {patient.phone} &bull; Email: {patient.email}
              </p>
            </div>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Patient Key Metrics Banner */}
        <div className="modal-kpi-banner">
          <div className="modal-kpi-item">
            <span>Total Visits</span>
            <strong>{patient.appointments.length} Consultations</strong>
          </div>
          <div className="modal-kpi-item">
            <span>Lifetime Revenue</span>
            <strong>₹{totalSpent.toLocaleString('en-IN')}</strong>
          </div>
          <div className="modal-kpi-item">
            <span>First Consultation</span>
            <strong>{patient.appointments[patient.appointments.length - 1]?.date || '—'}</strong>
          </div>
          <div className="modal-kpi-item">
            <span>Latest Visit</span>
            <strong>{patient.appointments[0]?.date || '—'}</strong>
          </div>
        </div>

        {/* Timeline of Consultations */}
        <div className="modal-content-body">
          <h3 className="timeline-title">Consultation &amp; Prescription History</h3>

          <div className="patient-timeline">
            {patient.appointments.map((appt, idx) => {
              const isEditing = editingNotesId === appt.id;

              return (
                <div key={appt.id} className="timeline-entry">
                  <div className="timeline-point">
                    <span className="point-number">{patient.appointments.length - idx}</span>
                  </div>

                  <div className="timeline-card">
                    <div className="timeline-card-head">
                      <div>
                        <div className="timeline-date">
                          <strong>{appt.date}</strong> at <span>{appt.time}</span>
                        </div>
                        <div className="timeline-reason">{appt.reason}</div>
                      </div>

                      <div className="timeline-badges">
                        <select
                          className={`status-select status-${appt.status || 'confirmed'}`}
                          value={appt.status || 'confirmed'}
                          onChange={(e) =>
                            onUpdateStatus(
                              appt.id,
                              e.target.value as 'confirmed' | 'completed' | 'cancelled' | 'no-show'
                            )
                          }
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no-show">No Show</option>
                        </select>

                        <span className={`payment-pill pill-${appt.paymentStatus || 'paid'}`}>
                          {appt.paymentStatus === 'paid'
                            ? `Paid ₹${appt.amount || 800}`
                            : appt.paymentStatus === 'refunded'
                            ? 'Refunded'
                            : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {appt.meetLink && (
                      <div className="timeline-meet-wrap">
                        <a
                          href={appt.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="meet-link-btn"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                          </svg>
                          Open Google Meet
                        </a>
                      </div>
                    )}

                    {appt.message && (
                      <p className="timeline-patient-msg">
                        <em>Patient Message:</em> &ldquo;{appt.message}&rdquo;
                      </p>
                    )}

                    {/* Doctor Clinical Notes */}
                    <div className="timeline-notes-box">
                      <div className="notes-box-head">
                        <strong>Doctor Clinical &amp; Rx Notes:</strong>
                        {!isEditing && (
                          <button
                            type="button"
                            className="notes-edit-btn"
                            onClick={() => startEditNotes(appt)}
                          >
                            {appt.notes ? 'Edit Notes' : '+ Add Clinical Notes'}
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="notes-editor">
                          <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Enter diagnosis notes, remedies prescribed (e.g., Pulsatilla 200C), dietary guidance or follow-up schedule..."
                            rows={3}
                            className="notes-textarea"
                          />
                          <div className="notes-actions">
                            <button
                              type="button"
                              className="btn-save-notes"
                              disabled={savingNotes}
                              onClick={() => handleSaveNotes(appt.id)}
                            >
                              {savingNotes ? 'Saving...' : 'Save Notes'}
                            </button>
                            <button
                              type="button"
                              className="btn-cancel-notes"
                              onClick={() => setEditingNotesId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="notes-display-text">
                          {appt.notes || <span className="notes-placeholder">No clinical notes recorded yet for this session.</span>}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-modal-close" onClick={onClose}>
            Close Patient Record
          </button>
        </div>
      </div>
    </div>
  );
}
