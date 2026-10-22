/**
 * Study Material, Guide Books & Class 10th Board Exam Preparation Repository
 * Covers Class 1 to 12th school subjects with deep focus on Class 10th CBSE Board Exams.
 */

const CLASS_10_BOARD_HUB = {
  meta: {
    title: "Class 10th CBSE Board Exam Preparation Hub (Session 2025-2026)",
    description: "Complete chapter-wise notes, portion weightage, topper strategies, and full sample papers with solutions for all Class 10 subjects.",
    lastUpdated: "Session 2025-2026",
    school: "OXFORD CONVENT SCHOOL SASARAM"
  },
  subjects: {
    mathematics: {
      id: "mathematics",
      name: "Mathematics (Standard & Basic)",
      code: "041 / 241",
      icon: "📐",
      color: "#3b82f6",
      portion: {
        totalMarks: 80,
        internalAssessment: 20,
        timeAllowed: "3 Hours",
        units: [
          { unit: "I. Number Systems", chapters: "Real Numbers", weightage: "06 Marks" },
          { unit: "II. Algebra", chapters: "Polynomials, Pair of Linear Equations in Two Variables, Quadratic Equations, Arithmetic Progressions", weightage: "20 Marks" },
          { unit: "III. Coordinate Geometry", chapters: "Coordinate Geometry (Distance & Section Formula)", weightage: "06 Marks" },
          { unit: "IV. Geometry", chapters: "Triangles (BPT Theorem Proof), Circles (Tangent Theorems)", weightage: "15 Marks" },
          { unit: "V. Trigonometry", chapters: "Introduction to Trigonometry, Trigonometric Identities, Heights and Distances", weightage: "12 Marks" },
          { unit: "VI. Mensuration", chapters: "Areas Related to Circles, Surface Areas and Volumes", weightage: "10 Marks" },
          { unit: "VII. Statistics & Probability", chapters: "Mean, Median, Mode (Grouped Data), Classical Probability", weightage: "11 Marks" }
        ],
        paperPattern: [
          "Section A: 20 Multiple Choice Questions (MCQs) of 1 mark each (including 2 Assertion-Reason).",
          "Section B: 5 Very Short Answer (VSA) questions of 2 marks each.",
          "Section C: 6 Short Answer (SA) questions of 3 marks each.",
          "Section D: 4 Long Answer (LA) questions of 5 marks each (with internal choices).",
          "Section E: 3 Source-Based / Case-Based integrated units of assessment (4 marks each)."
        ]
      },
      notes: [
        {
          chapter: "1. Real Numbers",
          points: [
            "Fundamental Theorem of Arithmetic: Every composite number can be expressed uniquely as a product of primes, apart from the order of prime factors.",
            "HCF × LCM = Product of two numbers: HCF(a, b) × LCM(a, b) = a × b (Valid strictly for 2 positive integers).",
            "Proof of Irrationality: To prove √2, √3, or √5 is irrational, use proof by contradiction: Assume √p = a/b (where a, b are coprime). Squaring both sides gives p*b² = a², proving p divides a, and eventually p divides both a and b, which contradicts the coprime assumption."
          ]
        },
        {
          chapter: "2. Polynomials & Quadratic Equations",
          points: [
            "Relationship between zeroes and coefficients for quadratic polynomial ax² + bx + c: Sum of zeroes (α + β) = -b/a, Product of zeroes (αβ) = c/a.",
            "Standard Quadratic Equation: ax² + bx + c = 0 (a ≠ 0).",
            "Quadratic Formula (Shridhara Acharya): x = [-b ± √(b² - 4ac)] / (2a).",
            "Nature of Roots from Discriminant (D = b² - 4ac): If D > 0: two distinct real roots; If D = 0: two equal real roots (-b/2a); If D < 0: no real roots."
          ]
        },
        {
          chapter: "3. Arithmetic Progressions (AP)",
          points: [
            "General term: aₙ = a + (n - 1)d, where a = first term, d = common difference (a₂ - a₁).",
            "Sum of first n terms: Sₙ = (n/2)[2a + (n - 1)d] = (n/2)[a + l], where l is the last term.",
            "Key identity: aₙ = Sₙ - Sₙ₋₁."
          ]
        },
        {
          chapter: "4. Geometry & Circles",
          points: [
            "Basic Proportionality Theorem (Thales Theorem): If a line is drawn parallel to one side of a triangle intersecting other two sides, it divides both sides in the same ratio. (Proof must be practiced).",
            "Tangent to a Circle Theorem 1: The tangent at any point of a circle is perpendicular to the radius through the point of contact (OP ⊥ AB).",
            "Tangent to a Circle Theorem 2: The lengths of tangents drawn from an external point to a circle are equal (PQ = PR)."
          ]
        },
        {
          chapter: "5. Trigonometry & Heights",
          points: [
            "Standard values: sin 0°=0, sin 30°=1/2, sin 45°=1/√2, sin 60°=√3/2, sin 90°=1. (cos values are reverse order).",
            "Core Pythagorean Identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ.",
            "Angle of Elevation: Looking upward from horizontal; Angle of Depression: Looking downward. Always draw a neat labelled right triangle diagram."
          ]
        },
        {
          chapter: "6. Statistics & Probability",
          points: [
            "Mean of grouped data: Direct method = Σ(fᵢxᵢ) / Σfᵢ; Assumed mean method = a + [Σ(fᵢdᵢ) / Σfᵢ].",
            "Mode = l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] × h.",
            "Median = l + [((n/2) - cf) / f] × h.",
            "Empirical Relationship: 3 Median = Mode + 2 Mean.",
            "Probability of event E: P(E) = (Number of favourable outcomes) / (Total possible outcomes). Note: 0 ≤ P(E) ≤ 1 and P(E) + P(not E) = 1."
          ]
        }
      ],
      strategy: [
        "15-Minute Reading Time: Do NOT start solving immediately. Mark the questions you are 100% confident in. Choose your internal options in Section C & D right away.",
        "Step-Marking Rule: Even if the final answer calculation is wrong, correct formula and neat steps fetch 75% to 80% marks. Never leave any question blank.",
        "Rough Work Column: Draw a neat vertical margin on the right side of every answer page for calculations. Avoid messy cancellations in main steps.",
        "Time Allocation Plan: Section A (20 MCQs) - 30 mins; Section B (5 VSA) - 20 mins; Section C (6 SA) - 40 mins; Section D (4 LA) - 50 mins; Section E (3 Case Study) - 25 mins; Revision - 15 mins."
      ],
      samplePaper: {
        title: "CBSE Class 10 Mathematics Board Model Question Paper (2025-2026)",
        maxMarks: 80,
        time: "3 Hours",
        questions: [
          {
            section: "Section A (1 Mark Each)",
            q: "1. If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:",
            solution: "Answer: xy² (Because HCF takes the smallest power of each common prime factor: x¹ and y²)."
          },
          {
            section: "Section A (1 Mark Each)",
            q: "2. If the discriminant of the equation 2x² - 4x + k = 0 is zero, what is the value of k?",
            solution: "Answer: k = 2. Solution: D = b² - 4ac = (-4)² - 4(2)(k) = 16 - 8k = 0 ⇒ 8k = 16 ⇒ k = 2."
          },
          {
            section: "Section B (2 Marks Each)",
            q: "3. Prove that √5 is an irrational number.",
            solution: "Solution: Let √5 = a/b (where a, b are coprime integers, b ≠ 0). 5b² = a² ⇒ 5 divides a² ⇒ 5 divides a. Let a = 5c. 5b² = 25c² ⇒ b² = 5c² ⇒ 5 divides b. Thus 5 is a common factor of a and b, contradicting that a and b are coprime. Hence √5 is irrational. (Q.E.D.)"
          },
          {
            section: "Section C (3 Marks Each)",
            q: "4. If α and β are the zeroes of the quadratic polynomial f(x) = x² - 5x + k such that α - β = 1, find the value of k.",
            solution: "Solution: α + β = -(-5)/1 = 5, αβ = k. We know (α - β)² = (α + β)² - 4αβ ⇒ 1² = 5² - 4k ⇒ 1 = 25 - 4k ⇒ 4k = 24 ⇒ k = 6."
          },
          {
            section: "Section D (5 Marks Each)",
            q: "5. State and prove Basic Proportionality Theorem (Thales Theorem).",
            solution: "Statement: If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.\nProof: Draw ΔABC with DE || BC. Join BE and CD. Draw DM ⊥ AC and EN ⊥ AB.\nArea(ΔADE) = 1/2 × AD × EN.\nArea(ΔBDE) = 1/2 × DB × EN.\nRatio: Area(ΔADE) / Area(ΔBDE) = AD / DB ... (1)\nSimilarly: Area(ΔADE) / Area(ΔCDE) = AE / EC ... (2)\nSince ΔBDE and ΔCDE lie on same base DE and between same parallels DE and BC, Area(ΔBDE) = Area(ΔCDE).\nHence from (1) and (2): AD / DB = AE / EC. (Hence Proved)."
          }
        ]
      }
    },

    science: {
      id: "science",
      name: "Science (Physics, Chemistry, Biology)",
      code: "086",
      icon: "🔬",
      color: "#10b981",
      portion: {
        totalMarks: 80,
        internalAssessment: 20,
        timeAllowed: "3 Hours",
        units: [
          { unit: "Unit I: Chemical Substances - Nature and Behaviour", chapters: "Chemical Reactions, Acids Bases & Salts, Metals & Non-metals, Carbon and its Compounds", weightage: "25 Marks" },
          { unit: "Unit II: World of Living (Biology)", chapters: "Life Processes, Control and Coordination, How do Organisms Reproduce?, Heredity and Evolution", weightage: "25 Marks" },
          { unit: "Unit III: Natural Phenomena (Physics)", chapters: "Light - Reflection and Refraction, The Human Eye and the Colourful World", weightage: "12 Marks" },
          { unit: "Unit IV: Effects of Current (Physics)", chapters: "Electricity, Magnetic Effects of Electric Current", weightage: "13 Marks" },
          { unit: "Unit V: Natural Resources", chapters: "Our Environment (Food Chains, Biomagnification, Ozone Layer Depletion)", weightage: "05 Marks" }
        ],
        paperPattern: [
          "Section A: 20 Objective Type Questions (including MCQs and Assertion-Reason) (1 mark each).",
          "Section B: 6 Short Answer Questions Type-I (2 marks each).",
          "Section C: 7 Short Answer Questions Type-II (3 marks each).",
          "Section D: 3 Long Answer Questions (5 marks each).",
          "Section E: 3 Source-Based / Case-Based units of assessment (4 marks each)."
        ]
      },
      notes: [
        {
          chapter: "1. Chemistry - Chemical Reactions & Equations",
          points: [
            "Combination Reaction: Two or more reactants combine to form a single product. Example: CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat (Slaked lime formation).",
            "Decomposition Reaction: A single reactant breaks down into two or more simpler products. Thermal: 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃. Electrolytic: 2H₂O → 2H₂ + O₂. Photolytic: 2AgCl(s) → 2Ag(s) + Cl₂(g) (Used in black & white photography).",
            "Displacement & Double Displacement: Fe + CuSO₄ → FeSO₄ + Cu (Blue to green). Precipitation: Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) (white ppt) + 2NaCl(aq).",
            "Redox Reaction: Oxidation is gain of oxygen or loss of hydrogen. Reduction is loss of oxygen or gain of hydrogen. In CuO + H₂ → Cu + H₂O, CuO is reduced to Cu, and H₂ is oxidized to H₂O."
          ]
        },
        {
          chapter: "2. Chemistry - Acids, Bases, Salts & Carbon Compounds",
          points: [
            "pH Scale: Acidic < 7, Neutral = 7, Basic > 7. Antacids like Mg(OH)₂ neutralize stomach acidity.",
            "Important Salts: Bleaching Powder (CaOCl₂), Baking Soda (NaHCO₃), Washing Soda (Na₂CO₃·10H₂O), Plaster of Paris (CaSO₄·½H₂O formed by heating gypsum at 373 K).",
            "Carbon's Versatile Nature: Catenation (self-linking) and Tetravalency.",
            "Saponification Reaction: Alkaline hydrolysis of esters produces soap. Ester + NaOH → Soap (Sodium salt of fatty acid) + Alcohol.",
            "Cleansing Action of Soap: Soap molecule has hydrophilic head (ionic) and hydrophobic tail (hydrocarbon). Dirt is trapped in the center of the micelle."
          ]
        },
        {
          chapter: "3. Biology - Life Processes & Reproduction",
          points: [
            "Photosynthesis equation: 6CO₂ + 12H₂O + Sunlight + Chlorophyll → C₆H₁₂O₆ + 6O₂ + 6H₂O.",
            "Respiration: Breakdown of glucose into pyruvate in cytoplasm. Aerobic gives 38 ATP + CO₂ + H₂O in mitochondria; Anaerobic in muscle gives Lactic acid + 2 ATP (causes cramps).",
            "Human Heart: Double circulation (Pulmonary and Systemic circulation) prevents mixing of oxygenated and deoxygenated blood.",
            "Excretion: Nephron is structural and functional unit of kidney. Involves Glomerular Filtration, Selective Tubular Reabsorption (glucose, amino acids), and Secretion.",
            "Mendel's Laws: Monohybrid phenotypic ratio = 3:1 (Genotypic 1:2:1); Dihybrid phenotypic ratio = 9:3:3:1."
          ]
        },
        {
          chapter: "4. Physics - Light & Electricity",
          points: [
            "Mirror Formula: 1/f = 1/v + 1/u; Magnification m = -v/u = h'/h.",
            "Lens Formula: 1/f = 1/v - 1/u; Magnification m = +v/u = h'/h. Power of lens P = 1/f (in metres), unit Dioptre (D).",
            "Ohm's Law: V = IR at constant temperature.",
            "Resistance Formula: R = ρ(l / A), where ρ is resistivity (depends only on material and temperature, independent of length or area).",
            "Combination of Resistors: Series: Rₛ = R₁ + R₂ + R₃; Parallel: 1/Rₚ = 1/R₁ + 1/R₂ + 1/R₃.",
            "Joule's Law of Heating: H = I²Rt = VIt = (V²/R)t."
          ]
        }
      ],
      strategy: [
        "Diagrams are High Scoring: Always draw neat, pencil diagrams with sharp labeling (Nephron, Human Alimentary Canal, Reflex Arc, Ray Diagrams). Labeled diagrams guarantee full marks.",
        "Include Balanced Chemical Equations: Whenever asked about chemical properties or reactions, write the balanced chemical equation with state symbols (s, l, g, aq).",
        "Physics Numericals Formula-Data-Step Rule: 1. Write 'Given' with correct SI units. 2. State the formula clearly. 3. Substitute values and calculate step-by-step. 4. Box the final answer with units (e.g., f = -20 cm, I = 2.5 A).",
        "Keywords Matter: In biology answers, use scientific keywords like 'hydrophilic', 'peristalsis', 'haemoglobin', 'synapse', 'semi-permeable membrane'."
      ],
      samplePaper: {
        title: "CBSE Class 10 Science Board Model Question Paper (2025-2026)",
        maxMarks: 80,
        time: "3 Hours",
        questions: [
          {
            section: "Section A (1 Mark Each)",
            q: "1. What change is observed when dilute HCl is added to zinc granules in a test tube?",
            solution: "Answer: Effervescence occurs due to the evolution of colourless, odourless Hydrogen gas (H₂), which burns with a pop sound. Reaction: Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g) ↑."
          },
          {
            section: "Section B (2 Marks Each)",
            q: "2. Why is red colour selected for danger signal lights?",
            solution: "Answer: Red light has the longest wavelength among visible colours. According to Rayleigh's Scattering Law (Scattering ∝ 1/λ⁴), red light is scattered the least by fog or smoke particles, allowing it to travel the greatest distance and be clearly visible from far away."
          },
          {
            section: "Section C (3 Marks Each)",
            q: "3. Differentiate between Aerobic and Anaerobic respiration with chemical pathways.",
            solution: "Answer:\n1. Aerobic: Takes place in presence of O₂, occurs in Mitochondria, complete oxidation of glucose, end products are CO₂ + H₂O, releases high energy (~36-38 ATP).\n2. Anaerobic: Takes place in absence of O₂, occurs in Cytoplasm (yeast/muscle), partial breakdown, end products are Ethanol + CO₂ (in yeast) or Lactic acid (in human muscle), releases low energy (~2 ATP)."
          },
          {
            section: "Section D (5 Marks Each)",
            q: "4. An electric lamp of 100 Ω, a toaster of 50 Ω, and a water filter of 500 Ω are connected in parallel to a 220 V source. (a) What is the equivalent resistance? (b) What is the total current drawn from the line?",
            solution: "Solution:\n(a) In parallel combination: 1/Rₚ = 1/R₁ + 1/R₂ + 1/R₃\n1/Rₚ = 1/100 + 1/50 + 1/500 = (5 + 10 + 1) / 500 = 16 / 500\nRₚ = 500 / 16 = 31.25 Ω.\n(b) According to Ohm's Law: I = V / Rₚ = 220 / 31.25 = 7.04 A.\nTotal current drawn from the line is 7.04 Amperes."
          }
        ]
      }
    },

    social_science: {
      id: "social_science",
      name: "Social Science (History, Geography, Civics, Economics)",
      code: "087",
      icon: "🌍",
      color: "#f59e0b",
      portion: {
        totalMarks: 80,
        internalAssessment: 20,
        timeAllowed: "3 Hours",
        units: [
          { unit: "Unit 1: India and Contemporary World - II (History)", chapters: "The Rise of Nationalism in Europe, Nationalism in India, The Making of a Global World, Print Culture", weightage: "20 Marks" },
          { unit: "Unit 2: Contemporary India - II (Geography)", chapters: "Resources and Development, Forest and Wildlife, Water Resources, Agriculture, Minerals and Energy Resources, Manufacturing Industries, Lifelines of National Economy", weightage: "20 Marks" },
          { unit: "Unit 3: Democratic Politics - II (Civics/Pol. Sci.)", chapters: "Power Sharing, Federalism, Gender Religion and Caste, Political Parties, Outcomes of Democracy", weightage: "20 Marks" },
          { unit: "Unit 4: Understanding Economic Development (Economics)", chapters: "Development, Sectors of the Indian Economy, Money and Credit, Globalisation and the Indian Economy", weightage: "20 Marks" },
          { unit: "Map Work (Mandatory)", chapters: "History (2 marks) + Geography (3 marks)", weightage: "Included in 80 marks" }
        ],
        paperPattern: [
          "Section A: 20 MCQs (1 mark each).",
          "Section B: 4 Very Short Answer Questions (2 marks each).",
          "Section C: 5 Short Answer Questions (3 marks each).",
          "Section D: 4 Long Answer Questions (5 marks each).",
          "Section E: 3 Case-Based Questions (4 marks each).",
          "Section F: Map Skill Based Question (5 marks: 2 from History, 3 from Geography)."
        ]
      },
      notes: [
        {
          chapter: "1. History - Nationalism in Europe & India",
          points: [
            "Nationalism in Europe: Treaty of Vienna (1815) hosted by Duke Metternich. Giuseppe Mazzini founded 'Young Italy'. Unification of Germany by Otto von Bismarck (Blood and Iron policy). Unification of Italy by Cavour, Garibaldi, and Victor Emmanuel II.",
            "Nationalism in India: Rowlatt Act (1919) gave government powers to arrest without trial. Jallianwala Bagh Massacre (13 April 1919, General Dyer).",
            "Non-Cooperation Movement (1920-1922): Launched at Nagpur Congress Session. Surrender of titles, boycott of foreign clothes. Called off after Chauri Chaura incident (Feb 1922).",
            "Civil Disobedience Movement (1930): Dandi March (12 March to 6 April 1930, 240 miles from Sabarmati to Dandi) breaking the Salt Law.",
            "Poona Pact (Sept 1932): Signed between Mahatma Gandhi and Dr. B.R. Ambedkar, reserving seats for Depressed Classes in Provincial Legislative Councils."
          ]
        },
        {
          chapter: "2. Geography - Resources, Agriculture & Energy",
          points: [
            "Resource Conservation: Agenda 21 signed at Rio de Janeiro Earth Summit 1992 for Sustainable Development.",
            "Soils of India: Alluvial Soil (fertile, northern plains, Khadar is new alluvial, Bangar is old alluvial). Black Soil (Regur soil, ideal for Cotton, Deccan trap).",
            "Cropping Seasons: Rabi (Sown Oct-Dec, Harvested Apr-Jun: Wheat, Mustard); Kharif (Sown with monsoon arrival, Harvested Sep-Oct: Paddy, Maize, Cotton); Zaid (Short summer season: Watermelon, Cucumber).",
            "Non-Conventional Energy: Solar, Wind (Tamil Nadu largest wind farm cluster), Biogas, Tidal energy."
          ]
        },
        {
          chapter: "3. Civics - Power Sharing, Federalism & Political Parties",
          points: [
            "Power Sharing: Belgium accommodated Dutch, French, and German speakers through equal representation; Sri Lanka adopted Majoritarianism favoring Sinhala over Tamils, leading to Civil War.",
            "Federalism: Division of power between Union, State, and Local governments. 73rd and 74th Constitutional Amendments (1992) decentralized power to Panchayats and Municipalities.",
            "Three Lists: Union List (Defence, Foreign Affairs - Parliament makes laws); State List (Police, Agriculture); Concurrent List (Education, Forests - Both can make laws, Union prevails in conflict).",
            "Political Parties: Functions include contesting elections, putting forward policies, forming governments, and playing role of opposition."
          ]
        },
        {
          chapter: "4. Economics - Development, Sectors & Money/Credit",
          points: [
            "Development indicators: Per Capita Income (World Bank Criterion), Human Development Index (HDI by UNDP considering Health, Education, and Income).",
            "Sectors: Primary (Agriculture, Fishing), Secondary (Manufacturing, Construction), Tertiary (IT, Banking, Transport - Largest contributing sector to India's GDP).",
            "Disguised Unemployment: More people working than required, common in rural agriculture.",
            "Money & Credit: Formal Sources (Banks, Cooperatives supervised by Reserve Bank of India - RBI); Informal Sources (Moneylenders, Traders with high interest rates). Self Help Groups (SHGs) empower rural women."
          ]
        },
        {
          chapter: "5. Mandatory Map Work Syllabus",
          points: [
            "History Map Items: Indian National Congress Sessions (Calcutta Sep 1920, Nagpur Dec 1920, Madras 1927). Important Centers of Freedom Movement (Champaran, Kheda, Ahmedabad Mill Strike, Amritsar Jallianwala Bagh, Chauri Chaura, Dandi).",
            "Geography Map Items: Major Dams (Salal, Bhakra Nangal, Tehri, Rana Pratap Sagar, Sardar Sarovar, Hirakud, Nagarjuna Sagar). Major Seaports (Kandla, Mumbai, Marmagao, New Mangalore, Kochi, Tuticorin, Chennai, Visakhapatnam, Paradip, Haldia). Major Software Tech Parks (Noida, Gandhinagar, Mumbai, Pune, Hyderabad, Bengaluru, Chennai)."
          ]
        }
      ],
      strategy: [
        "Use Point-wise Subheadings: For 3 and 5 mark questions, never write continuous paragraphs. Use bold bullet headings followed by 2 lines explanation.",
        "Map Work Precision: Practice marking on blank outline map of India using sharp HB pencil. Always write both location name and letter code.",
        "Include Historical Dates & Articles: Writing exact dates (e.g. 13 April 1919 for Jallianwala Bagh) and constitutional lists creates an outstanding impression.",
        "Economics & Civics Case Answers: Use real-life case studies like Self Help Groups (SHGs), Belgium model of accommodation, and RBI supervision."
      ],
      samplePaper: {
        title: "CBSE Class 10 Social Science Board Model Question Paper (2025-2026)",
        maxMarks: 80,
        time: "3 Hours",
        questions: [
          {
            section: "Section A (1 Mark Each)",
            q: "1. Who among the following hosted the Congress of Vienna in 1815?",
            solution: "Answer: Austrian Chancellor Duke Metternich."
          },
          {
            section: "Section B (2 Marks Each)",
            q: "2. State two prudential reasons for power sharing in a democracy.",
            solution: "Answer:\n1. It helps to reduce the possibility of conflict between social groups.\n2. Power sharing ensures the stability of political order by preventing tyranny of majority over minority."
          },
          {
            section: "Section C (3 Marks Each)",
            q: "3. Explain any three functions performed by the Reserve Bank of India (RBI).",
            solution: "Answer:\n1. Supervises the functioning of formal sources of loans and banks.\n2. Ensures that banks maintain a minimum cash balance (CRR) out of total deposits.\n3. Checks that banks give loans not just to profit-making businesses and traders, but also to small cultivators and borrowers."
          },
          {
            section: "Section D (5 Marks Each)",
            q: "4. Why did Mahatma Gandhi launch the Civil Disobedience Movement? Describe the significance of the Salt March.",
            solution: "Answer:\nReasons for launching CDM:\n1. The British rejected Gandhi's 11 demands sent to Viceroy Irwin, which included the abolition of the salt tax.\n2. Salt was chosen because it was consumed by both rich and poor alike, making the tax on it deeply oppressive.\nSignificance of Salt March:\n1. Marked the beginning of Civil Disobedience Movement on 6 April 1930 when Gandhi reached Dandi and broke the salt law by boiling sea water.\n2. People across the country broke salt laws, boycotted foreign cloth, picketed liquor shops, and refused to pay revenue taxes.\n3. It united the Indian masses across all social backgrounds against the colonial monopoly."
          }
        ]
      }
    },

    english: {
      id: "english",
      name: "English (Language & Literature)",
      code: "184",
      icon: "📖",
      color: "#8b5cf6",
      portion: {
        totalMarks: 80,
        internalAssessment: 20,
        timeAllowed: "3 Hours",
        units: [
          { unit: "Section A: Reading Skills", chapters: "Discursive Passage (10m) + Case-Based Factual Passage (10m)", weightage: "20 Marks" },
          { unit: "Section B: Writing Skills & Grammar", chapters: "Formal Letters (5m), Analytical Paragraph (5m), Integrated Grammar (10m: Tenses, Modals, Subject-Verb Concord, Reported Speech)", weightage: "20 Marks" },
          { unit: "Section C: Literature Textbook & Supplementary", chapters: "First Flight (Prose & Poetry: 28m) + Footprints Without Feet (12m)", weightage: "40 Marks" }
        ],
        paperPattern: [
          "Section A (Reading): 20 marks (Inference, vocabulary, multiple choice & short answers).",
          "Section B (Writing & Grammar): 20 marks (Letter to Editor / Complaint / Order; Data Analysis; 10 grammar items).",
          "Section C (Literature): 40 marks (2 reference to context extract questions, 4 short answer questions, 2 long answer questions)."
        ]
      },
      notes: [
        {
          chapter: "1. Formal Letter Formats (Editor, Complaint, Order)",
          points: [
            "Sender's Address (2-3 lines, no name).",
            "Date (e.g., 25 February 2026).",
            "Receiver's Designation & Address (The Editor, The Times of India, New Delhi).",
            "Subject (Brief, underlined, within 6-8 words).",
            "Salutation (Sir/Madam).",
            "Body (3 Paragraphs: Intro stating the issue, Detailed impact/reasons, Suggestion/appeal to authorities).",
            "Complimentary Close (Yours truly / Yours sincerely, Name/Signature)."
          ]
        },
        {
          chapter: "2. Analytical Paragraph Writing (Data & Graphs)",
          points: [
            "Introduction: Paraphrase the title/chart topic without copying exact words.",
            "Body Paragraph: Highlight key comparisons, highest/lowest trends, sudden shifts, and percentages.",
            "Concluding Paragraph: Summarize the overall trend or outcome in 2-3 concluding lines.",
            "Language Phrases to use: 'The chart illustrates...', 'A significant spike was recorded in...', 'In stark contrast to...', 'It is evident that...'"
          ]
        },
        {
          chapter: "3. Literature - First Flight Key Themes",
          points: [
            "A Letter to God: Lencho's unwavering faith in God contrasts with human cynicism. Irony: Post office employees who helped him were deemed 'a bunch of crooks'.",
            "Nelson Mandela - Long Walk to Freedom: Courage is not the absence of fear, but the triumph over it. Twin obligations: to family and to community/country.",
            "From the Diary of Anne Frank: Paper has more patience than people. Kitty the diary became her truest confidante.",
            "Madam Rides the Bus: Valli's meticulously planned eight-mile bus trip to town; realization of death when seeing the dead cow transforms her naive innocence.",
            "The Proposal: Chekhov's farce satirizing Russian aristocratic marriages driven by property disputes (Oxen Meadows, dogs Guess & Squeezer) rather than love."
          ]
        },
        {
          chapter: "4. Literature - Footprints Without Feet",
          points: [
            "A Triumph of Surgery: Tricki the pampered dog cured through exercise and strict diet by Dr. Herriot without any surgical intervention.",
            "The Thief's Story: Hari Singh reformed by Anil's trust, forgiveness, and the promise of education.",
            "The Necklace: Mathilde Loisel's vanity ruined her life for 10 years of grueling labor to replace an imitation paste necklace worth 500 francs.",
            "Bholi: Sulekha transformed by her school teacher from a stammering, neglected girl into a confident woman who rejected a greedy dowry-seeking groom."
          ]
        }
      ],
      strategy: [
        "Time Management in English: Section A (Reading) takes 45 mins; Section B (Writing & Grammar) takes 45 mins; Section C (Literature) takes 60 mins; Revision & Proofreading takes 30 mins.",
        "Word Limit Discipline: Analytical paragraph and Letter must strictly stay within 100-120 words. Writing unnecessarily long answers risks grammatical errors and loses presentation marks.",
        "Quote Author & Chapter Name: In literature 3-mark and 6-mark answers, mentioning the chapter name and author (e.g. 'In Ruskin Bond's The Thief's Story...') fetches top band marks.",
        "Neat Handwriting & Paragraph Spacing: Leave one blank line between answers. Underline key quotes or thematic keywords."
      ],
      samplePaper: {
        title: "CBSE Class 10 English Language & Literature Model Paper (2025-2026)",
        maxMarks: 80,
        time: "3 Hours",
        questions: [
          {
            section: "Section B: Writing Skills (5 Marks)",
            q: "You are Ananya/Arjun of Sasaram. Write a letter to the Editor of a national daily highlighting the increasing reckless driving and traffic congestion near school zones, suggesting measures to improve road safety.",
            solution: "Sample Format:\n12/B Gandhi Nagar, Sasaram\n25 October 2026\n\nThe Editor\nThe National Herald\nPatna, Bihar\n\nSubject: Urgent need for traffic regulation near school zones in Sasaram\n\nSir/Madam,\nThrough the esteemed columns of your widely read newspaper, I wish to draw the urgent attention of traffic authorities and the municipal corporation toward the alarming rise in traffic congestion and reckless driving near school zones during morning and afternoon hours.\n\nStudents, young children, and parents face grave danger daily due to speeding vehicles, absence of zebra crossings, and lack of dedicated speed-breakers. Several near-miss accidents have already caused widespread panic among local citizens.\n\nI strongly urge the authorities to deploy traffic marshals during school dispersal hours, install speed limit signboards (20 km/h), and construct speed humps immediately. Strict fines should be imposed on errant drivers to ensure the safety of our children.\n\nYours truly,\nAnanya/Arjun"
          },
          {
            section: "Section C: Literature (6 Marks)",
            q: "How did the teacher's empathetic attitude play a pivotal role in changing Bholi's life?",
            solution: "Answer: In K.A. Abbas's story 'Bholi', the school teacher serves as an epitome of patience, compassion, and empowerment. Bholi, originally named Sulekha, was neglected by her own parents due to pockmarks and stammering. On her first day at school, she felt terrified and broke down in tears.\n\nHowever, her teacher spoke to her in a soothing voice that she had never heard before. Instead of ridiculing her stammer, the teacher encouraged her to pronounce her name with love and assurance. She handed her illustrated picture books and instilled the belief that with education, Bholi would become more learned and respected than anyone else in the village.\n\nThis continuous warmth and encouragement fostered immense self-esteem in Bholi. Ultimately, it transformed her into an assertive, self-respecting young woman who bravely rejected Bishamber's greedy dowry demands and dedicated her life to serving her aging parents and teaching in the same village school."
          }
        ]
      }
    },

    hindi: {
      id: "hindi",
      name: "Hindi (Course A - Kshitij & Kritika)",
      code: "002",
      icon: "🇮🇳",
      color: "#ef4444",
      portion: {
        totalMarks: 80,
        internalAssessment: 20,
        timeAllowed: "3 Hours",
        units: [
          { unit: "खण्ड 'क' (अपठित बोध)", chapters: "अपठित गद्यांश (7 अंक) + अपठित काव्यांश (7 अंक)", weightage: "14 Marks" },
          { unit: "खण्ड 'ख' (व्यावहारिक व्याकरण)", chapters: "रचना के आधार पर वाक्य भेद (4), वाच्य (4), पद परिचय (4), अलंकार/रस (4)", weightage: "16 Marks" },
          { unit: "खण्ड 'ग' (पाठ्यपुस्तक क्षितिज भाग-2 एवं कृतिका भाग-2)", chapters: "गद्य खण्ड (17 अंक) + काव्य खण्ड (17 अंक) + कृतिका पूरक पुस्तक (6 अंक)", weightage: "30 Marks" },
          { unit: "खण्ड 'घ' (रचनात्मक लेखन)", chapters: "अनुच्छेद लेखन (6 अंक), पत्र लेखन (5 अंक), स्ववृत्त/ई-मेल (5 अंक), विज्ञापन/सन्देश (4 अंक)", weightage: "20 Marks" }
        ],
        paperPattern: [
          "खण्ड 'क': 14 अंक (बहुविकल्पीय एवं अतिलघुत्तरात्मक प्रश्न).",
          "खण्ड 'ख': 16 अंक (व्याकरण - वाक्य, वाच्य, पद परिचय, अलंकार).",
          "खण्ड 'ग': 30 अंक (पठित गद्यांश, काव्यांश एवं विस्तृत प्रश्नोत्तर).",
          "खण्ड 'घ': 20 अंक (रचनात्मक लेखन - अनुच्छेद, औपचारिक/अनौपचारिक पत्र, ई-मेल/स्ववृत्त, विज्ञापन लेखन)."
        ]
      },
      notes: [
        {
          chapter: "1. व्यावहारिक व्याकरण के मुख्य नियम",
          points: [
            "रचना के आधार पर वाक्य भेद: 1. सरल वाक्य (एक उद्देश्य और एक विधेय, जैसे: 'राम पुस्तक पढ़ता है।'); 2. संयुक्त वाक्य (समानाधिकरण योजक जैसे 'और, तथा, किन्तु, परन्तु' से जुड़े, जैसे: 'उसने मेहनत की और सफल हुआ।'); 3. मिश्र वाक्य (प्रधान उपवाक्य और आश्रित उपवाक्य, जैसे 'जो, जिसने, क्योंकि, यदि-तो' से जुड़े, जैसे: 'जब बारिश हुई, तब मोर नाचने लगे।')",
            "वाच्य: कर्तृवाच्य (कर्ता की प्रधानता: 'बच्चा खेलता है।'), कर्मवाच्य (कर्म की प्रधानता + 'के द्वारा': 'बच्चे द्वारा खेला जाता है।'), भाववाच्य (भाव की प्रधानता, अकर्मक क्रिया: 'रोगी से चला नहीं जाता।')",
            "पद परिचय: वाक्य में प्रयुक्त प्रत्येक पद का व्याकरणिक परिचय (संज्ञा, सर्वनाम, विशेषण, क्रिया, लिंग, वचन, कारक, काल)।",
            "रस: स्थायी भाव, विभाव, अनुभाव और संचारी भाव। प्रमुख रस: शृंगार (रति), वीर (उत्साह), करुण (शोक), हास्य (हास), रौद्र (क्रोध)।"
          ]
        },
        {
          chapter: "2. पाठ्यपुस्तक क्षितिज (गद्य व काव्य खण्ड)",
          points: [
            "नेताजी का चश्मा (स्वयं प्रकाश): कैप्टन चश्मेवाले के माध्यम से लेखक ने दर्शाया है कि देशप्रेम केवल सीमाओं पर बंदूक लेकर खड़े होने से नहीं, अपितु देश के महापुरुषों के प्रति आदर व छोटे-छोटे देशभक्ति के कार्यों से भी प्रकट होता है।",
            "बालगोबिन भगत (रामवृक्ष बेनीपुरी): बालगोबिन भगत कबीरपंथी गृहस्थ साधु थे। उन्होंने सामाजिक रूढ़ियों का विरोध करते हुए अपने इकलौते पुत्र की मृत्यु पर रोने के बजाय आत्मा-परमात्मा के मिलन का उत्सव मनाया और पतोहू का पुनर्विवाह करवाया।",
            "राम-लक्ष्मण-परशुराम संवाद (तुलसीदास): धनुष टूटने पर परशुराम के क्रोध और लक्ष्मण के व्यंग्यपूर्ण वचनों का सुन्दर समन्वय। लक्ष्मण ने शिवधनुष को 'धनुही' कहकर परशुराम के अहंकार पर चोट की।",
            "उत्साह एवं अट नहीं रही है (सूर्यकांत त्रिपाठी 'निराला'): 'उत्साह' में बादल को क्रांति और नवजीवन का प्रतीक माना गया है। 'अट नहीं रही है' में फागुन के असीम प्राकृतिक सौंदर्य का चित्रण है।"
          ]
        },
        {
          chapter: "3. कृतिका भाग-2 (पूरक पाठ्यपुस्तक)",
          points: [
            "माता का आँचल (शिवपूजन सहाय): ग्रामीण बचपन के खेलों, पिता के लाड़-प्यार और अंत में विपत्ति आने पर माँ की गोद में ही सच्ची शांति मिलने का मार्मिक चित्रण।",
            "साना-साना हाथ जोड़ि (मधु कांकरिया): सिक्किम की राजधानी गंगतोक और हिमालय की यात्रा का संस्मरण। प्रकृति की अलौकिक सुंदरता के साथ पत्थर तोड़ती पहाड़ी स्त्रियों का कठोर जीवन संघर्ष।"
          ]
        }
      ],
      strategy: [
        "मात्रा और वर्तनी का ध्यान: हिंदी बोर्ड परीक्षा में वर्तनी (spelling) की अशुद्धियों पर सबसे अधिक अंक कटते हैं। 'की' और 'की', 'है' और 'हैं' के अंतर का विशेष ध्यान रखें।",
        "अनुच्छेद एवं पत्र का प्रारूप: पत्र लेखन में प्रेषक का पता, दिनांक, विषय और महोदय की स्थिति सटीक होनी चाहिए। विज्ञापन लेखन में चारों ओर बॉर्डर (बॉक्स) अवश्य बनाएँ और आकर्षक स्लोगन लिखें।",
        "समय प्रबंधन: खण्ड 'क' (अपठित) - 35 मिनट; खण्ड 'ख' (व्याकरण) - 25 मिनट; खण्ड 'ग' (साहित्य) - 60 मिनट; खण्ड 'घ' (लेखन) - 45 मिनट; पुनरावलोकन (Revision) - 15 मिनट।"
      ],
      samplePaper: {
        title: "सीबीएसई कक्षा 10 हिंदी (पाठ्यक्रम 'अ') बोर्ड आदर्श प्रश्न-पत्र (2025-2026)",
        maxMarks: 80,
        time: "3 घंटे",
        questions: [
          {
            section: "खण्ड 'ख': व्यावहारिक व्याकरण (1 अंक)",
            q: "वाक्य रूपान्तरण कीजिए: 'सूरज निकला और पक्षी चहचहाने लगे।' (सरल वाक्य में बदलिए)",
            solution: "उत्तर: 'सूरज निकलते ही पक्षी चहचहाने लगे।' अथवा 'सूरज निकलने पर पक्षी चहचहाने लगे।'"
          },
          {
            section: "खण्ड 'ग': पाठ्यपुस्तक (3 अंक)",
            q: "कैप्टन चश्मेवाले के प्रति पानवाले की उपेक्षापूर्ण टिप्पणी पर हालदार साहब ने कैसा महसूस किया और क्यों?",
            solution: "उत्तर: जब हालदार साहब ने कैप्टन चश्मेवाले के बारे में पूछा तो पानवाले ने हँसते हुए कहा कि 'वह लँगड़ा क्या जाएगा फौज में! पागल है पागल!'। पानवाले की यह गैर-जिम्मेदाराना और उपेक्षापूर्ण टिप्पणी हालदार साहब को बिल्कुल अच्छी नहीं लगी। उन्हें एक देशभक्त नागरिक का इस प्रकार उपहास उड़ाया जाना बुरा लगा, क्योंकि कैप्टन साधनहीन और शारीरिक रूप से अक्षम होने के बावजूद नेताजी सुभाष चंद्र बोस की बिना चश्मे वाली प्रतिमा पर अपने पास से चश्मा लगाकर देशप्रेम का सच्चा दायित्व निभा रहा था।"
          },
          {
            section: "खण्ड 'घ': रचनात्मक लेखन (5 अंक)",
            q: "अपने क्षेत्र में वर्षा के कारण उत्पन्न जल-जमाव और मच्छरों के प्रकोप की ओर ध्यान आकृष्ट करते हुए नगर निगम अधिकारी को एक शिकायती पत्र लिखिए।",
            solution: "उत्तर प्रारूप:\nपरीक्षा भवन, सासाराम\nदिनांक: 25 अक्टूबर 2026\n\nसेवा में,\nमुख्य नगर पालिका / स्वास्थ्य अधिकारी,\nनगर निगम, सासाराम (बिहार)।\n\nविषय: क्षेत्र में जल-जमाव एवं मच्छरों के बढ़ते प्रकोप के संबंध में शिकायती पत्र।\n\nमहोदय,\nसविनय निवेदन है कि मैं सासाराम के वार्ड संख्या 15, आदर्श नगर का निवासी हूँ। हाल ही में हुई मूसलाधार वर्षा के कारण हमारे पूरे इलाके की नालियाँ अवरुद्ध हो गई हैं और सड़कों पर घुटनों तक गंदा पानी जमा हो गया है।\n\nलंबे समय से जल-निकासी की उचित व्यवस्था न होने से रुके हुए गंदे पानी में भयंकर मच्छर और संक्रामक कीटाणु पनप रहे हैं। इसके कारण क्षेत्र में डेंगू, मलेरिया और वायरल बुखार का खतरा तेजी से बढ़ गया है।\n\nअतः आपसे करबद्ध प्रार्थना है कि हमारे क्षेत्र में जल-निकासी की त्वरित व्यवस्था करवाएँ तथा ब्लीचिंग पाउडर व कीटनाशक दवाओं का छिड़काव शीघ्र करवाएँ। आपके इस त्वरित कार्य के लिए हम सभी क्षेत्रवासी आपके आभारी रहेंगे।\n\nभवदीय,\nसमस्त निवासी,\nआदर्श नगर, सासाराम"
          }
        ]
      }
    },

    information_technology: {
      id: "information_technology",
      name: "Information Technology (IT Code 402)",
      code: "402",
      icon: "💻",
      color: "#06b6d4",
      portion: {
        totalMarks: 50,
        internalAssessment: 50,
        timeAllowed: "2 Hours",
        units: [
          { unit: "Part A: Employability Skills", chapters: "Communication Skills, Self-Management Skills, ICT Skills, Entrepreneurial Skills, Green Skills", weightage: "10 Marks" },
          { unit: "Part B: Subject Specific Skills", chapters: "Unit 1: Digital Documentation (Advanced), Unit 2: Electronic Spreadsheet (Advanced), Unit 3: Database Management System (DBMS), Unit 4: Web Applications and Security", weightage: "40 Marks" }
        ],
        paperPattern: [
          "Part A (Employability Skills): Objective & Short Questions (10 Marks).",
          "Part B (Subject Specific Skills): Objective MCQs (16 Marks) + Short/Long Subjective Questions (24 Marks)."
        ]
      },
      notes: [
        {
          chapter: "1. Digital Documentation (Advanced)",
          points: [
            "Styles: Collection of formatting characteristics (Font, size, color, indent) applied to pages, text, frames. Categories: Paragraph styles, Character styles, Page styles, Frame styles.",
            "Creating Styles: From Selection, Drag and Drop, or Styles and Formatting dialog (F11 shortcut).",
            "Images in Documents: Cropping, resizing, grouping objects, text wrapping (Wrap off, Page wrap, Optimal page wrap).",
            "Table of Contents (TOC): Automatically generated using Heading 1, Heading 2, Heading 3 hierarchy.",
            "Mail Merge: Merging main document with a data source (recipient list) to produce personalized letters, envelopes, and labels."
          ]
        },
        {
          chapter: "2. Electronic Spreadsheet (Advanced)",
          points: [
            "Consolidating Data: Combining data from multiple worksheets or workbooks into a single summary sheet using SUM, AVERAGE, COUNT.",
            "Subtotals: Generates automatic subtotals and grand totals for grouped rows of data.",
            "What-If Analysis Tools: 1. Scenarios (saved sets of input values); 2. Goal Seek (calculates input needed to reach a desired target output); 3. Solver (advanced Goal Seek handling multiple variables with constraints).",
            "Macros: Recorded sequence of commands and keystrokes stored for repetitive automation."
          ]
        },
        {
          chapter: "3. Database Management System (DBMS)",
          points: [
            "Data vs Information: Data is raw unorganized facts; Information is processed meaningful data.",
            "Relational Database: Organizes data into two-dimensional tables (relations) comprising rows (tuples/records) and columns (attributes/fields).",
            "Primary Key: A unique field that identifies each record exclusively (cannot contain duplicate or NULL values).",
            "Foreign Key: A field that links to the primary key of another table to establish relationships (1-to-1, 1-to-Many, Many-to-Many).",
            "Core SQL Commands: CREATE TABLE, INSERT INTO, SELECT * FROM table WHERE condition, UPDATE table SET col=val WHERE cond, DELETE FROM table WHERE cond."
          ]
        },
        {
          chapter: "4. Web Applications & Cybersecurity",
          points: [
            "Network Types: LAN (Local Area Network - single building), MAN (Metropolitan), WAN (Wide Area Network - Internet).",
            "Network Topologies: Star (central hub), Bus (single backbone cable), Ring, Mesh.",
            "Instant Messaging & Blogs: Real-time chat (WhatsApp, Slack); Blogs are web logs (WordPress, Blogger).",
            "Workplace Safety: Occupational Hazards (Physical, Chemical, Biological, Ergonomic), Fire safety (PASS technique: Pull, Aim, Squeeze, Sweep).",
            "Cyber Threats: Phishing (fraudulent emails to steal passwords), Spyware, Trojan Horse, Ransomware.",
            "Security Best Practices: Strong passwords (8+ chars with mix of letters, numbers, symbols), Firewall enabled, Antivirus updates, Two-factor authentication (2FA)."
          ]
        }
      ],
      strategy: [
        "Focus on Exact Technical Terms: In IT 402, use accurate technical terms like 'Tuple', 'Cardinality' (number of rows), 'Degree' (number of columns), 'Goal Seek', 'Primary Key'.",
        "SQL Query Syntax: Write SQL keywords in UPPERCASE (e.g. `SELECT EmpName, Salary FROM Employee WHERE Dept='IT';`) and remember the terminating semicolon.",
        "Employability Skills 10 Marks: Part A is scoring. Review communication barriers, stress management techniques, and green economy basics."
      ],
      samplePaper: {
        title: "CBSE Class 10 Information Technology (Code 402) Model Paper (2025-2026)",
        maxMarks: 50,
        time: "2 Hours",
        questions: [
          {
            section: "Part B: Subject Specific (1 Mark)",
            q: "What is the degree and cardinality of a table named 'STUDENT' with 5 columns and 40 records?",
            solution: "Answer: Degree = 5 (Number of columns/attributes); Cardinality = 40 (Number of rows/tuples)."
          },
          {
            section: "Part B: Subject Specific (2 Marks)",
            q: "Differentiate between Goal Seek and Solver in Electronic Spreadsheets.",
            solution: "Answer:\n1. Goal Seek: Works backward from a known target result to find the single input value required. It handles only one variable cell.\n2. Solver: An advanced optimization tool that can handle multiple variable input cells subject to specific constraints or limits."
          },
          {
            section: "Part B: Subject Specific (4 Marks)",
            q: "Consider table 'BOOKS' with fields: BookID, Title, Author, Price, Qty. Write SQL queries to:\n(a) Display all books whose Price is greater than 500.\n(b) Increase the price of all books by 10%.\n(c) Display Title and Author sorted in descending order of Price.",
            solution: "SQL Queries:\n(a) SELECT * FROM BOOKS WHERE Price > 500;\n(b) UPDATE BOOKS SET Price = Price * 1.10;\n(c) SELECT Title, Author FROM BOOKS ORDER BY Price DESC;"
          }
        ]
      }
    }
  }
};

/**
 * General Class-wise study material registry for Class 1 to 12
 */
const CLASSWISE_STUDY_MATERIALS = {
  "Class 1": [
    { subject: "English", title: "Marigold Class 1 - Phonics & Alphabet Rhymes Guide", type: "Guide Book", pages: 42 },
    { subject: "Mathematics", title: "Math-Magic Class 1 - Numbers 1 to 100, Shapes & Addition Notes", type: "Notes", pages: 35 },
    { subject: "Hindi", title: "Rimjhim Class 1 - Varnamala, Matraen & Balgeet", type: "Guide Book", pages: 38 },
    { subject: "Environmental Studies (EVS)", title: "EVS Basics - My Body, Family, Animals & Plants Notes", type: "Revision Notes", pages: 30 }
  ],
  "Class 2": [
    { subject: "English", title: "Marigold Class 2 - Reading Comprehension & Stories Guide", type: "Guide Book", pages: 45 },
    { subject: "Mathematics", title: "Math-Magic Class 2 - Addition, Subtraction & Multiplication Tables (1-10)", type: "Formula Sheet", pages: 40 },
    { subject: "Hindi", title: "Rimjhim Class 2 - Kavita, Kahaniyan aur Vyakaran Guide", type: "Guide Book", pages: 42 },
    { subject: "Environmental Studies (EVS)", title: "EVS Class 2 - Seasons, Festivals, Cleanliness & Healthy Habits", type: "Revision Notes", pages: 34 }
  ],
  "Class 3": [
    { subject: "Mathematics", title: "Maths Class 3 - 3-Digit Numbers, Division & Measurement Notes", type: "Notes", pages: 48 },
    { subject: "General Science", title: "Science Class 3 - Living vs Non-Living, Parts of Plants & Food", type: "Guide Book", pages: 52 },
    { subject: "Social Studies", title: "Social Studies Class 3 - Earth, Our Country India & Occupations", type: "Notes", pages: 44 },
    { subject: "Computer Science", title: "Computer Class 3 - Input/Output Devices & MS Paint Guide", type: "Practical Notes", pages: 28 }
  ],
  "Class 4": [
    { subject: "Mathematics", title: "Maths Class 4 - Factors, Multiples, Fractions & Geometry Basics", type: "Formula Sheet", pages: 55 },
    { subject: "General Science", title: "Science Class 4 - Digestion, Teeth, Matter & Energy Notes", type: "Guide Book", pages: 58 },
    { subject: "Social Studies", title: "Social Studies Class 4 - Northern Mountains, Coastal Plains & Culture", type: "Notes", pages: 50 },
    { subject: "Computer Science", title: "Computer Class 4 - Windows OS, File Management & Typing", type: "Guide Book", pages: 32 }
  ],
  "Class 5": [
    { subject: "Mathematics", title: "Maths Class 5 - Decimals, Area & Perimeter, Volume & Percentage Guide", type: "Formula Sheet", pages: 62 },
    { subject: "General Science", title: "Science Class 5 - Skeletal System, Simple Machines & Space Notes", type: "Guide Book", pages: 65 },
    { subject: "Social Studies", title: "Social Studies Class 5 - Latitude & Longitudes, Freedom Struggle Notes", type: "Notes", pages: 56 },
    { subject: "Computer Science", title: "Computer Class 5 - Internet, Email & MS Word Fundamentals", type: "Practical Guide", pages: 36 }
  ],
  "Class 6": [
    { subject: "Mathematics", title: "NCERT Maths Class 6 - Integers, Fractions, Decimals & Algebra Notes", type: "Formula Sheet", pages: 75 },
    { subject: "Science", title: "NCERT Science Class 6 - Food, Components of Food, Separation of Substances Notes", type: "Guide Book", pages: 80 },
    { subject: "Social Science", title: "Social Science Class 6 - History (What Where How), Geography (Solar System) & Civics", type: "Notes", pages: 90 },
    { subject: "Computer", title: "Computer Class 6 - Fundamentals, MS PowerPoint & Flowcharts Guide", type: "Practical Notes", pages: 45 }
  ],
  "Class 7": [
    { subject: "Mathematics", title: "NCERT Maths Class 7 - Simple Equations, Lines and Angles, Triangles & Exponents", type: "Formula Sheet", pages: 85 },
    { subject: "Science", title: "NCERT Science Class 7 - Nutrition in Plants, Heat, Acids Bases & Motion Notes", type: "Guide Book", pages: 92 },
    { subject: "Social Science", title: "Social Science Class 7 - Medieval India, Environment & State Government", type: "Notes", pages: 95 },
    { subject: "Computer", title: "Computer Class 7 - HTML Basics, Advanced Excel & Number Systems", type: "Guide Book", pages: 50 }
  ],
  "Class 8": [
    { subject: "Mathematics", title: "NCERT Maths Class 8 - Rational Numbers, Linear Equations, Mensuration & Factorisation", type: "Formula Sheet", pages: 98 },
    { subject: "Science", title: "NCERT Science Class 8 - Crop Production, Microorganisms, Force & Pressure, Light", type: "Guide Book", pages: 105 },
    { subject: "Social Science", title: "Social Science Class 8 - Modern History (1857 Revolt), Resources & Indian Constitution", type: "Notes", pages: 110 },
    { subject: "Computer", title: "Computer Class 8 - Python Programming Basics & Cyber Ethics Guide", type: "Coding Notes", pages: 58 }
  ],
  "Class 9": [
    { subject: "Mathematics", title: "CBSE Class 9 Maths - Number Systems, Polynomials, Coordinate Geometry, Triangles & Circles", type: "Complete Guide", pages: 120 },
    { subject: "Science", title: "CBSE Class 9 Science - Matter in Our Surroundings, Motion, Force, Gravitation & Cell Biology", type: "Revision Notes", pages: 130 },
    { subject: "Social Science", title: "CBSE Class 9 SST - French Revolution, Socialism in Europe, India Size & Location", type: "Notes", pages: 125 },
    { subject: "English Language & Literature", title: "Class 9 English - Beehive & Moments Story Summaries & Writing Skills", type: "Literature Guide", pages: 95 },
    { subject: "Information Technology", title: "IT Code 402 Class 9 - Communication Skills, Word Processing & Spreadsheet", type: "Guide Book", pages: 70 }
  ],
  "Class 10": [
    { subject: "Mathematics", title: "CBSE Class 10th Maths Master Guide - Formulas, Theorems & 100 Solved Board Problems", type: "Board Master Guide", pages: 150 },
    { subject: "Science", title: "CBSE Class 10th Science Topper Notes - Reactions, Diagrams & Formula Sheet", type: "Board Master Guide", pages: 160 },
    { subject: "Social Science", title: "CBSE Class 10th SST Complete Revision - History, Geography Maps & Civics Notes", type: "Board Master Guide", pages: 145 },
    { subject: "English Language & Literature", title: "Class 10th English First Flight & Footprints - Character Sketches & Letter Formats", type: "Literature Guide", pages: 110 },
    { subject: "Hindi Course-A", title: "कक्षा 10वीं हिंदी क्षितिज, कृतिका एवं सम्पूर्ण व्याकरण हैंडबुक", type: "Complete Guide", pages: 115 },
    { subject: "Information Technology", title: "IT Code 402 Class 10th - Digital Docs, Calc, DBMS & Web Security Handbook", type: "Board Handbook", pages: 85 }
  ],
  "Class 11": [
    { subject: "Physics", title: "Class 11 Physics - Kinematics, Laws of Motion, Work Energy Power & Thermodynamics", type: "Formula Sheet", pages: 140 },
    { subject: "Chemistry", title: "Class 11 Chemistry - Structure of Atom, Periodic Classification, Chemical Bonding", type: "Revision Notes", pages: 150 },
    { subject: "Mathematics", title: "Class 11 Maths - Sets, Trigonometric Functions, Permutations & Calculus Basics", type: "Formula Book", pages: 135 },
    { subject: "Biology", title: "Class 11 Biology - Biological Classification, Plant Kingdom & Human Physiology", type: "Guide Book", pages: 160 },
    { subject: "English Core", title: "Class 11 English Core - Hornbill & Snapshots Summaries and Note Making", type: "Guide Book", pages: 90 }
  ],
  "Class 12": [
    { subject: "Physics", title: "Class 12 Physics CBSE Board - Electrostatics, Current, Optics & Semiconductor Notes", type: "Board Guide", pages: 175 },
    { subject: "Chemistry", title: "Class 12 Chemistry CBSE Board - Solutions, Electrochemistry, Organic Chemistry Reactions", type: "Reactions Handbook", pages: 180 },
    { subject: "Mathematics", title: "Class 12 Maths CBSE Board - Relations, Matrices, Calculus, Vectors & 3D Geometry", type: "Formula Master", pages: 165 },
    { subject: "Biology", title: "Class 12 Biology CBSE Board - Reproduction, Genetics, Biotechnology & Ecology", type: "Board Guide", pages: 170 },
    { subject: "Computer Science", title: "Class 12 Computer Science - Python OOPs, File Handling, SQL & Networking", type: "Code & Theory Guide", pages: 120 },
    { subject: "English Core", title: "Class 12 English Core - Flamingo, Vistas & Notice/Report/Article Writing Formats", type: "Complete Guide", pages: 100 }
  ]
};

function getClass10BoardHub(subjectId) {
  if (subjectId && CLASS_10_BOARD_HUB.subjects[subjectId]) {
    return CLASS_10_BOARD_HUB.subjects[subjectId];
  }
  return CLASS_10_BOARD_HUB;
}

function getStudyMaterials(cls, subject) {
  const cleanCls = cls ? (cls.startsWith('Class ') ? cls : `Class ${cls}`) : 'Class 10';
  const list = CLASSWISE_STUDY_MATERIALS[cleanCls] || CLASSWISE_STUDY_MATERIALS['Class 10'] || [];
  if (subject) {
    return list.filter(item => item.subject.toLowerCase().includes(subject.toLowerCase()));
  }
  return list;
}

module.exports = {
  CLASS_10_BOARD_HUB,
  CLASSWISE_STUDY_MATERIALS,
  getClass10BoardHub,
  getStudyMaterials
};
