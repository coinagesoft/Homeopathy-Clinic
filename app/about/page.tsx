import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Dr. Aarav Mehta',
  description: 'Learn about Dr. Aarav Mehta and his approach to personalised homeopathic consultations in Pune.',
};

export default function AboutPage() {
  return (
    <>
      {/* MediTro Wavy Page Banner */}
      <section className="meditro-page-banner">
        <span className="deco-shape deco-hero-circle" aria-hidden="true"></span>
        <span className="deco-shape deco-hero-plus" aria-hidden="true">+</span>
        <div className="container meditro-banner-inner">
          <h1>About Dr. Aarav Mehta</h1>
          <div className="meditro-breadcrumb">
            <Link href="/">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">About Us</span>
          </div>
        </div>
        <div className="hero-wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40C240 100 480 0 720 50C960 100 1200 15 1440 60V100H0V40Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* Doctor Profile Section */}
      <section className="meditro-section">
        <div className="container meditro-about-grid">
          <div className="meditro-hero-visual">
            <div className="hero-organic-backing">
              <Image
                src="/assets/dr-aarav-cropped.png"
                alt="Portrait of Dr. Aarav Mehta"
                width={646}
                height={576}
                priority
                unoptimized
                className="hero-doctor-img"
              />
            </div>
          </div>

          <div className="about-content-wrap">
            <span className="meditro-badge-orange">Doctor Profile</span>
            <h2>Experienced Care, Clearly Explained</h2>
            <p className="credential-pill">BHMS, MD (Homeopathy) &bull; 10+ Years Experience</p>
            <p>
              Dr. Aarav Mehta is a homeopathic physician in Pune with more than ten years of clinical practice. He completed his BHMS at Maharashtra University of Health Sciences and went on to earn an MD in Homeopathy.
            </p>
            <p style={{ marginTop: '14px' }}>
              His consultations are deliberately unhurried. He listens to the patient&apos;s concerns, asks about medical history, diet, sleep, and daily routine, and explains the available approach before discussing next steps.
            </p>

            <dl className="info-list">
              <div>
                <dt>Qualification</dt>
                <dd>BHMS, MD (Homeopathy)</dd>
              </div>
              <div>
                <dt>Clinical Experience</dt>
                <dd>10+ Years (5,000+ Consultations)</dd>
              </div>
              <div>
                <dt>Clinic Location</dt>
                <dd>123 Green Park Road, Pune</dd>
              </div>
              <div>
                <dt>Consultation Hours</dt>
                <dd>Mon – Sat, 9:00 AM to 6:00 PM</dd>
              </div>
            </dl>

            <div style={{ marginTop: '28px' }}>
              <Link href="/appointment" className="btn-meditro-orange">
                Book Consultation with Dr. Aarav
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Common Reasons for Consultation */}
      <section className="meditro-section meditro-process">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Areas of Care</span>
            <h2>Common Reasons For Consultation</h2>
          </div>

          <div className="process-cards-grid">
            <div className="process-card">
              <div className="process-num">01</div>
              <h3>Allergies &amp; Respiratory</h3>
              <p>Recurring sneezing, nasal congestion, sinusitis, seasonal sensitivities, and wheezing.</p>
              <Link href="/appointment" className="btn-process-link">
                <span>Book Visit</span>
                <span className="process-arrow-box">&rsaquo;</span>
              </Link>
            </div>

            <div className="process-card process-card-active">
              <div className="process-num">02</div>
              <h3>Migraine &amp; Digestion</h3>
              <p>Chronic headache patterns, triggers, acidity, bloating, and irregular digestion care.</p>
              <Link href="/appointment" className="btn-process-link">
                <span>Book Visit</span>
                <span className="process-arrow-box">&rsaquo;</span>
              </Link>
            </div>

            <div className="process-card">
              <div className="process-num">03</div>
              <h3>Skin, Joints &amp; Sleep</h3>
              <p>Constitutional remedies for skin irritation, rashes, joint stiffness, stress, and sleep.</p>
              <Link href="/appointment" className="btn-process-link">
                <span>Book Visit</span>
                <span className="process-arrow-box">&rsaquo;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
