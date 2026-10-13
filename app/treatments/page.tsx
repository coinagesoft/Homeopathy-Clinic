'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TREATMENTS, Treatment } from '@/lib/treatmentsData';

export default function TreatmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTreatments = selectedCategory === 'all'
    ? TREATMENTS
    : TREATMENTS.filter((t) => t.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* =========================================================
          1. PAGE HERO BANNER
         ========================================================= */}
      <section className="meditro-page-banner">
        <span className="deco-shape deco-hero-circle" aria-hidden="true"></span>
        <span className="deco-shape deco-hero-plus" aria-hidden="true">+</span>

        <div className="container meditro-banner-inner">
          <span className="meditro-badge-orange">Specialized Clinical Care</span>
          <h1>Homeopathic Treatments &amp; Clinical Protocols</h1>
          <p className="banner-subtext">
            Root-cause, non-steroidal constitutional healing tailored to your physical, emotional, and genetic profile by Dr. Aarav Mehta (BHMS, MD).
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
            <span className="breadcrumb-current">Treatments</span>
          </div>
        </div>

        <div className="hero-wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40C240 100 480 0 720 50C960 100 1200 15 1440 60V100H0V40Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* =========================================================
          2. CORE TREATMENT PILLARS STATS
         ========================================================= */}
      <section className="treatments-stats-bar">
        <div className="container">
          <div className="treatment-stats-grid">
            <div className="stat-card">
              <span className="stat-num">8+</span>
              <strong>Clinical Specialties</strong>
              <small>From stubborn dermatology to respiratory asthma</small>
            </div>
            <div className="stat-card">
              <span className="stat-num">100%</span>
              <strong>Steroid-Free Medicine</strong>
              <small>Zero habit-forming ingredients or side effects</small>
            </div>
            <div className="stat-card">
              <span className="stat-num">20,000+</span>
              <strong>Patients Treated</strong>
              <small>Across Maharashtra, Pan-India &amp; 18+ Countries</small>
            </div>
            <div className="stat-card">
              <span className="stat-num">45 Min</span>
              <strong>In-Depth Case Study</strong>
              <small>Unhurried 360&deg; constitutional evaluation</small>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. INTERACTIVE CATEGORY FILTER TABS
         ========================================================= */}
      <section className="meditro-section treatments-main-section" id="all-treatments">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Evidence-Based Classical Homeopathy</span>
            <h2>Explore Our Specialized Treatment Areas</h2>
            <p className="section-lead-p">
              Click any treatment category below to review how classical homeopathy treats the root pathology, what symptoms are targeted, and the realistic recovery timeline.
            </p>
          </div>

          <div className="treatment-filter-pills" role="tablist" aria-label="Treatment categories">
            <button
              type="button"
              className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Treatments (8)
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedCategory === 'skin-hair' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('skin-hair')}
            >
              Skin &amp; Hair Care
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedCategory === 'respiratory' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('respiratory')}
            >
              Respiratory &amp; Allergies
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedCategory === 'digestive' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('digestive')}
            >
              Digestive &amp; Gut Health
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedCategory === 'pain-joints' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('pain-joints')}
            >
              Joints &amp; Arthritis
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedCategory === 'mind-hormones' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('mind-hormones')}
            >
              Mind, Stress &amp; Hormones
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedCategory === 'pediatric' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('pediatric')}
            >
              Pediatric &amp; Immunity
            </button>
          </div>

          {/* =========================================================
              4. DETAILED TREATMENT CARDS GRID
             ========================================================= */}
          <div className="treatment-cards-list">
            {filteredTreatments.map((treatment) => {
              const isExpanded = expandedId === treatment.id;

              return (
                <article key={treatment.id} id={treatment.id} className="treatment-detail-card">
                  <div className="treatment-card-header">
                    <div className="treatment-title-block">
                      <span className="treatment-badge-tag">{treatment.badge}</span>
                      <h3>{treatment.name}</h3>
                      <p className="treatment-short-desc">{treatment.shortDesc}</p>
                    </div>

                    <div className="treatment-header-cta">
                      <Link href="/appointment" className="btn-meditro-orange btn-book-treatment">
                        Book Consultation
                      </Link>
                    </div>
                  </div>

                  {/* Conditions Pills Wrap */}
                  <div className="treatment-conditions-block">
                    <span className="conditions-label">Treated Conditions:</span>
                    <div className="conditions-pills-row">
                      {treatment.conditions.map((cond) => (
                        <span key={cond} className="cond-chip">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Two-Column Deep Clinical Explanation */}
                  <div className="treatment-clinical-grid">
                    <div className="clinical-col constitutional-col">
                      <h4>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        The Homeopathic Constitutional Approach
                      </h4>
                      <p>{treatment.constitutionalApproach}</p>
                    </div>

                    <div className="clinical-col suppression-col">
                      <h4>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                        Why Conventional Suppression Fails
                      </h4>
                      <p>{treatment.whyConventionalFails}</p>
                    </div>
                  </div>

                  {/* Expandable Details: Symptoms & Timeline */}
                  {isExpanded && (
                    <div className="treatment-expanded-drawer">
                      <div className="expanded-grid">
                        <div className="expanded-symptoms">
                          <h5>Core Symptoms Resolved:</h5>
                          <ul>
                            {treatment.symptomsTreated.map((s) => (
                              <li key={s}>
                                <span className="check-bullet">&bull;</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="expanded-highlights">
                          <h5>Clinical Highlights:</h5>
                          <ul>
                            {treatment.clinicalHighlights.map((h) => (
                              <li key={h}>
                                <span className="check-icon">&#x2713;</span>
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="treatment-timeline-banner">
                        <span className="timeline-clock-icon">&#x23F1;</span>
                        <div>
                          <strong>Expected Recovery Timeline:</strong>
                          <p>{treatment.typicalDuration}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle Button & Consultation Link Footer */}
                  <div className="treatment-card-footer">
                    <button
                      type="button"
                      className="btn-toggle-treatment"
                      onClick={() => toggleExpand(treatment.id)}
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? 'Hide Detailed Clinical Info' : 'View Symptoms & Recovery Timeline'}</span>
                      <span className={`toggle-chevron ${isExpanded ? 'rotated' : ''}`}>&#x25BC;</span>
                    </button>

                    <div className="footer-links-group">
                      {/* <span className="treatment-time-badge">
                        Timeline: {treatment.typicalDuration.split(' ')[0]} {treatment.typicalDuration.split(' ')[1]} {treatment.typicalDuration.split(' ')[2]}
                      </span> */}
                      <Link href="/appointment" className="btn-treatment-direct-book">
                        Book for {treatment.name.split('&')[0]} &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. COMPARISON MATRIX: HOMEOPATHY VS SUPPRESSION
         ========================================================= */}
      <section className="meditro-section treatments-comparison-section">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Why Constitutional Care Works</span>
            <h2>Classical Homeopathy vs Conventional Suppression</h2>
            <p className="section-lead-p">
              Understanding the fundamental clinical difference between suppressing symptoms with chemicals and stimulating your vital force to heal from within.
            </p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Clinical Aspect</th>
                  <th className="th-conventional">Conventional Suppressive Care</th>
                  <th className="th-homeopathy">Dr. Aarav Mehta Homeopathy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Primary Focus</strong></td>
                  <td>Blocks or mutes peripheral symptoms (creams, antacids, inhalers)</td>
                  <td className="highlight-cell">Treats the internal root cause and constitutional susceptibility</td>
                </tr>
                <tr>
                  <td><strong>Steroids &amp; Chemical Toxins</strong></td>
                  <td>Frequent reliance on topical steroids, cortisone, or NSAIDs</td>
                  <td className="highlight-cell"><strong>100% Steroid-Free</strong>, non-toxic micro-potentized remedies</td>
                </tr>
                <tr>
                  <td><strong>Post-Medication Rebound</strong></td>
                  <td>High incidence of flares / rebound symptoms once pills stop</td>
                  <td className="highlight-cell">Durable, permanent cellular remission without drug dependency</td>
                </tr>
                <tr>
                  <td><strong>Case Evaluation Time</strong></td>
                  <td>3 to 5 minutes quick prescription</td>
                  <td className="highlight-cell">Unhurried 30 to 45 minutes in-depth personal consultation</td>
                </tr>
                <tr>
                  <td><strong>Side Effects &amp; Organ Strain</strong></td>
                  <td>Acidity, liver/kidney strain, skin thinning, gut dysbiosis</td>
                  <td className="highlight-cell">Completely gentle, safe for infants, pregnant women, and seniors</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. TREATMENTS FREQUENTLY ASKED QUESTIONS
         ========================================================= */}
      <section className="meditro-section treatments-faq-section">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Patient Clarifications</span>
            <h2>Frequently Asked Questions About Our Treatments</h2>
          </div>

          <div className="faq-cards-grid">
            <div className="faq-card">
              <h4>Can I take homeopathic medicines along with allopathic prescriptions?</h4>
              <p>
                Yes, absolutely. Homeopathic medicines operate on a bio-energetic regulatory level and do not chemically interfere with conventional drugs. If you are taking thyroid, blood pressure, or diabetes medication, you should continue them; we gradually adjust dosages under medical monitoring as your constitutional health improves.
              </p>
            </div>

            <div className="faq-card">
              <h4>Are Dr. Aarav&apos;s homeopathic medicines 100% free of steroids?</h4>
              <p>
                Yes, unequivocally 100% steroid-free. We dispense only authentic, sealed German-grade (Dr. Reckeweg &amp; SBL) dilutions and bio-chemic tissue salts prepared under strict pharmacopoeial standards. You are welcome to independently lab-test our medicines at any certified testing laboratory.
              </p>
            </div>

            <div className="faq-card">
              <h4>How long before I start noticing clinical improvement?</h4>
              <p>
                In acute conditions (allergies, acute acidity, fever), improvement is often noticed within 24 to 48 hours. In deep-rooted chronic conditions (eczema, psoriasis, asthma, PCOD), initial signs of relief appear within 2 to 4 weeks, with systemic recovery unfolding over 3 to 6 months.
              </p>
            </div>

            <div className="faq-card">
              <h4>Do I need to visit the Pune clinic in person or is telehealth available?</h4>
              <p>
                Both options are fully supported! If you reside in Pune or nearby, you can visit our clinic at Green Park Road. For patients across Maharashtra, India, or internationally, Dr. Aarav conducts thorough 45-minute Google Meet video consultations, with authentic medicines securely dispatched directly to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. BOTTOM CTA BANNER
         ========================================================= */}
      <section className="treatments-bottom-cta">
        <div className="container">
          <div className="treatments-cta-box">
            <h2>Ready To Experience Lasting Relief from Chronic Illness?</h2>
            <p>
              Schedule an unhurried consultation with Dr. Aarav Mehta (BHMS, MD). We will examine your health history, identify the root cause, and formulate your personalized constitutional recovery plan.
            </p>
            <div className="cta-actions">
              <Link href="/appointment" className="btn-meditro-orange">
                Book Consultation
              </Link>
              <a href="tel:+919876543210" className="btn-meditro-outline-white">
                Call Clinic: (+91) 98765 43210
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
