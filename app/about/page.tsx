import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Dr. Aarav Mehta (BHMS, MD) | Classical Homeopathy Clinic Pune',
  description: 'Detailed clinical profile, qualifications, medical philosophy, and 15+ years of clinical excellence of Dr. Aarav Mehta, Senior Classical Homeopath in Pune.',
};

export default function AboutPage() {
  return (
    <>
      {/* MediTro Wavy Page Banner */}
      <section className="meditro-page-banner">
        <span className="deco-shape deco-hero-circle" aria-hidden="true"></span>
        <span className="deco-shape deco-hero-plus" aria-hidden="true">+</span>
        <div className="container meditro-banner-inner">
          <span className="meditro-badge-orange">Senior Classical Consultant</span>
          <h1>About Dr. Aarav Mehta</h1>
          <p className="banner-subtext">
            BHMS (Gold Medalist), MD (Homeopathy) &bull; 15+ Years of Clinical Practice &bull; 20,000+ Consultations
          </p>

          <div className="meditro-breadcrumb">
            <Link href="/">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">About Doctor</span>
          </div>
        </div>

        <div className="hero-wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40C240 100 480 0 720 50C960 100 1200 15 1440 60V100H0V40Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* Main Doctor Profile Section */}
      <section className="meditro-section about-doctor-section">
        <div className="container meditro-about-grid">
          {/* Doctor Portrait Visual */}
          <div className="meditro-hero-visual">
            <div className="hero-organic-backing">
              <Image
                src="/assets/dr-aarav-cropped.png"
                alt="Portrait of Dr. Aarav Mehta, Senior Classical Homeopath"
                width={646}
                height={576}
                priority
                unoptimized
                className="hero-doctor-img"
              />
            </div>
            <div className="about-exp-float-card">
              <strong>15+</strong>
              <span>Years Clinical Excellence</span>
            </div>
          </div>

          {/* Detailed Profile Summary */}
          <div className="about-content-wrap">
            <span className="meditro-badge-orange">Detailed Clinical Profile</span>
            <h2>Dedicated To Unhurried, Root-Cause Healing</h2>
            <div className="credential-badge-row">
              <span className="cred-badge">BHMS (Gold Medalist)</span>
              <span className="cred-badge">MD (Homeopathy)</span>
              <span className="cred-badge">CCH / NCH Registered</span>
            </div>

            <p className="about-profile-lead">
              Dr. Aarav Mehta is a renowned Senior Classical Homeopathic Physician in Pune with over 15 years of dedicated clinical practice. Graduating as a Gold Medalist in Bachelor of Homeopathic Medicine and Surgery (BHMS) from Maharashtra University of Health Sciences (MUHS), he completed his postgraduate Doctor of Medicine (MD) in Homeopathic Philosophy and Repertory.
            </p>

            <p>
              Over his career, Dr. Mehta has successfully managed more than <strong>20,000+ clinical cases</strong> across India and 18+ countries worldwide. He is widely recognized for his expertise in treating recalcitrant chronic skin conditions (eczema, psoriasis), respiratory allergies, asthma, digestive disorders, pediatric immunity, and stress-related lifestyle ailments.
            </p>

            <div className="about-stats-summary-grid">
              <div className="stat-pill-item">
                <strong>15+</strong>
                <span>Years Clinical Experience</span>
              </div>
              <div className="stat-pill-item">
                <strong>20,000+</strong>
                <span>Consultations Treated</span>
              </div>
              <div className="stat-pill-item">
                <strong>98.4%</strong>
                <span>Patient Satisfaction</span>
              </div>
              <div className="stat-pill-item">
                <strong>18+</strong>
                <span>Countries Served via Telehealth</span>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link href="/appointment" className="btn-meditro-orange">
                Schedule Consultation with Dr. Aarav
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy of Treatment Section */}
      <section className="meditro-section about-philosophy-section">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Clinical Methodology</span>
            <h2>Our Core Medical Philosophy &amp; Standards</h2>
            <p className="section-lead-p">
              Classical constitutional homeopathy treats the individual person rather than an isolated disease label. Here is what defines Dr. Aarav’s patient-first approach.
            </p>
          </div>

          <div className="philosophy-cards-grid">
            <div className="philosophy-card">
              <div className="philo-icon-box">01</div>
              <h3>360&deg; Constitutional Case Taking</h3>
              <p>
                Every initial consultation spans an unhurried 30 to 45 minutes. Dr. Aarav investigates not just your chief physical symptoms, but also your sleep architecture, thermal sensitivities, emotional temperament, past suppressions, and family medical genetics.
              </p>
            </div>

            <div className="philosophy-card philo-card-highlight">
              <div className="philo-icon-box">02</div>
              <h3>100% Non-Steroidal Protocol</h3>
              <p>
                We adhere strictly to non-suppressive healing. Zero topical steroid creams, zero heavy antihistamines, and zero habit-forming sedatives. Our micro-potentized remedies stimulate your own vital force to repair damaged tissues naturally.
              </p>
            </div>

            <div className="philosophy-card">
              <div className="philo-icon-box">03</div>
              <h3>Authentic German-Grade Medicines</h3>
              <p>
                Every prescription is dispensed from genuine, certified original German (Dr. Reckeweg &amp; SBL) mother tinctures and bio-chemic salts, prepared under strict international pharmacopoeial standards with sealed tamper-proof packaging.
              </p>
            </div>

            <div className="philosophy-card">
              <div className="philo-icon-box">04</div>
              <h3>Global Telehealth &amp; Continuous Care</h3>
              <p>
                For patients outside Pune or abroad, Dr. Aarav provides seamless Google Meet video consultations, private medical records, and reliable doorstep medicine dispatch across India and international destinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Accreditations & Memberships */}
      <section className="meditro-section about-accreditations-section">
        <div className="container">
          <div className="accreditations-box">
            <div className="accred-left">
              <span className="meditro-badge-blue">Credentials &amp; Memberships</span>
              <h3>Recognized Excellence In Clinical Homeopathy</h3>
              <p>
                Dr. Aarav Mehta maintains active registrations and professional standing with leading statutory medical bodies:
              </p>
              <ul className="accred-list">
                <li>
                  <span className="accred-check">&#x2713;</span>
                  <div>
                    <strong>Central Council of Homeopathy (CCH) / NCH</strong>
                    <span>Registered Medical Practitioner, Govt. of India</span>
                  </div>
                </li>
                <li>
                  <span className="accred-check">&#x2713;</span>
                  <div>
                    <strong>Asian Homeopathic Medical League (AHML)</strong>
                    <span>Life Member &bull; Clinical Research Delegate</span>
                  </div>
                </li>
                <li>
                  <span className="accred-check">&#x2713;</span>
                  <div>
                    <strong>Homeopathic Medical Association of India (HMAI)</strong>
                    <span>Active Member, Maharashtra State Branch</span>
                  </div>
                </li>
                <li>
                  <span className="accred-check">&#x2713;</span>
                  <div>
                    <strong>Maharashtra Council of Homeopathy (MCH)</strong>
                    <span>Licensed Homeopathic Physician &bull; Pune District</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="accred-right-card">
              <div className="clinic-badge-seal">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h4>Dr. Aarav&apos;s Clinical Promise</h4>
              <p>
                &ldquo;I promise to listen to your health concerns without rush, explain the true root cause with clarity, and prescribe only pure, safe homeopathic remedies that heal without side-effects.&rdquo;
              </p>
              <strong>Dr. Aarav Mehta</strong>
              <small>BHMS, MD (Homeopathy)</small>

              <div style={{ marginTop: '20px' }}>
                <Link href="/appointment" className="btn-meditro-orange" style={{ width: '100%', textAlign: 'center' }}>
                  Book An Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments Teaser */}
      <section className="meditro-section about-treatments-teaser">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Specialized Care</span>
            <h2>Conditions We Treat Successfully</h2>
          </div>

          <div className="about-teaser-cards-grid">
            <div className="teaser-card">
              <h4>Chronic Skin Diseases</h4>
              <p>Eczema, Psoriasis, Urticaria, Lichen Planus, and severe acne cleared without topical steroids.</p>
              <Link href="/treatments#skin-disorders" className="teaser-link">Learn Treatment &rarr;</Link>
            </div>
            <div className="teaser-card">
              <h4>Allergic Asthma &amp; Sinus</h4>
              <p>Break the cycle of daily morning sneezing, nasal drops, and inhaler dependence naturally.</p>
              <Link href="/treatments#respiratory-allergies" className="teaser-link">Learn Treatment &rarr;</Link>
            </div>
            <div className="teaser-card">
              <h4>Digestive &amp; IBS Care</h4>
              <p>Healing hyperacidity, GERD, and erratic bowel movements by treating the gut-brain axis.</p>
              <Link href="/treatments#digestive-gut-health" className="teaser-link">Learn Treatment &rarr;</Link>
            </div>
            <div className="teaser-card">
              <h4>PCOD &amp; Women&apos;s Health</h4>
              <p>Natural regulation of menstrual cycles and thyroid balance without synthetic birth control pills.</p>
              <Link href="/treatments#womens-health-pcod" className="teaser-link">Learn Treatment &rarr;</Link>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/treatments" className="btn-meditro-blue">
              View All Specialized Treatment Protocols &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
