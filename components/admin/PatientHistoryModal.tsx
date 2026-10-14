'use client';

import React, { useState, useEffect } from 'react';
import { Appointment } from '@/lib/storage';
import {
  IconPhone,
  IconMail,
  IconPencil,
  IconCopy,
  IconCheck,
  IconVideo,
  IconBuilding,
  IconStethoscope,
  IconRefresh,
} from './AdminIcons';

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
  onUpdateStatus?: (
    appointmentId: string,
    status: 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  ) => Promise<void>;
  onReschedule?: (appt: Appointment) => void;
}

function formatReadableDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export default function PatientHistoryModal({
  patient,
  onClose,
  onUpdateNotes,
}: PatientHistoryModalProps) {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [copiedApptId, setCopiedApptId] = useState<string | null>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
      await onUpdateNotes(apptId, noteContent.trim());
      setEditingNotesId(null);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCopyNotes = async (apptId: string, notesText: string) => {
    if (!notesText) return;
    try {
      await navigator.clipboard.writeText(notesText);
      setCopiedApptId(apptId);
      setTimeout(() => setCopiedApptId(null), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div
      className="admin-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-drawer-title"
    >
      <aside
        className="admin-drawer-panel admin-drawer-panel-patient"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <header className="drawer-header patient-drawer-header">
          <div className="patient-drawer-top">
            <div className="patient-avatar-circle patient-drawer-avatar">
              {patient.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="patient-drawer-identity">
              <div className="patient-drawer-name-row">
                <h3 id="patient-drawer-title" className="patient-drawer-name">
                  {patient.fullName}
                </h3>
                {patient.age && (
                  <span className="patient-drawer-age-pill">Age: {patient.age}</span>
                )}
              </div>
              <div className="patient-drawer-contacts">
                {patient.phone && (
                  <a
                    href={`tel:${patient.phone}`}
                    className="patient-contact-chip"
                    title="Call patient"
                  >
                    <IconPhone size={12} />
                    <span>{patient.phone}</span>
                  </a>
                )}
                {patient.email && (
                  <a
                    href={`mailto:${patient.email}`}
                    className="patient-contact-chip"
                    title="Send email"
                  >
                    <IconMail size={12} />
                    <span className="truncate-text">{patient.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-drawer-close"
            onClick={onClose}
            aria-label="Close patient record"
            title="Close (Esc)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Patient Key Metrics Banner */}
        <div className="patient-drawer-kpis">
          <div className="patient-kpi-tile">
            <span className="kpi-tile-label">Total Visits</span>
            <strong className="kpi-tile-val">
              {patient.appointments.length} Consult{patient.appointments.length === 1 ? '' : 's'}
            </strong>
          </div>
          <div className="patient-kpi-tile">
            <span className="kpi-tile-label">Lifetime Spend</span>
            <strong className="kpi-tile-val highlight-green">
              ₹{totalSpent.toLocaleString('en-IN')}
            </strong>
          </div>
          <div className="patient-kpi-tile">
            <span className="kpi-tile-label">First Visit</span>
            <span className="kpi-tile-date">
              {formatReadableDate(patient.appointments[patient.appointments.length - 1]?.date)}
            </span>
          </div>
          <div className="patient-kpi-tile">
            <span className="kpi-tile-label">Latest Visit</span>
            <span className="kpi-tile-date highlight-accent">
              {formatReadableDate(patient.appointments[0]?.date)}
            </span>
          </div>
        </div>

        {/* Consultation & Clinical Prescription History */}
        <div className="patient-drawer-body">
          <div className="patient-drawer-timeline-head">
            <div className="timeline-title-wrap">
              <IconStethoscope size={18} />
              <h4>Consultation &amp; Clinical Notes History</h4>
            </div>
            <span className="timeline-counter-badge">
              {patient.appointments.length} Session{patient.appointments.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="patient-drawer-timeline">
            {patient.appointments.map((appt, idx) => {
              const isEditing = editingNotesId === appt.id;
              const isCopied = copiedApptId === appt.id;

              return (
                <div key={appt.id} className="patient-history-card">
                  {/* Card Header Row */}
                  <div className="history-card-header">
                    <div className="history-session-badge">
                      #{patient.appointments.length - idx}
                    </div>

                    <div className="history-datetime">
                      <strong>{formatReadableDate(appt.date)}</strong>
                      <span className="history-time-tag">{appt.time}</span>
                    </div>

                    {/* Mode Tag */}
                    {appt.consultationType !== 'offline' && appt.meetLink ? (
                      <a
                        href={appt.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="history-mode-pill mode-online"
                        title="Join Google Meet"
                      >
                        <IconVideo size={12} />
                        <span>Online Meet</span>
                      </a>
                    ) : (
                      <span className="history-mode-pill mode-clinic" title="In-Clinic Visit">
                        <IconBuilding size={12} />
                        <span>In-Clinic</span>
                      </span>
                    )}

                    {/* Payment Pill */}
                    <span className={`payment-pill pill-${appt.paymentStatus || 'paid'}`}>
                      {appt.paymentStatus === 'paid'
                        ? `Paid ₹${appt.amount || 800}`
                        : appt.paymentStatus === 'refunded'
                        ? 'Refunded'
                        : 'Pending'}
                    </span>
                  </div>

                  {/* Health Concern Reason & Patient Message */}
                  <div className="history-card-reason">
                    <span className="reason-label">Health Concern:</span>
                    <span className="reason-pill">{appt.reason}</span>
                  </div>

                  {appt.message && (
                    <div className="history-patient-message">
                      <em>Patient Query:</em> &ldquo;{appt.message}&rdquo;
                    </div>
                  )}

                  {/* Doctor Clinical & Prescription Notes Card */}
                  <div className="clinical-notes-card">
                    <div className="clinical-notes-header">
                      <div className="notes-heading-wrap">
                        <span className="notes-icon-box" aria-hidden="true">
                          <IconStethoscope size={14} />
                        </span>
                        <strong>Doctor Clinical &amp; Rx Notes</strong>
                        {appt.notes && !isEditing && (
                          <span className="notes-saved-tag">Recorded</span>
                        )}
                      </div>

                      <div className="notes-header-actions">
                        {appt.notes && !isEditing && (
                          <button
                            type="button"
                            className="btn-copy-note"
                            onClick={() => handleCopyNotes(appt.id, appt.notes || '')}
                            title="Copy prescription notes to clipboard"
                          >
                            {isCopied ? (
                              <>
                                <IconCheck size={12} />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <IconCopy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}

                        {!isEditing && (
                          <button
                            type="button"
                            className="btn-edit-note"
                            onClick={() => startEditNotes(appt)}
                          >
                            <IconPencil size={12} />
                            <span>{appt.notes ? 'Edit Notes' : '+ Add Clinical Notes'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      /* Interactive Notes Editor */
                      <div className="clinical-notes-editor">

                        <textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Enter diagnosis, clinical observation, constitutional remedies (e.g., Pulsatilla 200C - 4 pills morning), dietary guidance, and follow-up timeline..."
                          rows={4}
                          className="clinical-notes-textarea"
                          autoFocus
                        />

                        <div className="clinical-notes-footer">
                          <span className="notes-char-count">
                            {noteContent.length} characters
                          </span>

                          <div className="notes-btn-group">
                            <button
                              type="button"
                              className="btn-save-clinical-notes"
                              disabled={savingNotes}
                              onClick={() => handleSaveNotes(appt.id)}
                            >
                              {savingNotes ? (
                                <>
                                  <IconRefresh size={12} />
                                  <span>Saving...</span>
                                </>
                              ) : (
                                <span>Save Clinical Notes</span>
                              )}
                            </button>
                            <button
                              type="button"
                              className="btn-cancel-clinical-notes"
                              disabled={savingNotes}
                              onClick={() => setEditingNotesId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Rendered Notes View */
                      <div className="clinical-notes-display">
                        {appt.notes ? (
                          <pre className="clinical-notes-content">{appt.notes}</pre>
                        ) : (
                          <div
                            className="clinical-notes-empty"
                            onClick={() => startEditNotes(appt)}
                            role="button"
                            tabIndex={0}
                          >
                            <span>No clinical notes recorded yet for this session.</span>
                            <strong>Click here to add diagnosis &amp; prescription notes</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <footer className="patient-drawer-footer">
          <div className="drawer-footer-info">
            <span>
              Recorded for <strong>{patient.fullName}</strong> ({patient.appointments.length}{' '}
              visits)
            </span>
          </div>
          <button type="button" className="btn-patient-drawer-close" onClick={onClose}>
            Close Record
          </button>
        </footer>
      </aside>
    </div>
  );
}
