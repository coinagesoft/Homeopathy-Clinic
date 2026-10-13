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
          </aside>
        </div>
      </section>
    </>
  );
}
