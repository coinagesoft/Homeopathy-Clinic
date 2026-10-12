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
      <section className="page-header">
        <div className="container">
          <h1>About Dr. Aarav Mehta</h1>
          <p>
            A homeopathic physician in Pune with more than ten years of clinical practice and a patient-first approach to consultation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container profile-grid">
          <div className="profile-image">
            <Image
              src="/assets/dr-aarav-cropped.png"
              alt="Portrait of Dr. Aarav Mehta"
              width={646}
              height={576}
              priority
            />
          </div>
          <div>
            <h2>Experienced care, clearly explained</h2>
            <p className="credential">BHMS, MD (Homeopathy)</p>
            <p>
              Dr. Aarav Mehta is a homeopathic physician with more than ten years of clinical experience. He completed his BHMS at Maharashtra University of Health Sciences and went on to earn an MD in Homeopathy.
            </p>
            <p>
              His consultations are deliberately unhurried. He listens to the patient&apos;s concerns, asks about medical history, diet, sleep and daily routine, and explains the available approach before discussing next steps.
            </p>
            <dl className="info-list">
              <div>
                <dt>Qualification</dt>
                <dd>BHMS, MD (Homeopathy)</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>10+ years</dd>
              </div>
              <div>
                <dt>Practice</dt>
                <dd>Pune, Maharashtra</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container approach-grid">
          <div>
            <h2>A thoughtful approach to patient care</h2>
          </div>
          <div className="copy">
            <p>
              Every patient has a different health history. The consultation focuses on understanding individual symptoms, medical history and lifestyle before discussing appropriate care.
            </p>
            <p>
              Homeopathy is a complementary system of care. Patients with serious or emergency conditions are advised to seek immediate medical attention, and existing treatment should not be stopped without consulting a qualified doctor.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Common reasons for consultation</h2>
          </div>
          <ul className="area-list">
            <li>Allergies</li>
            <li>Migraine and headaches</li>
            <li>Digestive concerns</li>
            <li>Skin concerns</li>
            <li>Respiratory concerns</li>
            <li>Stress and sleep</li>
          </ul>
          <Link href="/appointment" className="btn">
            Book an appointment
          </Link>
        </div>
      </section>
    </>
  );
}

