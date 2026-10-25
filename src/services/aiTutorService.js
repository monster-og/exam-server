/**
 * Nandu — AI Smart Tutor Service
 * Oxford Convent School, Sasaram
 * Clears doubts across all academic subjects (Maths, Science, SST, English, Computer, etc.)
 * Powered by Google Gemini AI with resilient local academic fallback engine.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const NANDU_SYSTEM_PROMPT = `
You are "Nandu" (नंदू), the official, friendly, and super-smart AI Tutor of Oxford Convent School, Sasaram.
Your sole mission is to clear any doubt asked by school students across any subject and any grade (Class 1 to 12th).

Subjects you excel at:
1. 📐 Mathematics: Algebra, Trigonometry, Geometry, Arithmetic, Calculus, Mensuration, Statistics. (Always provide step-by-step calculations with clear formulas).
2. 🔬 Science (Physics, Chemistry, Biology): Laws of motion, chemical equations, cell structure, electricity, optics, human body, ecosystem.
3. 💻 Computer Science / IT: Coding (Python, HTML, CSS, JavaScript, C++), computer hardware, OS, networking, internet, database.
4. 📖 English & Hindi: Grammar rules, tenses, active/passive voice, essays, letter writing, comprehension, word meanings.
5. 🌍 Social Science (History, Geography, Civics/Pol Sci, Economics): Freedom movement, constitution, climate, maps, economy.

Response Style Guidelines:
- Tone: Extremely encouraging, warm, respectful, and motivating (like a favorite school teacher).
- Language: Match the student's language! If asked in Hindi or Hinglish, explain in clear, natural Hinglish/Hindi. If asked in English, answer in English.
- Structure your answer cleanly:
  1. 💡 **Main Concept / सीधी बात**: Short summary.
  2. 📝 **Step-by-Step Explanation / हल**: Break down formulas or points.
  3. 🌟 **Real-Life Example / उदाहरण**: Connect with daily life.
  4. 🎯 **Quick Tip for Exam**: How to score full marks in this question.
- Format with bold headings, bullet points, and neat spacing so it's super easy to read.
- Introduce yourself warmly as "Nandu — Aapka AI Tutor" when greeted or asked who you are.
`;

// ─── LOCAL SUBJECT KNOWLEDGE BASE (OFFLINE FALLBACK ENGINE) ──────────────────
const LOCAL_KNOWLEDGE_BASE = [
  {
    keywords: ['pythagor', 'right angle', 'hypotenuse', 'karna', 'aadhara'],
    subject: 'Mathematics',
    answer: `💡 **Pythagoras Theorem (पाइथागोरस प्रमेय)**

📐 **Formula**: 
$$\\text{Hypotenuse}^2 = \\text{Perpendicular}^2 + \\text{Base}^2$$
$$H^2 = P^2 + B^2$$

📝 **Step-by-Step Explanation**:
- Ek Right-Angled Triangle (समकोण त्रिभुज) me $90^\\circ$ ke samne wali side sabse lambi hoti hai, jise **Hypotenuse (कर्ण)** kehte hain.
- Dono choti sides ke squares ka sum hamesha Hypotenuse ke square ke barabar hota hai.

🌟 **Example**:
- Agar Base = 3 cm aur Perpendicular = 4 cm hai:
  $$H^2 = 3^2 + 4^2 = 9 + 16 = 25$$
  $$H = \\sqrt{25} = 5\\text{ cm}$$

🎯 **Exam Tip**: Hamesha pehle diagram banayein aur $90^\\circ$ angle mark karein! Full marks pakke.`
  },
  {
    keywords: ['photosynthesis', 'prakash sanshleshan', 'chlorophyll', 'plants food'],
    subject: 'Science (Biology)',
    answer: `💡 **Photosynthesis (प्रकाश संश्लेषण)**

🌿 **Chemical Reaction**:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 (\\text{Glucose}) + 6\\text{O}_2$$

📝 **Process in 4 Simple Steps**:
1. **Absorption**: Patti me maujood **Chlorophyll** sunlight ko absorb karta hai.
2. **Water Uptake**: Roots zameen se paani (H₂O) absorb karti hain.
3. **Carbon Dioxide**: Stomata ke zariye hawa se CO₂ andar aati hai.
4. **Food & Oxygen**: Paudhe glucose (food) banate hain aur humare jeene ke liye **Oxygen (O₂)** release karte hain!

🌟 **Real-Life Fun Fact**:
Hum jo oxygen saans lene ke liye use karte hain, wo 100% plants ke photosynthesis se hi aati hai!`
  },
  {
    keywords: ['newton', 'law of motion', 'gati ke niyam', 'inertia', 'force'],
    subject: 'Science (Physics)',
    answer: `💡 **Newton's 3 Laws of Motion (न्यूटन के गति के 3 नियम)**

1. 🛑 **First Law (Law of Inertia - जड़त्व का नियम)**:
   - Jo cheez ruki hai wo ruki rahegi, aur jo chal rahi hai wo chalti rahegi, jab tak uspe koi baahri force (External Force) na lage.
   - *Example*: Jab bus achanak rukti hai, to hum aage ki taraf girte hain.

2. ⚡ **Second Law (F = m × a - संवेग का नियम)**:
   - Force = Mass × Acceleration.
   - *Example*: Cricketer ball catch karte waqt apne haath piche khinchta hai taaki chot kam lage.

3. 💥 **Third Law (Action-Reaction - क्रिया-प्रतिक्रिया)**:
   - Har Action ka ek barabar aur opposite Reaction hota hai.
   - *Example*: Rocket se gas niche nikalti hai aur rocket aage asmaan me udta hai!`
  },
  {
    keywords: ['quadratic', 'dwighat', 'discriminant', 'ax2', 'shridharacharya'],
    subject: 'Mathematics',
    answer: `💡 **Quadratic Equation (द्विघात समीकरण)**

📐 **Standard Form**: 
$$ax^2 + bx + c = 0$$ (jahan $a \\neq 0$)

📝 **Quadratic Formula (Shridharacharya Method)**:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

🔍 **Discriminant (D = b² - 4ac)**:
- Agar $D > 0$: 2 alag-alag Real Roots milenge.
- Agar $D = 0$: Dono Roots barabar honge (Equal Roots).
- Agar $D < 0$: No Real Roots (Imaginary).

🌟 **Example**: $x^2 - 5x + 6 = 0$
- Factors: $(x - 2)(x - 3) = 0 \\implies x = 2, 3$`
  },
  {
    keywords: ['ram', 'rom', 'memory', 'volatile', 'difference between ram and rom'],
    subject: 'Computer Science',
    answer: `💡 **Difference Between RAM and ROM (कंप्यूटर मेमोरी)**

| Feature | ⚡ RAM (Random Access Memory) | 💾 ROM (Read Only Memory) |
|---|---|---|
| **Nature** | Volatile (Power off hote hi data ud jata hai) | Non-Volatile (Permanent data rehta hai) |
| **Speed** | Super Fast | Slower than RAM |
| **Operation** | Read and Write dono ho sakta hai | Sirf Read ho sakta hai |
| **Usage** | Running apps aur games store karta hai | Booting instructions (BIOS) store karta hai |
| **Analogy** | Blackboard (Likh kar mita sakte hain) | Printed Book (Badla nahi ja sakta) |`
  },
  {
    keywords: ['tense', 'present tense', 'past tense', 'grammar', 'english rule'],
    subject: 'English Grammar',
    answer: `💡 **English Tenses Formula Chart (12 Tenses at a Glance)**

1. ⏰ **Present Tense**:
   - **Simple**: Subject + V1(s/es) + Object *(He plays football)*
   - **Continuous**: Subject + is/am/are + V4(ing) *(He is playing)*
   - **Perfect**: Subject + has/have + V3 *(He has played)*
   - **Perfect Continuous**: Subject + has/have been + V4 + since/for *(He has been playing since morning)*

2. ⌛ **Past Tense**:
   - **Simple**: Subject + V2 *(He played)*
   - **Continuous**: Subject + was/were + V4 *(He was playing)*
   - **Perfect**: Subject + had + V3 *(He had played)*

3. 🚀 **Future Tense**:
   - **Simple**: Subject + will/shall + V1 *(He will play)*
   - **Continuous**: Subject + will be + V4 *(He will be playing)*`
  }
];

/**
 * Ask Nandu a Doubt
 */
export async function askNanduAI({ doubt, subject = '', studentClass = '', chatHistory = [] }) {
  if (!doubt || !doubt.trim()) {
    throw new Error('Please enter a doubt or question for Nandu.');
  }

  const cleanDoubt = doubt.trim();

  // Try Online Google Gemini API first
  if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('your_api_key')) {
    try {
      // Format prompt with system persona, academic context and recent dialogue
      let promptText = `${NANDU_SYSTEM_PROMPT}\n\n=== CURRENT QUERY CONTEXT ===\nStudent Class: ${studentClass || 'General School Student'}\nSubject Context: ${subject || 'All Subjects'}\n`;

      if (chatHistory && chatHistory.length > 0) {
        promptText += `\n=== RECENT DIALOGUE HISTORY ===\n`;
        const recent = chatHistory.slice(-4);
        recent.forEach(msg => {
          promptText += `${msg.sender === 'student' ? 'Student' : 'Nandu'}: ${msg.text}\n`;
        });
      }

      promptText += `\n=== STUDENT'S DOUBT ===\n${cleanDoubt}\n\nPlease explain step-by-step as Nandu AI Tutor:`;

      const contents = [
        {
          role: 'user',
          parts: [{ text: promptText }]
        }
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return {
            success: true,
            source: 'gemini_ai',
            tutor: 'Nandu',
            answer: candidate.trim()
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call notice, falling back to Nandu Knowledge Base:', err.message);
    }
  }

  // Fallback: Local Academic Knowledge Engine
  const qLower = cleanDoubt.toLowerCase();
  
  // Greeting handler
  if (/^(hi|hello|namaste|hey|who are you|kaun ho|kaise ho|help)/i.test(qLower)) {
    return {
      success: true,
      source: 'local_engine',
      tutor: 'Nandu',
      answer: `🙏 **Namaste! Main hoon Nandu (नंदू)** — Oxford Convent School ka aapka personal AI Tutor!

Aap mujhse kisi bhi subject ka doubt puch sakte hain:
- 📐 **Mathematics** (Formulas, Numericals, Geometry, Algebra)
- 🔬 **Science** (Physics, Chemistry, Biology)
- 💻 **Computer & IT** (Coding, Shortcuts, Hardware, Software)
- 📖 **English & Hindi Grammar** (Tenses, Rules, Meanings)
- 🌍 **Social Science** (History, Civics, Geography)

Bas apna sawal niche type kijiye aur main step-by-step simple bhasha me samjha dunga!`
    };
  }

  for (const item of LOCAL_KNOWLEDGE_BASE) {
    const matched = item.keywords.some(k => qLower.includes(k));
    if (matched) {
      return {
        success: true,
        source: 'local_engine',
        tutor: 'Nandu',
        answer: item.answer
      };
    }
  }

  // General smart tutor synthesis response
  return {
    success: true,
    source: 'local_engine',
    tutor: 'Nandu',
    answer: `💡 **Nandu's Academic Explanation**:

Aapne bahut accha sawal pucha hai: *"**${cleanDoubt}**"*

📝 **Step-by-Step Concept Breakdown**:
1. **Core Principle**: Kisi bhi concept ko samajhne ke liye pehle uske basic definition aur primary rule ko identify karein.
2. **Formula / Rule**: Sambandhit subject ka standard CBSE formula ya theory apply karein.
3. **Application**: Sawal ke diye gaye values ko formula me step-by-step substitute karein taaki calculation me galti na ho.

🌟 **Nandu's Study Tip**:
- Is topic se jude 2–3 practice questions abhi apne rough copy me solve karein.
- Agar koi specific numerical ya equation hai to uska exact number niche type karein, main turant solve kar dunga! 👍`
  };
}

export const SUGGESTED_DOUBTS = [
  { id: 1, subject: 'Mathematics', query: 'Explain Pythagoras Theorem with step-by-step example' },
  { id: 2, subject: 'Science', query: 'What is Photosynthesis? Explain chemical reaction' },
  { id: 3, subject: 'Physics', query: 'Explain Newton 3 Laws of Motion with daily life examples' },
  { id: 4, subject: 'Mathematics', query: 'How to solve Quadratic Equations using formula?' },
  { id: 5, subject: 'Computer', query: 'What is the difference between RAM and ROM?' },
  { id: 6, subject: 'English', query: 'Give me a simple chart of all 12 English Tenses with rules' },
];
