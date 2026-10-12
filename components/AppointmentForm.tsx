'use client';

import React, { useState, useEffect, useRef } from 'react';

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
  const [todayIso, setTodayIso] = useState('');

  // Real booked slots loaded from backend
  const [serverBookedSlots, setServerBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Google status for doctor
  const [googleStatus, setGoogleStatus] = useState<{
    connected: boolean;
    hasConfig: boolean;
    doctorEmail: string;
  } | null>(null);
  const [googleMessage, setGoogleMessage] = useState<string | null>(null);

  const successBoxRef = useRef<HTMLDivElement>(null);
  const slotSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Check URL params for Google OAuth feedback & status
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
  }, []);

  const fetchGoogleStatus = () => {
    fetch('/api/auth/google/status')
      .then((res) => res.json())
      .then((data) => setGoogleStatus(data))
      .catch((err) => console.error('Error fetching Google status:', err));
  };

  // Initialize date logic safely on client side
  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
    setTodayIso(today);

    // Initial date: if today is Sunday, select Monday
    const initial = new Date();
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
      return;
    }

    setIsLoadingSlots(true);
    fetch(`/api/appointments?date=${dateString}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookedSlots) {
          setServerBookedSlots(data.bookedSlots);
        }
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
    currentToday: string = todayIso
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
        if (currentToday && trimmed < currentToday) return 'Please choose today or a later date.';
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
      <div className="google-status-bar">
        <div>
          <strong>Doctor Calendar:</strong>{' '}
          {googleStatus?.connected ? (
            <span className="meet-badge">
              Connected: {googleStatus.doctorEmail}
            </span>
          ) : (
            <span style={{ color: '#b45309' }}>
              {googleStatus?.doctorEmail || 'shivrajrbabar@gmail.com'} (Not connected)
            </span>
          )}
        </div>
        {!googleStatus?.connected && (
          <a
            href="/api/auth/google"
            className="btn-connect-google"
            title="Authenticate doctor account to enable Google Calendar & Meet"
          >
            Connect Google Calendar (1-Click)
          </a>
        )}
      </div>

      {googleMessage && (
        <div className="success-box" style={{ marginBottom: '18px' }}>
          <p style={{ color: 'var(--green-dark)', fontWeight: 600 }}>{googleMessage}</p>
        </div>
      )}

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
            <p>
              Doctor: <strong>{confirmedBooking.doctorEmail}</strong>
              <br />
              Patient: <strong>{confirmedBooking.email}</strong>
            </p>

            {confirmedBooking.googleConnected ? (
              <div className="notice-success">
                Calendar event has been automatically created on{' '}
                <strong>{confirmedBooking.doctorEmail}</strong> and invitation sent to{' '}
                <strong>{confirmedBooking.email}</strong> with Google Meet video link.
              </div>
            ) : (
              <div className="notice-warning">
                Google Calendar background sync is not yet linked. Use the button below to add
                this appointment directly to your Google Calendar now with one click.
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

            {confirmedBooking.meetLink && (
              <p style={{ marginTop: '14px', fontSize: '13px', color: 'var(--muted)' }}>
                Direct Meet Link:{' '}
                <a
                  href={confirmedBooking.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline', color: 'var(--link)' }}
                >
                  {confirmedBooking.meetLink}
                </a>
              </p>
            )}
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

            {/* Preferred Date */}
            <div className={`field ${errors.date ? 'invalid' : ''}`}>
              <label htmlFor="date">Preferred date</label>
              <input
                type="date"
                id="date"
                name="date"
                min={todayIso}
                value={formData.date}
                onChange={handleInputChange}
                aria-invalid={!!errors.date}
                aria-describedby="date-error"
                disabled={isSubmitting}
              />
              <p className="error-text" id="date-error">
                {errors.date}
              </p>
            </div>

            {/* Selected Time */}
            <div className={`field ${errors.time ? 'invalid' : ''}`}>
              <label htmlFor="time">Selected time</label>
              <input
                type="text"
                id="time"
                name="time"
                readOnly
                placeholder="Choose a slot below"
                value={selectedSlotLabel}
                aria-invalid={!!errors.time}
                aria-describedby="time-error"
              />
              <p className="error-text" id="time-error">
                {errors.time}
              </p>
            </div>

            {/* Time Slot Picker */}
            <div className="field full">
              <div className="slot-section" ref={slotSectionRef}>
                <div className="slot-head">
                  <h3>Choose a time</h3>
                  <p>Clinic hours: 9:00 AM to 6:00 PM, Monday to Saturday</p>
                </div>

                <p className="slot-date-note" id="slot-date-note">
                  {!formData.date
                    ? 'Select a date to see available times.'
                    : isSunday
                    ? 'The clinic is closed on Sunday. Please choose another date.'
                    : isLoadingSlots
                    ? 'Checking available slots...'
                    : `Available times on ${prettyDate}`}
                </p>

                {!isSunday && formData.date && (
                  <div className="slot-grid" id="slot-grid">
                    {SLOTS.map((slot) => {
                      const isBooked = serverBookedSlots.includes(slot.value);
                      const isSelected = formData.time === slot.value;
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          className={`slot-btn ${isBooked ? 'booked' : ''} ${
                            isSelected ? 'selected' : ''
                          }`}
                          disabled={isBooked || isSubmitting}
                          aria-label={isBooked ? `${slot.label} booked` : slot.label}
                          onClick={() => handleSlotSelect(slot.value)}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="selected-slot" id="selected-slot" aria-live="polite">
                  {selectedSlotLabel ? `Selected: ${selectedSlotLabel}` : ''}
                </p>
                <p className="slot-note">
                  Crossed-out times are already booked. The clinic is closed on Sundays.
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
