/**
 * Oxford Convent School AI Study Tutor & Doubt Assistant Service
 * Provides educational explanations for Class 1 to 12th school subjects.
 */

async function getChatbotResponse(userMessage, studentClass = '', subject = '', history = []) {
  const msg = (userMessage || '').trim();
  if (!msg) return "Hello! I am your AI Study Tutor. Ask me any doubt from your subjects (Maths, Science, Social Studies, English, Computer, etc.)!";

  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. Try Gemini API if key is available
  if (geminiKey) {
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];
    for (const modelName of candidateModels) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: `You are "Ai Nandu Tutor" (Nandu), the friendly, encouraging, and highly knowledgeable academic tutor created specially by The Boss for all students of OXFORD CONVENT SCHOOL SASARAM.
You assist school students from Class 1 to 12th across all subjects (Science, Maths, Social Science, English, Hindi, Computer, Commerce, Arts, etc.).
Explain concepts step-by-step with clear examples, formulas, bullet points, and simple English or easy Hinglish/Hindi when appropriate.
Always be warm, encouraging, polite, and student-friendly. Keep answers well structured and accurate.`
              }]
            },
            contents: [
              ...history.slice(-4).map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
              })),
              {
                role: 'user',
                parts: [{ text: `Student Class: ${studentClass || 'General'}, Subject Context: ${subject || 'General'}\nStudent Question: ${msg}` }]
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) return aiText;
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn(`Gemini model ${modelName} returned status ${response.status}:`, errData?.error?.message || response.statusText);
        }
      } catch (e) {
        console.warn(`Gemini API call (${modelName}) failed:`, e.message);
      }
    }
  }

  // 2. Intelligent Built-in Educational Knowledge Engine
  return generateKnowledgeEngineResponse(msg, studentClass);
}

function generateKnowledgeEngineResponse(query, studentClass) {
  const q = query.toLowerCase();

  // Greeting
  if (/^(hi|hello|hey|namaste|pranam|good morning|good evening|good afternoon)/.test(q)) {
    return `👋 **Namaste & Hello!** I am your **Oxford AI Study Assistant**.\n\nHow can I help you today with your studies?\n- 📐 **Mathematics & Formulas (Class 1 to 12th)**\n- 🔬 **Science (Physics, Chemistry, Biology)**\n- 💻 **Computer Science & Coding**\n- 📊 **Commerce, Accounts & Economics**\n- 🏛️ **Social Science, History, Civics & Geography**\n- 📝 **Exam preparation & revision tips**\n\nAsk me any question or concept!`;
  }

  // Mathematics
  if (q.includes('pythagoras') || q.includes('right angle triangle')) {
    return `📐 **Pythagoras Theorem:**\n\nIn any right-angled triangle:\n$$\\text{Hypotenuse}^2 = \\text{Base}^2 + \\text{Perpendicular}^2$$\n$$H^2 = B^2 + P^2$$\n\n**Example:** If Base = 3 and Perpendicular = 4, then:\n$$H = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$$`;
  }
  if (q.includes('quadratic') || q.includes('dighat samikaran')) {
    return `📐 **Quadratic Equation (द्विघात समीकरण):**\n\nStandard Form: $$ax^2 + bx + c = 0$$\n\n**Quadratic Formula (Shridhara Acharya Formula):**\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n- **Discriminant ($D$):** $$D = b^2 - 4ac$$\n  - If $D > 0$: 2 real & distinct roots\n  - If $D = 0$: 2 equal real roots\n  - If $D < 0$: No real roots (imaginary)`;
  }
  if (q.includes('trigonometry') || q.includes('sin cos') || q.includes('trig formula')) {
    return `📐 **Key Trigonometry Ratios & Formulas:**\n\n- $\\sin \\theta = \\frac{\\text{Perpendicular}}{\\text{Hypotenuse}}$\n- $\\cos \\theta = \\frac{\\text{Base}}{\\text{Hypotenuse}}$\n- $\\tan \\theta = \\frac{\\text{Perpendicular}}{\\text{Base}} = \\frac{\\sin \\theta}{\\cos \\theta}$\n\n**Fundamental Identities:**\n1. $\\sin^2 \\theta + \\cos^2 \\theta = 1$\n2. $1 + \\tan^2 \\theta = \\sec^2 \\theta$\n3. $1 + \\cot^2 \\theta = \\csc^2 \\theta$`;
  }
  if (q.includes('area of circle') || q.includes('circle formula') || q.includes('circumference')) {
    return `📐 **Circle Formulas:**\n- **Area:** $$A = \\pi r^2$$\n- **Circumference (Perimeter):** $$C = 2 \\pi r$$\n- **Diameter:** $$d = 2r$$\n*(where $\\pi \\approx \\frac{22}{7} \\approx 3.14159$)*`;
  }
  if (q.includes('differentiation') || q.includes('derivative') || q.includes('calculus')) {
    return `📐 **Basic Differentiation Rules:**\n- $\\frac{d}{dx}(x^n) = n x^{n-1}$\n- $\\frac{d}{dx}(\\sin x) = \\cos x$\n- $\\frac{d}{dx}(\\cos x) = -\\sin x$\n- $\\frac{d}{dx}(e^x) = e^x$\n- $\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$\n- **Product Rule:** $(uv)' = u'v + uv'$\n- **Quotient Rule:** $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$`;
  }
  if (q.includes('integration') || q.includes('integral')) {
    return `📐 **Basic Integration Formulas:**\n- $\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$\n- $\\int \\frac{1}{x} \\, dx = \\ln|x| + C$\n- $\\int e^x \\, dx = e^x + C$\n- $\\int \\sin x \\, dx = -\\cos x + C$\n- $\\int \\cos x \\, dx = \\sin x + C$`;
  }

  // Science - Physics
  if (q.includes('newton') || q.includes('law of motion') || q.includes('motion')) {
    return `🔬 **Newton's Three Laws of Motion:**\n\n1. **First Law (Law of Inertia):** An object remains at rest or in uniform motion unless acted upon by an external net force.\n2. **Second Law ($F = ma$):** Force equals mass times acceleration ($F = m \\times a$).\n3. **Third Law:** For every action, there is an equal and opposite reaction ($F_{AB} = -F_{BA}$).`;
  }
  if (q.includes('ohm') || q.includes('current') || q.includes('voltage') || q.includes('resistance')) {
    return `⚡ **Ohm's Law:**\n\nAt constant temperature, the current ($I$) flowing through a conductor is directly proportional to the potential difference ($V$) across its ends.\n\n$$V = I \\times R$$\n\n- **$V$** = Voltage (Volts, $V$)\n- **$I$** = Current (Amperes, $A$)\n- **$R$** = Resistance (Ohms, $\\Omega$)`;
  }
  if (q.includes('gravity') || q.includes('gravitational') || q.includes('g value')) {
    return `🌍 **Universal Law of Gravitation:**\n\nEvery particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between them:\n\n$$F = G \\frac{m_1 m_2}{r^2}$$\n\n- **$G$** = $6.674 \\times 10^{-11} \\, \\text{N}\\cdot\\text{m}^2/\\text{kg}^2$\n- **Acceleration due to gravity on Earth ($g$):** $\\approx 9.8 \\, \\text{m/s}^2$`;
  }

  // Science - Chemistry
  if (q.includes('photosynthesis') || q.includes('prakash sanshleshan')) {
    return `🌿 **Photosynthesis (प्रकाश संश्लेषण):**\n\nThe process by which green plants make glucose (food) from Carbon Dioxide and Water in the presence of Sunlight and Chlorophyll.\n\n**Chemical Equation:**\n$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Sunlight, Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$\n\n**Key Byproduct:** Oxygen ($\\text{O}_2$) is released into the atmosphere!`;
  }
  if (q.includes('acid') || q.includes('base') || q.includes('ph scale') || q.includes('ph value')) {
    return `🧪 **Acids, Bases & pH Scale:**\n\n- **pH Scale (0 to 14):**\n  - $\\text{pH} < 7$: **Acidic** (e.g., Lemon Juice, Vinegar, $\\text{HCl}$)\n  - $\\text{pH} = 7$: **Neutral** (Pure Water)\n  - $\\text{pH} > 7$: **Basic / Alkaline** (e.g., Baking Soda, Soap, $\\text{NaOH}$)\n\n- **Litmus Test:**\n  - Acid turns blue litmus **Red**\n  - Base turns red litmus **Blue**`;
  }
  if (q.includes('periodic table') || q.includes('atomic number') || q.includes('elements')) {
    return `⚛️ **Periodic Table Highlights:**\n- **Modern Periodic Law:** Properties of elements are periodic functions of their **atomic numbers** (by Henry Moseley).\n- **Structure:** 18 Groups (Vertical columns) and 7 Periods (Horizontal rows).\n- **First 5 Elements:**\n  1. Hydrogen ($\\text{H}$, $Z=1$)\n  2. Helium ($\\text{He}$, $Z=2$)\n  3. Lithium ($\\text{Li}$, $Z=3$)\n  4. Beryllium ($\\text{Be}$, $Z=4$)\n  5. Boron ($\\text{B}$, $Z=5$)`;
  }

  // Science - Biology
  if (q.includes('cell') || q.includes('mitochondria') || q.includes('dna')) {
    return `🧬 **Cell Biology Essentials:**\n\n- **Cell:** The structural and functional unit of life (discovered by Robert Hooke in 1665).\n- **Mitochondria:** The **"Powerhouse of the Cell"** (produces ATP via cellular respiration).\n- **Nucleus:** The **"Control Center"** containing genetic material (DNA / Chromosomes).\n- **Ribosomes:** Protein factories of the cell.\n- **Plant Cell vs Animal Cell:** Plant cells have a **Cell Wall** and **Chloroplasts**; animal cells do not.`;
  }

  // Computer Science / BCA / IT
  if (q.includes('bca') || q.includes('oops') || q.includes('object oriented')) {
    return `💻 **4 Core Pillars of Object-Oriented Programming (OOP):**\n\n1. **Encapsulation:** Wrapping data (variables) and methods into a single unit (Class) and restricting direct access.\n2. **Abstraction:** Hiding internal complex implementation and showing only essential features.\n3. **Inheritance:** Creating a new class (child) from an existing class (parent) for code reusability.\n4. **Polymorphism:** The ability of a message/function to be processed in more than one form (e.g., Method Overloading & Overriding).`;
  }
  if (q.includes('database') || q.includes('dbms') || q.includes('sql') || q.includes('rdbms')) {
    return `🗄️ **DBMS & SQL Basics:**\n\n- **DBMS:** Database Management System to store, manage, and retrieve data efficiently.\n- **Primary Key:** Unique identifier for each record in a table (cannot be NULL).\n- **Foreign Key:** A field linking to the Primary Key of another table.\n- **Core SQL Commands:**\n  - \`SELECT * FROM students WHERE class='BCA';\`\n  - \`INSERT INTO students (name, class) VALUES ('Rahul', 'BCA');\`\n  - \`UPDATE students SET mobile='9876543210' WHERE id=1;\`\n  - \`DELETE FROM students WHERE id=1;\``;
  }
  if (q.includes('python') || q.includes('java') || q.includes('c++') || q.includes('data structure')) {
    return `💻 **Programming & Data Structures:**\n\n- **Linear Data Structures:** Array, Linked List, Stack (LIFO), Queue (FIFO).\n- **Non-Linear Data Structures:** Trees (Binary Tree, BST), Graphs.\n- **Time Complexity (Big-O Notation):**\n  - Array Access: $O(1)$\n  - Binary Search: $O(\\log n)$\n  - Linear Search: $O(n)$\n  - Merge Sort / Quick Sort (Avg): $O(n \\log n)$`;
  }

  // Commerce & Economics
  if (q.includes('commerce') || q.includes('accounting') || q.includes('debit credit') || q.includes('golden rules')) {
    return `📊 **3 Golden Rules of Accounting:**\n\n1. **Personal Account:**\n   - Debit the Receiver\n   - Credit the Giver\n2. **Real Account (Assets):**\n   - Debit what comes in\n   - Credit what goes out\n3. **Nominal Account (Expenses/Incomes):**\n   - Debit all expenses and losses\n   - Credit all incomes and gains\n\n**Accounting Equation:**\n$$\\text{Assets} = \\text{Liabilities} + \\text{Capital (Equity)}$$`;
  }
  if (q.includes('gdp') || q.includes('inflation') || q.includes('demand') || q.includes('supply')) {
    return `📈 **Economics Key Concepts:**\n\n- **GDP (Gross Domestic Product):** Total market value of all final goods and services produced within a country in a year ($$\\text{GDP} = C + I + G + (X - M)$$).\n- **Law of Demand:** When price rises, quantity demanded falls, keeping other factors constant ($P \\uparrow \\implies Q_d \\downarrow$).\n- **Inflation:** General increase in prices and fall in the purchasing power of money.`;
  }

  // Exam Preparation Tips
  if (q.includes('exam tip') || q.includes('how to study') || q.includes('padhai kaise') || q.includes('score high') || q.includes('marks')) {
    return `🎯 **Top Exam Preparation Tips from Oxford Convent School Faculty:**\n\n1. 📖 **Understand Core Concepts:** Don't just memorize — understand the 'why' behind formulas and theorems.\n2. ⏱️ **Time Management:** Practice timed mock tests on our online portal to build speed.\n3. 📝 **Make Short Notes:** Write 1-page formula and summary sheets for quick last-minute revision.\n4. 🔁 **Solve Previous Year Papers:** Practice MCQ and True/False questions repeatedly.\n5. 🥗 **Stay Healthy & Calm:** Drink plenty of water, sleep 7-8 hours before exam day, and stay confident!`;
  }

  // General fallback tutor response
  return `🎓 **Ai Nandu Tutor:**\n\nRegarding **"${query}"**:\n\n- To understand this topic thoroughly, break it down into core definitions, key formulas, and practical examples.\n- Review your textbook and class notes for detailed syllabus coverage.\n- If you have a specific formula, mathematical problem, programming query, or science question, type the exact question and I will solve and explain it step-by-step! ✨`;
}

module.exports = { getChatbotResponse };