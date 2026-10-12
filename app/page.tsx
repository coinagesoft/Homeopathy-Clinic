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
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>A thoughtful approach to your health</h1>
            <p className="lead">
              Individual consultations built around your symptoms, health history and everyday routine, with time to listen and explain.
            </p>
            <div className="btn-row">
              <Link href="/appointment" className="btn">
                Book an appointment
              </Link>
              <Link href="/about" className="text-link">
                Meet Dr. Aarav
              </Link>
            </div>
            <div className="hero-note">
              <strong>More than 10 years of clinical experience</strong>
              Consultations by appointment in Pune
            </div>
          </div>
          <div className="hero-media">
            <Image
              src="/assets/dr-aarav-cropped.png"
              alt="Dr. Aarav Mehta, homeopathic physician"
              width={646}
              height={576}
              priority
            />
          </div>
        </div>
      </section>

      <section className="facts">
        <div className="container facts-grid">
          <div>
            <strong>10+</strong>
            <span>Years of experience</span>
          </div>
          <div>
            <strong>5,000+</strong>
            <span>Patient consultations</span>
          </div>
          <div>
            <strong>One-to-one</strong>
            <span>Unhurried consultations</span>
          </div>
          <div>
            <strong>Mon to Sat</strong>
            <span>9:00 AM to 6:00 PM</span>
          </div>
        </div>
      </section>

      <section className="section about-preview">
        <div className="container split">
          <div>
            <Image
              className="photo"
              src="/assets/consultation-photo-clean.jpg"
              alt="Dr. Aarav Mehta consulting with a patient in an unhurried, attentive clinic environment"
              width={1200}
              height={896}
              unoptimized
              priority
            />
          </div>
          <div className="copy">
            <h2>Care that begins with listening</h2>
            <p>
              At Dr. Aarav Homeopathy Clinic, every consultation starts with understanding the person behind the symptoms. We take time to discuss your concerns, health history, lifestyle and expectations.
            </p>
            <p>
              The clinic is set up for unhurried consultations, clear communication and planned follow-ups.
            </p>
            <p style={{ marginTop: '22px' }}>
              <Link href="/about" className="text-link">
                Read about our approach
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section section-tint" id="treatments">
        <div className="container">
          <div className="section-head">
            <h2>Care for everyday health concerns</h2>
            <p>Consultations are individualised, and outcomes vary from person to person.</p>
          </div>
          <div className="treatment-grid">
            <article className="treatment">
              <h3>Allergies</h3>
              <p>Recurring symptoms such as sneezing, itching and nasal congestion.</p>
            </article>
            <article className="treatment">
              <h3>Migraine and headaches</h3>
              <p>Review of headache patterns, triggers and daily routine.</p>
            </article>
            <article className="treatment">
              <h3>Digestive concerns</h3>
              <p>Consultation around acidity, bloating and irregular digestion.</p>
            </article>
            <article className="treatment">
              <h3>Skin concerns</h3>
              <p>Discussion of recurring irritation, dryness and rashes.</p>
            </article>
            <article className="treatment">
              <h3>Joint and muscle pain</h3>
              <p>Assessment of ongoing stiffness and everyday aches.</p>
            </article>
            <article className="treatment">
              <h3>Stress and sleep</h3>
              <p>A conversation about rest, stress and daily routine.</p>
            </article>
          </div>
          <p className="disclaimer">
            Homeopathy is a complementary system of care. For emergencies or serious conditions, seek appropriate medical attention.
          </p>
        </div>
      </section>

      <section className="section doctor-preview">
        <div className="container doctor-grid">
          <div className="doctor-image">
            <figure>
              <Image
                src="/assets/dr-aarav-cropped.png"
                alt="Dr. Aarav Mehta, homeopathic physician"
                width={646}
                height={576}
              />
              <figcaption>Dr. Aarav Mehta, BHMS, MD (Homeopathy)</figcaption>
            </figure>
          </div>
          <div className="doctor-copy">
            <h2>Dr. Aarav Mehta</h2>
            <p className="credential">BHMS, MD (Homeopathy)</p>
            <p className="quote">
              Every consultation should leave a patient feeling heard, informed and clear about the next step.
            </p>
            <p>
              With more than ten years of clinical experience, Dr. Aarav focuses on careful case understanding and straightforward communication.
            </p>
            <Link href="/about" className="text-link">
              More about Dr. Aarav
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2>Ready to schedule a consultation?</h2>
            <p>Choose a convenient date and time. Our clinic team will contact you to confirm your request.</p>
          </div>
          <div className="cta-actions">
            <Link href="/appointment" className="btn btn-light">
              Book an appointment
            </Link>
            <a href="tel:+919876543210" className="cta-phone">
              or call +91 98765 43210
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

