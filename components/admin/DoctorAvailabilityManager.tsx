'use client';

import React, { useState } from 'react';
import { DoctorOverride } from '@/lib/availability';

const ALL_SLOTS = [
  { value: '09:00', label: '9:00 AM' },
  { value: '09:45', label: '9:45 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:15', label: '11:15 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:45', label: '12:45 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:45', label: '3:45 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:15', label: '5:15 PM' },
];

const PRESET_REASONS = [
  'Personal Leave',
  'Attending Medical Conference',
  'Clinical Case Review Meeting',
  'Emergency / Minor Procedure',
  'Clinic Maintenance / Holiday',
];

interface DoctorAvailabilityManagerProps {
  overrides: DoctorOverride[];
  onRefresh: () => void;
}

export default function DoctorAvailabilityManager({
  overrides,
  onRefresh,
}: DoctorAvailabilityManagerProps) {
  const tomorrowIso = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  }, []);

  const [date, setDate] = useState(tomorrowIso);
  const [type, setType] = useState<'full_day' | 'specific_slots'>('full_day');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const toggleSlot = (slotVal: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotVal) ? prev.filter((s) => s !== slotVal) : [...prev, slotVal]
    );
  };

  const handleSelectAllSlots = () => {
    setSelectedSlots(ALL_SLOTS.map((s) => s.value));
  };

  const handleClearSlots = () => {
    setSelectedSlots([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!date) {
      setFeedback({ type: 'error', message: 'Please select a date for the availability override.' });
      return;
    }

    if (type === 'specific_slots' && selectedSlots.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Please choose at least one time slot to block.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          type,
          blockedSlots: type === 'specific_slots' ? selectedSlots : undefined,
          reason: reason.trim() || (type === 'full_day' ? 'Doctor On Leave' : 'Doctor Unavailable'),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save availability');
      }

      setFeedback({
        type: 'success',
        message: `Availability override successfully applied for ${date}. This date/slots are now blocked in the booking calendar.`,
      });

      // Reset form
      setReason('');
      setSelectedSlots([]);
      onRefresh();
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error setting availability.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, overrideDate: string) => {
    if (!confirm(`Are you sure you want to remove the leave override for ${overrideDate}? This will reopen the slots for booking.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/availability?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `Availability restored for ${overrideDate}.`,
        });
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete availability override:', err);
    }
  };

  return (
    <div className="admin-availability-section">
      {/* Informational Guidance Banner */}
      <div className="admin-info-banner">
        <div className="banner-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div>
          <strong>Doctor Leave &amp; Blackout Management</strong>
          <p>
            Block entire days (e.g. Next Monday) or individual consultation slots. Overrides take effect immediately across the patient booking portal and prevent double-booking.
          </p>
        </div>
      </div>

      <div className="availability-layout-grid">
        {/* Availability Form Card */}
        <div className="availability-card form-card">
          <h3 className="card-heading">Set Unavailability / Blackout</h3>
          <p className="card-subhead">Specify dates or hours when Dr. Aarav will not take appointments.</p>

          {feedback && (
            <div className={`admin-alert alert-${feedback.type}`}>
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="availability-form">
            <div className="form-group">
              <label htmlFor="override-date">Target Date</label>
              <input
                type="date"
                id="override-date"
                min={tomorrowIso}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="admin-input"
              />
              <span className="field-hint">Select tomorrow or any upcoming date</span>
            </div>

            <div className="form-group">
              <label>Blackout Type</label>
              <div className="type-toggle-group">
                <button
                  type="button"
                  className={`toggle-option ${type === 'full_day' ? 'active' : ''}`}
                  onClick={() => setType('full_day')}
                >
                  <span className="option-title">Full Day Off / Leave</span>
                  <span className="option-desc">No consultations all day</span>
                </button>
                <button
                  type="button"
                  className={`toggle-option ${type === 'specific_slots' ? 'active' : ''}`}
                  onClick={() => setType('specific_slots')}
                >
                  <span className="option-title">Specific Time Slots</span>
                  <span className="option-desc">Block only chosen hours</span>
                </button>
              </div>
            </div>

            {/* If Specific Slots: Render Slot Selection Grid */}
            {type === 'specific_slots' && (
              <div className="form-group slot-picker-group">
                <div className="slot-picker-head">
                  <label>Select Slots to Block</label>
                  <div className="slot-quick-actions">
                    <button type="button" onClick={handleSelectAllSlots} className="quick-btn">
                      Select All
                    </button>
                    <button type="button" onClick={handleClearSlots} className="quick-btn">
                      Clear
                    </button>
                  </div>
                </div>

                <div className="slot-chips-grid">
                  {ALL_SLOTS.map((s) => {
                    const isSelected = selectedSlots.includes(s.value);
                    return (
                      <button
                        key={s.value}
                        type="button"
                        className={`slot-chip ${isSelected ? 'chip-blocked' : ''}`}
                        onClick={() => toggleSlot(s.value)}
                      >
                        <span>{s.label}</span>
                        {isSelected && <span className="chip-mark">&times; Block</span>}
                      </button>
                    );
                  })}
                </div>
                <span className="field-hint">
                  {selectedSlots.length} slot{selectedSlots.length === 1 ? '' : 's'} selected to block
                </span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="override-reason">Reason / Note for Blackout</label>
              <input
                type="text"
                id="override-reason"
                placeholder="e.g. Attending Conference, Personal leave, Seminar"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="admin-input"
              />

              <div className="preset-tags-wrap">
                <span className="preset-label">Quick Presets:</span>
                {PRESET_REASONS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="preset-tag-btn"
                    onClick={() => setReason(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-save-override"
            >
              {isSubmitting ? 'Saving Override...' : 'Apply Doctor Blackout'}
            </button>
          </form>
        </div>

        {/* Existing Overrides List Card */}
        <div className="availability-card list-card">
          <div className="list-card-header">
            <div>
              <h3 className="card-heading">Active Doctor Overrides</h3>
              <p className="card-subhead">{overrides.length} leave / blackout rule{overrides.length === 1 ? '' : 's'} registered</p>
            </div>
            <button type="button" onClick={onRefresh} className="btn-refresh" title="Refresh list">
              &#x21bb; Refresh
            </button>
          </div>

          {overrides.length === 0 ? (
            <div className="empty-overrides-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <p>No active doctor leaves or blackouts registered.</p>
              <small>All clinic hours (Mon to Sat 9am-6pm) are currently open for patient booking.</small>
            </div>
          ) : (
            <div className="overrides-table-wrapper">
              <table className="admin-table overrides-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Blocked Details</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overrides.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.date}</strong>
                      </td>
                      <td>
                        <span className={`override-type-pill ${item.type}`}>
                          {item.type === 'full_day' ? 'Full Day Off' : 'Partial Slots'}
                        </span>
                      </td>
                      <td>
                        {item.type === 'full_day' ? (
                          <span className="text-muted">All 10 clinic slots blocked</span>
                        ) : (
                          <div className="blocked-slots-badges">
                            {item.blockedSlots?.map((slotVal) => {
                              const label = ALL_SLOTS.find((s) => s.value === slotVal)?.label || slotVal;
                              return (
                                <span key={slotVal} className="slot-badge-mini">
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="override-reason-text">{item.reason || 'Doctor unavailable'}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-delete-override"
                          onClick={() => handleDelete(item.id, item.date)}
                          title="Restore availability on this date"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
