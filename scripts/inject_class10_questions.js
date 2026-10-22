const fs = require('fs');
const path = require('path');

const QUESTIONS_FILE = path.join(__dirname, '..', 'data', 'questions.json');
const allQuestions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8'));

// ─── MATHEMATICS (CBSE CLASS 10) ──────────────────────────────────────────────
const mathsQuestions = [
  {
    id: "q_c10_math_1",
    type: "mcq",
    text: "If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:",
    options: ["xy", "xy²", "x³y³", "x²y²"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_2",
    type: "mcq",
    text: "If one zero of the quadratic polynomial x² + 3x + k is 2, then the value of k is:",
    options: ["10", "-10", "-7", "-2"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_3",
    type: "mcq",
    text: "The pair of linear equations 2x + 3y = 5 and 4x + 6y = 15 represents two lines which are:",
    options: ["Intersecting at exactly one point", "Coincident", "Parallel (No solution)", "Perpendicular"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_4",
    type: "mcq",
    text: "The discriminant of the quadratic equation 2x² - 4x + 3 = 0 is:",
    options: ["-8", "8", "-40", "16"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_5",
    type: "mcq",
    text: "Which term of the AP: 21, 18, 15, ... is -81?",
    options: ["28th term", "34th term", "35th term", "36th term"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_6",
    type: "mcq",
    text: "The distance of the point P(-6, 8) from the origin (0, 0) is:",
    options: ["8 units", "2√7 units", "10 units", "6 units"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_7",
    type: "mcq",
    text: "If ΔABC ~ ΔPQR with BC/QR = 1/3, then Area(ΔPRQ) / Area(ΔBCA) is equal to:",
    options: ["9", "3", "1/3", "1/9"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_8",
    type: "mcq",
    text: "If tan θ = 4/3, then (sin θ + cos θ) is equal to:",
    options: ["7/3", "7/4", "7/5", "5/7"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_9",
    type: "mcq",
    text: "The value of (sin² 30° + cos² 30°) + (sec² 45° - tan² 45°) is:",
    options: ["1", "2", "3", "0"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_10",
    type: "mcq",
    text: "From an external point P, tangents PA and PB are drawn to a circle with centre O. If ∠APB = 80°, then ∠POA is equal to:",
    options: ["50°", "60°", "70°", "80°"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_11",
    type: "mcq",
    text: "If the perimeter and the area of a circle are numerically equal, then the radius of the circle is:",
    options: ["2 units", "π units", "4 units", "7 units"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_12",
    type: "mcq",
    text: "For a frequency distribution, if Mean = 28 and Median = 26, then the Mode is approximately:",
    options: ["22", "24", "25", "30"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_13",
    type: "mcq",
    text: "Which of the following cannot be the probability of an event?",
    options: ["2/3", "-1.5", "15%", "0.7"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_14",
    type: "mcq",
    text: "A card is drawn from a well-shuffled deck of 52 playing cards. The probability of getting a black face card is:",
    options: ["3/13", "3/26", "1/26", "3/52"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_math_15",
    type: "mcq",
    text: "Assertion (A): The HCF of two numbers is 5 and their product is 150, then their LCM is 30.\nReason (R): For any two positive integers a and b, HCF(a, b) × LCM(a, b) = a × b.",
    options: [
      "Both (A) and (R) are true and (R) is the correct explanation of (A).",
      "Both (A) and (R) are true but (R) is not the correct explanation of (A).",
      "(A) is true but (R) is false.",
      "(A) is false but (R) is true."
    ],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  }
];

// ─── SCIENCE (CBSE CLASS 10) ──────────────────────────────────────────────────
const scienceQuestions = [
  {
    id: "q_c10_sci_1",
    type: "mcq",
    text: "When aqueous solutions of potassium iodide and lead nitrate are mixed, an insoluble precipitate is formed. What is the chemical formula and colour of this precipitate?",
    options: ["KNO₃, White", "PbI₂, Yellow", "Pb(NO₃)₂, Yellow", "KI, White"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_2",
    type: "mcq",
    text: "Which gas is evolved when dilute hydrochloric acid reacts with an active metal such as zinc?",
    options: ["Oxygen (O₂)", "Hydrogen (H₂)", "Carbon dioxide (CO₂)", "Chlorine (Cl₂)"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_3",
    type: "mcq",
    text: "Baking soda is a mixture of sodium hydrogen carbonate and a mild edible acid such as:",
    options: ["Tartaric acid", "Hydrochloric acid", "Acetic acid", "Sulphuric acid"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_4",
    type: "mcq",
    text: "Which of the following non-metals is a liquid at room temperature?",
    options: ["Mercury", "Bromine", "Iodine", "Chlorine"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_5",
    type: "mcq",
    text: "In the human digestive system, the enzyme Pepsin requires which medium to act efficiently upon dietary proteins?",
    options: ["Strongly alkaline", "Neutral", "Acidic (pH ~ 1.5 - 2)", "Slightly basic"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_6",
    type: "mcq",
    text: "The breakdown of pyruvate into carbon dioxide, water, and energy takes place in which cellular organelle?",
    options: ["Cytoplasm", "Mitochondria", "Chloroplast", "Nucleus"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_7",
    type: "mcq",
    text: "Which plant hormone is primarily responsible for promoting cell division and is present in greater concentration in fruits and seeds?",
    options: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_8",
    type: "mcq",
    text: "A Mendelian dihybrid cross between round-yellow (RRYY) and wrinkled-green (rryy) pea plants produces an F2 phenotypic ratio of:",
    options: ["3:1", "9:3:3:1", "1:2:1", "9:7"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_9",
    type: "mcq",
    text: "An object is placed at a distance of 20 cm in front of a concave mirror of focal length 15 cm. The nature of the image formed is:",
    options: ["Virtual and erect", "Real, inverted and magnified", "Real, inverted and diminished", "Virtual and diminished"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_10",
    type: "mcq",
    text: "The power of a lens is -2.0 D. Its focal length and lens type are:",
    options: ["-50 cm, Convex lens", "-50 cm, Concave lens", "+50 cm, Concave lens", "+20 cm, Convex lens"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_11",
    type: "mcq",
    text: "The clear blue appearance of the daytime sky is due to which optical phenomenon?",
    options: ["Atmospheric refraction", "Total internal reflection", "Scattering of light (Rayleigh scattering)", "Dispersion of light"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_12",
    type: "mcq",
    text: "Three resistors of resistances 2 Ω, 3 Ω, and 6 Ω are connected in parallel. Their equivalent resistance is:",
    options: ["11 Ω", "1 Ω", "2 Ω", "0.5 Ω"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_13",
    type: "mcq",
    text: "The magnetic field inside a long straight solenoid carrying current is:",
    options: ["Zero", "Decreases as we move towards its ends", "Increases as we move towards its ends", "Is uniform at all points"],
    correctAnswer: 3,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_14",
    type: "mcq",
    text: "According to Lindeman's 10% law of energy transfer in an ecosystem, if 10,000 J of energy is available to producers, how much energy is transferred to secondary consumers?",
    options: ["1,000 J", "100 J", "10 J", "1 J"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sci_15",
    type: "mcq",
    text: "Assertion (A): Silver chloride turns grey when exposed to sunlight.\nReason (R): Decomposition of silver chloride into silver and chlorine occurs in the presence of sunlight (photolytic decomposition).",
    options: [
      "Both (A) and (R) are true and (R) is the correct explanation of (A).",
      "Both (A) and (R) are true but (R) is not the correct explanation of (A).",
      "(A) is true but (R) is false.",
      "(A) is false but (R) is true."
    ],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  }
];

// ─── SOCIAL SCIENCE (CBSE CLASS 10) ───────────────────────────────────────────
const sstQuestions = [
  {
    id: "q_c10_sst_1",
    type: "mcq",
    text: "Who was proclaimed the German Emperor in a ceremony held at the Hall of Mirrors in Versailles in January 1871?",
    options: ["Kaiser William I", "Otto von Bismarck", "Giuseppe Garibaldi", "Count Cavour"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_2",
    type: "mcq",
    text: "Why did Mahatma Gandhi decide to withdraw the Non-Cooperation Movement in February 1922?",
    options: ["Jallianwala Bagh incident", "Chauri Chaura violent clash", "Rowlatt Act passage", "Simon Commission arrival"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_3",
    type: "mcq",
    text: "Which of the following treaties recognised Greece as an independent nation in 1832?",
    options: ["Treaty of Vienna (1815)", "Treaty of Constantinople (1832)", "Treaty of Versailles (1919)", "Act of Union (1707)"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_4",
    type: "mcq",
    text: "Black soil, also known as Regur soil, is ideal for growing which major commercial crop?",
    options: ["Tea", "Cotton", "Wheat", "Jute"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_5",
    type: "mcq",
    text: "Which multipurpose river valley project is built across the Satluj-Beas river basin in Northern India?",
    options: ["Bhakra-Nangal Project", "Hirakud Project", "Tehri Dam Project", "Sardar Sarovar Project"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_6",
    type: "mcq",
    text: "Which of the following is a non-metallic mineral and considered indispensable for the electrical and electronic industry due to its insulating properties?",
    options: ["Bauxite", "Mica", "Copper", "Limestone"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_7",
    type: "mcq",
    text: "In Belgium, power sharing was achieved peacefully by accommodating linguistic groups. What was the major ethnic division in Belgium?",
    options: [
      "Dutch-speaking (59%) in Flemish region and French-speaking (40%) in Wallonia",
      "German-speaking (80%) and French-speaking (20%)",
      "Sinhalese (74%) and Sri Lankan Tamils (18%)",
      "English-speaking and Dutch-speaking"
    ],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_8",
    type: "mcq",
    text: "Subjects like Defence, Foreign Affairs, Banking, and Currency are included in which list of the Indian Constitution?",
    options: ["State List", "Union List", "Concurrent List", "Residuary Powers"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_9",
    type: "mcq",
    text: "A political party that secures at least 6% of the total votes in Lok Sabha elections or Assembly elections in 4 states and wins at least 4 seats in the Lok Sabha is recognized as a:",
    options: ["Regional Party", "National Party", "State Party", "Independent Coalition"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_10",
    type: "mcq",
    text: "According to the World Development Report published by the World Bank, countries are classified as rich or low-income based primarily on which criterion?",
    options: ["Gross Domestic Product (GDP)", "Per Capita Income (PCI)", "Human Development Index (HDI)", "Literacy Rate"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_11",
    type: "mcq",
    text: "Which sector of the Indian economy generates the maximum share of employment while contributing a lower percentage to GDP?",
    options: ["Primary Sector (Agriculture)", "Secondary Sector (Manufacturing)", "Tertiary Sector (Services)", "IT Sector"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_12",
    type: "mcq",
    text: "In India, which formal agency supervises the functioning of formal sources of loans and issues currency notes on behalf of the Central Government?",
    options: ["State Bank of India (SBI)", "Reserve Bank of India (RBI)", "Ministry of Finance", "NITI Aayog"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_13",
    type: "mcq",
    text: "Which international organisation aims to liberalise international trade and establish rules regarding trade between nations?",
    options: ["World Bank", "International Monetary Fund (IMF)", "World Trade Organization (WTO)", "United Nations Development Programme (UNDP)"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_14",
    type: "mcq",
    text: "The famous slogan 'Swaraj is my birthright and I shall have it' was declared by which nationalist leader?",
    options: ["Bal Gangadhar Tilak", "Lala Lajpat Rai", "Bipin Chandra Pal", "Subhash Chandra Bose"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_sst_15",
    type: "mcq",
    text: "Assertion (A): Democracy produces an accountable, responsive, and legitimate government.\nReason (R): Democratic governments are based on the idea of deliberation and negotiation, and citizens have the right to choose their rulers.",
    options: [
      "Both (A) and (R) are true and (R) is the correct explanation of (A).",
      "Both (A) and (R) are true but (R) is not the correct explanation of (A).",
      "(A) is true but (R) is false.",
      "(A) is false but (R) is true."
    ],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  }
];

// ─── ENGLISH LANGUAGE & LITERATURE (CBSE CLASS 10) ───────────────────────────
const englishQuestions = [
  {
    id: "q_c10_eng_1",
    type: "mcq",
    text: "In 'A Letter to God', why did Lencho describe the falling raindrops as 'new coins'?",
    options: [
      "Because they were shiny like silver coins",
      "Because good rains promised a bountiful harvest and prosperity",
      "Because coins were literally dropping from clouds",
      "Because he wanted to buy a new tractor"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_2",
    type: "mcq",
    text: "According to Nelson Mandela in 'Long Walk to Freedom', what does true 'courage' mean?",
    options: [
      "The complete absence of fear",
      "The triumph over fear",
      "Physical strength and aggression",
      "Never taking risks"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_3",
    type: "mcq",
    text: "In the poem 'Dust of Snow' by Robert Frost, what simple incident changed the poet's mood?",
    options: [
      "The warm rays of the morning sun",
      "A crow shaking down dust of snow from a hemlock tree",
      "A robin singing melodiously",
      "The sight of blooming roses in winter"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_4",
    type: "mcq",
    text: "In 'A Triumph of Surgery', what was the real cure administered by Dr. Herriot to Tricki?",
    options: [
      "Major surgery on the stomach",
      "Heavy dosage of tonics and cod-liver oil",
      "No food for two days, plenty of water, and natural exercise with other dogs",
      "Complete bed rest in an air-conditioned room"
    ],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_5",
    type: "mcq",
    text: "In 'The Thief's Story', what changed Hari Singh's heart and made him return the stolen money to Anil?",
    options: [
      "Fear of being caught by the police",
      "Anil's trust and the desire to learn to read and write whole sentences",
      "The sudden rain that spoiled the notes",
      "He missed the train to Lucknow"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_6",
    type: "mcq",
    text: "Fill in the blank by choosing the correct modal verb: 'You _______ wear a helmet while riding a two-wheeler; it is legally mandatory.'",
    options: ["may", "must", "might", "could"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_7",
    type: "mcq",
    text: "Select the option that identifies the error and supplies the correction for the sentence: 'Each of the participants were given a certificate of merit.'",
    options: [
      "Error: participants | Correction: participant",
      "Error: were | Correction: was",
      "Error: given | Correction: gave",
      "Error: of | Correction: for"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_8",
    type: "mcq",
    text: "Report the dialogue between teacher and student:\nTeacher: 'Have you submitted your assignment?'\nStudent: 'I will submit it tomorrow, Sir.'\nThe student replied that he _______.",
    options: [
      "will submit it the next day",
      "would submit it the next day",
      "would submit it tomorrow",
      "submits it next day"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_9",
    type: "mcq",
    text: "In 'From the Diary of Anne Frank', why did Mr. Keesing assign Anne the essay 'A Chatterbox'?",
    options: [
      "Because she failed her math test",
      "Because she talked too much during class lectures",
      "Because she was absent for three days",
      "Because she was good at writing humorous stories"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_10",
    type: "mcq",
    text: "In the poem 'Fire and Ice', what do 'Fire' and 'Ice' metaphorically represent respectively?",
    options: [
      "Anger and Happiness",
      "Desire/Lust and Hatred/Cold indifference",
      "Love and Passion",
      "Destruction and Rebirth"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_11",
    type: "mcq",
    text: "Fill in the blank with the correct form of the verb: 'Neither the teacher nor the students _______ present in the laboratory yesterday.'",
    options: ["was", "were", "is", "are"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_12",
    type: "mcq",
    text: "In 'The Necklace', what tragic irony is revealed at the climax of the story by Madame Forestier?",
    options: [
      "The lost necklace was actually made of imitation stones worth only 500 francs",
      "The necklace was never lost; it was inside the cab",
      "The diamond necklace was stolen by Matilda's maid",
      "Madame Forestier had already bought a replacement"
    ],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_13",
    type: "mcq",
    text: "What poetic device is used in the line: 'The silence is golden, the freedom is sweet' (Amanda)?",
    options: ["Metaphor", "Simile", "Oxymoron", "Onomatopoeia"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_14",
    type: "mcq",
    text: "In a formal Letter to the Editor, which subscription sign-off is most appropriate and standard?",
    options: ["Yours affectionately", "Yours faithfully / Yours truly", "Your loving friend", "With best regards always"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_eng_15",
    type: "mcq",
    text: "Assertion (A): Bholi rejected Bishamber at the marriage altar and threw the garland into the sacred fire.\nReason (R): Bishamber was a greedy, contemptible man who demanded 5,000 rupees dowry because of Bholi's pockmarks.",
    options: [
      "Both (A) and (R) are true and (R) is the correct explanation of (A).",
      "Both (A) and (R) are true but (R) is not the correct explanation of (A).",
      "(A) is true but (R) is false.",
      "(A) is false but (R) is true."
    ],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  }
];

// ─── HINDI COURSE-A (CBSE CLASS 10) ──────────────────────────────────────────
const hindiQuestions = [
  {
    id: "q_c10_hin_1",
    type: "mcq",
    text: "'दशरथ के पुत्र राम ने रावण का वध किया।' इस वाक्य में रेखांकित पदबंध 'दशरथ के पुत्र राम' किस प्रकार का पदबंध है?",
    options: ["संज्ञा पदबंध", "विशेषण पदबंध", "क्रिया पदबंध", "क्रियाविशेषण पदबंध"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_2",
    type: "mcq",
    text: "'जब वर्षा रुकी, तब हम सब विद्यालय गए।' रचना की दृष्टि से यह वाक्य किस भेद के अंतर्गत आता है?",
    options: ["सरल वाक्य", "संयुक्त वाक्य", "मिश्र वाक्य", "आज्ञावाचक वाक्य"],
    correctAnswer: 2,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_3",
    type: "mcq",
    text: "'यथाशक्ति' शब्द में कौन सा समास है?",
    options: ["तत्पुरुष समास", "अव्ययीभाव समास", "द्विगु समास", "द्वंद्व समास"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_4",
    type: "mcq",
    text: "'नीलकंठ' (नीला है कंठ जिसका अर्थात् शिव) में कौन सा समास है?",
    options: ["कर्मधारय समास", "बहुव्रीहि समास", "द्विगु समास", "तत्पुरुष समास"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_5",
    type: "mcq",
    text: "'आँखों का तारा होना' मुहावरे का सही अर्थ क्या है?",
    options: ["बहुत प्रिय होना", "आँखों में दर्द होना", "दूर की वस्तु न दिखना", "घमंड में चूर होना"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_6",
    type: "mcq",
    text: "'नेताजी का चश्मा' पाठ के लेखक स्वयं प्रकाश के अनुसार, कैप्टन कौन था?",
    options: ["एक सेना का सेवानिवृत्त फौजी", "एक गरीब लँगड़ा चश्मे बेचने वाला देशभक्त", "कस्बे का नगरपालिका अध्यक्ष", "पानवाला"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_7",
    type: "mcq",
    text: "'बालगोबिन भगत' पाठ में बालगोबिन भगत किसके आदर्शों और गीतों पर चलते थे?",
    options: ["तुलसीदास", "कबीरदास", "सूरदास", "मीराबाई"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_8",
    type: "mcq",
    text: "'लखनवी अंदाज़' पाठ में लेखक यशपाल ने किस वर्ग पर व्यंग्य किया है?",
    options: ["पतनशील सामंती और दिखावटी नवाब वर्ग पर", "मजदूर वर्ग पर", "राजनीतिज्ञों पर", "व्यापारियों पर"],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_9",
    type: "mcq",
    text: "सूरदास के पद में गोपियों ने 'बड़भागी' (भाग्यशाली) कहकर किस पर व्यंग्य किया है?",
    options: ["श्रीकृष्ण पर", "उद्धव पर", "बलराम पर", "नंद बाबा पर"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_10",
    type: "mcq",
    text: "'राम-लक्ष्मण-परशुराम संवाद' में परशुराम जी के क्रोध का मुख्य कारण क्या था?",
    options: [
      "राजा जनक द्वारा उनका सत्कार न किया जाना",
      "शिवजी के धनुष का खंडन होना",
      "लक्ष्मण द्वारा कटु वचन कहना",
      "सीता स्वयंवर में आमंत्रित न किया जाना"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_11",
    type: "mcq",
    text: "'उत्साह' कविता में कवि सूर्यकांत त्रिपाठी 'निराला' ने बादलों को किसका प्रतीक माना है?",
    options: ["विनाश का", "क्रान्ति, नवचेतना और पौरुष का", "केवल वर्षा और जल का", "उदासी का"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_12",
    type: "mcq",
    text: "'माता का अँचल' पाठ में बच्चे अंततः विपत्ति आने पर किसके आँचल में शरण लेते हैं?",
    options: ["बाबूजी की गोद में", "माता के प्रेम और ममतामयी आँचल में", "मित्रों के समूह में", "घर के कमरे में"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_13",
    type: "mcq",
    text: "'जॉर्ज पंचम की नाक' व्यंग्यात्मक कहानी में मुख्य चिंता किस बात को लेकर दर्शाई गई है?",
    options: [
      "मूर्तिकार की गरीबी",
      "औपनिवेशिक मानसिकता और नाक (प्रतिष्ठा) बचाने की अंधी होड़",
      "दिल्ली की सड़कों की मरम्मत",
      "रानी एलिजाबेथ के सूट का रंग"
    ],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_14",
    type: "mcq",
    text: "'दिए गए विकल्पों में से 'अंगूठा दिखाना' मुहावरे का उपयुक्त अर्थ क्या है?",
    options: ["सांत्वना देना", "ऐन वक्त पर मना कर देना या धोखा देना", "मदद करना", "शाबाशी देना"],
    correctAnswer: 1,
    marks: 1,
    timeLimit: 30
  },
  {
    id: "q_c10_hin_15",
    type: "mcq",
    text: "कथन (A): गोपियों ने उद्धव के योग संदेश को 'कड़वी ककड़ी' के समान बताया।\nकारण (R): गोपियाँ श्रीकृष्ण के अनन्य प्रेम में लीन थीं और निर्गुण ज्ञान उनके विरह को और बढ़ा रहा था।",
    options: [
      "कथन (A) और कारण (R) दोनों सही हैं और कारण (R) कथन (A) की सही व्याख्या करता है।",
      "कथन (A) और कारण (R) दोनों सही हैं लेकिन (R) सही व्याख्या नहीं करता।",
      "कथन (A) सही है लेकिन कारण (R) गलत है।",
      "कथन (A) गलत है लेकिन कारण (R) सही है।"
    ],
    correctAnswer: 0,
    marks: 1,
    timeLimit: 30
  }
];

// Helper to register question sets for both standard names and aliases
function setQuestionPair(subjectNames, questions) {
  subjectNames.forEach(sub => {
    allQuestions[`Class 10_${sub}`] = questions;
    allQuestions[`Class 10_${sub}_Class Test`] = questions;
    allQuestions[`Class 10_${sub}_Mock Test`] = questions;
    allQuestions[`Class 10_${sub}_PT-1`] = questions;
  });
}

setQuestionPair(["Mathematics", "Maths"], mathsQuestions);
setQuestionPair(["Science"], scienceQuestions);
setQuestionPair(["Social Science", "SST"], sstQuestions);
setQuestionPair(["English Language & Literature", "English"], englishQuestions);
setQuestionPair(["Hindi Course-A", "Hindi"], hindiQuestions);

fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(allQuestions, null, 2), 'utf8');
console.log('Successfully injected Class 10 authentic CBSE Mock Tests & Question Banks into questions.json!');
console.log('Maths:', mathsQuestions.length, 'questions');
console.log('Science:', scienceQuestions.length, 'questions');
console.log('Social Science:', sstQuestions.length, 'questions');
console.log('English:', englishQuestions.length, 'questions');
console.log('Hindi:', hindiQuestions.length, 'questions');
