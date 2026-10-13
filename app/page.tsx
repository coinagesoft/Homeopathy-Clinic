import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dr. Aarav Homeopathy Clinic, Pune',
  description: 'Personalised homeopathic consultations with Dr. Aarav Mehta in Pune.',
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
              We Provide All Health Care Solution
            </span>
            <h1>
              Protect Your Health And Take Care Of Your Health
            </h1>
            <p className="meditro-hero-lead">
              Individual homeopathic consultations with Dr. Aarav Mehta (BHMS, MD) built around your symptoms, health history, and everyday routine in Pune.
            </p>
            <div className="meditro-hero-actions">
              <Link href="/appointment" className="btn-meditro-orange">
                Book Appointment
              </Link>
              <Link href="/about" className="btn-meditro-outline">
                Read More
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
          2. ABOUT US SECTION (2x2 Collage + 4 Feature Icon Pills)
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
              <strong>10+</strong>
              <span>Year Experience</span>
            </div>
            <span className="collage-center-diamond" aria-hidden="true"></span>
          </div>

          {/* Right: About Copy & 4 Feature Pills */}
          <div className="about-content-wrap">
            <span className="meditro-badge-orange">About Us</span>
            <h2>The Great Place Of Homeopathic Medical Center</h2>
            <p>
              At Dr. Aarav Homeopathy Clinic, every consultation starts with understanding the person behind the symptoms. We take unhurried time to discuss your concerns, medical history, sleep, lifestyle, and expectations for clear, lasting care.
            </p>

            <div className="about-features-grid">
              <div className="about-feature-pill">
                <span className="feature-icon-box icon-cyan" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </span>
                <strong>Individualised Care</strong>
              </div>

              <div className="about-feature-pill">
                <span className="feature-icon-box icon-green" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline points="17 11 19 13 23 9" />
                  </svg>
                </span>
                <strong>Qualified Doctors</strong>
              </div>

              <div className="about-feature-pill">
                <span className="feature-icon-box icon-pink" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
                <strong>Best Professionals</strong>
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
                <strong>Medical Treatment</strong>
              </div>
            </div>

            <Link href="/about" className="btn-meditro-blue">
              Read More
            </Link>
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
            <h2>How we works?</h2>
          </div>

          <div className="process-cards-grid">
            {/* Step 01 */}
            <div className="process-card">
              <div className="process-num">01</div>
              <h3>Make Appointment</h3>
              <p>
                Select your preferred date and available consultation slot online for an unhurried one-to-one visit.
              </p>
              <Link href="/appointment" className="btn-process-link">
                <span>View More</span>
                <span className="process-arrow-box">&rsaquo;</span>
              </Link>
            </div>

            {/* Step 02 (Active Orange Center Card) */}
            <div className="process-card process-card-active">
              <div className="process-num">02</div>
              <h3>Take Treatment</h3>
              <p>
                Discuss your symptoms, medical history, sleep, and daily routine with Dr. Aarav Mehta for constitutional care.
              </p>
              <Link href="/about" className="btn-process-link">
                <span>View More</span>
                <span className="process-arrow-box">&rsaquo;</span>
              </Link>
            </div>

            {/* Step 03 */}
            <div className="process-card">
              <div className="process-num">03</div>
              <h3>Registration</h3>
              <p>
                Receive your personalised homeopathic treatment plan with Google Calendar reminders and planned follow-ups.
              </p>
              <Link href="/appointment" className="btn-process-link">
                <span>View More</span>
                <span className="process-arrow-box">&rsaquo;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. SERVICES SECTION ("We Cover A Big Variety Of Medical Services")
         ========================================================= */}
      <section className="meditro-section meditro-services" id="treatments">
        <div className="services-blue-backdrop" aria-hidden="true"></div>

        <div className="container meditro-services-grid">
          {/* Left Copy */}
          <div className="services-intro-col">
            <span className="meditro-badge-orange">Services</span>
            <h2>We Cover A Big Variety Of Medical Services</h2>
            <p>
              We provide personalised constitutional homeopathic treatment for chronic and everyday health concerns, tailored to each patient&apos;s constitution.
            </p>
            <Link href="/appointment" className="btn-meditro-orange">
              All Services
            </Link>
          </div>

          {/* Right Cards overlapping the Royal-Blue Backdrop */}
          <div className="services-cards-row">
            <article className="meditro-service-card">
              <div className="service-icon-frame">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                  <circle cx="20" cy="10" r="2" />
                </svg>
              </div>
              <h3>Diagnostics &amp; Allergies</h3>
              <p>Constitutional care for recurring sneezing, nasal congestion, asthma, and seasonal allergies.</p>
              <Link href="/appointment" className="btn-service-more">
                View More
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
              <h3>Migraine &amp; Treatment</h3>
              <p>Detailed review of headache patterns, digestive acidity, skin rashes, and daily lifestyle triggers.</p>
              <Link href="/appointment" className="btn-service-more">
                View More
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
              <h3>Chronic &amp; Joint Care</h3>
              <p>Unhurried assessment for joint stiffness, muscle aches, sleep disturbances, and stress recovery.</p>
              <Link href="/appointment" className="btn-service-more">
                View More
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. TESTIMONIALS SECTION (Hexagon Orbit + Orange Quote Card)
         ========================================================= */}
      <section className="meditro-section meditro-testimonials" id="testimonials">
        <span className="deco-shape deco-testi-plus" aria-hidden="true">+</span>
        <span className="deco-shape deco-testi-circle" aria-hidden="true"></span>

        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Testimonial</span>
            <h2>See What Are The Patients Saying About us</h2>
          </div>

          <div className="testimonial-grid-meditro">
            {/* Left: Hexagonal Patient Avatar Orbit */}
            <div className="testimonial-orbit-wrap" aria-hidden="true">
              <div className="orbit-dashed-ring"></div>
              <div className="orbit-center-hex">
                <span>5,000+</span>
                <small>Happy Patients</small>
              </div>
              <div className="orbit-avatar pos-1">SR</div>
              <div className="orbit-avatar pos-2">AK</div>
              <div className="orbit-avatar pos-3">PD</div>
              <div className="orbit-avatar pos-4">RM</div>
              <div className="orbit-avatar pos-5">SV</div>
              <div className="orbit-avatar pos-6">NK</div>
            </div>

            {/* Right: Orange Quote Card */}
            <div className="testimonial-quote-col">
              <div className="meditro-orange-quote-card">
                <div className="quote-floating-badge" aria-hidden="true">
                  &ldquo;
                </div>
                <p className="quote-card-text">
                  Dr. Aarav Mehta takes the time to genuinely listen to every symptom and explain the treatment clearly. After months of recurring migraine and seasonal allergies, the constitutional homeopathic care made a remarkable difference in my daily health.
                </p>
                <div className="quote-card-footer">
                  <div>
                    <strong>Shivraj R. Babar</strong>
                    <span>PATIENT &bull; PUNE</span>
                  </div>
                  <span className="quote-watermark" aria-hidden="true">
                    &rdquo;
                  </span>
                </div>
              </div>

              <div className="quote-nav-arrows">
                <Link href="/appointment" className="quote-arrow-btn" aria-label="Book consultation">
                  &#x2190;
                </Link>
                <Link href="/appointment" className="quote-arrow-btn" aria-label="Next review">
                  &#x2192;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. LATEST NEWS / INSIGHTS SECTION ("Our Latest News")
         ========================================================= */}
      <section className="meditro-section meditro-news">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Latest News</span>
            <h2>Our Latest News</h2>
          </div>

          <div className="news-cards-grid">
            <article className="meditro-news-card">
              <div className="news-card-img">
                <Image
                  src="/assets/consultation-photo-clean.jpg"
                  alt="Homeopathic consultation session"
                  width={500}
                  height={340}
                  unoptimized
                />
              </div>
              <div className="news-card-body">
                <div className="news-meta-row">
                  <span className="news-author">Dr. Aarav Mehta</span>
                  <span className="news-date">21 July 2026</span>
                </div>
                <h3>How Constitutional Homeopathy Helps Manage Seasonal Allergies</h3>
                <Link href="/appointment" className="btn-news-more">
                  <span>Read More</span>
                  <span className="news-arrow-box">&rsaquo;</span>
                </Link>
              </div>
            </article>

            <article className="meditro-news-card">
              <div className="news-card-img">
                <Image
                  src="/assets/dr-aarav-cropped.png"
                  alt="Dr. Aarav Mehta clinical guidance"
                  width={500}
                  height={340}
                  unoptimized
                />
              </div>
              <div className="news-card-body">
                <div className="news-meta-row">
                  <span className="news-author">Dr. Aarav Mehta</span>
                  <span className="news-date">19 July 2026</span>
                </div>
                <h3>Understanding Migraine Triggers: Sleep, Routine and Holistic Care</h3>
                <Link href="/about" className="btn-news-more">
                  <span>Read More</span>
                  <span className="news-arrow-box">&rsaquo;</span>
                </Link>
              </div>
            </article>

            <article className="meditro-news-card">
              <div className="news-card-img">
                <Image
                  src="/assets/consultation-photo-clean.jpg"
                  alt="Patient-first clinical environment"
                  width={500}
                  height={340}
                  unoptimized
                />
              </div>
              <div className="news-card-body">
                <div className="news-meta-row">
                  <span className="news-author">Dr. Aarav Mehta</span>
                  <span className="news-date">15 July 2026</span>
                </div>
                <h3>Why Unhurried One-to-One Consultations Lead to Better Health</h3>
                <Link href="/appointment" className="btn-news-more">
                  <span>Read More</span>
                  <span className="news-arrow-box">&rsaquo;</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
