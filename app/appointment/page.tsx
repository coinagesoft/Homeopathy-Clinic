import type { Metadata } from 'next';
import Link from 'next/link';
import AppointmentForm from '@/components/AppointmentForm';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Request an appointment with Dr. Aarav Mehta at the Pune clinic.',
};

export default function AppointmentPage() {
  return (
    <>
      {/* MediTro Wavy Page Banner */}
      <section className="meditro-page-banner">
        <span className="deco-shape deco-hero-circle" aria-hidden="true"></span>
        <span className="deco-shape deco-hero-plus" aria-hidden="true">+</span>
        <div className="container meditro-banner-inner">
          <h1>Book An Appointment</h1>
          <div className="meditro-breadcrumb">
            <Link href="/">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Booking</span>
          </div>
        </div>
        <div className="hero-wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40C240 100 480 0 720 50C960 100 1200 15 1440 60V100H0V40Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      <section className="meditro-section booking-section">
        <div className="container booking-grid">
          <div>
            <AppointmentForm />
          </div>
          <aside className="booking-aside">
            <div className="clinic-card">
              <span className="meditro-badge-orange" style={{ marginBottom: '12px' }}>
                Clinic Info
              </span>
              <h2>Visit Dr. Aarav in Pune</h2>
              <div className="info-item">
                <span>Address</span>
                <p>
                  123 Green Park Road
                  <br />
                  Pune, Maharashtra
                </p>
              </div>
              <div className="info-item">
                <span>Phone</span>
                <p>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </p>
              </div>
              <div className="info-item">
                <span>Email</span>
                <p>
                  <a href="mailto:info@aaravhomeopathy.com">info@aaravhomeopathy.com</a>
                </p>
              </div>
              <div className="info-item">
                <span>Clinic Hours</span>
                <p>
                  Monday to Saturday
                  <br />
                  9:00 AM to 6:00 PM
                </p>
              </div>
            </div>
            <div className="aside-note">
              <strong>Before your visit</strong>
              <p>
                Please keep any relevant medical reports and details of current medication ready for your consultation.
              </p>
            </div>

            {/* Consultation Highlights Card */}
            <div className="aside-trust-card">
              <h3>What&apos;s Included</h3>
              <ul className="aside-trust-list">
                <li>
                  <span className="trust-check">✓</span>
                  <div>
                    <strong>1-on-1 Constitutional Case Taking</strong>
                    <p>In-depth root cause evaluation &amp; personalized diagnosis</p>
                  </div>
                </li>
                <li>
                  <span className="trust-check">✓</span>
                  <div>
                    <strong>Online Video or In-Clinic</strong>
                    <p>Instant Google Meet calendar link or Pune clinic walk-in</p>
                  </div>
                </li>
                <li>
                  <span className="trust-check">✓</span>
                  <div>
                    <strong>Digital Prescription Included</strong>
                    <p>Delivered to your email and WhatsApp after visit</p>
                  </div>
                </li>
                <li>
                  <span className="trust-check">✓</span>
                  <div>
                    <strong>100% Confidential Care</strong>
                    <p>Encrypted medical records &amp; strict patient privacy</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Helpline Assistance Card */}
            <div className="aside-help-card">
              <div className="help-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="help-text-wrap">
                <strong>Need Assistance Booking?</strong>
                <p>Call or WhatsApp our reception desk for instant scheduling support.</p>
                <a href="tel:+919876543210" className="help-call-link">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
