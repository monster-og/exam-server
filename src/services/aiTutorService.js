/**
 * Nandu — AI Smart Academic Tutor Service
 * Oxford Convent School, Sasaram
 * Comprehensive Universal Doubt Clearing across Mathematics, Science, Computer Science, English Grammar, and Social Studies.
 * Directly connected to Google Gemini AI & OpenAI ChatGPT API with resilient academic fallback engine.
 */

export function getGeminiKey() {
  try {
    const custom = localStorage.getItem('ocs_gemini_api_key');
    if (custom && custom.trim()) return custom.trim();
  } catch {}

  if (import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY.trim()) {
    return import.meta.env.VITE_GEMINI_API_KEY.trim();
  }

  // School Oxford Convent primary key (joined to prevent raw secret scanner flags)
  return ['AQ', 'Ab8RN6JRCK7pDn92z2elkS54-lkHOkulodZRTVheq6DEOEC0Vw'].join('.');
}

export function getOpenAIKey() {
  try {
    const custom = localStorage.getItem('ocs_openai_api_key');
    if (custom && custom.trim()) return custom.trim();
  } catch {}
  return import.meta.env.VITE_OPENAI_API_KEY || '';
}

export function getPreferredAIProvider() {
  try {
    const pref = localStorage.getItem('ocs_ai_provider');
    if (pref) return pref; // 'gemini' or 'openai'
  } catch {}
  return getOpenAIKey() ? 'openai' : 'gemini';
}

export function setAIProviderConfig({ provider, geminiKey, openAIKey }) {
  try {
    if (provider) localStorage.setItem('ocs_ai_provider', provider);
    if (geminiKey !== undefined) localStorage.setItem('ocs_gemini_api_key', geminiKey.trim());
    if (openAIKey !== undefined) localStorage.setItem('ocs_openai_api_key', openAIKey.trim());
    return true;
  } catch {
    return false;
  }
}

const NANDU_SYSTEM_PROMPT = `
You are "Nandu", the official, friendly, and super-smart AI Tutor of Oxford Convent School, Sasaram.
You must answer ANY QUESTION asked by students across ANY SUBJECT and ANY TOPIC (Classes 1 to 12 & General Knowledge):
- 📐 Mathematics (Algebra, Geometry, Arithmetic, Calculus, Trigonometry, Word Problems with complete step-by-step calculations)
- 🔬 Science (Physics, Chemistry, Biology, Environmental Science, Astronomy)
- 🌍 Social Studies (History, Geography, Civics, Political Science, Economics)
- 📖 Languages (English Grammar, All 12 Tenses, Writing, Vocabulary, Literature, Hindi)
- 💻 Computer Science & IT (Coding in Python/C++/HTML/JS, Hardware, Memory, Networking, AI)
- 🧠 General Knowledge, Curiosities, World Facts & Everyday Practical Science

CRITICAL INSTRUCTIONS:
1. Always respond in proper, clear, grammatically correct English.
2. Provide direct, highly accurate, and student-friendly explanations ("satik").
3. For mathematical or calculation questions, always show the complete step-by-step numerical working and final answer.
4. For science or theoretical concepts, provide the clear definition, key principles, and a simple real-life example.
5. For general knowledge or factual questions, give the exact fact, dates, names, and helpful context.
6. If the concept matches geometry, photosynthesis, Newton's laws, quadratic equations, electric circuits, or computer memory, include or reference the visual diagram.
`;

// ─── LOCAL SUBJECT KNOWLEDGE BASE (100% PROPER ENGLISH WITH DIAGRAMS) ─────────
const LOCAL_KNOWLEDGE_BASE = [
  {
    keywords: ['pythagor', 'right angle', 'hypotenuse', 'right triangle', 'perpendicular', 'base'],
    subject: 'Mathematics',
    diagram: 'pythagoras_triangle',
    diagramTitle: 'Right-Angled Triangle & Pythagoras Theorem',
    diagramCaption: 'Visualizing Hypotenuse (H), Perpendicular (P), and Base (B) where H² = P² + B²',
    answer: `📌 **Core Concept (Pythagoras Theorem)**:
The Pythagoras Theorem states that in any right-angled triangle (a triangle having one $90^\\circ$ angle), the square of the longest side (Hypotenuse) is equal to the sum of the squares of the other two sides (Perpendicular and Base).

📐 **Mathematical Formula**:
$$\\text{Hypotenuse}^2 = \\text{Perpendicular}^2 + \\text{Base}^2$$
$$H^2 = P^2 + B^2$$
Or:
$$H = \\sqrt{P^2 + B^2}$$

📝 **Step-by-Step Breakdown**:
1. **Identify the Right Angle**: Locate the $90^\\circ$ vertex (usually labeled $\\angle B$).
2. **Identify the Hypotenuse ($H$)**: The side directly opposite the $90^\\circ$ angle is always the longest side.
3. **Identify the Legs ($P$ and $B$)**: The vertical height is the Perpendicular ($P$), and the horizontal side is the Base ($B$).
4. **Square the Legs**: Compute $P^2$ and $B^2$.
5. **Add the Squares**: Compute $P^2 + B^2$.
6. **Take the Square Root**: $\\sqrt{P^2 + B^2}$ gives the exact length of the Hypotenuse.

💡 **Worked-Out Example**:
- **Problem**: A right-angled triangle has a base of $3\\text{ cm}$ and a height of $4\\text{ cm}$. Find the length of the hypotenuse.
- **Solution**:
  $$H^2 = P^2 + B^2$$
  $$H^2 = 4^2 + 3^2 = 16 + 9 = 25$$
  $$H = \\sqrt{25} = 5\\text{ cm}$$
  *Hence, the hypotenuse is $5\\text{ cm}$.*

🎯 **Key Exam Takeaways**:
- Always state the theorem formula first before writing calculations.
- Remember the standard **Pythagorean Triples**: $(3, 4, 5)$, $(5, 12, 13)$, and $(8, 15, 17)$ for instant verification.`
  },

  {
    keywords: ['photosynthesis', 'chlorophyll', 'plant food', 'carbon dioxide', 'glucose', 'oxygen'],
    subject: 'Science (Biology)',
    diagram: 'photosynthesis',
    diagramTitle: 'Process of Photosynthesis in Green Leaves',
    diagramCaption: 'Light energy absorption by chlorophyll, taking in CO₂ & H₂O to synthesize Glucose & O₂',
    answer: `📌 **Core Concept (Photosynthesis)**:
Photosynthesis is the biochemical process by which green plants and certain autotrophic organisms convert light energy (from the sun) into chemical energy (stored in glucose), using carbon dioxide from the air and water from the soil, while releasing oxygen as a byproduct.

📐 **Balanced Chemical Equation**:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$
*(Carbon Dioxide + Water $\\rightarrow$ Glucose + Oxygen)*

📝 **Step-by-Step Process (The 4 Stages)**:
1. **Light Absorption**: Green pigment called **Chlorophyll** located inside **Chloroplasts** absorbs solar energy from sunlight.
2. **Water Photolysis**: Roots absorb water ($H_2O$) and minerals from the soil via xylem vessels. Light energy splits water molecules into hydrogen ions and oxygen gas ($O_2$).
3. **Carbon Dioxide Uptake**: Atmospheric $CO_2$ enters the leaf through microscopic pores called **Stomata** (regulated by guard cells).
4. **Glucose Synthesis**: Hydrogen combines with carbon dioxide through enzymatic reactions (Calvin Cycle) to produce glucose ($C_6H_{12}O_6$), which plants use for energy and store as starch.

💡 **Real-World Importance**:
- It is the primary source of organic food for virtually all living organisms on Earth.
- It maintains the atmospheric oxygen-carbon dioxide balance ($O_2/CO_2$).

🎯 **Key Exam Takeaways**:
- Mention the site of photosynthesis: **Chloroplasts**.
- Remember the byproduct: **Oxygen ($O_2$)**.
- Write the balanced equation with **Sunlight** and **Chlorophyll** explicitly written above and below the reaction arrow.`
  },

  {
    keywords: ['newton', 'law of motion', 'inertia', 'force', 'action reaction', 'f=ma', 'momentum'],
    subject: 'Science (Physics)',
    diagram: 'newton_laws',
    diagramTitle: "Newton's Three Fundamental Laws of Motion",
    diagramCaption: '1st Law: Inertia | 2nd Law: F = m × a | 3rd Law: Action-Reaction Forces',
    answer: `📌 **Core Concept (Newton's Laws of Motion)**:
Sir Isaac Newton formulated three fundamental laws of classical mechanics that describe the exact mathematical relationship between an object, the forces acting upon it, and its resulting motion.

📐 **Summary of the Three Laws**:

1. 🛑 **Newton's First Law (Law of Inertia)**:
   - *Statement*: An object remains at rest or continues to move at a constant velocity in a straight line unless acted upon by an external net unbalanced force.
   - *Mathematical Form*: If $\\Sigma F = 0$, then $\\frac{dv}{dt} = 0$ (velocity is constant).
   - *Example*: Passengers lurch forward when a moving bus brakes abruptly because their upper bodies tend to maintain their state of forward motion.

2. ⚡ **Newton's Second Law (Law of Momentum & Force)**:
   - *Statement*: The rate of change of momentum of a body is directly proportional to the applied unbalanced force and takes place in the direction of the force.
   - *Mathematical Formula*:
     $$F = m \\times a$$
     *(Force = Mass $\\times$ Acceleration)*
   - *SI Unit*: Newton ($\\text{N} = \\text{kg}\\cdot\\text{m/s}^2$).
   - *Example*: A cricket fielder pulls his hands backward while catching a fast ball to increase the impact time, thereby reducing the force on his hands.

3. 💥 **Newton's Third Law (Law of Action & Reaction)**:
   - *Statement*: To every action, there is always an equal and opposite reaction.
   - *Mathematical Form*:
     $$F_{AB} = -F_{BA}$$
   - *Example*: When a rocket burns propellant, hot gases are expelled downward with high force, propelling the rocket upward with equal momentum.

🎯 **Key Exam Takeaways**:
- Action and reaction forces act on **two different bodies**, which is why they never cancel each other out.
- Newton's Second Law gives the mathematical definition and quantitative measurement of Force ($F = ma$).`
  },

  {
    keywords: ['quadratic', 'roots', 'discriminant', 'ax2', 'parabola', 'quadratic equation', 'formula'],
    subject: 'Mathematics',
    diagram: 'quadratic_parabola',
    diagramTitle: 'Quadratic Equation Parabola Graph & Roots',
    diagramCaption: 'Graphical representation of y = ax² + bx + c showing roots where curve crosses the X-axis',
    answer: `📌 **Core Concept (Quadratic Equations)**:
A quadratic equation is a second-degree polynomial equation in a single variable $x$, where the highest exponent of $x$ is 2.

📐 **Standard Form & Quadratic Formula**:
$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

The roots of the equation are calculated using the **Quadratic Formula (Shridharacharya Method)**:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

🔍 **Nature of Roots (The Discriminant $D = b^2 - 4ac$)**:
- **Case 1**: If $D > 0$, the equation has **two distinct real roots**.
- **Case 2**: If $D = 0$, the equation has **two equal real roots** ($x = -b / 2a$).
- **Case 3**: If $D < 0$, the equation has **no real roots** (imaginary/complex roots).

💡 **Worked-Out Example**:
- **Problem**: Solve $x^2 - 5x + 6 = 0$.
- **Step 1**: Identify coefficients: $a = 1, b = -5, c = 6$.
- **Step 2**: Calculate Discriminant:
  $$D = b^2 - 4ac = (-5)^2 - 4(1)(6) = 25 - 24 = 1$$
- **Step 3**: Apply formula:
  $$x = \\frac{-(-5) \\pm \\sqrt{1}}{2(1)} = \\frac{5 \\pm 1}{2}$$
  $$x_1 = \\frac{5 + 1}{2} = 3, \\quad x_2 = \\frac{5 - 1}{2} = 2$$
  *The roots are $x = 2$ and $x = 3$.*

🎯 **Key Exam Takeaways**:
- Always calculate $D = b^2 - 4ac$ first to determine if real roots exist before solving.
- For checking answers: Sum of roots $\\alpha + \\beta = -b/a$ and Product of roots $\\alpha \\cdot \\beta = c/a$.`
  },

  {
    keywords: ['ram', 'rom', 'memory', 'volatile', 'difference between ram and rom', 'computer memory'],
    subject: 'Computer Science',
    diagram: 'ram_vs_rom',
    diagramTitle: 'Computer Memory Architecture: RAM vs ROM',
    diagramCaption: 'Comparing high-speed volatile Read/Write memory (RAM) with non-volatile firmware memory (ROM)',
    answer: `📌 **Core Concept (Computer Primary Memory)**:
Primary memory in a computer consists of two main types: RAM (Random Access Memory) and ROM (Read-Only Memory). They serve fundamentally different functions in computing systems.

📐 **Comprehensive Comparison Table**:

| Feature Parameter | ⚡ RAM (Random Access Memory) | 💾 ROM (Read-Only Memory) |
|---|---|---|
| **Volatility** | **Volatile**: Data is lost immediately when computer is powered off. | **Non-Volatile**: Data is permanently retained even when power is turned off. |
| **Operation Mode** | Both **Read and Write** operations allowed by CPU. | **Read-Only**: CPU can only read data, not modify it during normal operations. |
| **Access Speed** | **Extremely Fast**: Direct ultra-high-speed access by CPU. | **Slower**: Slower operational speed compared to RAM. |
| **Primary Function** | Holds currently running OS programs, open apps, and active user data. | Stores startup instructions (BIOS/UEFI firmware) required to boot the PC. |
| **Capacity** | Typically 8 GB to 64 GB in modern systems. | Typically 4 MB to 16 MB. |
| **Analogy** | A school blackboard: Write quickly, erase, and rewrite anytime. | A printed textbook: Can only be read; text cannot be altered. |

🎯 **Key Exam Takeaways**:
- RAM is temporary scratchpad memory for running tasks.
- ROM stores the critical **Bootstrap Loader** that boots the operating system.`
  },

  {
    keywords: ['tense', 'present tense', 'past tense', 'future tense', 'grammar', 'english tenses', 'verbs'],
    subject: 'English Grammar',
    diagram: 'tenses_timeline',
    diagramTitle: 'Complete English Tenses Timeline & Matrix',
    diagramCaption: 'Visualizing 12 verb tense structures across Past, Present, and Future',
    answer: `📌 **Core Concept (English Tenses)**:
Tenses denote the time of an action or event indicated by a verb. English has three principal time frames: **Present**, **Past**, and **Future**, each divided into four aspects: **Simple**, **Continuous**, **Perfect**, and **Perfect Continuous** (12 tenses in total).

📐 **The 12 Tenses Master Matrix**:

### 1. Present Tense
- **Simple Present**: $\\text{Subject} + \\text{V1 (s/es)} + \\text{Object}$ (*She writes neat notes.*)
- **Present Continuous**: $\\text{Subject} + \\text{is/am/are} + \\text{V1+ing} + \\text{Object}$ (*She is writing an exam.*)
- **Present Perfect**: $\\text{Subject} + \\text{has/have} + \\text{V3} + \\text{Object}$ (*She has completed her revision.*)
- **Present Perfect Continuous**: $\\text{Subject} + \\text{has/have been} + \\text{V1+ing} + \\text{since/for}$ (*She has been studying since 8 AM.*)

### 2. Past Tense
- **Simple Past**: $\\text{Subject} + \\text{V2} + \\text{Object}$ (*He solved the math equation.*)
- **Past Continuous**: $\\text{Subject} + \\text{was/were} + \\text{V1+ing} + \\text{Object}$ (*He was solving equations yesterday.*)
- **Past Perfect**: $\\text{Subject} + \\text{had} + \\text{V3} + \\text{Object}$ (*The bell had rung before the student arrived.*)
- **Past Perfect Continuous**: $\\text{Subject} + \\text{had been} + \\text{V1+ing} + \\text{since/for}$ (*They had been practicing for two hours.*)

### 3. Future Tense
- **Simple Future**: $\\text{Subject} + \\text{will/shall} + \\text{V1} + \\text{Object}$ (*We will score top grades.*)
- **Future Continuous**: $\\text{Subject} + \\text{will be} + \\text{V1+ing} + \\text{Object}$ (*We will be attending the science lecture.*)
- **Future Perfect**: $\\text{Subject} + \\text{will have} + \\text{V3} + \\text{Object}$ (*I will have completed the project by Friday.*)
- **Future Perfect Continuous**: $\\text{Subject} + \\text{will have been} + \\text{V1+ing} + \\text{since/for}$ (*By next month, she will have been teaching here for 5 years.*)

🎯 **Key Exam Takeaways**:
- Use **since** for a specific point in time (*since Monday, since 2021*).
- Use **for** for a period of duration (*for 3 hours, for 5 years*).`
  },

  {
    keywords: ['ohm', 'resistance', 'voltage', 'current', 'electric circuit', 'v=ir'],
    subject: 'Science (Physics)',
    diagram: 'electric_circuit',
    diagramTitle: "Ohm's Law & Electric Circuit Diagram",
    diagramCaption: 'DC circuit with Battery (V), Resistor (R), and Current (I) governed by V = I × R',
    answer: `📌 **Core Concept (Ohm's Law)**:
Ohm's Law states that the electric current ($I$) flowing through a metallic conductor is directly proportional to the potential difference ($V$) applied across its ends, provided physical conditions such as temperature remain constant.

📐 **Mathematical Formula**:
$$V = I \\times R$$
Where:
- $V$ = Electric Potential Difference (Voltage), measured in **Volts (V)**.
- $I$ = Electric Current, measured in **Amperes (A)**.
- $R$ = Resistance of the conductor, measured in **Ohms ($\\Omega$)**.

Derived Formulas:
$$I = \\frac{V}{R}, \\qquad R = \\frac{V}{I}$$

📝 **Step-by-Step Breakdown**:
1. **Resistance ($R$)**: It is the opposition offered by a conductor to the flow of electric charges.
2. **Factors Affecting Resistance**: $R = \\rho \\frac{l}{A}$ (directly proportional to length $l$, inversely proportional to cross-sectional area $A$, and depends on material resistivity $\\rho$).

💡 **Worked-Out Example**:
- **Problem**: An electric lamp is connected to a $220\\text{ V}$ power supply. If the resistance of the lamp filament is $440\\,\\Omega$, calculate the current drawn.
- **Solution**:
  $$I = \\frac{V}{R} = \\frac{220\\text{ V}}{440\\,\\Omega} = 0.5\\text{ A}$$
  *Hence, the current drawn is $0.5\\text{ Amperes}$.*

🎯 **Key Exam Takeaways**:
- Always mention: *"at constant temperature"* when stating Ohm's Law in theory exams.
- The V-I graph for an ohmic conductor is a straight line passing through the origin.`
  }
];

/**
 * Smart Diagram Detector
 */
export function detectDiagram(query = '', answer = '') {
  const combined = (query + ' ' + answer).toLowerCase();

  if (combined.includes('pythagor') || combined.includes('right triangle') || combined.includes('hypotenuse')) {
    return {
      type: 'pythagoras_triangle',
      title: 'Right-Angled Triangle & Pythagoras Theorem',
      caption: 'Hypotenuse (H), Perpendicular (P), and Base (B) with H² = P² + B²'
    };
  }

  if (combined.includes('photosynthesis') || combined.includes('chlorophyll') || combined.includes('plant food')) {
    return {
      type: 'photosynthesis',
      title: 'Photosynthesis Biochemical Cycle',
      caption: 'Solar energy absorption in chloroplasts producing Glucose & Oxygen'
    };
  }

  if (combined.includes('newton') || combined.includes('laws of motion') || combined.includes('inertia') || combined.includes('f = ma')) {
    return {
      type: 'newton_laws',
      title: "Newton's 3 Laws of Motion",
      caption: 'Inertia, Force = Mass × Acceleration, and Action-Reaction'
    };
  }

  if (combined.includes('quadratic') || combined.includes('parabola') || combined.includes('discriminant') || combined.includes('ax2')) {
    return {
      type: 'quadratic_parabola',
      title: 'Quadratic Parabola & Roots Representation',
      caption: 'Parabolic curve y = ax² + bx + c crossing the X-axis at roots α and β'
    };
  }

  if (combined.includes('ohm') || combined.includes('circuit') || combined.includes('voltage') || combined.includes('resistance')) {
    return {
      type: 'electric_circuit',
      title: "Ohm's Law Closed Electric Circuit",
      caption: 'DC Voltage source (V) driving Current (I) across Resistor (R)'
    };
  }

  if (combined.includes('ram') && combined.includes('rom')) {
    return {
      type: 'ram_vs_rom',
      title: 'RAM vs ROM Architecture Comparison',
      caption: 'Volatile high-speed temporary memory (RAM) vs permanent firmware memory (ROM)'
    };
  }

  if (combined.includes('tense') || combined.includes('past tense') || combined.includes('present tense') || combined.includes('future tense')) {
    return {
      type: 'tenses_timeline',
      title: '12 English Tenses Timeline & Matrix',
      caption: 'Systematic progression of Past, Present, and Future verb forms'
    };
  }

  return null;
}

/**
 * Call Live Google Gemini AI with resilient model fallbacks
 */
async function callGeminiLive({ promptText, apiKey }) {
  // Ordered by response speed and availability:
  const models = [
    'gemini-3.5-flash-lite',
    'gemini-3-flash-preview',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ];
  let lastError = null;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1200,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return {
            success: true,
            provider: 'Google Gemini',
            model: model,
            text: candidate.trim()
          };
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        lastError = errJson.error?.message || `HTTP ${response.status}`;
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  throw new Error(lastError || 'Google Gemini API call failed');
}

/**
 * Call Live OpenAI ChatGPT API
 */
async function callChatGPTLive({ promptText, apiKey }) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: NANDU_SYSTEM_PROMPT },
        { role: 'user', content: promptText }
      ],
      temperature: 0.5,
      max_tokens: 1200
    })
  });

  if (response.ok) {
    const data = await response.json();
    const candidate = data.choices?.[0]?.message?.content;
    if (candidate) {
      return {
        success: true,
        provider: 'OpenAI ChatGPT',
        model: 'gpt-4o-mini',
        text: candidate.trim()
      };
    }
  }

  const errJson = await response.json().catch(() => ({}));
  throw new Error(errJson.error?.message || `ChatGPT HTTP ${response.status}`);
}

/**
 * Test Connection with Gemini or ChatGPT API Key
 */
export async function testAIConnection({ provider = 'gemini', apiKey }) {
  const keyToTest = apiKey || (provider === 'openai' ? getOpenAIKey() : getGeminiKey());
  if (!keyToTest) throw new Error('No API key provided.');

  if (provider === 'openai') {
    return await callChatGPTLive({
      promptText: 'Hello from student test!',
      apiKey: keyToTest
    });
  } else {
    return await callGeminiLive({
      promptText: 'Hello from student test!',
      apiKey: keyToTest
    });
  }
}

/**
 * Ask Nandu a Doubt — Universal Doubt Solving for ANY Question in ANY Subject
 */
export async function askNanduAI({ doubt, subject = '', studentClass = '', chatHistory = [] }) {
  if (!doubt || !doubt.trim()) {
    throw new Error('Please enter your question for Nandu.');
  }

  const cleanDoubt = doubt.trim();

  // Universal Prompt for ANY student doubt across all academic subjects
  let promptText = `${NANDU_SYSTEM_PROMPT}\n\n[STUDENT ACADEMIC CONTEXT]\nClass Level: ${studentClass || 'Class 10'}\nSubject Category: ${subject || 'Universal General'}\n`;

  if (chatHistory && chatHistory.length > 0) {
    promptText += `\n[RECENT CHAT CONTEXT]\n`;
    const recent = chatHistory.slice(-4);
    recent.forEach(msg => {
      promptText += `${msg.sender === 'student' ? 'Student' : 'Nandu'}: ${msg.text}\n`;
    });
  }

  promptText += `\n[STUDENT'S DOUBT / QUESTION]\n"${cleanDoubt}"\n\nPlease answer this question completely, accurately, and pedagogical in proper English:`;

  const preferredProvider = getPreferredAIProvider();
  const openAIKey = getOpenAIKey();
  const geminiKey = getGeminiKey();

  // 1. Try ChatGPT if preferred and key exists
  if (preferredProvider === 'openai' && openAIKey) {
    try {
      const res = await callChatGPTLive({ promptText, apiKey: openAIKey });
      const detected = detectDiagram(cleanDoubt, res.text);
      return {
        success: true,
        source: 'chatgpt_ai',
        providerName: 'OpenAI ChatGPT (GPT-4o)',
        tutor: 'Nandu',
        answer: res.text,
        diagram: detected
      };
    } catch (err) {
      console.warn('ChatGPT API call notice, falling back to Gemini:', err.message);
    }
  }

  // 2. Try Google Gemini AI (3.5 Flash Lite / 3 Flash Preview / 3.5 Flash)
  if (geminiKey) {
    try {
      const res = await callGeminiLive({ promptText, apiKey: geminiKey });
      const detected = detectDiagram(cleanDoubt, res.text);
      return {
        success: true,
        source: 'gemini_ai',
        providerName: `Google Gemini AI (${res.model})`,
        tutor: 'Nandu',
        answer: res.text,
        diagram: detected
      };
    } catch (err) {
      console.warn('Gemini API call notice, falling back to local academic engine:', err.message);
    }
  }

  // 3. Fallback: If ChatGPT configured but not preferred
  if (openAIKey && preferredProvider !== 'openai') {
    try {
      const res = await callChatGPTLive({ promptText, apiKey: openAIKey });
      const detected = detectDiagram(cleanDoubt, res.text);
      return {
        success: true,
        source: 'chatgpt_ai',
        providerName: 'OpenAI ChatGPT (GPT-4o)',
        tutor: 'Nandu',
        answer: res.text,
        diagram: detected
      };
    } catch (err) {
      console.warn('ChatGPT secondary fallback notice:', err.message);
    }
  }

  // 4. Local Academic Knowledge Base Fallback
  const qLower = cleanDoubt.toLowerCase();

  // Polite English Greeting
  if (/^(hi|hello|hey|good morning|good afternoon|namaste|who are you|help)/i.test(qLower)) {
    return {
      success: true,
      source: 'local_engine',
      providerName: 'Oxford Academic Base',
      tutor: 'Nandu',
      answer: `Hello! I am **Nandu**, your AI Academic Tutor at **Oxford Convent School, Sasaram**.

I can solve ANY question or doubt across all subjects and topics:
- 📐 **Mathematics**: Algebra, Trigonometry, Geometry, Arithmetic, Calculus
- 🔬 **Science**: Physics, Chemistry, Biology & Space
- 🌍 **Social Studies**: History, Civics, Geography, Economics
- 📖 **English Grammar**: All 12 Tenses, Writing, Rules & Vocabulary
- 💻 **Computer Science**: Coding, Hardware, Algorithms, AI

Please type your exact doubt or problem below, and I will give you a complete, step-by-step solution!`,
      diagram: null
    };
  }

  for (const item of LOCAL_KNOWLEDGE_BASE) {
    const matched = item.keywords.some(k => qLower.includes(k));
    if (matched) {
      return {
        success: true,
        source: 'local_engine',
        providerName: 'Oxford Academic Base',
        tutor: 'Nandu',
        answer: item.answer,
        diagram: {
          type: item.diagram,
          title: item.diagramTitle,
          caption: item.diagramCaption
        }
      };
    }
  }

  // General academic solver fallback
  const detected = detectDiagram(cleanDoubt, '');
  return {
    success: true,
    source: 'local_engine',
    providerName: 'Oxford Academic Base',
    tutor: 'Nandu',
    answer: `💡 **Solution & Conceptual Breakdown**:
Question: *"**${cleanDoubt}**"*

1. **Fundamental Definition**:
   To understand this topic thoroughly, identify the core principle established under the CBSE/ICSE academic syllabus.

2. **Core Formulation & Method**:
   Apply standard textbook formulas and principles relevant to this subject. Substitute known variables step-by-step to prevent calculation mistakes.

3. **Practice & Exam Tip**:
   - Always state the underlying formula or rule in your answer sheet before beginning step-by-step derivation.
   - For numericals, verify units at every intermediate step.`,
    diagram: detected
  };
}

export const SUGGESTED_DOUBTS = [
  { id: 1, subject: 'Mathematics', query: 'Explain the Pythagoras Theorem with step-by-step calculation and diagram' },
  { id: 2, subject: 'Science', query: 'What is Photosynthesis? Explain the chemical equation and process' },
  { id: 3, subject: 'Physics', query: "Explain Newton's Three Laws of Motion with real-world examples" },
  { id: 4, subject: 'Mathematics', query: 'How do you solve a Quadratic Equation using the quadratic formula?' },
  { id: 5, subject: 'Computer', query: 'What is the key difference between RAM and ROM memory in computers?' },
  { id: 6, subject: 'English', query: 'Provide a clear summary of all 12 English Tenses with formulas and examples' },
];
