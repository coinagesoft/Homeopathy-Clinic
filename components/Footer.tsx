import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <strong>Dr. Aarav Mehta</strong>
            <small>Homeopathy Clinic, Pune</small>
          </Link>
          <p>Personalised homeopathic consultations in a calm, private clinic.</p>
          <a href="tel:+919876543210" className="footer-phone">
            +91 98765 43210
          </a>
        </div>
        <div>
          <h3>Pages</h3>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About the doctor</Link>
            </li>
            <li>
              <Link href="/#treatments">Treatments</Link>
            </li>
            <li>
              <Link href="/appointment">Appointment</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Areas of care</h3>
          <ul>
            <li>
              <Link href="/#treatments">Allergies</Link>
            </li>
            <li>
              <Link href="/#treatments">Headaches</Link>
            </li>
            <li>
              <Link href="/#treatments">Digestive concerns</Link>
            </li>
            <li>
              <Link href="/#treatments">Skin concerns</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Visit the clinic</h3>
          <p>
            123 Green Park Road
            <br />
            Pune, Maharashtra
          </p>
          <p>
            Monday to Saturday
            <br />
            9:00 AM to 6:00 PM
          </p>
          <p>
            <a href="mailto:info@aaravhomeopathy.com">info@aaravhomeopathy.com</a>
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Dr. Aarav Homeopathy Clinic</span>
        <span>Consultations by appointment</span>
      </div>
    </footer>
  );
}

