import type { Metadata } from 'next';
import AppointmentForm from '@/components/AppointmentForm';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Request an appointment with Dr. Aarav Mehta at the Pune clinic.',
};

export default function AppointmentPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Book an appointment</h1>
          <p>
            Choose a preferred date and time. Our clinic team will contact you to confirm the appointment.
          </p>
        </div>
      </section>

      <section className="section booking-section">
        <div className="container booking-grid">
          <div>
            <AppointmentForm />
          </div>
          <aside className="booking-aside">
            <div className="clinic-card">
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
                <span>Clinic hours</span>
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

