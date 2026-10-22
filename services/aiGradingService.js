/**
 * Oxford Convent School - High-Speed AI & Heuristic One-Word Answer (OWA) Grading Service
 * Optimized for instant auto-evaluation (< 50ms) with full syllabus knowledge engine,
 * spelling tolerance, abbreviations, and Gemini 2.5 AI grading.
 * Automatically outputs correct/expected answer in answer key if answer is incorrect.
 */

const COMMON_ABBREVIATIONS = {
  'cpu': 'central processing unit',
  'central processing unit': 'cpu',
  'alu': 'arithmetic logic unit',
  'arithmetic logic unit': 'alu',
  'ram': 'random access memory',
  'random access memory': 'ram',
  'rom': 'read only memory',
  'read only memory': 'rom',
  'os': 'operating system',
  'operating system': 'os',
  'lan': 'local area network',
  'local area network': 'lan',
  'wan': 'wide area network',
  'wide area network': 'wan',
  'man': 'metropolitan area network',
  'metropolitan area network': 'man',
  'html': 'hypertext markup language',
  'hypertext markup language': 'html',
  'css': 'cascading style sheets',
  'cascading style sheets': 'css',
  'sql': 'structured query language',
  'structured query language': 'sql',
  'ip': 'internet protocol',
  'internet protocol': 'ip',
  'dns': 'domain name system',
  'domain name system': 'dns',
  'smtp': 'simple mail transfer protocol',
  'simple mail transfer protocol': 'smtp',
  'http': 'hypertext transfer protocol',
  'hypertext transfer protocol': 'http',
  'https': 'hypertext transfer protocol secure',
  'hypertext transfer protocol secure': 'https',
  'dbms': 'database management system',
  'database management system': 'dbms',
  'bps': 'bits per second',
  'bits per second': 'bps',
  'gui': 'graphical user interface',
  'graphical user interface': 'gui',
  'cli': 'command line interface',
  'command line interface': 'cli',
  'ai': 'artificial intelligence',
  'artificial intelligence': 'ai',
  'it': 'information technology',
  'information technology': 'it',
  'h2o': 'water',
  'water': 'h2o',
  'co2': 'carbon dioxide',
  'carbon dioxide': 'co2',
  'vdu': 'visual display unit',
  'crt': 'cathode ray tube',
  'lcd': 'liquid crystal display',
  'led': 'light emitting diode',
  'dvd': 'digital versatile disc',
  'cd': 'compact disc',
  'usb': 'universal serial bus',
  'ups': 'uninterruptible power supply',
  'kb': 'kilobyte',
  'mb': 'megabyte',
  'gb': 'gigabyte',
  'tb': 'terabyte',
  'wlan': 'wireless local area network',
  'pan': 'personal area network',
  'iot': 'internet of things',
  'url': 'uniform resource locator',
  'isp': 'internet service provider',
  'www': 'world wide web',
  'ftp': 'file transfer protocol',
  'bios': 'basic input output system',
  'docx': 'document',
  'it act': 'information technology act',
  'it act 2000': 'information technology act 2000'
};

const NUMBER_WORDS = {
  '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
  '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
  '10': 'ten', '16': 'sixteen', '32': 'thirty two', '64': 'sixty four'
};

const KNOWLEDGE_DATABASE = [
  // Class 10 & Office Automation
  { qTerms: ['libreoffice', 'word processing'], aTerms: ['writer', 'libreoffice writer'], canonicalAnswer: 'Writer' },
  { qTerms: ['libreoffice', 'spreadsheet'], aTerms: ['calc', 'libreoffice calc'], canonicalAnswer: 'Calc' },
  { qTerms: ['libreoffice', 'database'], aTerms: ['base', 'libreoffice base'], canonicalAnswer: 'Base' },
  { qTerms: ['libreoffice', 'presentation'], aTerms: ['impress', 'libreoffice impress'], canonicalAnswer: 'Impress' },
  { qTerms: ['repetitive', 'calc'], aTerms: ['macro', 'macros'], canonicalAnswer: 'Macro' },
  { qTerms: ['automates repetitive tasks'], aTerms: ['macro', 'macros'], canonicalAnswer: 'Macro' },
  { qTerms: ['relational database', 'query'], aTerms: ['sql', 'structured query language'], canonicalAnswer: 'SQL' },
  { qTerms: ['query relational databases'], aTerms: ['sql', 'structured query language'], canonicalAnswer: 'SQL' },

  // Class 6 Computer
  { qTerms: ['earliest mechanical calculating device'], aTerms: ['abacus'], canonicalAnswer: 'Abacus' },
  { qTerms: ['beads on wires'], aTerms: ['abacus'], canonicalAnswer: 'Abacus' },
  { qTerms: ['permanent primary memory', 'boot'], aTerms: ['rom', 'read only memory'], canonicalAnswer: 'ROM' },
  { qTerms: ['startup boot instructions'], aTerms: ['rom', 'read only memory', 'bios'], canonicalAnswer: 'ROM' },
  { qTerms: ['horizontal bar', 'bottom', 'desktop'], aTerms: ['taskbar'], canonicalAnswer: 'Taskbar' },
  { qTerms: ['file extension', 'word document'], aTerms: ['.docx', 'docx'], canonicalAnswer: '.docx' },
  { qTerms: ['interconnected computers'], aTerms: ['internet'], canonicalAnswer: 'Internet' },

  // Class 7 Computer
  { qTerms: ['hexadecimal', 'base'], aTerms: ['16', 'sixteen'], canonicalAnswer: '16' },
  { qTerms: ['radix of the hexadecimal'], aTerms: ['16', 'sixteen'], canonicalAnswer: '16' },
  { qTerms: ['volatile main memory', 'cpu'], aTerms: ['ram', 'random access memory'], canonicalAnswer: 'RAM' },
  { qTerms: ['arithmetic total', 'excel'], aTerms: ['sum', '=sum', 'sum()'], canonicalAnswer: 'SUM' },
  { qTerms: ['html tag', 'visible contents'], aTerms: ['body', '<body>'], canonicalAnswer: 'body' },
  { qTerms: ['disguised as legitimate'], aTerms: ['trojan', 'trojan horse'], canonicalAnswer: 'Trojan' },

  // Class 8 Computer
  { qTerms: ['48-bit', 'nic'], aTerms: ['mac', 'mac address'], canonicalAnswer: 'MAC' },
  { qTerms: ['hardware address', 'nic'], aTerms: ['mac', 'mac address'], canonicalAnswer: 'MAC' },
  { qTerms: ['vertical column', 'database table'], aTerms: ['field', 'column', 'attribute'], canonicalAnswer: 'Field' },
  { qTerms: ['secure encrypted', 'http'], aTerms: ['https'], canonicalAnswer: 'HTTPS' },
  { qTerms: ['python', 'accept input'], aTerms: ['input', 'input()'], canonicalAnswer: 'input' },
  { qTerms: ['plain text into unreadable', 'ciphertext'], aTerms: ['encryption'], canonicalAnswer: 'Encryption' },

  // Class 9 Computer
  { qTerms: ['numerical label', 'device', 'ip network'], aTerms: ['ip', 'ip address'], canonicalAnswer: 'IP' },
  { qTerms: ['encrypts victim files', 'ransom'], aTerms: ['ransomware'], canonicalAnswer: 'Ransomware' },
  { qTerms: ['merges a standard document template', 'recipient'], aTerms: ['mail merge'], canonicalAnswer: 'Mail Merge' },
  { qTerms: ['transmission capacity', 'network'], aTerms: ['bandwidth'], canonicalAnswer: 'Bandwidth' },
  { qTerms: ['cyber legislation', '2000'], aTerms: ['it act', 'it act 2000', 'information technology act'], canonicalAnswer: 'IT Act' },

  // Class 11 & 12 Computer & Science
  { qTerms: ['python keyword', 'sends a value back'], aTerms: ['return'], canonicalAnswer: 'return' },
  { qTerms: ['inserting an element into a stack'], aTerms: ['push'], canonicalAnswer: 'push' },
  { qTerms: ['removes duplicate rows'], aTerms: ['distinct'], canonicalAnswer: 'DISTINCT' },
  { qTerms: ['translates domain names into ip'], aTerms: ['dns', 'domain name system'], canonicalAnswer: 'DNS' },
  { qTerms: ['another name for a row'], aTerms: ['tuple', 'record'], canonicalAnswer: 'tuple' },
  { qTerms: ['capacitance', 'si unit'], aTerms: ['farad', 'f'], canonicalAnswer: 'Farad' },
  { qTerms: ['detects small electric currents'], aTerms: ['galvanometer'], canonicalAnswer: 'Galvanometer' },
  { qTerms: ['quantum of electromagnetic'], aTerms: ['photon'], canonicalAnswer: 'Photon' },
  { qTerms: ['bending of light', 'obstacle'], aTerms: ['diffraction'], canonicalAnswer: 'Diffraction' },
  { qTerms: ['adding a controlled amount of impurity', 'semiconductor'], aTerms: ['doping'], canonicalAnswer: 'Doping' },

  // General Science & GK
  { qTerms: ['powerhouse', 'cell'], aTerms: ['mitochondria', 'mitochondrion'], canonicalAnswer: 'Mitochondria' },
  { qTerms: ['brain of computer'], aTerms: ['cpu', 'processor', 'central processing unit'], canonicalAnswer: 'CPU' },
  { qTerms: ['purifies blood'], aTerms: ['kidney', 'kidneys'], canonicalAnswer: 'Kidney' },
  { qTerms: ['red planet'], aTerms: ['mars'], canonicalAnswer: 'Mars' },
  { qTerms: ['largest mammal'], aTerms: ['blue whale', 'whale'], canonicalAnswer: 'Blue Whale' },
  { qTerms: ['hardest substance'], aTerms: ['diamond'], canonicalAnswer: 'Diamond' },
  { qTerms: ['formula for water'], aTerms: ['h2o', 'water'], canonicalAnswer: 'H2O' },
  { qTerms: ['capital of india'], aTerms: ['new delhi', 'delhi'], canonicalAnswer: 'New Delhi' },
  { qTerms: ['capital of bihar'], aTerms: ['patna'], canonicalAnswer: 'Patna' },
  { qTerms: ['father of computer'], aTerms: ['charles babbage', 'babbage'], canonicalAnswer: 'Charles Babbage' }
];

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 99; // Quick rejection
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function cleanTokens(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g, ' ')
    .replace(/\b(the|a|an|is|are|of|to|in|for|called)\b/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

function normalizeStr(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\b(the|a|an)\b/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolves the canonical expected answer from question text or reference answer
 */
function resolveCanonicalAnswer(questionText, referenceAnswer) {
  if (referenceAnswer && referenceAnswer !== 0 && referenceAnswer !== '0' && String(referenceAnswer).trim() !== '') {
    return String(referenceAnswer).trim();
  }
  const q = (questionText || '').toLowerCase();
  for (const item of KNOWLEDGE_DATABASE) {
    if (item.qTerms.every(term => q.includes(term))) {
      return item.canonicalAnswer;
    }
  }
  return '';
}

/**
 * Main function to evaluate student One Word Answer (OWA).
 * Returns: { isCorrect, awardedMarks, expectedAnswer, reason }
 */
async function gradeOneWordAnswer(questionText, studentAnswer, correctAnswer = '', maxMarks = 2) {
  const sAns = (studentAnswer || '').toString().trim();
  const marks = Number(maxMarks) || 2;
  const canonicalExpected = resolveCanonicalAnswer(questionText, correctAnswer);

  // 1. If student didn't answer anything
  if (!sAns) {
    return {
      isCorrect: false,
      awardedMarks: 0,
      expectedAnswer: canonicalExpected,
      reason: canonicalExpected 
        ? `No answer submitted by student. Sahi Uttar (Correct Answer): ${canonicalExpected}`
        : 'No answer submitted by student.'
    };
  }

  // 2. High-speed local evaluation (< 0.1 millisecond)
  const normStd = normalizeStr(sAns);
  const normCorr = normalizeStr(canonicalExpected);

  if (normCorr) {
    // A. Exact match
    if (normStd === normCorr) {
      return { isCorrect: true, awardedMarks: marks, expectedAnswer: canonicalExpected, reason: 'Exact match with expected answer.' };
    }

    // B. Alphanumeric stripped match
    const alphaStd = normStd.replace(/[^a-z0-9]/g, '');
    const alphaCorr = normCorr.replace(/[^a-z0-9]/g, '');
    if (alphaStd && alphaStd === alphaCorr) {
      return { isCorrect: true, awardedMarks: marks, expectedAnswer: canonicalExpected, reason: 'Matched expected answer.' };
    }

    // C. Number equivalents (e.g. "2" and "two", "16" and "sixteen")
    if (NUMBER_WORDS[alphaStd] === alphaCorr || NUMBER_WORDS[alphaCorr] === alphaStd) {
      return { isCorrect: true, awardedMarks: marks, expectedAnswer: canonicalExpected, reason: 'Matched numeric answer.' };
    }

    // D. Abbreviation & Full form match
    if (COMMON_ABBREVIATIONS[alphaStd] === normCorr || COMMON_ABBREVIATIONS[alphaCorr] === normStd || COMMON_ABBREVIATIONS[normStd] === normCorr) {
      return { isCorrect: true, awardedMarks: marks, expectedAnswer: canonicalExpected, reason: 'Recognized correct abbreviation / full form.' };
    }

    // E. Substring containment
    if (alphaStd.length >= 3 && alphaCorr.length >= 3) {
      if (alphaStd.includes(alphaCorr) || alphaCorr.includes(alphaStd)) {
        return { isCorrect: true, awardedMarks: marks, expectedAnswer: canonicalExpected, reason: 'Conceptually matched reference answer.' };
      }
    }

    // F. Token-level overlap (e.g. "Mail Merge" tokens in "Mail merge feature")
    const stdTokens = cleanTokens(normStd);
    const corrTokens = cleanTokens(normCorr);
    if (corrTokens.length > 0 && corrTokens.every(t => stdTokens.includes(t))) {
      return { isCorrect: true, awardedMarks: marks, expectedAnswer: canonicalExpected, reason: 'Key technical terms matched.' };
    }
    if (stdTokens.length > 0 && stdTokens.every(t => corrTokens.includes(t))) {
      return { isCorrect: true, awardedMarks: marks, expectedAnswer: canonicalExpected, reason: 'Key technical terms matched.' };
    }

    // G. Levenshtein edit distance (tolerance for 1-2 character spelling errors)
    if (alphaStd.length >= 4 && alphaCorr.length >= 4) {
      const dist = levenshtein(alphaStd, alphaCorr);
      if (dist <= 2) {
        return { isCorrect: true, awardedMarks: marks, expectedAnswer: canonicalExpected, reason: 'Correct answer (minor spelling variation accepted).' };
      }
    }
  }

  // 3. Heuristic Knowledge Check with Oxford Curriculum Engine (< 0.1ms)
  const heuristic = fallbackHeuristicGrade(questionText, normStd, canonicalExpected, marks);
  if (heuristic.isCorrect) {
    return heuristic;
  }

  // 4. Ultra-fast AI check with tight 700ms timeout if Gemini key is available
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 700); // 700ms max

      const prompt = `Grade student one-word answer for Oxford Convent School exam.
Question: "${questionText}"
Reference / Expected Answer: "${canonicalExpected || 'Infer correct answer from question'}"
Student Answer: "${sAns}"
Max Marks: ${marks}
Rules:
1. Award full marks if conceptually correct or minor spelling mistake. Else 0.
2. In all cases, specify the accurate, canonical correct answer in "expectedAnswer".
3. If incorrect, state: "Answer does not match expected solution. Sahi Uttar (Correct Answer): <expectedAnswer>".
Return JSON ONLY: {"isCorrect": boolean, "awardedMarks": number, "expectedAnswer": "string", "reason": "string"}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const awarded = Math.min(Math.max(Number(parsed.awardedMarks) || 0, 0), marks);
          const isOk = Boolean(parsed.isCorrect && awarded > 0);
          const resolvedAns = parsed.expectedAnswer || canonicalExpected;
          let finalReason = parsed.reason || '';

          if (!isOk) {
            if (resolvedAns) {
              finalReason = `Answer does not match expected solution. Sahi Uttar (Correct Answer): ${resolvedAns}`;
            } else {
              finalReason = 'Answer does not match expected solution.';
            }
          }

          return {
            isCorrect: isOk,
            awardedMarks: awarded,
            expectedAnswer: resolvedAns,
            reason: finalReason
          };
        }
      }
    } catch (err) {
      // Network delay or abort - fallback immediately to heuristic
    }
  }

  return heuristic;
}

function fallbackHeuristicGrade(question, studentAns, canonicalExpected, maxMarks) {
  const s = (studentAns || '').toLowerCase().trim();
  const c = (canonicalExpected || '').toLowerCase().trim();

  if (c && (s === c || s.includes(c) || c.includes(s))) {
    return {
      isCorrect: true,
      awardedMarks: maxMarks,
      expectedAnswer: canonicalExpected,
      reason: 'Matched reference answer.'
    };
  }

  const q = (question || '').toLowerCase();
  for (const pair of KNOWLEDGE_DATABASE) {
    if (pair.qTerms.every(term => q.includes(term))) {
      if (pair.aTerms.some(term => s.includes(term))) {
        return {
          isCorrect: true,
          awardedMarks: maxMarks,
          expectedAnswer: pair.canonicalAnswer,
          reason: 'Correct concept verified by Oxford Knowledge Engine.'
        };
      } else {
        // Known question with incorrect student answer: provide correct answer immediately
        return {
          isCorrect: false,
          awardedMarks: 0,
          expectedAnswer: pair.canonicalAnswer,
          reason: `Answer does not match expected solution. Sahi Uttar (Correct Answer): ${pair.canonicalAnswer}`
        };
      }
    }
  }

  const wrongReason = canonicalExpected
    ? `Answer does not match expected solution. Sahi Uttar (Correct Answer): ${canonicalExpected}`
    : 'Answer does not match expected solution.';

  return {
    isCorrect: false,
    awardedMarks: 0,
    expectedAnswer: canonicalExpected || '',
    reason: wrongReason
  };
}

module.exports = {
  gradeOneWordAnswer,
  resolveCanonicalAnswer
};
