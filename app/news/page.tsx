import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { NEWS_ARTICLES } from '@/lib/newsData';

export const metadata: Metadata = {
  title: 'Clinical News & Homeopathic Health Insights | Dr. Aarav Mehta',
  description: 'Evidence-based articles, clinical case insights, and holistic healthcare guidance authored by Dr. Aarav Mehta (BHMS, MD), Pune.',
};

export default function NewsIndexPage() {
  return (
    <>
      {/* Page Hero Banner */}
      <section className="meditro-page-banner">
        <span className="deco-shape deco-hero-circle" aria-hidden="true"></span>
        <span className="deco-shape deco-hero-plus" aria-hidden="true">+</span>

        <div className="container meditro-banner-inner">
          <span className="meditro-badge-orange">Doctor’s Clinical Journal</span>
          <h1>Clinical News &amp; Health Insights</h1>
          <p className="banner-subtext">
            Practical guidance on root-cause healing, immune resilience, allergy management, and classical homeopathic protocols by Dr. Aarav Mehta.
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
            <span className="breadcrumb-current">News &amp; Insights</span>
          </div>
        </div>

        <div className="hero-wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40C240 100 480 0 720 50C960 100 1200 15 1440 60V100H0V40Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* Main Articles Listing */}
      <section className="meditro-section news-directory-section">
        <div className="container">
          <div className="meditro-section-header">
            <span className="meditro-badge-orange">Featured Medical Articles</span>
            <h2>Educational Guidance For Holistic Wellness</h2>
            <p className="section-lead-p">
              Read how classical constitutional homeopathy approaches complex chronic conditions from allergy desensitization to dermatological healing.
            </p>
          </div>

          <div className="news-cards-grid news-directory-grid">
            {NEWS_ARTICLES.map((article) => (
              <article key={article.slug} className="meditro-news-card news-page-card">
                <Link href={`/news/${article.slug}`} className="news-card-img-link" tabIndex={-1}>
                  <div className="news-card-img">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={500}
                      height={340}
                      unoptimized
                    />
                    <span className="news-category-badge">{article.category}</span>
                  </div>
                </Link>

                <div className="news-card-body">
                  <div className="news-meta-row">
                    <span className="news-author">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {article.author}
                    </span>
                    <span className="news-date">{article.publishedDate}</span>
                    <span className="news-read-time">{article.readTime}</span>
                  </div>

                  <h3>
                    <Link href={`/news/${article.slug}`} className="news-title-link">
                      {article.title}
                    </Link>
                  </h3>

                  <p className="news-card-summary">
                    {article.summary}
                  </p>

                  <div className="news-card-bottom">
                    <Link href={`/news/${article.slug}`} className="btn-news-more">
                      <span>Read Full Article</span>
                      <span className="news-arrow-box" aria-hidden="true">&rsaquo;</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Consultation CTA Banner */}
          <div className="news-page-cta-card">
            <div>
              <h3>Have Questions About Your Symptoms?</h3>
              <p>Discuss your case with Dr. Aarav Mehta in an unhurried, private consultation.</p>
            </div>
            <Link href="/appointment" className="btn-meditro-orange">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

