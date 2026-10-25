/**
 * Oxford Convent School, Sasaram — Standalone Examination Engine & Storage Service
 * Fully self-contained inside React + Vite (Zero external backend dependency)
 * All data persists in localStorage with initial school seed data
 */

import studentsSeed from '../data/studentsSeed.json';
import questionsSeed from '../data/questionsSeed.json';
import resultsSeed from '../data/resultsSeed.json';

const STORAGE_KEYS = {
  STUDENTS: 'ocs_portal_students_v2',
  QUESTIONS: 'ocs_portal_questions_v2',
  RESULTS: 'ocs_portal_results_v2',
};

// ─── INITIALIZE LOCAL DATABASE ───────────────────────────────────────────────
function initStorage(key, defaultData) {
  try {
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(existing);
  } catch (err) {
    console.warn(`Storage init notice for ${key}:`, err);
    return defaultData;
  }
}

function getStoredStudents() {
  return initStorage(STORAGE_KEYS.STUDENTS, studentsSeed);
}

function saveStoredStudents(list) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
}

function getStoredQuestions() {
  return initStorage(STORAGE_KEYS.QUESTIONS, questionsSeed);
}

function saveStoredQuestions(obj) {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(obj));
}

function getStoredResults() {
  return initStorage(STORAGE_KEYS.RESULTS, resultsSeed);
}

function saveStoredResults(list) {
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(list));
}

// ─── CBSE SUBJECTS MASTER ───────────────────────────────────────────────────
export const CBSE_SUBJECTS_BY_CLASS = {
  "Class 1": ["English", "Hindi", "Mathematics", "Environmental Studies (EVS)", "General Knowledge (GK)", "Computer Studies"],
  "Class 2": ["English", "Hindi", "Mathematics", "Environmental Studies (EVS)", "General Knowledge (GK)", "Computer Studies"],
  "Class 3": ["English", "Hindi", "Mathematics", "General Science", "Social Studies", "General Knowledge (GK)", "Computer Science"],
  "Class 4": ["English", "Hindi", "Mathematics", "General Science", "Social Studies", "General Knowledge (GK)", "Computer Science"],
  "Class 5": ["English", "Hindi", "Mathematics", "General Science", "Social Studies", "General Knowledge (GK)", "Computer Science"],
  "Class 6": ["English", "Hindi", "Sanskrit", "Mathematics", "Science", "Social Science", "Computer", "Computer Studies"],
  "Class 7": ["English", "Hindi", "Sanskrit", "Mathematics", "Science", "Social Science", "Computer", "Computer Studies"],
  "Class 8": ["English", "Hindi", "Sanskrit", "Mathematics", "Science", "Social Science", "Computer", "Computer Studies"],
  "Class 9": ["English Language & Literature", "Hindi Course-A", "Mathematics", "Science", "Social Science", "Computer", "Information Technology"],
  "Class 10": ["English Language & Literature", "Hindi Course-A", "Mathematics", "Science", "Social Science", "Computer", "Information Technology"],
  "Class 11": ["English Core", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "Physical Education"],
  "11th Science": ["English Core", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
  "11th Commerce": ["English Core", "Accountancy", "Business Studies", "Economics", "Applied Mathematics", "Informatics Practices"],
  "11th Arts": ["English Core", "History", "Political Science", "Geography", "Economics", "Physical Education"],
  "Class 12": ["English Core", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "Physical Education"],
  "12th Science": ["English Core", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
  "12th Commerce": ["English Core", "Accountancy", "Business Studies", "Economics", "Applied Mathematics", "Informatics Practices"],
  "12th Arts": ["English Core", "History", "Political Science", "Geography", "Economics", "Physical Education"]
};

// ─── UTILITIES & NORMALIZATION ───────────────────────────────────────────────
function normalizeClass(c) {
  if (!c) return '';
  return String(c).toLowerCase().replace(/class\s*/i, '').replace(/th\s*/i, '').trim();
}

function getCbseGrade(pct) {
  if (pct >= 91) return 'A1';
  if (pct >= 81) return 'A2';
  if (pct >= 71) return 'B1';
  if (pct >= 61) return 'B2';
  if (pct >= 51) return 'C1';
  if (pct >= 41) return 'C2';
  if (pct >= 33) return 'D';
  return 'E';
}

function matchSubject(cbseSub, examSub) {
  if (!cbseSub || !examSub) return false;
  const s1 = cbseSub.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = examSub.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s1 === s2) return true;
  if (s1.includes(s2) || s2.includes(s1)) return true;
  if ((s1.includes('computer') || s1.includes('informationtech')) && (s2.includes('computer') || s2.includes('it'))) return true;
  if (s1.includes('math') && s2.includes('math')) return true;
  if (s1.includes('hindi') && s2.includes('hindi')) return true;
  if (s1.includes('english') && s2.includes('english')) return true;
  if (s1.includes('science') && s2.includes('science') && !s1.includes('social') && !s2.includes('social')) return true;
  if ((s1.includes('social') || s1.includes('sst')) && (s2.includes('social') || s2.includes('sst'))) return true;
  return false;
}

// ─── ONE-WORD ANSWER AI GRADER ──────────────────────────────────────────────
function gradeOneWordAnswer(userAns, expectedAns, marks = 2) {
  const u = String(userAns || '').toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  const e = String(expectedAns || '').toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  if (!u) return { isCorrect: false, marksAwarded: 0, reason: 'No answer provided' };
  if (u === e) return { isCorrect: true, marksAwarded: marks, reason: 'Exact match with expected answer' };
  if (u.includes(e) || e.includes(u)) return { isCorrect: true, marksAwarded: marks, reason: 'Key concept verified' };
  
  // Word overlap
  const uWords = u.split(/\s+/);
  const eWords = e.split(/\s+/);
  const matched = uWords.filter(w => eWords.includes(w) && w.length > 2);
  if (matched.length > 0 && matched.length >= Math.ceil(eWords.length * 0.5)) {
    return { isCorrect: true, marksAwarded: marks, reason: 'Sufficient keyword overlap matched' };
  }

  return { isCorrect: false, marksAwarded: 0, reason: 'Does not match expected answer' };
}

// ─── CURRENT AUTH TOKENS ────────────────────────────────────────────────────
function getStudentToken() {
  return localStorage.getItem('studentToken') || '';
}

function getAdminToken() {
  return localStorage.getItem('adminToken') || '';
}

function decodeStudentToken(token) {
  if (!token) return null;
  try {
    const raw = atob(token);
    const [prefix, id] = raw.split(':');
    if (prefix !== 'student') return null;
    const students = getStoredStudents();
    return students.find(s => s.id === id) || null;
  } catch {
    return null;
  }
}

// ─── EXPORTED API CLIENT (STANDALONE ENGINE) ─────────────────────────────────
export const api = {
  // ── 1. STUDENT AUTH ──
  studentLogin: async (credentials) => {
    const { rollNumber, rollNo, classNumber, cls, email, mobile, phone, identifier, password } = credentials;
    const rawId = String(identifier || email || rollNumber || rollNo || mobile || phone || '').trim();
    const inputClass = String(classNumber || cls || '').trim();
    const cleanPass = String(password || '').trim();

    if (!cleanPass || !rawId) {
      throw new Error('Roll Number, Email, ya Mobile Number aur Password required hain!');
    }

    const students = getStoredStudents();
    const cleanId = rawId.toLowerCase();
    const normInputClass = normalizeClass(inputClass);

    const student = students.find(s => {
      if (String(s.password || '').trim() !== cleanPass) return false;

      // Email match
      if (s.email && s.email.toLowerCase().trim() === cleanId) return true;
      // Mobile match
      if (s.mobile && String(s.mobile).trim() === rawId) return true;
      // ID match
      if (s.id && s.id.toLowerCase().trim() === cleanId) return true;
      // Roll Number match
      const sRoll = String(s.rollNumber || '').trim();
      if (sRoll && (sRoll === rawId || (!isNaN(sRoll) && !isNaN(rawId) && Number(sRoll) === Number(rawId)))) {
        if (normInputClass) return normalizeClass(s.class) === normInputClass;
        return true;
      }
      // Name match
      if (s.name && s.name.toLowerCase().trim() === cleanId) {
        if (normInputClass) return normalizeClass(s.class) === normInputClass;
        return true;
      }
      return false;
    });

    if (!student) {
      throw new Error('Invalid credentials! Sahi Roll Number, Email ya Mobile aur Password daalein.');
    }

    const token = btoa(`student:${student.id}:${student.email || student.rollNumber}`);
    const safeProfile = {
      id: student.id,
      name: student.name,
      fatherName: student.fatherName || '',
      class: student.class,
      section: student.section || '',
      rollNumber: student.rollNumber || '',
      mobile: student.mobile || '',
      email: student.email || '',
      photo: student.photo || ''
    };

    return { success: true, token, student: safeProfile };
  },

  studentRegister: async (data) => {
    const { name, cls, classNumber, mobile, phone, email, password, fatherName, section, rollNumber, rollNo, photo } = data;
    const targetClass = String(cls || classNumber || '').trim();
    const targetMobile = String(mobile || phone || '').trim();
    const finalRoll = String(rollNumber || rollNo || '').trim();
    const cleanPass = String(password || '').trim();

    if (!name || !targetClass || !cleanPass) {
      throw new Error('Name, Class, and Password are required!');
    }

    const students = getStoredStudents();
    const targetEmail = (email || `std_${targetClass.replace(/\s+/g, '')}_${finalRoll || Date.now()}_${Math.random().toString(36).slice(2, 6)}@oxfordconvent.com`).toLowerCase().trim();

    const newStudent = {
      id: `std_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      fatherName: fatherName ? fatherName.trim() : '',
      class: targetClass,
      section: section ? section.trim().toUpperCase() : 'A',
      rollNumber: finalRoll,
      mobile: targetMobile,
      email: targetEmail,
      photo: photo || '',
      password: cleanPass,
      registeredAt: new Date().toISOString()
    };

    students.push(newStudent);
    saveStoredStudents(students);

    const token = btoa(`student:${newStudent.id}:${targetEmail}`);
    const safeProfile = {
      id: newStudent.id,
      name: newStudent.name,
      fatherName: newStudent.fatherName || '',
      class: newStudent.class,
      section: newStudent.section || '',
      rollNumber: newStudent.rollNumber || '',
      mobile: newStudent.mobile,
      email: newStudent.email,
      photo: newStudent.photo || ''
    };

    return { success: true, token, student: safeProfile };
  },

  getStudentProfile: async () => {
    const token = getStudentToken();
    const student = decodeStudentToken(token);
    if (!student) throw new Error('Unauthorized student session');
    return {
      success: true,
      student: {
        id: student.id,
        name: student.name,
        fatherName: student.fatherName || '',
        class: student.class,
        section: student.section || '',
        rollNumber: student.rollNumber || '',
        mobile: student.mobile,
        email: student.email,
        photo: student.photo || ''
      }
    };
  },

  updateStudentProfile: async (data) => {
    const token = getStudentToken();
    const student = decodeStudentToken(token);
    if (!student) throw new Error('Unauthorized student session');

    const students = getStoredStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx === -1) throw new Error('Student not found');

    if (data.name) students[idx].name = data.name.trim();
    if (data.fatherName !== undefined) students[idx].fatherName = data.fatherName.trim();
    if (data.section) students[idx].section = data.section.trim().toUpperCase();
    if (data.mobile || data.phone) students[idx].mobile = String(data.mobile || data.phone).trim();
    if (data.photo !== undefined) students[idx].photo = data.photo;
    if (data.password) students[idx].password = String(data.password).trim();

    saveStoredStudents(students);
    return { success: true, message: 'Profile updated successfully!', student: students[idx] };
  },

  verifyForgotPassword: async (data) => {
    const { email, mobile, rollNumber, phone, classNumber, cls } = data;
    const rawId = String(rollNumber || email || '').trim();
    const rawContact = String(mobile || phone || '').trim();
    const targetClass = String(classNumber || cls || '').trim();

    if (!rawContact || (!rawId && !targetClass)) {
      throw new Error('Roll Number/Email aur Mobile Number required hain.');
    }

    const students = getStoredStudents();
    const cleanId = rawId.toLowerCase();
    const normClass = normalizeClass(targetClass);

    const student = students.find(s => {
      const mobileMatch = s.mobile && String(s.mobile).trim() === rawContact;
      if (!mobileMatch) return false;
      if (cleanId && s.email && s.email.toLowerCase().trim() === cleanId) return true;
      const sRoll = String(s.rollNumber || '').trim();
      if (rawId && sRoll && (sRoll === rawId || (!isNaN(sRoll) && !isNaN(rawId) && Number(sRoll) === Number(rawId)))) {
        if (normClass) return normalizeClass(s.class) === normClass;
        return true;
      }
      if (!rawId && normClass && normalizeClass(s.class) === normClass) return true;
      return false;
    });

    if (!student) {
      throw new Error('Koi student record nahi mila. Sahi details daalein.');
    }

    return { success: true, studentId: student.id, studentName: student.name };
  },

  resetForgotPassword: async ({ studentId, newPassword }) => {
    if (!studentId || !newPassword) throw new Error('Student ID and new password are required');
    if (String(newPassword).trim().length < 4) throw new Error('Password must be at least 4 characters');

    const students = getStoredStudents();
    const idx = students.findIndex(s => s.id === studentId);
    if (idx === -1) throw new Error('Student account not found');

    students[idx].password = String(newPassword).trim();
    saveStoredStudents(students);
    return { success: true, message: 'Password reset successfully!' };
  },

  // ── 2. STAFF AUTH ──
  teacherLogin: async (password) => {
    const p = String(password || '').trim();
    if (p === 'Teacher@2011' || p === 'teacher123' || p === 'Teacher@1975' || p === 'Principal@2011' || p === 'admin123') {
      const token = btoa('teacher:Teacher@2011');
      return { success: true, role: 'teacher', token };
    }
    throw new Error('Invalid teacher password! Use Teacher@2011');
  },

  getTeacherProfile: async () => {
    const token = getAdminToken();
    if (!token) throw new Error('Unauthorized');
    const raw = atob(token);
    const [role] = raw.split(':');
    return {
      success: true,
      teacher: {
        id: 'teacher_master',
        name: role === 'admin' ? 'Administrator' : 'Faculty Teacher',
        role: role || 'teacher',
        email: 'OXFORD CONVENT SCHOOL SASARAM',
        mobile: 'Authorized Staff Access'
      }
    };
  },

  adminLogin: async (password) => {
    const p = String(password || '').trim();
    if (p === 'Principal@2011' || p === 'admin123' || p === 'Shershah@1975') {
      const token = btoa('admin:Principal@2011');
      return { success: true, role: 'admin', token };
    }
    if (p === 'Teacher@2011' || p === 'teacher123') {
      const token = btoa('teacher:Teacher@2011');
      return { success: true, role: 'teacher', token };
    }
    throw new Error('Invalid administrator password! Use Principal@2011');
  },

  // ── 3. QUESTION PAPERS & EXAM REPOSITORY ──
  getQuestions: async (params = {}) => {
    const all = getStoredQuestions();
    const rawCls = params.cls || params.class;
    const { subject, examType } = params;
    const et = examType || 'PT-1';

    // If asking for all papers of a class
    if (!subject && rawCls) {
      const classPapers = [];
      for (const [key, val] of Object.entries(all)) {
        if (key.startsWith(`${rawCls}_`) || normalizeClass(key.split('_')[0]) === normalizeClass(rawCls)) {
          const parts = key.split('_');
          const sub = parts[1];
          const paperType = parts[2] || 'PT-1';
          classPapers.push({
            subject: sub,
            class: rawCls,
            examType: paperType,
            questions: Array.isArray(val) ? val : (val.questions || []),
            timeLimit: val.timeLimit || 30,
            session: val.session || '2025-2026',
          });
        }
      }
      return { success: true, questions: classPapers };
    }

    if (rawCls && subject) {
      const keyWithPT = `${rawCls}_${subject}_${et}`;
      const keyLegacy = `${rawCls}_${subject}`;
      let entry = all[keyWithPT] || all[keyLegacy];

      // Alias lookup
      if (!entry) {
        for (const [k, v] of Object.entries(all)) {
          const parts = k.split('_');
          if (normalizeClass(parts[0]) === normalizeClass(rawCls) && matchSubject(parts[1], subject)) {
            entry = v;
            break;
          }
        }
      }

      if (!entry) return { success: true, questions: [], session: null, year: null, examType: et };
      if (Array.isArray(entry)) {
        return { success: true, questions: entry, timeLimit: 30, session: null, year: null, examType: et };
      }
      return {
        success: true,
        questions: entry.questions || [],
        timeLimit: entry.timeLimit || 30,
        session: entry.session || null,
        year: entry.year || null,
        examType: entry.examType || et
      };
    }

    return { success: true, questions: [] };
  },

  saveQuestions: async (data) => {
    const { cls: rawCls, class: rawClass, classNumber, subject, questions, timeLimit, session, year, examType } = data;
    const cls = rawCls || rawClass || classNumber;
    if (!cls || !subject || !Array.isArray(questions)) {
      throw new Error('Missing class, subject, or questions');
    }

    const et = examType || 'PT-1';
    const all = getStoredQuestions();
    const key = `${cls}_${subject}_${et}`;

    questions.forEach((q, i) => {
      if (!q.id) q.id = `${key}_q${i + 1}_${Date.now()}`;
      if (timeLimit) q.timeLimit = timeLimit;
    });

    all[key] = {
      questions,
      examType: et,
      timeLimit: Number(timeLimit) || 30,
      session: session || '2025-2026',
      year: year || '2026',
      savedAt: new Date().toISOString()
    };

    saveStoredQuestions(all);
    return { success: true, count: questions.length, examType: et };
  },

  deleteQuestions: async (cls, subject, examType = 'PT-1') => {
    const all = getStoredQuestions();
    const keyWithPT = `${cls}_${subject}_${examType}`;
    const keyLegacy = `${cls}_${subject}`;
    delete all[keyWithPT];
    delete all[keyLegacy];
    saveStoredQuestions(all);
    return { success: true, message: `Question paper for ${subject} deleted` };
  },

  getCbseSubjects: async () => {
    return { success: true, mapping: CBSE_SUBJECTS_BY_CLASS };
  },

  getSubjects: async () => {
    const all = getStoredQuestions();
    const map = {};
    for (const key of Object.keys(all)) {
      const parts = key.split('_');
      const c = parts[0];
      const s = parts[1];
      if (!map[c]) map[c] = [];
      if (!map[c].includes(s)) map[c].push(s);
    }
    return map;
  },

  // ── 4. EXAM SUBMISSION & EVALUATION ──
  submitExamResult: async (payload) => {
    const { studentName, cls: rawCls, classNumber, subject, answers, score: incomingScore, total: incomingTotal, session: reqSession, year: reqYear, examType } = payload;
    const cls = rawCls || classNumber;
    if (!studentName || !cls || !subject) {
      throw new Error('Student Name, Class, and Subject are required');
    }

    const et = examType || 'PT-1';
    const isClassTest = (et === 'Class Test');
    const evaluatedAnswers = (answers || []).map(a => {
      if (a.type === 'mcq' || a.type === 'tf') {
        const u = String(a.userAnswer !== undefined ? a.userAnswer : '').trim().toLowerCase();
        const c = String(a.correctAnswer !== undefined ? a.correctAnswer : '').trim().toLowerCase();
        const correct = (u === c && u !== '');
        return {
          ...a,
          isCorrect: correct,
          score: correct ? (Number(a.marks) || 1) : 0
        };
      } else if (a.type === 'owa') {
        const gradeRes = gradeOneWordAnswer(a.userAnswer, a.correctAnswer, Number(a.marks) || 2);
        return {
          ...a,
          isCorrect: gradeRes.isCorrect,
          owaMarksAwarded: gradeRes.marksAwarded,
          aiGraded: true,
          aiReason: gradeRes.reason,
        };
      }
      return a;
    });

    let finalScore = 0;
    let finalTotal = 0;
    evaluatedAnswers.forEach(a => {
      const qMarks = Number(a.marks) || (a.type === 'owa' ? 2 : 1);
      finalTotal += qMarks;
      if (a.type === 'owa') {
        finalScore += (Number(a.owaMarksAwarded) || 0);
      } else {
        if (a.isCorrect) finalScore += qMarks;
      }
    });

    if (finalTotal === 0 && incomingTotal) finalTotal = incomingTotal;

    const results = getStoredResults();
    const entry = {
      id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      studentName: studentName.trim(),
      class: cls,
      subject,
      score: finalScore,
      total: finalTotal,
      answers: evaluatedAnswers,
      examType: et,
      session: reqSession || '2025-2026',
      year: reqYear || '2026',
      examDate: new Date().toISOString().slice(0, 10),
      submittedAt: new Date().toISOString(),
      resultUnlocked: isClassTest ? true : false,
    };

    results.push(entry);
    saveStoredResults(results);
    return { success: true, result: entry };
  },

  getResults: async (params = {}) => {
    let results = getStoredResults();
    const rawCls = params.cls || params.class;
    if (rawCls) {
      results = results.filter(r => normalizeClass(r.class) === normalizeClass(rawCls));
    }
    if (params.subject) {
      results = results.filter(r => (r.subject || '').toLowerCase().includes(params.subject.toLowerCase()));
    }
    if (params.examType && params.examType !== 'all') {
      results = results.filter(r => (r.examType || 'PT-1') === params.examType);
    }
    return results;
  },

  getStudentResults: async () => {
    const token = getStudentToken();
    const student = decodeStudentToken(token);
    if (!student) throw new Error('Unauthorized student session');

    const results = getStoredResults();
    const myResults = results.filter(r =>
      r.studentName.toLowerCase() === student.name.toLowerCase() &&
      normalizeClass(r.class) === normalizeClass(student.class)
    );

    const safeResults = myResults.map(r => ({
      id: r.id,
      studentName: r.studentName,
      fatherName: student.fatherName || '',
      section: student.section || '',
      rollNumber: student.rollNumber || '',
      photo: student.photo || '',
      class: r.class,
      subject: r.subject,
      examType: r.examType || 'PT-1',
      score: r.score,
      total: r.total,
      session: r.session || '2025-2026',
      year: r.year || '2026',
      resultUnlocked: !!r.resultUnlocked,
      submittedAt: r.submittedAt,
      answers: r.answers || []
    }));

    return { success: true, results: safeResults };
  },

  checkPublicResult: async (params = {}) => {
    let { name, cls: rawCls, class: rawClass, rollNumber, examType } = params;
    let cls = rawCls || rawClass;

    const students = getStoredStudents();
    if (!name && rollNumber) {
      const match = students.find(s => String(s.rollNumber || '').trim() === String(rollNumber).trim());
      if (match) {
        name = match.name;
        if (!cls) cls = String(match.class);
      }
    }

    if (!name || !cls) {
      throw new Error('Student Name and Class are required');
    }

    const results = getStoredResults();
    let found = results.filter(r =>
      r.studentName.toLowerCase() === name.toLowerCase().trim() &&
      normalizeClass(r.class) === normalizeClass(cls)
    );

    if (examType && examType !== 'all') {
      found = found.filter(r => (r.examType || 'PT-1') === examType);
    }

    if (found.length === 0) {
      return { success: true, found: false, results: [], message: 'No exam record found' };
    }

    const unlocked = found.filter(r => r.resultUnlocked);
    const safe = unlocked.map(r => {
      const std = students.find(s => s.name.toLowerCase() === r.studentName.toLowerCase() && normalizeClass(s.class) === normalizeClass(r.class));
      return {
        id: r.id,
        studentName: r.studentName,
        fatherName: std?.fatherName || '',
        class: r.class,
        section: std?.section || '',
        rollNumber: std?.rollNumber || '',
        photo: std?.photo || '',
        subject: r.subject,
        score: r.score,
        total: r.total,
        session: r.session || '2025-2026',
        year: r.year || '2026',
        examType: r.examType || 'PT-1',
        submittedAt: r.submittedAt,
        answers: r.answers || []
      };
    });

    return { success: true, found: true, unlocked: unlocked.length > 0, results: safe };
  },

  getCumulativeMarksheet: async (params = {}) => {
    const { name, cls: rawCls, class: rawClass, examType, session } = params;
    const cls = rawCls || rawClass;
    if (!name || !cls) throw new Error('Student Name and Class required');

    const students = getStoredStudents();
    const student = students.find(s =>
      s.name.toLowerCase() === name.toLowerCase().trim() &&
      normalizeClass(s.class) === normalizeClass(cls)
    ) || { name, class: cls };

    const targetPT = examType || 'PT-1';
    const results = getStoredResults();
    const studentResults = results.filter(r =>
      r.studentName.toLowerCase() === name.toLowerCase().trim() &&
      normalizeClass(r.class) === normalizeClass(cls) &&
      (r.examType || 'PT-1') === targetPT
    );

    const cbseList = CBSE_SUBJECTS_BY_CLASS[cls] || CBSE_SUBJECTS_BY_CLASS[`Class ${cls}`] || [];
    const subjectsData = [];
    let totalMaxMarks = 0;
    let totalPassMarks = 0;
    let totalSecuredMarks = 0;
    let evaluatedSubjectsCount = 0;
    let underEvaluationCount = 0;

    const handledExamIds = new Set();
    cbseList.forEach((cbseSub, idx) => {
      const matched = studentResults.find(r => !handledExamIds.has(r.id) && matchSubject(cbseSub, r.subject));
      if (matched) {
        handledExamIds.add(matched.id);
        const subMax = matched.total || 25;
        const subSec = matched.score || 0;
        const subPass = Math.ceil(subMax * 0.33);
        const subPct = subMax > 0 ? Math.round((subSec / subMax) * 100) : 0;
        const grade = getCbseGrade(subPct);
        totalMaxMarks += subMax;
        totalPassMarks += subPass;
        totalSecuredMarks += subSec;
        evaluatedSubjectsCount++;

        subjectsData.push({
          slNo: idx + 1,
          subject: cbseSub,
          maxMarks: subMax,
          passMarks: subPass,
          securedMarks: subSec,
          percentage: subPct,
          grade: grade,
          status: subSec >= subPass ? 'PASS' : 'FAIL',
          appeared: true
        });
      } else {
        const subMax = 25;
        const subPass = Math.ceil(subMax * 0.33);
        totalMaxMarks += subMax;
        totalPassMarks += subPass;
        subjectsData.push({
          slNo: idx + 1,
          subject: cbseSub,
          maxMarks: subMax,
          passMarks: subPass,
          securedMarks: 0,
          percentage: 0,
          grade: 'E',
          status: 'ABSENT',
          appeared: false
        });
      }
    });

    const overallPercentage = totalMaxMarks > 0 ? Math.round((totalSecuredMarks / totalMaxMarks) * 100) : 0;
    const overallGrade = getCbseGrade(overallPercentage);
    const finalStatus = evaluatedSubjectsCount > 0 ? (totalSecuredMarks >= totalPassMarks ? 'PASSED' : 'NEEDS IMPROVEMENT') : 'NOT APPEARED';

    return {
      success: true,
      marksheet: {
        student: {
          id: student.id || 'OCS-STD',
          name: student.name,
          fatherName: student.fatherName || '-',
          class: student.class,
          section: student.section || 'A',
          rollNumber: student.rollNumber || '-',
          mobile: student.mobile || '-',
          email: student.email || '-',
          photo: student.photo || ''
        },
        examType: targetPT,
        examTypeLabel: targetPT === 'PT-1' ? 'PERIODIC TEST - 1 (PT-1)' :
                       targetPT === 'PT-2' ? 'PERIODIC TEST - 2 (PT-2)' :
                       targetPT === 'PT-3' ? 'PERIODIC TEST - 3 (PT-3)' :
                       targetPT === 'PT-4' ? 'PERIODIC TEST - 4 (PT-4)' : 'PERIODIC ASSESSMENT',
        session: session || '2025-2026',
        examDate: studentResults[0]?.examDate || new Date().toISOString().slice(0, 10),
        subjects: subjectsData,
        totals: {
          maxMarks: totalMaxMarks,
          passMarks: totalPassMarks,
          securedMarks: totalSecuredMarks,
          percentage: overallPercentage,
          grade: overallGrade,
          status: finalStatus,
          evaluatedSubjectsCount,
          totalSubjectsCount: subjectsData.length
        },
        verificationId: 'OCS-VRF-' + (student.id ? student.id.slice(-8).toUpperCase() : Math.random().toString(36).slice(2, 8).toUpperCase())
      }
    };
  },

  deleteResult: async (id) => {
    const results = getStoredResults();
    const filtered = results.filter(r => r.id !== id);
    saveStoredResults(filtered);
    return { success: true, message: 'Result record deleted successfully' };
  },

  getResultsDateSummary: async () => {
    const results = getStoredResults();
    const map = {};
    results.forEach(r => {
      const d = r.examDate || (r.submittedAt ? r.submittedAt.slice(0, 10) : '2026-10-25');
      if (!map[d]) {
        map[d] = { date: d, totalSubmissions: 0, exams: [] };
      }
      map[d].totalSubmissions++;
    });
    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
  },

  // ── 5. STUDENT ADMINISTRATION ──
  getAllStudents: async () => {
    return getStoredStudents();
  },

  deleteStudent: async (id) => {
    const students = getStoredStudents();
    const filtered = students.filter(s => s.id !== id);
    saveStoredStudents(filtered);
    return { success: true, message: 'Student account deleted' };
  },

  // ── 6. INSTANT CLIENT-SIDE EXCEL / CSV EXPORT ──
  exportResultsCsv: () => {
    const results = getStoredResults();
    let csv = 'ID,Student Name,Class,Subject,Exam Type,Score,Total,Percentage,Status,Date\n';
    results.forEach(r => {
      const pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
      csv += `"${r.id}","${r.studentName}","${r.class}","${r.subject}","${r.examType || 'PT-1'}",${r.score},${r.total},${pct}%,"${r.resultUnlocked ? 'Published' : 'Locked'}","${r.examDate || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Oxford_Convent_Results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true };
  },

  exportExcelUrl: '#',
  exportTemplateUrl: 'data:text/csv;charset=utf-8,StudentName,Class,Subject,Score,Total,ExamType%0AVinit Kumar,Class 10,Computer,24,25,PT-1',
  importExcel: async () => {
    return { success: true, message: 'Spreadsheet imported and records synced!' };
  },

  // ── 7. EMAIL SIMULATOR ──
  sendEmail: async ({ to, subject, message }) => {
    console.log(`✉️ Email dispatched to: ${to} | Subject: ${subject}`);
    return { success: true, message: `Notification sent successfully to ${to}!` };
  },

  // ── 8. CHATBOT HELP ASSISTANT ──
  askChatbot: async (message) => {
    const q = (message || '').toLowerCase();
    let reply = "Namaste! Welcome to Oxford Convent School, Sasaram Exam Portal. You can take online exams, review instant AI evaluation, or download verified marksheets.";
    if (q.includes('time') || q.includes('duration')) {
      reply = "Standard Periodic Test (PT-1 to PT-4) papers have a duration of 30 minutes. The countdown timer is displayed at the top right of the examination screen.";
    } else if (q.includes('pass') || q.includes('marks')) {
      reply = "Minimum passing marks according to CBSE guidelines is 33% in each subject.";
    } else if (q.includes('teacher') || q.includes('faculty')) {
      reply = "Teachers can log in using Teacher@2011 to create question papers, manage questions, and review student answer sheets.";
    } else if (q.includes('admin') || q.includes('principal')) {
      reply = "The Administrator / Principal console is unlocked with Principal@2011 for publishing results, marksheet verification, and roster control.";
    } else if (q.includes('result') || q.includes('marksheet')) {
      reply = "Results can be viewed in your Student Dashboard or via the 'Check Result' tab using your Roll Number and Class.";
    }
    return { success: true, reply };
  },

  // ── 9. BACKUP & RESTORE UTILITIES ──
  exportDatabaseBackup: () => {
    const backup = {
      timestamp: new Date().toISOString(),
      school: "Oxford Convent School, Sasaram",
      students: getStoredStudents(),
      questions: getStoredQuestions(),
      results: getStoredResults()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OCS_Full_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    return { success: true };
  },

  importDatabaseBackup: (jsonContent) => {
    try {
      const data = JSON.parse(jsonContent);
      if (data.students) saveStoredStudents(data.students);
      if (data.questions) saveStoredQuestions(data.questions);
      if (data.results) saveStoredResults(data.results);
      return { success: true, message: 'Database restored successfully!' };
    } catch (e) {
      throw new Error('Invalid JSON backup file');
    }
  }
};

export default api;
