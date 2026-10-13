'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TESTIMONIALS, PatientTestimonial } from '@/lib/testimonialsData';

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = TESTIMONIALS.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Autoscroll timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const current: PatientTestimonial = TESTIMONIALS[currentIndex];

  return (
    <div
      className="testimonials-carousel-root"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Patient Testimonials"
    >
      <div className="testimonial-grid-meditro">
        {/* Left: Hexagonal Orbit of Avatars with Active Pulse */}
        <div className="testimonial-orbit-wrap" aria-hidden="true">
          <div className="orbit-dashed-ring"></div>

          <div className="orbit-center-hex">
            <span className="orbit-number">20,000+</span>
            <small>Patients Cured</small>
            <div className="orbit-stars-mini">★★★★★</div>
          </div>

          {TESTIMONIALS.slice(0, 6).map((t, idx) => {
            const isActive = idx === currentIndex;
            const posClass = `pos-${idx + 1}`;
            return (
              <button
                key={t.id}
                type="button"
                className={`orbit-avatar ${posClass} ${isActive ? 'avatar-active' : ''}`}
                style={{ backgroundColor: t.avatarBg }}
                onClick={() => goToSlide(idx)}
                title={`Read review by ${t.name}`}
                aria-label={`View review by ${t.name}`}
              >
                <span>{t.avatarInitials}</span>
                {isActive && <span className="active-glow-ring"></span>}
              </button>
            );
          })}
        </div>

        {/* Right: Orange Quote Card with Smooth Transition */}
        <div className="testimonial-quote-col">
          <div className="meditro-orange-quote-card" role="group" aria-roledescription="slide" aria-label={`${currentIndex + 1} of ${total}`}>
            <div className="quote-floating-badge" aria-hidden="true">
              &ldquo;
            </div>

            {/* Condition Pill & Rating */}
            <div className="quote-top-badge-row">
              <span className="quote-condition-pill">{current.condition}</span>
              <div className="quote-stars-row" aria-label="5 out of 5 stars">
                {'★'.repeat(current.rating)}
              </div>
            </div>

            {/* Quote Body */}
            <blockquote className="quote-card-text">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Footer with Patient Name & Location */}
            <div className="quote-card-footer">
              <div className="quote-patient-meta">
                <div className="patient-name-wrap">
                  <strong>{current.name}</strong>
                  {current.verified && (
                    <span className="verified-badge" title="Verified Patient Review">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified Patient
                    </span>
                  )}
                </div>
                <span>
                  Age {current.age} &bull; {current.location} &bull; {current.duration}
                </span>
              </div>
              <span className="quote-watermark" aria-hidden="true">
                &rdquo;
              </span>
            </div>
          </div>

          {/* Clean Dot Indicators (without arrow buttons, status pill, or book button) */}
          <div className="testimonial-carousel-controls testimonial-dots-only">
            <div className="carousel-dots-list" role="tablist" aria-label="Testimonial selector">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === currentIndex}
                  className={`carousel-dot ${idx === currentIndex ? 'dot-active' : ''}`}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Jump to review by ${t.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
