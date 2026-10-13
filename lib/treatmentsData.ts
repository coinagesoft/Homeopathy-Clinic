export interface Treatment {
  id: string;
  name: string;
  category: 'skin-hair' | 'respiratory' | 'digestive' | 'pain-joints' | 'mind-hormones' | 'pediatric';
  badge: string;
  shortDesc: string;
  conditions: string[];
  constitutionalApproach: string;
  whyConventionalFails: string;
  typicalDuration: string;
  symptomsTreated: string[];
  clinicalHighlights: string[];
}

export const TREATMENTS: Treatment[] = [
  {
    id: 'skin-disorders',
    name: 'Chronic Skin Disorders & Dermatology',
    category: 'skin-hair',
    badge: 'Non-Steroidal Root Cause Care',
    shortDesc: 'Deep-acting constitutional remedies for chronic eczema, psoriasis, urticaria, cystic acne, and allergic dermatitis without topical steroid suppression.',
    conditions: [
      'Atopic Dermatitis & Eczema (Weeping & Dry)',
      'Psoriasis (Plaque, Guttate, Scalp)',
      'Chronic Urticaria & Hives (Dermatographia)',
      'Stubborn Adult & Adolescent Cystic Acne',
      'Lichen Planus & Hyperpigmentation',
      'Fungal Infections & Chronic Tinea Recurrence'
    ],
    constitutionalApproach: 'In classical homeopathy, the skin is viewed as an excretory organ and a reflection of internal vitality. Rather than driving toxins inward with steroid creams or immunosuppressants—which frequently triggers asthma, digestive ulcers, or severe rebound flares—we prescribe tailored constitutional remedies that stimulate healthy skin cellular regeneration and balance immune hypersensitivity from the inside out.',
    whyConventionalFails: 'Topical steroids provide short-term symptomatic suppression. Once discontinued, the disease rebounds with greater intensity (Steroid Withdrawal Syndrome) because the underlying autoimmune or metabolic root remains untouched.',
    typicalDuration: '3 to 6 months for marked clearance and long-term remission depending on steroid dependency history.',
    symptomsTreated: [
      'Severe itching, burning, and scaling',
      'Cracked skin, bleeding, and oozing eruptions',
      'Seasonal flares during winter or humid weather',
      'Stress-induced hives and swelling (angioedema)'
    ],
    clinicalHighlights: [
      '100% steroid-free, non-greasy oral treatment',
      'Addresses emotional and digestive triggers linked to skin flares',
      'Safe for infants, toddlers, and sensitive skin types'
    ]
  },
  {
    id: 'respiratory-allergies',
    name: 'Respiratory Health, Allergies & Asthma',
    category: 'respiratory',
    badge: 'Permanent Immunity Strengthening',
    shortDesc: 'Eliminate recurrent sneezing, allergic rhinitis, chronic sinusitis, bronchitis, and wheezing by lowering histamine hyper-reactivity naturally.',
    conditions: [
      'Allergic Rhinitis (Morning Sneezing Fits)',
      'Bronchial Asthma & Exercise-Induced Wheezing',
      'Chronic Maxillary & Frontal Sinusitis',
      'Nasal Polyps & Post-Nasal Drip',
      'Recurrent Bronchitis & Wheezy Chest',
      'Dust, Pollen, Animal Dander & Weather Allergies'
    ],
    constitutionalApproach: 'Conventional medicine relies on daily antihistamines, nasal steroid sprays, and inhalers that mask airway spasm temporarily. Our constitutional treatment targets your mucosal immune defense. We identify whether temperature changes, cold drinks, damp weather, or emotional tension trigger your attacks, gently desensitizing the airway mucous membranes.',
    whyConventionalFails: 'Inhalers and antihistamines relax smooth muscle or block histamine receptors without fixing why the mast cells degranulate excessively in the first place, leaving patients inhaler-dependent for years.',
    typicalDuration: '2 to 5 months to systematically reduce inhaler frequency and prevent seasonal attacks.',
    symptomsTreated: [
      'Violent morning bouts of 15–20 sneezes',
      'Watery eyes, nose blockage, and post-nasal drip',
      'Night-time chest tightness and shortness of breath',
      'Sinus headaches, facial pressure, and loss of smell'
    ],
    clinicalHighlights: [
      'Gradual reduction in inhaler and nasal spray dependency',
      'Prevents progression from simple allergic rhinitis to full-blown asthma',
      'Excellent results in children with pollen and seasonal weather changes'
    ]
  },
  {
    id: 'digestive-gut-health',
    name: 'Gastrointestinal & Gut-Brain Health',
    category: 'digestive',
    badge: 'Restores Natural Digestive Harmony',
    shortDesc: 'Holistic healing for IBS, chronic hyperacidity, GERD, bloating, constipation, and ulcerative colitis by harmonizing gut motility and the gut-brain axis.',
    conditions: [
      'Irritable Bowel Syndrome (IBS-Diarrhea / IBS-Constipation)',
      'Gastroesophageal Reflux Disease (GERD) & Heartburn',
      'Chronic Hyperacidity, Waterbrash & Sour Belching',
      'Functional Dyspepsia, Flatulence & Bloating',
      'Chronic Habitual Constipation & Sluggish Bowels',
      'Mild-to-Moderate Ulcerative Colitis & Proctitis'
    ],
    constitutionalApproach: 'The human gastrointestinal tract is deeply intertwined with the nervous system (the enteric nervous system). Chronic acidity and erratic bowel movements often stem from autonomic imbalances, stress, and impaired digestive enzyme release. Homeopathy treats the whole digestive tract, relieving spasms, repairing the mucosal lining, and reducing nerve sensitivity.',
    whyConventionalFails: 'Long-term PPI (antacid) usage suppresses stomach acid production, leading to impaired B12/calcium absorption, SIBO, and rebound acid hypersecretion whenever medication is stopped.',
    typicalDuration: '2 to 4 months for stable digestion and discontinuation of habitual antacids.',
    symptomsTreated: [
      'Burning epigastric pain radiating to throat',
      'Urgent morning loose stools after waking or meals',
      'Abdominal distension, cramps, and painful gas trapping',
      'Feeling of incomplete evacuation and heaviness'
    ],
    clinicalHighlights: [
      'Breaks dependence on daily antacids and laxatives',
      'Alleviates stress-induced gut flares without psychiatric sedatives',
      'Comprehensive food tolerance restoration'
    ]
  },
  {
    id: 'hair-alopecia-scalp',
    name: 'Hair Loss, Alopecia & Scalp Disorders',
    category: 'skin-hair',
    badge: 'Autoimmune & Follicular Restoration',
    shortDesc: 'Clinically proven constitutional protocol to stop excessive hair shedding, reverse patchy Alopecia Areata, and cure chronic dandruff.',
    conditions: [
      'Alopecia Areata (Patchy Coin-Sized Bald Spots)',
      'Diffuse Telogen Effluvium (Post-Illness / Post-Stress Hair Loss)',
      'Androgenetic Alopecia (Early Hairline Receding & Thinning)',
      'Chronic Seborrheic Dermatitis & Stubborn Dandruff',
      'Folliculitis of the Scalp & Itchy Burning Lesions'
    ],
    constitutionalApproach: 'Hair follicles are responsive to systemic microcirculation, hormonal spikes (DHT, thyroid, cortisol), and autoimmune antibodies. Rather than artificial stimulants like Minoxidil (which causes massive shed upon cessation), constitutional homeopathy corrects the internal hormonal and autoimmune environment to naturally reactivate dormant hair roots.',
    whyConventionalFails: 'Minoxidil and steroid injections into the scalp provide short-term superficial stimulation without addressing the underlying autoimmune trigger or stress response, resulting in recurring patches.',
    typicalDuration: '3 to 6 months for new vellus hair growth in alopecia patches and significant reduction in daily hair fall.',
    symptomsTreated: [
      'Sudden smooth round bald patches on scalp or beard',
      'Losing clumps of hair while brushing or showering',
      'Greasy, yellow, itchy scales clinging to scalp hair roots',
      'Scalp hypersensitivity, tenderness, and burning sensation'
    ],
    clinicalHighlights: [
      'Zero minoxidil, zero chemical lotions, zero shedding rebounds',
      'Stimulates thick, pigmented, natural terminal hair regrowth',
      'Customized diet advice for keratin and iron assimilation'
    ]
  },
  {
    id: 'womens-health-pcod',
    name: "Women's Health & Hormonal Balance",
    category: 'mind-hormones',
    badge: 'Non-Synthetic Endocrine Rebalancing',
    shortDesc: 'Natural regulation of menstrual cycles, ovarian follicular maturation in PCOD/PCOS, thyroid optimization, and comfortable menopausal transition.',
    conditions: [
      'Polycystic Ovarian Disease / Syndrome (PCOD/PCOS)',
      'Irregular, Delayed, or Absent Menstrual Cycles (Amenorrhea)',
      'Subclinical Hypothyroidism & Hashimoto Thyroiditis',
      'Uterine Fibroids & Endometriosis Pain Management',
      'Severe Premenstrual Syndrome (PMS) & Dysmenorrhea',
      'Perimenopause Hot Flashes, Mood Swings & Insomnia'
    ],
    constitutionalApproach: 'The female hypothalamic-pituitary-ovarian (HPO) axis is sensitive to mental stress, metabolic changes, and emotional health. Instead of synthetic birth control pills that force an artificial withdrawal bleed, classical homeopathy stimulates the ovaries naturally, promoting spontaneous ovulation, reducing cyst size, and restoring metabolic balance.',
    whyConventionalFails: 'Oral contraceptive pills (OCPs) mask symptoms by providing synthetic hormones. Once stopped, cycles frequently become even more irregular, accompanied by weight gain, facial acne, and emotional lows.',
    typicalDuration: '4 to 8 months for regular natural 28-32 day menstrual cycles and ovarian ultrasound improvement.',
    symptomsTreated: [
      'Cycles delayed by 40 to 90+ days with heavy painful clotting',
      'Facial hirsutism, cystic jawline acne, and stubborn weight gain',
      'Debilitating lower abdominal cramps during menses',
      'Fatigue, cold intolerance, and mood fluctuations'
    ],
    clinicalHighlights: [
      'Zero synthetic hormones or birth control pills',
      'Aims for spontaneous, natural ovulation and improved fertility',
      'Balances thyroid antibodies and metabolic vitality'
    ]
  },
  {
    id: 'joint-arthritis-spine',
    name: 'Joint, Arthritis & Musculoskeletal Care',
    category: 'pain-joints',
    badge: 'Reduces Inflammation & Halts Degeneration',
    shortDesc: 'Gentle, effective relief from chronic joint stiffness, osteoarthritis cartilage wear, rheumatoid arthritis, cervical spondylitis, and sciatica nerve pain.',
    conditions: [
      'Osteoarthritis of Knees, Hips & Hands (Cartilage Wear)',
      'Rheumatoid Arthritis (Symmetric Joint Swelling & Morning Stiffness)',
      'Cervical & Lumbar Spondylosis (Disc Degeneration)',
      'Sciatica Nerve Pain & Radiating Leg Numbness',
      'Frozen Shoulder & Calcific Rotator Cuff Tendonitis',
      'High Uric Acid & Acute / Chronic Gouty Arthritis'
    ],
    constitutionalApproach: 'Degenerative joint disease and inflammatory arthropathies require holistic management that reduces synovial inflammation, strengthens periarticular ligaments, and prevents further structural damage. Homeopathic remedies relieve nerve compression and pain without causing the gastric ulcers or kidney strain associated with NSAID painkillers.',
    whyConventionalFails: 'Regular reliance on painkiller pills (NSAIDs) damages gastric lining and renal function, while cortisone joint injections weaken cartilage tissue over time.',
    typicalDuration: '2 to 5 months for significant improvement in joint mobility and walking distance.',
    symptomsTreated: [
      'Severe morning stiffness lasting more than 30–60 minutes',
      'Knee crepitus (cracking sounds), swelling, and difficulty climbing stairs',
      'Neck stiffness radiating shooting pain down the arm to fingers',
      'Sharp, electric sciatica pain running down the back of the leg'
    ],
    clinicalHighlights: [
      'Gentle on the stomach—causes zero acidity, gastritis, or kidney risk',
      'Enables reduction in daily painkiller tablets',
      'Preserves active independence and mobility for seniors'
    ]
  },
  {
    id: 'mind-stress-sleep',
    name: 'Mental Wellness, Stress & Sleep Health',
    category: 'mind-hormones',
    badge: 'Non-Sedative, Non-Addictive Emotional Care',
    shortDesc: 'Restorative constitutional healing for generalized anxiety, panic episodes, chronic work burnout, depressive moods, and persistent insomnia.',
    conditions: [
      'Generalized Anxiety Disorder (GAD) & Restlessness',
      'Panic Attacks, Palpitations & Claustrophobia',
      'Chronic Insomnia, Night-Waking & Non-Restorative Sleep',
      'Work Burnout, Chronic Fatigue & Mental Fog',
      'Exam Fear, Performance Anxiety & Social Phobia',
      'Mild-to-Moderate Depressive Episodes & Grief Trauma'
    ],
    constitutionalApproach: 'Homeopathy is renowned for understanding mental-emotional causation (ailments from grief, prolonged worry, financial stress, or suppressed anger). We select constitutional remedies aligned with your temperament, calming overactive sympathetic nervous pathways and restoring natural serotonin/melatonin rhythms without chemical sedation.',
    whyConventionalFails: 'Sedatives, sleeping pills, and SSRIs can cause daytime grogginess, emotional blunting, weight changes, and severe withdrawal symptoms upon attempted discontinuation.',
    typicalDuration: '1 to 3 months for calm mental clarity and deep, natural, unmedicated sleep.',
    symptomsTreated: [
      'Persistent racing thoughts, anticipatory fear, and muscle tension',
      'Sudden heart racing, breathlessness, and trembling hands in crowds',
      'Lying awake in bed for hours with hyperactive mental chatter',
      'Waking up tired, irritable, and mentally exhausted'
    ],
    clinicalHighlights: [
      'Non-habit-forming, non-sedating, zero morning grogginess',
      'Safe to take alongside existing medication under doctor supervision',
      'Helps you respond to daily life stressors with resilience and calm'
    ]
  },
  {
    id: 'pediatric-child-immunity',
    name: 'Pediatric Care & Child Immunity',
    category: 'pediatric',
    badge: 'Safe, Sweet Pills Loved by Children',
    shortDesc: 'Protect your child from repeated courses of antibiotics. Safe, natural strengthening for recurrent tonsillitis, adenoids, coughs, and digestive complaints.',
    conditions: [
      'Recurrent Tonsillitis & Adenoid Hypertrophy (Mouth Breathing)',
      'Frequent School-Age Colds, Coughs & Ear Infections (Otitis)',
      'Childhood Bronchial Asthma & Wheezing Tendencies',
      'Poor Appetite, Picky Eating & Failure to Thrive',
      'Dentition Fevers, Diarrhea & Irritability',
      'Skin Molluscum, Warts & Childhood Eczema'
    ],
    constitutionalApproach: 'Children respond quickly and profoundly to homeopathic remedies because their vital force is untainted by decades of chronic suppressions. Rather than putting growing children through multiple cycles of broad-spectrum antibiotics and surgical adenoidectomy, our sweet micro-pills build lifelong mucosal immunity naturally.',
    whyConventionalFails: 'Repeated antibiotic courses disrupt developing child gut microbiomes, weakening mucosal defenses and causing children to fall sick again within 2-3 weeks.',
    typicalDuration: '1 to 3 months to break the cycle of recurrent monthly fevers and colds.',
    symptomsTreated: [
      'Snoring, mouth breathing, and restless sleep from enlarged adenoids',
      'Swollen red tonsils causing painful swallowing and high fevers',
      'Catching a cold or cough with every minor temperature change',
      'Low stamina, slow weight gain, and poor resistance'
    ],
    clinicalHighlights: [
      'Naturally sweet tasting sugar globules—kids happily take them with zero tears',
      'Avoids invasive surgical removal of tonsils and adenoids in many cases',
      'Strengthens the child’s natural defense for healthy growth'
    ]
  }
];

