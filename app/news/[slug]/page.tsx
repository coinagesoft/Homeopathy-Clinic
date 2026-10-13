import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NEWS_ARTICLES } from '@/lib/newsData';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return NEWS_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = NEWS_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | Dr. Aarav Mehta`,
    description: article.summary,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = NEWS_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = NEWS_ARTICLES.filter((a) =>
    article.relatedSlugs.includes(a.slug)
  );

  return (
    <>
      {/* Article Page Hero Banner */}
      <section className="meditro-page-banner article-page-banner">
        <span className="deco-shape deco-hero-circle" aria-hidden="true"></span>
        <span className="deco-shape deco-hero-plus" aria-hidden="true">+</span>

        <div className="container meditro-banner-inner article-banner-inner">
          <div className="article-top-meta">
            <span className="article-category-pill">{article.category}</span>
            <span className="article-meta-dot">&bull;</span>
            <span className="article-date-str">{article.publishedDate}</span>
            <span className="article-meta-dot">&bull;</span>
            <span className="article-read-time">{article.readTime}</span>
          </div>

          <h1 className="article-main-title">{article.title}</h1>

          <div className="meditro-breadcrumb">
            <Link href="/">
              <span>Home</span>
            </Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/news">
              <span>News</span>
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{article.category}</span>
          </div>
        </div>

        <div className="hero-wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40C240 100 480 0 720 50C960 100 1200 15 1440 60V100H0V40Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* Article Main Body Section */}
      <section className="meditro-section article-content-section">
        <div className="container article-layout-grid">
          {/* Main Article Column */}
          <main className="article-main-col">
            {/* Featured Image */}
            <div className="article-featured-image-wrap">
              <Image
                src={article.image}
                alt={article.title}
                width={800}
                height={460}
                priority
                unoptimized
                className="article-featured-img"
              />
              <div className="featured-img-caption">
                Clinical guidance by Dr. Aarav Mehta (BHMS, MD), Pune Homeopathy Clinic
              </div>
            </div>

            {/* Key Clinical Takeaways Box */}
            <div className="key-takeaways-box">
              <div className="takeaways-header">
                <span className="takeaways-icon">&#x2728;</span>
                <h3>Key Clinical Takeaways</h3>
              </div>
              <ul className="takeaways-list">
                {article.keyTakeaways.map((point, idx) => (
                  <li key={idx}>
                    <span className="bullet-point">&#x2714;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rich Article Sections */}
            <div className="article-body-content">
              {article.contentSections.map((section, idx) => (
                <div key={idx} className="article-section-block">
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}

                  {section.callout && (
                    <aside className="article-callout-card" aria-label="Clinical highlight">
                      <div className="callout-quote-icon">&ldquo;</div>
                      <p>{section.callout}</p>
                    </aside>
                  )}
                </div>
              ))}
            </div>

            {/* Doctor's Concluding Clinical Quote */}
            <div className="doctor-quote-banner">
              <div className="doctor-quote-avatar">
                <Image
                  src="/assets/dr-aarav-cropped.png"
                  alt="Dr. Aarav Mehta"
                  width={72}
                  height={72}
                  unoptimized
                />
              </div>
              <div className="doctor-quote-text">
                <blockquote>&ldquo;{article.clinicalQuote}&rdquo;</blockquote>
                <strong>&mdash; Dr. Aarav Mehta</strong>
                <small>BHMS, MD (Homeopathy) &bull; Pune Clinic</small>
              </div>
            </div>

            {/* Navigation back to all articles */}
            <div className="article-bottom-nav">
              <Link href="/news" className="btn-back-to-news">
                &larr; Back to All Clinical Articles
              </Link>
              <Link href="/treatments" className="btn-browse-treatments">
                Explore Related Treatments &rarr;
              </Link>
            </div>
          </main>

          {/* Sidebar Column */}
          <aside className="article-sidebar-col">
            {/* Author Profile Card */}
            <div className="sidebar-widget author-card-widget">
              <div className="author-widget-header">
                <Image
                  src="/assets/dr-aarav-cropped.png"
                  alt="Dr. Aarav Mehta"
                  width={90}
                  height={90}
                  unoptimized
                  className="author-avatar"
                />
                <div>
                  <h4>{article.author}</h4>
                  <span className="author-credentials">BHMS, MD (Homeopathy)</span>
                  <span className="author-exp-badge">15+ Years Clinical Practice</span>
                </div>
              </div>
              <p className="author-bio-snippet">
                Dr. Aarav Mehta is a senior classical homeopath in Pune with over 20,000 successful consultations across chronic dermatology, asthma, and lifestyle disorders.
              </p>
              <Link href="/about" className="author-full-profile-link">
                View Doctor&apos;s Full Profile &rarr;
              </Link>
            </div>

            {/* Book Consultation Widget */}
            <div className="sidebar-widget cta-widget">
              <span className="cta-widget-badge">Direct Doctor Booking</span>
              <h3>Need Expert Help For This Condition?</h3>
              <p>
                Schedule a 45-minute unhurried consultation with Dr. Aarav Mehta in Pune or online via Google Meet.
              </p>
              <ul className="cta-perks-list">
                <li>&#x2713; Full 360&deg; Case Investigation</li>
                <li>&#x2713; 100% Non-Steroidal Remedies</li>
                <li>&#x2713; Direct WhatsApp &amp; Meet Follow-up</li>
              </ul>
              <Link href="/appointment" className="btn-meditro-orange btn-sidebar-book">
                Book Consultation (₹800)
              </Link>
              <a href="tel:+919876543210" className="sidebar-phone-link">
                Call: (+91) 98765 43210
              </a>
            </div>

            {/* Related Articles Widget */}
            {relatedArticles.length > 0 && (
              <div className="sidebar-widget related-articles-widget">
                <h4 className="sidebar-widget-title">Related Clinical Insights</h4>
                <div className="related-list">
                  {relatedArticles.map((rel) => (
                    <article key={rel.slug} className="mini-related-item">
                      <Link href={`/news/${rel.slug}`}>
                        <span className="mini-category">{rel.category}</span>
                        <h5>{rel.title}</h5>
                        <small>{rel.readTime}</small>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}

