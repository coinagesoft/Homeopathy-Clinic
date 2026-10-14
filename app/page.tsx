import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import NewsCarousel from '@/components/NewsCarousel';

export const metadata: Metadata = {
  title: 'Dr. Aarav Homeopathy Clinic | Classical Homeopathy in Pune',
  description: 'Unhurried, root-cause constitutional homeopathic consultations with Dr. Aarav Mehta (BHMS, MD) in Pune & global telehealth.',
};

export default function HomePage() {
  return (
    <>
      {/* =========================================================
          1. HERO SECTION (MediTro Wavy Lavender Hero)
         ========================================================= */}
      <section className="meditro-hero">
        {/* Floating Decorative Shapes */}
        <span className="deco-shape deco-hero-circle" aria-hidden="true"></span>
        <span className="deco-shape deco-hero-square" aria-hidden="true"></span>
        <span className="deco-shape deco-hero-plus" aria-hidden="true">+</span>
        <span className="deco-shape deco-hero-triangle" aria-hidden="true"></span>

        <div className="container meditro-hero-grid">
          <div className="meditro-hero-copy">
            <span className="meditro-badge-blue">
              Classical Constitutional Homeopathy
            </span>
            <h1>
              Protect Your Health With Root-Cause Healing
            </h1>
            <p className="meditro-hero-lead">
              Unhurried, personal homeopathic consultations with Dr. Aarav Mehta (BHMS, MD). Gentle, lasting relief for chronic skin, allergy, migraine, gut, and lifestyle conditions in Pune &amp; worldwide.
            </p>
            <div className="meditro-hero-actions">
              <Link href="/appointment" className="btn-meditro-orange">
                Book Appointment
              </Link>
              <Link href="/treatments" className="btn-meditro-outline">
                Our Treatments
              </Link>
            </div>
          </div>

          <div className="meditro-hero-visual">
            <div className="hero-organic-backing">
              <Image
                src="/assets/dr-aarav-cropped.png"
                alt="Dr. Aarav Mehta, BHMS, MD (Homeopathy)"
                width={646}
                height={576}
                priority
                unoptimized
                className="hero-doctor-img"
              />
            </div>
            <span className="deco-waves-orange" aria-hidden="true">
              &#x2248;&#x2248;&#x2248;
            </span>
          </div>
        </div>

        {/* Bottom Wavy SVG Divider */}
        <div className="hero-wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path
              d="M0 50C240 120 480 0 720 60C960 120 1200 20 1440 70V120H0V50Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* =========================================================
          2. ABOUT US SECTION (Elaborated Profile + Experience)
         ========================================================= */}
      <section className="meditro-section meditro-about">
        <span className="deco-shape deco-about-square-left" aria-hidden="true"></span>
        <span className="deco-shape deco-about-square-right" aria-hidden="true"></span>

        <div className="container meditro-about-grid">
          {/* Left: 2x2 Asymmetric Collage */}
          <div className="about-collage-wrap">
            <div className="collage-item collage-tl">
              <Image
                src="/assets/consultation-photo-clean.jpg"
                alt="Dr. Aarav consulting with a patient"
                width={600}
                height={450}
                unoptimized
              />
            </div>
            <div className="collage-item collage-tr">
              <Image
                src="/assets/dr-aarav-cropped.png"
                alt="Dr. Aarav Mehta portrait"
                width={500}
                height={450}
                unoptimized
              />
            </div>
            <div className="collage-item collage-bl">
              <Image
                src="/assets/consultation-photo-clean.jpg"
                alt="Holistic consultation environment"
                width={500}
                height={450}
                unoptimized
              />
            </div>
            <div className="collage-item collage-exp-card">
              <strong>15+</strong>
              <span>Years Experience</span>
            </div>
            <span className="collage-center-diamond" aria-hidden="true"></span>
          </div>

          {/* Right: Elaborated Profile Summary */}
          <div className="about-content-wrap">
            <span className="meditro-badge-orange">About Dr. Aarav Mehta</span>
            <h2>Experienced Care, Clearly Explained</h2>
            <p className="credential-pill">
              BHMS (Gold Medalist), MD (Homeopathy) &bull; 15+ Years &bull; 20,000+ Consultations
            </p>
            <p>
              Dr. Aarav Mehta is a senior classical homeopathic physician in Pune with over 15 years of dedicated clinical practice. Graduating as a Gold Medalist from Maharashtra University of Health Sciences, he has successfully treated chronic skin conditions, respiratory allergies, digestive disorders, and pediatric ailments.
            </p>
            <p style={{ marginTop: '10px' }}>
              His consultations are deliberately unhurried (30 to 45 minutes). He examines your medical history, sleep, lifestyle, thermal traits, and emotional stress to formulate a pure, non-steroidal constitutional prescription.
            </p>

            <div className="about-features-grid">
              <div className="about-feature-pill">
                <span className="feature-icon-box icon-cyan" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </span>
                <strong>Constitutional Care</strong>
              </div>

              <div className="about-feature-pill">
                <span className="feature-icon-box icon-green" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline points="17 11 19 13 23 9" />
                  </svg>
                </span>
                <strong>100% Steroid-Free</strong>
              </div>

              <div className="about-feature-pill">
                <span className="feature-icon-box icon-pink" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
                <strong>German-Grade Remedies</strong>
              </div>

              <div className="about-feature-pill">
                <span className="feature-icon-box icon-purple" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.5 20.5 10 22l-4-2.5L2 17l1.5-.5" />
                    <path d="m14 6 4 4" />
                    <path d="m17 3 4 4" />
                    <path d="M19 5 9 15l-4 1 1-4L16 2z" />
                  </svg>
                </span>
                <strong>Global Telehealth</strong>
              </div>
            </div>

            <div className="about-actions-group">
              <Link href="/about" className="btn-meditro-blue">
                Read Full Doctor Profile &rarr;
              </Link>
              {/* <Link href="/appointment" className="btn-meditro-orange">
                Book Visit
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. WORKING PROCESS SECTION ("How we works?" 01 / 02 / 03)
         ========================================================= */}
      <section className="meditro-section meditro-process" id="process">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Working Process</span>
            <h2>How Our Clinical Care Works</h2>
          </div>

          <div className="process-cards-grid">
            {/* Step 01 */}
            <div className="process-card">
              <div className="process-num">01</div>
              <h3>Make Appointment</h3>
              <p>
                Choose your preferred date and available consultation slot online for an unhurried one-to-one clinic or Google Meet visit.
              </p>
              <Link href="/appointment" className="btn-process-link">
                <span>Book Slot</span>
                <span className="process-arrow-box" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Step 02 (Active Orange Center Card) */}
            <div className="process-card process-card-active">
              <div className="process-num">02</div>
              <h3>In-Depth Case Study</h3>
              <p>
                Spend 30–45 minutes discussing your symptoms, medical history, diet, sleep, and lifestyle triggers with Dr. Aarav Mehta.
              </p>
              <Link href="/about" className="btn-process-link">
                <span>Our Philosophy</span>
                <span className="process-arrow-box" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Step 03 */}
            <div className="process-card">
              <div className="process-num">03</div>
              <h3>Personalized Recovery</h3>
              <p>
                Receive authentic German-grade constitutional medicines with dietary guidance, calendar reminders, and planned follow-ups.
              </p>
              <Link href="/treatments" className="btn-process-link">
                <span>View Treatments</span>
                <span className="process-arrow-box" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. TREATMENTS SECTION (Renamed from Services & linked to /treatments)
         ========================================================= */}
      <section className="meditro-section meditro-services" id="treatments">
        <div className="services-blue-backdrop" aria-hidden="true"></div>

        <div className="container meditro-services-grid">
          {/* Left Copy */}
          <div className="services-intro-col">
            <span className="meditro-badge-orange">Our Treatments</span>
            <h2>Specialized Classical Homeopathic Treatments</h2>
            <p>
              We provide individualized constitutional treatment for chronic and complex health conditions, addressing the root pathology rather than suppressing external symptoms.
            </p>
            <div className="treatment-intro-actions">
              <Link href="/treatments" className="btn-meditro-orange">
                Explore All 8 Treatments &rarr;
              </Link>
              {/* <Link href="/appointment" className="btn-treatment-consult">
                Book Consultation
              </Link> */}
            </div>
          </div>

          {/* Right Treatment Cards */}
          <div className="services-cards-row">
            <article className="meditro-service-card">
              <div className="service-icon-frame">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                  <circle cx="20" cy="10" r="2" />
                </svg>
              </div>
              <span className="card-cat-badge">Skin &amp; Hair</span>
              <h3>Chronic Skin &amp; Eczema</h3>
              <p>Non-steroidal constitutional care for severe eczema, psoriasis plaques, chronic urticaria, and cystic acne.</p>
              <Link href="/treatments#skin-disorders" className="btn-service-more">
                Treatment Details &rarr;
              </Link>
            </article>

            <article className="meditro-service-card">
              <div className="service-icon-frame">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.5 20.5 10 22l-4-2.5L2 17l1.5-.5" />
                  <path d="m14 6 4 4" />
                  <path d="M19 5 9 15l-4 1 1-4L16 2z" />
                </svg>
              </div>
              <span className="card-cat-badge">Respiratory</span>
              <h3>Allergies &amp; Asthma</h3>
              <p>Desensitizing airway mucous membranes to eliminate morning sneezing fits, sinus headaches, and inhaler dependence.</p>
              <Link href="/treatments#respiratory-allergies" className="btn-service-more">
                Treatment Details &rarr;
              </Link>
            </article>

            <article className="meditro-service-card">
              <div className="service-icon-frame">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <line x1="12" y1="9" x2="12" y2="15" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                </svg>
              </div>
              <span className="card-cat-badge">Digestion</span>
              <h3>IBS, Gut &amp; Acidity</h3>
              <p>Restoring gut-brain harmony, soothing acid reflux, and healing erratic bowel movements without antacid reliance.</p>
              <Link href="/treatments#digestive-gut-health" className="btn-service-more">
                Treatment Details &rarr;
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. TESTIMONIALS SECTION (Multiple Reviews + Auto-Scroll)
         ========================================================= */}
      <section className="meditro-section meditro-testimonials" id="testimonials">
        <span className="deco-shape deco-testi-plus" aria-hidden="true">+</span>
        <span className="deco-shape deco-testi-circle" aria-hidden="true"></span>

        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Patient Testimonials</span>
            <h2>See What Patients Say About Our Care</h2>
            <p className="section-lead-p">
              Real recovery stories from individuals who achieved lasting relief through Dr. Aarav Mehta&apos;s constitutional care.
            </p>
          </div>

          {/* Interactive Multi-Review Auto-Scroll Carousel */}
          <TestimonialsCarousel />
        </div>
      </section>

      {/* =========================================================
          6. LATEST NEWS & INSIGHTS (Auto-Scroll Carousel View)
         ========================================================= */}
      <section className="meditro-section meditro-news" id="news">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Clinical News &amp; Insights</span>
            <h2>Our Latest Medical Articles &amp; Guides</h2>
            <p className="section-lead-p">
              Evidence-based health guidance and classical homeopathic insights written by Dr. Aarav Mehta.
            </p>
          </div>

          {/* Interactive Auto-Scroll News Carousel Component */}
          <NewsCarousel />

          <div className="news-browse-all-row">
            <Link href="/news" className="btn-meditro-blue">
              Browse All Clinical Articles &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
