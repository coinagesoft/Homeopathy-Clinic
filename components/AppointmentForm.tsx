'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import CalendarPicker from './CalendarPicker';

const SLOTS = [
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

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  age: string;
  reason: string;
  date: string;
  time: string;
  message: string;
}

interface ConfirmedBooking {
  id: string;
  fullName: string;
  email: string;
  date: string;
  time: string;
  reason: string;
  meetLink?: string;
  googleCalendarUrl?: string;
  googleConnected?: boolean;
  doctorEmail?: string;
  calendarError?: string;
}

export default function AppointmentForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    reason: '',
    date: '',
    time: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);
  const [tomorrowIso, setTomorrowIso] = useState('');

  // Real booked slots loaded from backend
  const [serverBookedSlots, setServerBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Doctor availability overrides loaded from backend
  const [doctorBlockedDates, setDoctorBlockedDates] = useState<{ date: string; reason: string }[]>([]);
  const [doctorBlockedSlots, setDoctorBlockedSlots] = useState<string[]>([]);
  const [isDoctorDateBlocked, setIsDoctorDateBlocked] = useState(false);
  const [doctorBlockReason, setDoctorBlockReason] = useState('');

  // Google status for doctor
  const [googleStatus, setGoogleStatus] = useState<{
    connected: boolean;
    hasConfig: boolean;
    doctorEmail: string;
  } | null>(null);
  const [googleMessage, setGoogleMessage] = useState<string | null>(null);

  const successBoxRef = useRef<HTMLDivElement>(null);
  const calendarSectionRef = useRef<HTMLDivElement>(null);
  const slotSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Check URL params for Google OAuth feedback & status and fetch doctor availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('google_connected') === 'true') {
        setGoogleMessage('Google Calendar successfully connected for shivrajrbabar@gmail.com!');
      } else if (params.get('google_error')) {
        setGoogleMessage(`Google Authorization Notice: ${params.get('google_error')}`);
      }
    }

    fetchGoogleStatus();
    fetchDoctorAvailability();
  }, []);

  const fetchDoctorAvailability = () => {
    fetch('/api/availability')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.blockedDates)) {
          setDoctorBlockedDates(data.blockedDates);
        }
      })
      .catch((err) => console.error('Error fetching doctor availability:', err));
  };

  const fetchGoogleStatus = () => {
    fetch('/api/auth/google/status')
      .then((res) => res.json())
      .then((data) => setGoogleStatus(data))
      .catch((err) => console.error('Error fetching Google status:', err));
  };

  // Initialize date logic safely on client side (only allow booking from tomorrow onwards)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    setTomorrowIso(tomorrowStr);

    // Initial date: start from tomorrow; if tomorrow is Sunday, advance to Monday
    const initial = new Date(tomorrow);
    if (initial.getDay() === 0) {
      initial.setDate(initial.getDate() + 1);
    }
    const initialIso = `${initial.getFullYear()}-${String(initial.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(initial.getDate()).padStart(2, '0')}`;

    setFormData((prev) => ({
      ...prev,
      date: initialIso,
    }));
  }, []);

  // Fetch booked slots whenever the selected date changes
  const fetchBookedSlots = React.useCallback((dateString: string) => {
    if (!dateString) return;
    const isSun = new Date(`${dateString}T00:00:00`).getDay() === 0;
    if (isSun) {
      setServerBookedSlots([]);
      setDoctorBlockedSlots([]);
      setIsDoctorDateBlocked(false);
      setDoctorBlockReason('');
      return;
    }

    setIsLoadingSlots(true);
    fetch(`/api/appointments?date=${dateString}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookedSlots) {
          setServerBookedSlots(data.bookedSlots);
        }
        if (data.doctorBlockedSlots) {
          setDoctorBlockedSlots(data.doctorBlockedSlots);
        } else {
          setDoctorBlockedSlots([]);
        }
        setIsDoctorDateBlocked(Boolean(data.isDoctorBlocked));
        setDoctorBlockReason(data.doctorBlockReason || '');
      })
      .catch((err) => console.error('Failed to load booked slots:', err))
      .finally(() => setIsLoadingSlots(false));
  }, []);

  useEffect(() => {
    if (formData.date) {
      fetchBookedSlots(formData.date);
    }
  }, [formData.date, fetchBookedSlots]);

  const validateField = (
    name: keyof FormData,
    value: string,
    currentTomorrow: string = tomorrowIso
  ): string => {
    const trimmed = value.trim();

    switch (name) {
      case 'fullName':
        if (!trimmed) return 'Please enter your full name.';
        if (trimmed.length < 3) return 'Your name should be at least 3 characters.';
        if (!/^[A-Za-z][A-Za-z .'-]*$/.test(trimmed)) return 'Please use letters and spaces only.';
        return '';

      case 'phone': {
        if (!trimmed) return 'Please enter your phone number.';
        const digits = trimmed.replace(/[\s-]/g, '');
        if (!/^(\+91|91|0)?[6-9]\d{9}$/.test(digits))
          return 'Please enter a valid 10-digit mobile number.';
        return '';
      }

      case 'email':
        if (!trimmed) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
          return 'Please enter a valid email, for example name@example.com.';
        }
        return '';

      case 'age': {
        if (!trimmed) return 'Please enter your age.';
        const ageNum = Number(trimmed);
        if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
          return 'Please enter an age between 1 and 120.';
        }
        return '';
      }

      case 'reason':
        return trimmed ? '' : 'Please select a reason for consultation.';

      case 'date': {
        if (!trimmed) return 'Please choose a preferred date.';
        if (currentTomorrow && trimmed < currentTomorrow) {
          return 'Appointments must be booked from tomorrow onwards. Same-day or past bookings are not allowed.';
        }
        const d = new Date(`${trimmed}T00:00:00`);
        if (d.getDay() === 0) return 'The clinic is closed on Sundays. Please choose another day.';
        return '';
      }

      case 'time':
        if (!trimmed) return 'Please choose an available appointment slot.';
        if (serverBookedSlots.includes(trimmed))
          return 'This slot is already booked. Please pick another available time.';
        return '';

      case 'message':
        return trimmed.length > 300 ? 'Please keep your message under 300 characters.' : '';

      default:
        return '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    setFormData((prev) => {
      const next = { ...prev, [fieldName]: value };
      if (fieldName === 'date') {
        next.time = '';
      }
      return next;
    });

    if (errors[fieldName]) {
      const errorMsg = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    }
  };

  const handleCalendarDateSelect = (dateIso: string) => {
    setFormData((prev) => ({
      ...prev,
      date: dateIso,
      time: '',
    }));
    setErrors((prev) => ({ ...prev, date: '', time: '' }));
  };

  const handleSlotSelect = (slotValue: string) => {
    if (serverBookedSlots.includes(slotValue)) return;
    setFormData((prev) => ({ ...prev, time: slotValue }));
    setErrors((prev) => ({ ...prev, time: '' }));
  };

  const isSunday = formData.date ? new Date(`${formData.date}T00:00:00`).getDay() === 0 : false;
  const selectedSlotLabel = SLOTS.find((s) => s.value === formData.time)?.label || '';

  const prettyDate = React.useMemo(() => {
    if (!formData.date || isSunday) return '';
    try {
      return new Date(`${formData.date}T00:00:00`).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    } catch {
      return '';
    }
  }, [formData.date, isSunday]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const fieldKeys = Object.keys(formData) as (keyof FormData)[];

    let firstInvalidKey: keyof FormData | null = null;

    fieldKeys.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        if (!firstInvalidKey) {
          firstInvalidKey = key;
        }
      }
    });

    setErrors(newErrors);

    if (firstInvalidKey) {
      if (firstInvalidKey === 'time') {
        slotSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (firstInvalidKey === 'date') {
        calendarSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const inputElement = formRef.current?.elements.namedItem(firstInvalidKey) as HTMLElement | null;
        inputElement?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Slot already booked
          setErrors((prev) => ({
            ...prev,
            time: 'This time slot is already booked for this date. Please choose another slot.',
          }));
          fetchBookedSlots(formData.date);
          slotSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert(result.error || 'Failed to book appointment. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      setConfirmedBooking({
        id: result.appointment.id,
        fullName: result.appointment.fullName,
        email: result.appointment.email,
        date: result.appointment.date,
        time: result.appointment.time,
        reason: result.appointment.reason,
        meetLink: result.meetLink,
        googleCalendarUrl: result.googleCalendarUrl,
        googleConnected: result.googleConnected,
        doctorEmail: result.doctorEmail || 'shivrajrbabar@gmail.com',
      });

      // Refresh booked slots on this date so it's locked immediately
      fetchBookedSlots(formData.date);

      // Reset form fields
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        age: '',
        reason: '',
        date: formData.date,
        time: '',
        message: '',
      });
      setErrors({});

      setTimeout(() => {
        successBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        successBoxRef.current?.focus();
      }, 50);
    } catch (err) {
      console.error('Error submitting appointment:', err);
      alert('Network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Google Calendar status banner for doctor */}
      {/* Booking confirmation box */}
      {confirmedBooking && (
        <div
          className="success-box"
          id="success-box"
          role="status"
          tabIndex={-1}
          ref={successBoxRef}
        >
          <h2>Appointment confirmed!</h2>
          <p>
            Thank you, <strong>{confirmedBooking.fullName}</strong>. Your consultation has been
            scheduled for <strong>{confirmedBooking.date}</strong> at{' '}
            <strong>
              {SLOTS.find((s) => s.value === confirmedBooking.time)?.label || confirmedBooking.time}
            </strong>
            .
          </p>

          <div className="meet-box">
            <h3>Google Meet Consultation</h3>

            {confirmedBooking.googleConnected ? (
              <div className="notice-success">
                Your consultation has been booked successfully! The appointment with Google Meet
                video call has been scheduled on your calendar.
              </div>
            ) : (
              <div className="notice-warning">
                Your consultation has been booked! Use the button below to add this appointment
                directly to your Google Calendar.
              </div>
            )}

            <div className="meet-link-row">
              {confirmedBooking.meetLink && (
                <a
                  href={confirmedBooking.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-small"
                  style={{ textDecoration: 'none' }}
                >
                  Join Google Meet
                </a>
              )}

              {confirmedBooking.googleCalendarUrl && (
                <a
                  href={confirmedBooking.googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-calendar"
                  style={{ textDecoration: 'none' }}
                >
                  Add to Google Calendar
                </a>
              )}

              <a
                href={`/api/appointments/${confirmedBooking.id}/ics`}
                download
                className="btn-outline"
                style={{ textDecoration: 'none' }}
              >
                Download .ics Invite
              </a>
            </div>
          </div>
        </div>
      )}



      <div className="form-panel">
        <div className="form-heading">
          <h2>Your details</h2>
          <p>All fields are required except the message.</p>
        </div>
        <form id="appointment-form" noValidate ref={formRef} onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Full Name */}
            <div className={`field full ${errors.fullName ? 'invalid' : ''}`}>
              <label htmlFor="fullName">Full name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleInputChange}
                aria-invalid={!!errors.fullName}
                aria-describedby="fullName-error"
                disabled={isSubmitting}
              />
              <p className="error-text" id="fullName-error">
                {errors.fullName}
              </p>
            </div>

            {/* Phone */}
            <div className={`field ${errors.phone ? 'invalid' : ''}`}>
              <label htmlFor="phone">Phone number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleInputChange}
                aria-invalid={!!errors.phone}
                aria-describedby="phone-error"
                disabled={isSubmitting}
              />
              <p className="error-text" id="phone-error">
                {errors.phone}
              </p>
            </div>

            {/* Email */}
            <div className={`field ${errors.email ? 'invalid' : ''}`}>
              <label htmlFor="email">Email address (for calendar invite)</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                disabled={isSubmitting}
              />
              <p className="error-text" id="email-error">
                {errors.email}
              </p>
            </div>

            {/* Age */}
            <div className={`field ${errors.age ? 'invalid' : ''}`}>
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                min="1"
                max="120"
                inputMode="numeric"
                value={formData.age}
                onChange={handleInputChange}
                aria-invalid={!!errors.age}
                aria-describedby="age-error"
                disabled={isSubmitting}
              />
              <p className="error-text" id="age-error">
                {errors.age}
              </p>
            </div>

            {/* Reason */}
            <div className={`field ${errors.reason ? 'invalid' : ''}`}>
              <label htmlFor="reason">Reason for consultation</label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                aria-invalid={!!errors.reason}
                aria-describedby="reason-error"
                disabled={isSubmitting}
              >
                <option value="">Select a reason</option>
                <option>Allergies</option>
                <option>Migraine &amp; Headaches</option>
                <option>Digestive Concerns</option>
                <option>Skin Concerns</option>
                <option>Joint &amp; Muscle Pain</option>
                <option>Respiratory Concerns</option>
                <option>Stress &amp; Sleep</option>
                <option>Other / General Consultation</option>
              </select>
              <p className="error-text" id="reason-error">
                {errors.reason}
              </p>
            </div>

            {/* Preferred Date — Custom Interactive Calendar */}
            <div
              className={`field full calendar-booking-field ${errors.date ? 'invalid' : ''}`}
              ref={calendarSectionRef}
            >
              <div className="calendar-field-header">
                <label className="calendar-field-label">
                  Choose Preferred Date <span>(Advance booking only &bull; Mon to Sat)</span>
                </label>
                <p className="calendar-field-desc">
                  Select an available date from tomorrow onwards. The clinic is closed on Sundays.
                </p>
              </div>

              <CalendarPicker
                selectedDate={formData.date}
                onSelectDate={handleCalendarDateSelect}
                minDate={tomorrowIso}
                disabled={isSubmitting}
                doctorBlockedDates={doctorBlockedDates}
              />

              <input type="hidden" name="date" value={formData.date} />

              {errors.date && (
                <p className="error-text" id="date-error" style={{ marginTop: '8px' }}>
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time Slot Picker */}
            <div className={`field full ${errors.time ? 'invalid' : ''}`}>
              <input type="hidden" name="time" value={formData.time} />

              <div className="slot-section" ref={slotSectionRef}>
                <div className="slot-head">
                  <h3>Choose a Consultation Time</h3>
                  <p>Clinic hours: 9:00 AM to 6:00 PM, Monday to Saturday (Advance booking only)</p>
                </div>

                <p className="slot-date-note" id="slot-date-note">
                  {!formData.date
                    ? 'Select a date above to see available times.'
                    : tomorrowIso && formData.date < tomorrowIso
                    ? 'Same-day and past appointments cannot be booked online. Please select tomorrow or a later date.'
                    : isSunday
                    ? 'The clinic is closed on Sunday. Please choose another date.'
                    : isDoctorDateBlocked
                    ? `Dr. Aarav is unavailable on ${prettyDate} (${doctorBlockReason || 'Doctor on leave'}).`
                    : isLoadingSlots
                    ? 'Checking real-time calendar availability...'
                    : `Available times on ${prettyDate}`}
                </p>

                {tomorrowIso && formData.date && formData.date < tomorrowIso && (
                  <div className="notice-warning" style={{ marginTop: '14px' }}>
                    Appointments cannot be booked for current date or previous dates. Please select tomorrow or a later date.
                  </div>
                )}

                {isDoctorDateBlocked && (
                  <div className="notice-warning" style={{ marginTop: '14px' }}>
                    <strong>Doctor On Leave:</strong> Dr. Aarav is unavailable on this date ({doctorBlockReason || 'Doctor unavailable'}). Please select another date.
                  </div>
                )}

                {!isSunday && !isDoctorDateBlocked && formData.date && (!tomorrowIso || formData.date >= tomorrowIso) && (
                  <>
                    <div className="slot-grid" id="slot-grid">
                      {SLOTS.map((slot) => {
                        const isDoctorBlocked = doctorBlockedSlots.includes(slot.value);
                        const isBooked = serverBookedSlots.includes(slot.value);
                        const isUnavailable = isBooked || isDoctorBlocked;
                        const isSelected = formData.time === slot.value;
                        return (
                          <button
                            key={slot.value}
                            type="button"
                            className={`slot-btn ${
                              isDoctorBlocked ? 'doctor-blocked' : isBooked ? 'booked' : 'open'
                            } ${isSelected ? 'selected' : ''}`}
                            disabled={isUnavailable || isSubmitting}
                            aria-label={
                              isDoctorBlocked
                                ? `${slot.label} (Doctor Unavailable)`
                                : isBooked
                                ? `${slot.label} (Booked)`
                                : `${slot.label} (Available)`
                            }
                            onClick={() => handleSlotSelect(slot.value)}
                          >
                            <span className="slot-time">{slot.label}</span>
                            <span
                              className={`slot-badge ${
                                isDoctorBlocked
                                  ? 'badge-doctor-blocked'
                                  : isBooked
                                  ? 'badge-booked'
                                  : 'badge-open'
                              }`}
                            >
                              {isDoctorBlocked ? 'Unavailable' : isBooked ? 'Booked' : 'Available'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="slot-legend">
                      <span className="legend-item">
                        <span className="legend-dot dot-open"></span> Available
                      </span>
                      <span className="legend-item">
                        <span className="legend-dot dot-booked"></span> Already Booked
                      </span>
                      <span className="legend-item">
                        <span className="legend-dot dot-leave"></span> Doctor Blocked
                      </span>
                      <span className="legend-item">
                        <span className="legend-dot dot-selected"></span> Selected
                      </span>
                    </div>
                  </>
                )}

                {/* Selected Date & Time Confirmation Banner */}
                {formData.date && formData.time && !isSunday && (
                  <div className="selected-slot-banner" aria-live="polite">
                    <div className="slot-banner-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="slot-banner-content">
                      <strong>Confirmed Appointment Selection:</strong>
                      <span>{prettyDate} at {selectedSlotLabel}</span>
                    </div>
                  </div>
                )}

                {errors.time && (
                  <p className="error-text" id="time-error" style={{ marginTop: '10px' }}>
                    {errors.time}
                  </p>
                )}

                <p className="slot-note" style={{ marginTop: '14px' }}>
                  Slots marked Booked are already reserved in Dr. Aarav&apos;s Google Calendar.
                </p>
              </div>
            </div>

            {/* Message */}
            <div className={`field full ${errors.message ? 'invalid' : ''}`}>
              <label htmlFor="message">
                Message <span>(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                maxLength={300}
                placeholder="Anything you would like the doctor to know before your visit"
                value={formData.message}
                onChange={handleInputChange}
                aria-describedby="message-error"
                disabled={isSubmitting}
              ></textarea>
              <p className="error-text" id="message-error">
                {errors.message}
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling with Google Meet...' : 'Request appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
