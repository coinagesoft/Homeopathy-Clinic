export interface PatientTestimonial {
  id: string;
  name: string;
  age: number;
  location: string;
  condition: string;
  rating: number;
  avatarInitials: string;
  avatarBg: string;
  quote: string;
  duration: string;
  verified: boolean;
}

export const TESTIMONIALS: PatientTestimonial[] = [
  {
    id: 'testi-1',
    name: 'Shivraj R. Babar',
    age: 34,
    location: 'Pune, Maharashtra',
    condition: 'Chronic Migraine & Severe Hyperacidity',
    rating: 5,
    avatarInitials: 'SB',
    avatarBg: '#565ACF',
    quote: 'Dr. Aarav Mehta takes the time to genuinely listen to every symptom and explain the treatment clearly. After months of debilitating one-sided throbbing migraines and daily antacid use, the constitutional homeopathic care made a remarkable difference. I have been completely free of painkillers for over 8 months now!',
    duration: '4 months treatment',
    verified: true
  },
  {
    id: 'testi-2',
    name: 'Ananya Deshmukh',
    age: 29,
    location: 'Kothrud, Pune',
    condition: 'Chronic Atopic Eczema & Skin Weeping',
    rating: 5,
    avatarInitials: 'AD',
    avatarBg: '#00A3C4',
    quote: 'I had struggled with severe eczema on my hands and neck for nearly 6 years. Every dermatologist prescribed steroid creams that worked temporarily but caused intense rebound flares when stopped. Dr. Aarav explained the constitutional approach patiently. Within 4 months of treatment, my skin is smooth, clear, and itch-free without a single drop of steroid cream!',
    duration: '5 months treatment',
    verified: true
  },
  {
    id: 'testi-3',
    name: 'Rajesh K. Patel',
    age: 47,
    location: 'Viman Nagar, Pune',
    condition: 'Allergic Bronchial Asthma & Pollen Allergy',
    rating: 5,
    avatarInitials: 'RP',
    avatarBg: '#F17732',
    quote: 'Every monsoon and winter used to be a nightmare with morning bouts of 20+ sneezes and night-time asthma wheezing. I was taking inhalers twice daily. With Dr. Aarav’s gentle constitutional remedies, my morning sneezing stopped within weeks. I have not needed my emergency inhaler for the past 6 months!',
    duration: '6 months treatment',
    verified: true
  },
  {
    id: 'testi-4',
    name: 'Pooja S. Kulkarni',
    age: 31,
    location: 'Bengaluru (Telehealth Consult)',
    condition: 'PCOD, Hormonal Acne & Severe Hair Fall',
    rating: 5,
    avatarInitials: 'PK',
    avatarBg: '#7C3AED',
    quote: 'Being in Bengaluru, I consulted Dr. Aarav through Google Meet. His case-taking was incredibly detailed—asking about sleep, diet, stress, and emotions. My menstrual cycles became regular within 3 months, my jawline cystic acne cleared completely, and the hair shedding stopped. The medicine delivery to my doorstep was so prompt and reliable.',
    duration: '4 months treatment',
    verified: true
  },
  {
    id: 'testi-5',
    name: 'Deepak V. Verma',
    age: 53,
    location: 'Nashik, Maharashtra',
    condition: 'Cervical Spondylosis & Sciatica Nerve Pain',
    rating: 5,
    avatarInitials: 'DV',
    avatarBg: '#16A34A',
    quote: 'Severe cervical stiffness and radiating pain down my right leg made walking and driving agonizing. Painkillers gave me bad stomach acidity. Dr. Aarav’s homeopathic treatment brought down the inflammation gently without any stomach upset. I can now walk 3 kilometers every morning with zero pain.',
    duration: '3.5 months treatment',
    verified: true
  },
  {
    id: 'testi-6',
    name: 'Meera & Rohan Iyer',
    age: 6,
    location: 'Baner, Pune',
    condition: 'Childhood Recurrent Tonsillitis & Adenoids',
    rating: 5,
    avatarInitials: 'MI',
    avatarBg: '#E11D48',
    quote: 'Our 6-year-old son Aarush was falling sick every 3 weeks with high fevers and swollen tonsils. We were advised surgical adenoidectomy. Dr. Aarav’s sweet pills were a godsend—Aarush happily took them, his snoring and mouth breathing stopped, and he hasn’t missed a single day of school this term. Truly grateful!',
    duration: '3 months treatment',
    verified: true
  },
  {
    id: 'testi-7',
    name: 'Dr. Vikram S. Joshi',
    age: 41,
    location: 'Aundh, Pune',
    condition: 'Work Stress, Panic Episodes & Chronic Insomnia',
    rating: 5,
    avatarInitials: 'VJ',
    avatarBg: '#1F2278',
    quote: 'As a medical professional myself, I was hesitant about taking sleeping pills or anti-anxiety tranquilizers for work burnout. Dr. Aarav’s classical homeopathic prescribing addressed my nervous exhaustion and sleep cycle deeply. I sleep 7 hours of restorative, peaceful sleep every night without any daytime grogginess.',
    duration: '2.5 months treatment',
    verified: true
  }
];

