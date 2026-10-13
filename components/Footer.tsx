import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="meditro-footer" id="contact">
      {/* Wavy Top Divider */}
      <div className="footer-wave-top" aria-hidden="true">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0 40C240 100 480 0 720 40C960 80 1200 10 1440 50V100H0V40Z"
            fill="#F3F4FF"
          />
          <path
            d="M0 40C240 100 480 0 720 40C960 80 1200 10 1440 50"
            stroke="#DCDEFE"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      <div className="footer-main-wrap">
        {/* Decorative Floating Shapes */}
        <span className="deco-shape deco-footer-plus" aria-hidden="true">+</span>
        <span className="deco-shape deco-footer-circle" aria-hidden="true"></span>

        <div className="container footer-grid-meditro">
          {/* Column 1: Brand & Orange Phone Callout */}
          <div className="footer-col-brand">
            <Link href="/" className="brand-meditro">
              <span className="brand-logo-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                  <circle cx="20" cy="10" r="2" />
                </svg>
              </span>
              <span className="brand-text-wrap">
                <strong>Dr. Aarav</strong>
                <small>Homeopathy Clinic</small>
              </span>
            </Link>

            <p className="footer-about-text">
              Personalised constitutional homeopathic consultations in Pune. Unhurried one-to-one care focused on understanding the whole person.
            </p>

            <div className="footer-contact-callout">
              <span className="contact-callout-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div className="contact-callout-info">
                <span>Contact Us</span>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col-links">
            <h3 className="footer-col-title">Quick Links</h3>
            <div className="footer-title-wave" aria-hidden="true"></div>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/#treatments">Services</Link></li>
              <li><Link href="/appointment">Booking</Link></li>
              <li><Link href="/#process">How We Work</Link></li>
              <li><Link href="/#testimonials">Testimonials</Link></li>
              <li><Link href="/admin">Doctor Admin Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="footer-col-links">
            <h3 className="footer-col-title">Our Services</h3>
            <div className="footer-title-wave" aria-hidden="true"></div>
            <ul>
              <li><Link href="/#treatments">Allergies &amp; Sinus</Link></li>
              <li><Link href="/#treatments">Migraine &amp; Headaches</Link></li>
              <li><Link href="/#treatments">Digestive Concerns</Link></li>
              <li><Link href="/#treatments">Skin Treatments</Link></li>
              <li><Link href="/#treatments">Joint &amp; Muscle Pain</Link></li>
              <li><Link href="/#treatments">Stress &amp; Sleep Care</Link></li>
            </ul>
          </div>

          {/* Column 4: Clinic Visit & Subscribe */}
          <div className="footer-col-subscribe">
            <h3 className="footer-col-title">Visit Clinic</h3>
            <div className="footer-title-wave" aria-hidden="true"></div>

            <div className="footer-clinic-card">
              <p>
                <strong>Address:</strong> 123 Green Park Road, Pune, Maharashtra
              </p>
              <p>
                <strong>Hours:</strong> Mon – Sat, 9:00 AM to 6:00 PM
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:info@aaravhomeopathy.com">info@aaravhomeopathy.com</a>
              </p>
            </div>

            <Link href="/appointment" className="btn-meditro-orange footer-cta-btn">
              Book Appointment Now
            </Link>

            <div className="footer-social-row">
              <a href="#contact" aria-label="Clinic Location" className="social-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </a>
              <a href="mailto:info@aaravhomeopathy.com" aria-label="Email Clinic" className="social-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
              <a href="tel:+919876543210" aria-label="Call Clinic" className="social-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
              <Link href="/admin" aria-label="Doctor Admin Portal" className="social-pill" title="Doctor Admin Portal">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="container footer-bottom-meditro">
          <p>
            Copyright &copy; 2026 Design &amp; Developed for{' '}
            <strong>Dr. Aarav Mehta Homeopathy Clinic</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
