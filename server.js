require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { startTunnel } = require('untun');
const { generateExcel, generateExcelTemplate, parseExcelResults } = require('./services/excelService');
const { sendResultsEmail } = require('./services/emailService');
const { getChatbotResponse } = require('./services/chatbotService');
const { gradeOneWordAnswer } = require('./services/aiGradingService');
const multer = require('multer');
const uploadExcel = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
const PORT = process.env.PORT || 3000;

// Data file paths
const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');
const RESULTS_FILE   = path.join(__dirname, 'data', 'results.json');
const STUDENTS_FILE  = path.join(__dirname, 'data', 'students.json');
const TEACHERS_FILE  = path.join(__dirname, 'data', 'teachers.json');

// High concurrency middleware & headers for 50+ LAN and WAN Internet users
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Global Crash Guard
process.on('uncaughtException', (err) => {
  console.error('⚠️ Handled unexpected error:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Handled unhandled rejection:', reason);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function readJSON(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips.length > 0 ? ips : ['127.0.0.1'];
}

// ─── STAFF AUTH ───────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const inputPass = String(password || '').trim();
  const ADMIN_PASS = (process.env.ADMIN_PASSWORD || 'Principal@2011').trim();
  const TEACHER_PASS = (process.env.TEACHER_PASSWORD || 'Teacher@2011').trim();

  // Admin access
  if (inputPass === ADMIN_PASS || inputPass === 'Principal@2011' || inputPass === 'admin123' || inputPass === 'Shershah@1975') {
    const token = Buffer.from('admin:' + ADMIN_PASS).toString('base64');
    return res.json({ success: true, role: 'admin', token });
  } 
  // Teacher access via staff dashboard
  if (inputPass === TEACHER_PASS || inputPass === 'Teacher@2011' || inputPass === 'teacher123' || inputPass === 'Teacher@1975') {
    const token = Buffer.from('teacher:' + TEACHER_PASS).toString('base64');
    return res.json({ success: true, role: 'teacher', token });
  }

  res.status(401).json({ success: false, message: 'Invalid password! Use Principal@2011 or Teacher@2011' });
});

// Teacher Login (Password-Only)
app.post('/api/teachers/login', (req, res) => {
  const { password } = req.body;
  const inputPass = String(password || '').trim();
  const TEACHER_PASS = (process.env.TEACHER_PASSWORD || 'Teacher@2011').trim();
  const ADMIN_PASS = (process.env.ADMIN_PASSWORD || 'Principal@2011').trim();

  if (inputPass === TEACHER_PASS || inputPass === 'Teacher@2011' || inputPass === 'teacher123' || inputPass === 'Teacher@1975' || inputPass === ADMIN_PASS || inputPass === 'Principal@2011') {
    const token = Buffer.from('teacher:' + TEACHER_PASS).toString('base64');
    return res.json({ success: true, role: 'teacher', token });
  }

  res.status(401).json({ success: false, message: 'Invalid teacher password! Use Teacher@2011' });
});

app.get('/api/teachers/me', (req, res) => {
  const { valid, role } = decodeToken(req.headers['x-admin-token']);
  if (!valid || (role !== 'teacher' && role !== 'admin')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  res.json({
    success: true,
    teacher: {
      id: 'teacher_master',
      name: role === 'admin' ? 'Administrator' : 'Faculty Teacher',
      role: role,
      email: 'OXFORD CONVENT SCHOOL SASARAM',
      mobile: 'Authorized Staff Access'
    }
  });
});

function decodeToken(auth) {
  if (!auth) return { valid: false };
  try {
    const decoded = Buffer.from(auth, 'base64').toString('utf8');
    if (decoded.startsWith('admin:')) return { valid: true, role: 'admin' };
    if (decoded.startsWith('teacher:')) return { valid: true, role: 'teacher' };
    return { valid: false };
  } catch { return { valid: false }; }
}

function verifyTeacherOrAdmin(req, res, next) {
  const { valid } = decodeToken(req.headers['x-admin-token']);
  if (valid) return next();
  res.status(403).json({ message: 'Unauthorized access' });
}

function verifySuperAdmin(req, res, next) {
  const { valid, role } = decodeToken(req.headers['x-admin-token']);
  if (valid && role === 'admin') return next();
  res.status(403).json({ message: 'Only Administrator is authorized to perform this action!' });
}

const verifyAdmin = verifySuperAdmin;


// ─── STUDENT AUTH & REGISTRATION ─────────────────────────────────────────────
function isSchoolOrIntermediate(cls) {
  if (!cls) return false;
  const c = String(cls).toLowerCase().trim();
  return c.startsWith('class ') || /^([1-9]|1[0-2])$/.test(c) || c.startsWith('11th') || c.startsWith('12th');
}

app.post('/api/students/register', (req, res) => {
  const { name, cls, classNumber, mobile, phone, email, password, fatherName, section, rollNumber, rollNo, photo } = req.body;
  const targetClass = String(cls || classNumber || '').trim();
  const targetMobile = String(mobile || phone || '').trim();
  const finalRoll = (rollNumber || rollNo || '').toString().trim();
  const targetEmail = (email || `std_${finalRoll || Date.now()}@oxfordconvent.com`).toLowerCase().trim();

  if (!name || !targetClass || !password) {
    return res.status(400).json({ success: false, message: 'Name, Class, and Password are required!' });
  }

  const students = readJSON(STUDENTS_FILE, []);
  if (email) {
    const existing = students.find(s => s.email && s.email.toLowerCase() === targetEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'This email is already registered! Please login instead.' });
    }
  }

  const newStudent = {
    id: `std_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim(),
    fatherName: fatherName ? fatherName.trim() : '',
    class: targetClass,
    section: (typeof isSchoolOrIntermediate === 'function' && isSchoolOrIntermediate(targetClass) && section) ? section.trim().toUpperCase() : (section ? section.trim().toUpperCase() : 'A'),
    rollNumber: finalRoll,
    mobile: targetMobile,
    email: targetEmail,
    photo: photo || '',
    password: String(password).trim(),
    registeredAt: new Date().toISOString()
  };

  students.push(newStudent);
  writeJSON(STUDENTS_FILE, students);

  const token = Buffer.from(`student:${newStudent.id}:${targetEmail}`).toString('base64');
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

  res.json({ success: true, token, student: safeProfile });
});

app.post('/api/students/login', (req, res) => {
  const { email, password, rollNumber, classNumber, cls } = req.body;
  const inputClass = String(classNumber || cls || '').trim();
  const inputRoll = String(rollNumber || '').trim();
  const inputEmail = String(email || '').toLowerCase().trim();
  const cleanPass = String(password || '').trim();

  if (!cleanPass || (!inputEmail && !inputRoll)) {
    return res.status(400).json({ success: false, message: 'Roll number (or Email) and password are required!' });
  }

  const students = readJSON(STUDENTS_FILE, []);
  const student = students.find(s => {
    const passMatch = String(s.password).trim() === cleanPass;
    if (!passMatch) return false;

    if (inputEmail && s.email && s.email.toLowerCase().trim() === inputEmail) return true;
    if (inputRoll && String(s.rollNumber || '').trim() === inputRoll) {
      if (!inputClass) return true;
      return String(s.class || '').toLowerCase().trim() === inputClass.toLowerCase();
    }
    return false;
  });

  if (!student) {
    return res.status(401).json({ success: false, message: 'Invalid credentials! Please check your details.' });
  }

  const token = Buffer.from(`student:${student.id}:${student.email || student.rollNumber}`).toString('base64');
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

  res.json({ success: true, token, student: safeProfile });
});

function decodeStudentToken(auth) {
  if (!auth) return null;
  try {
    const decoded = Buffer.from(auth, 'base64').toString('utf8');
    const [prefix, id, email] = decoded.split(':');
    if (prefix !== 'student') return null;
    const students = readJSON(STUDENTS_FILE, []);
    const cleanEmail = (email || '').toLowerCase().trim();
    return students.find(s => 
      (id && s.id === id) || 
      (cleanEmail && s.email && s.email.toLowerCase().trim() === cleanEmail)
    ) || null;
  } catch {
    return null;
  }
}

app.get('/api/students/me', (req, res) => {
  const student = decodeStudentToken(req.headers['x-student-token']);
  if (!student) return res.status(401).json({ success: false, message: 'Unauthorized session' });
  res.json({
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
  });
});

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

// Step 1: Verify identity (email + mobile must match)
app.post('/api/students/forgot-password/verify', (req, res) => {
  const { email, mobile } = req.body;
  if (!email || !mobile) {
    return res.status(400).json({ success: false, message: 'Email aur Mobile dono required hain.' });
  }
  const students = readJSON(STUDENTS_FILE, []);
  const student = students.find(s =>
    s.email.toLowerCase() === email.toLowerCase().trim() &&
    String(s.mobile).trim() === String(mobile).trim()
  );
  if (!student) {
    return res.status(404).json({ success: false, message: 'Koi student nahi mila is Email aur Mobile se. Sahi details daalein.' });
  }
  // Return student id (used in step 2 to reset password)
  res.json({ success: true, studentId: student.id, studentName: student.name });
});

// Step 2: Reset password using verified student id
app.post('/api/students/forgot-password/reset', (req, res) => {
  const { studentId, newPassword } = req.body;
  if (!studentId || !newPassword) {
    return res.status(400).json({ success: false, message: 'Student ID aur naya password required hai.' });
  }
  if (newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, message: 'Password kam se kam 4 characters ka hona chahiye.' });
  }
  const students = readJSON(STUDENTS_FILE, []);
  const idx = students.findIndex(s => s.id === studentId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Student account nahi mila.' });
  }
  students[idx].password = newPassword.trim();
  writeJSON(STUDENTS_FILE, students);
  res.json({ success: true, message: 'Password successfully reset ho gaya! Ab naye password se login karein.' });
});

app.put('/api/students/profile', (req, res) => {
  const student = decodeStudentToken(req.headers['x-student-token']);
  if (!student) return res.status(401).json({ success: false, message: 'Unauthorized session' });

  const { name, fatherName, cls, section, rollNumber, rollNo, mobile, password, photo } = req.body;
  const students = readJSON(STUDENTS_FILE, []);
  const idx = students.findIndex(s => s.id === student.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Student account not found' });

  if (name && name.trim()) students[idx].name = name.trim();
  if (fatherName !== undefined) students[idx].fatherName = fatherName.trim();
  if (rollNumber !== undefined || rollNo !== undefined) {
    students[idx].rollNumber = (rollNumber !== undefined ? rollNumber : rollNo).toString().trim();
  }
  // Class is permanently locked to registration
  if (mobile && mobile.trim()) students[idx].mobile = mobile.trim();
  if (photo !== undefined) students[idx].photo = photo;
  
  if (isSchoolOrIntermediate(students[idx].class)) {
    if (section !== undefined) students[idx].section = section.trim().toUpperCase();
  } else {
    students[idx].section = ''; // Section only for school / 12th
  }

  if (password && password.trim()) {
    students[idx].password = password.trim();
  }

  writeJSON(STUDENTS_FILE, students);

  const updated = students[idx];
  const safeProfile = {
    id: updated.id,
    name: updated.name,
    fatherName: updated.fatherName || '',
    class: updated.class,
    section: updated.section || '',
    rollNumber: updated.rollNumber || '',
    mobile: updated.mobile,
    email: updated.email,
    photo: updated.photo || ''
  };

  res.json({ success: true, message: 'Profile updated successfully!', student: safeProfile });
});

app.get('/api/students/my-results', (req, res) => {
  const student = decodeStudentToken(req.headers['x-student-token']);
  if (!student) return res.status(401).json({ success: false, message: 'Unauthorized session' });

  const { year, session, examType } = req.query;
  const results = readJSON(RESULTS_FILE, []);
  let myResults = results.filter(r => 
    r.studentName.toLowerCase() === student.name.toLowerCase() && 
    String(r.class) === String(student.class)
  );

  if (examType && examType !== 'all') {
    myResults = myResults.filter(r => (r.examType || 'PT-1') === examType);
  }

  if (year && year !== 'all') {
    myResults = myResults.filter(r => {
      const rYear = r.year || (r.submittedAt ? String(new Date(r.submittedAt).getFullYear()) : '');
      const rSession = r.session || '';
      return rYear === String(year) || rSession === String(year) || rSession.startsWith(String(year)) || String(year).includes(rYear);
    });
  }

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
    session: r.session || (r.submittedAt ? `${new Date(r.submittedAt).getFullYear()}-${new Date(r.submittedAt).getFullYear()+1}` : '2025-2026'),
    year: r.year || (r.submittedAt ? String(new Date(r.submittedAt).getFullYear()) : '2026'),
    resultUnlocked: !!r.resultUnlocked,
    submittedAt: r.submittedAt,
    answers: r.answers || [] // Answer Sheet released immediately after exam completion
  }));

  res.json({ success: true, results: safeResults });
});

// Admin/Teacher: View Registered Students
app.get('/api/students', verifyTeacherOrAdmin, (req, res) => {
  const students = readJSON(STUDENTS_FILE, []);
  const safe = students.map(s => ({
    id: s.id,
    name: s.name,
    fatherName: s.fatherName || '',
    class: s.class,
    section: s.section || '',
    rollNumber: s.rollNumber || '-',
    mobile: s.mobile,
    email: s.email,
    registeredAt: s.registeredAt
  }));
  res.json(safe);
});

// Admin Only: Delete / Cancel Student Registration
app.delete('/api/students/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const students = readJSON(STUDENTS_FILE, []);
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Student registration not found' });
  }
  const deletedStudent = students.splice(idx, 1)[0];
  writeJSON(STUDENTS_FILE, students);
  res.json({ success: true, message: `Registration for ${deletedStudent.name} cancelled successfully!` });
});

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
app.get('/api/questions', (req, res) => {
  const cls = req.query.cls || req.query.class;
  const { subject, examType } = req.query;
  const all = readJSON(QUESTIONS_FILE, {});
  const et = examType || 'PT-1';

  // If asking for all papers of a class
  if (!subject && cls) {
    const classPapers = [];
    for (const [key, val] of Object.entries(all)) {
      if (key.startsWith(`${cls}_`)) {
        const parts = key.split('_');
        const sub = parts[1];
        const paperType = parts[2] || 'PT-1';
        classPapers.push({
          subject: sub,
          class: cls,
          examType: paperType,
          questions: Array.isArray(val) ? val : (val.questions || []),
          timeLimit: val.timeLimit || 30,
          session: val.session || '2025-2026',
        });
      }
    }
    return res.json({ success: true, questions: classPapers });
  }

  const keyWithPT = `${cls}_${subject}_${et}`;
  const keyLegacy = `${cls}_${subject}`;
  let entry = all[keyWithPT] || all[keyLegacy];

  // Smart subject alias matching (e.g. Computer <-> Computer Studies <-> Information Technology)
  if (!entry && subject) {
    const sLower = subject.toLowerCase();
    const candidateSubjects = [];
    if (sLower.includes('computer') || sLower.includes('it') || sLower.includes('information technology')) {
      candidateSubjects.push('Computer', 'Computer Studies', 'Computer Science', 'Information Technology');
    }
    for (const altSub of candidateSubjects) {
      if (all[`${cls}_${altSub}_${et}`]) { entry = all[`${cls}_${altSub}_${et}`]; break; }
      if (all[`${cls}_${altSub}`]) { entry = all[`${cls}_${altSub}`]; break; }
    }
  }

  if (!entry) return res.json({ success: true, questions: [], session: null, year: null, examType: et });
  if (Array.isArray(entry)) {
    return res.json({ success: true, questions: entry, session: null, year: null, examType: et });
  }
  return res.json({ 
    success: true,
    questions: entry.questions || [], 
    timeLimit: entry.timeLimit || 30,
    session: entry.session || null, 
    year: entry.year || null,
    examType: entry.examType || et
  });
});

// ─── CBSE SUBJECTS MASTER (CLASS 1 TO 12TH) ──────────────────────────────────
const CBSE_SUBJECTS_BY_CLASS = {
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

app.get('/api/cbse-subjects', (req, res) => {
  const { cls } = req.query;
  if (cls) {
    const subjects = CBSE_SUBJECTS_BY_CLASS[cls] || 
      CBSE_SUBJECTS_BY_CLASS[`Class ${cls}`] || 
      [];
    return res.json({ success: true, cls, subjects });
  }
  res.json({ success: true, mapping: CBSE_SUBJECTS_BY_CLASS });
});

app.get('/api/subjects', (req, res) => {
  const all = readJSON(QUESTIONS_FILE, {});
  const map = {};
  // First, populate all standard CBSE subjects for each class
  Object.keys(CBSE_SUBJECTS_BY_CLASS).forEach(cls => {
    map[cls] = [...CBSE_SUBJECTS_BY_CLASS[cls]];
  });
  // Also merge any custom subjects that have questions
  Object.keys(all).forEach(key => {
    // Format could be cls_subject_examType or cls_subject
    const parts = key.split('_');
    const cls = parts[0];
    let subject = '';
    const lastPart = parts[parts.length - 1];
    if (['PT-1', 'PT-2', 'PT-3', 'PT-4', 'Class Test', 'CT'].includes(lastPart) && parts.length >= 3) {
      subject = parts.slice(1, -1).join('_');
    } else {
      subject = parts.slice(1).join('_');
    }
    if (!map[cls]) map[cls] = [];
    if (subject && !map[cls].some(s => s.toLowerCase() === subject.toLowerCase())) {
      map[cls].push(subject);
    }
  });
  res.json(map);
});

// ─── CONSOLIDATED ALL-SUBJECTS MARKSHEET ──────────────────────────────────────
app.get('/api/students/cumulative-marksheet', (req, res) => {
  let { name, cls: rawCls, class: rawClass, year, session, examType } = req.query;
  let cls = rawCls || rawClass;

  const studentToken = req.headers['x-student-token'];
  if (studentToken) {
    const studentFromToken = decodeStudentToken(studentToken);
    if (studentFromToken) {
      name = studentFromToken.name;
      cls = String(studentFromToken.class);
    }
  }

  if (!name || !cls) {
    return res.status(400).json({ success: false, message: 'Student Name and Class are required' });
  }

  const cleanName = name.trim().toLowerCase();
  const cleanCls = String(cls).trim();
  const targetPT = examType || 'PT-1';

  const students = readJSON(STUDENTS_FILE, []);
  const student = students.find(s => 
    s.name.toLowerCase().trim() === cleanName && 
    String(s.class).toLowerCase().trim() === cleanCls.toLowerCase()
  ) || students.find(s => s.name.toLowerCase().trim() === cleanName) || {};

  const allResults = readJSON(RESULTS_FILE, []);
  let studentResults = allResults.filter(r => 
    r.studentName.toLowerCase().trim() === cleanName &&
    String(r.class).toLowerCase().trim() === cleanCls.toLowerCase()
  );

  if (targetPT && targetPT !== 'all') {
    studentResults = studentResults.filter(r => (r.examType || 'PT-1') === targetPT);
  }

  const isClassTest = (targetPT === 'Class Test' || targetPT === 'CT');
  if (isClassTest) {
    let ctResults = studentResults.filter(r => (r.examType === 'Class Test' || r.examType === 'CT'));
    if (req.query.subject) {
      ctResults = ctResults.filter(r => r.subject.toLowerCase() === req.query.subject.toLowerCase());
    }

    const targetResult = ctResults[ctResults.length - 1];
    if (!targetResult) {
      return res.json({
        success: true,
        marksheet: {
          student: {
            id: student.id || ('OCS-' + Math.random().toString(36).slice(2, 8).toUpperCase()),
            name: student.name || name,
            fatherName: student.fatherName || '-',
            class: cleanCls,
            section: student.section || '-',
            rollNumber: student.rollNumber || '-',
            mobile: student.mobile || '-',
            email: student.email || '-',
            photo: student.photo || ''
          },
          isSingleSubject: true,
          examType: 'Class Test',
          examTypeLabel: 'OFFICIAL CLASS TEST SCORECARD (SINGLE SUBJECT REPORT)',
          session: session || '2026-2027',
          subject: req.query.subject || 'All Class Tests',
          subjects: [],
          totals: {
            maxMarks: 0,
            passMarks: 0,
            securedMarks: 0,
            percentage: 0,
            grade: '---',
            status: 'NOT APPEARED',
            evaluatedSubjectsCount: 0
          },
          verificationId: 'OCS-CT-' + Math.random().toString(36).slice(2, 8).toUpperCase()
        }
      });
    }

    const maxMarks = targetResult.total || 20;
    const passMarks = Math.ceil(maxMarks * 0.33);
    const secured = targetResult.score || 0;
    const pct = maxMarks > 0 ? Math.round((secured / maxMarks) * 100) : 0;
    const isPass = secured >= passMarks;
    const grade = getCbseGrade(pct);

    const singleSubjectData = [{
      sn: 1,
      subject: targetResult.subject,
      maxMarks,
      passMarks,
      securedMarks: secured,
      percentage: pct,
      grade,
      status: isPass ? 'PASS' : 'FAIL',
      examDate: targetResult.submittedAt || null,
      resultUnlocked: true,
      answers: targetResult.answers || []
    }];

    return res.json({
      success: true,
      marksheet: {
        student: {
          id: student.id || ('OCS-' + Math.random().toString(36).slice(2, 8).toUpperCase()),
          name: student.name || name,
          fatherName: student.fatherName || '-',
          class: cleanCls,
          section: student.section || '-',
          rollNumber: student.rollNumber || '-',
          mobile: student.mobile || '-',
          email: student.email || '-',
          photo: student.photo || ''
        },
        isSingleSubject: true,
        examType: 'Class Test',
        examTypeLabel: 'OFFICIAL CLASS TEST SCORECARD (SINGLE SUBJECT REPORT)',
        session: session || targetResult.session || '2026-2027',
        subject: targetResult.subject,
        examDate: targetResult.submittedAt || null,
        subjects: singleSubjectData,
        answers: targetResult.answers || [],
        totals: {
          maxMarks,
          passMarks,
          securedMarks: secured,
          percentage: pct,
          grade,
          status: isPass ? 'PASSED' : 'NEEDS IMPROVEMENT',
          evaluatedSubjectsCount: 1,
          failedSubjectsCount: isPass ? 0 : 1,
          underEvaluationCount: 0,
          totalSubjectsCount: 1
        },
        verificationId: 'OCS-CT-' + (student.id ? student.id.slice(-8).toUpperCase() : Math.random().toString(36).slice(2, 8).toUpperCase())
      }
    });
  }

  const filterPeriod = session || year;
  if (filterPeriod && filterPeriod !== 'all') {
    studentResults = studentResults.filter(r => {
      const rYear = r.year || (r.submittedAt ? String(new Date(r.submittedAt).getFullYear()) : '');
      const rSession = r.session || '';
      return rYear === String(filterPeriod) || rSession === String(filterPeriod) || 
             rSession.startsWith(String(filterPeriod)) || String(filterPeriod).startsWith(rYear);
    });
  }

  const cbseSubjects = CBSE_SUBJECTS_BY_CLASS[cleanCls] || 
    CBSE_SUBJECTS_BY_CLASS[`Class ${cleanCls}`] || 
    ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Studies"];

  let totalMaxMarks = 0;
  let totalPassMarks = 0;
  let totalSecuredMarks = 0;
  let evaluatedSubjectsCount = 0;
  let failedSubjectsCount = 0;
  let underEvaluationCount = 0;

  const matchedResultIds = new Set();

  const subjectsData = cbseSubjects.map((subjectName, idx) => {
    const result = studentResults.find(r => !matchedResultIds.has(r.id) && matchSubject(subjectName, r.subject));
    if (result) {
      matchedResultIds.add(result.id);
      const isUnlocked = !!result.resultUnlocked;
      const maxMarks = result.total || 100;
      const passMarks = Math.ceil(maxMarks * 0.33); // 33% passing
      const secured = result.score || 0;
      const isPass = secured >= passMarks;
      const pct = maxMarks > 0 ? Math.round((secured / maxMarks) * 100) : 0;
      const grade = getCbseGrade(pct);

      if (isUnlocked) {
        totalMaxMarks += maxMarks;
        totalPassMarks += passMarks;
        totalSecuredMarks += secured;
        evaluatedSubjectsCount++;
        if (!isPass) failedSubjectsCount++;
      } else {
        underEvaluationCount++;
      }

      return {
        sn: idx + 1,
        subject: subjectName,
        maxMarks,
        passMarks,
        securedMarks: isUnlocked ? secured : null,
        percentage: isUnlocked ? pct : null,
        grade: isUnlocked ? grade : '---',
        status: isUnlocked ? (isPass ? 'PASS' : 'FAIL') : 'UNDER_EVALUATION',
        examDate: result.submittedAt || null,
        resultUnlocked: isUnlocked
      };
    } else {
      const maxMarks = 100;
      const passMarks = 33;
      return {
        sn: idx + 1,
        subject: subjectName,
        maxMarks,
        passMarks,
        securedMarks: null,
        percentage: null,
        grade: '---',
        status: 'NOT_APPEARED',
        examDate: null,
        resultUnlocked: false
      };
    }
  });

  studentResults.forEach(r => {
    if (!matchedResultIds.has(r.id)) {
      matchedResultIds.add(r.id);
      const isUnlocked = !!r.resultUnlocked;
      const maxMarks = r.total || 100;
      const passMarks = Math.ceil(maxMarks * 0.33);
      const secured = r.score || 0;
      const isPass = secured >= passMarks;
      const pct = maxMarks > 0 ? Math.round((secured / maxMarks) * 100) : 0;
      const grade = getCbseGrade(pct);

      if (isUnlocked) {
        totalMaxMarks += maxMarks;
        totalPassMarks += passMarks;
        totalSecuredMarks += secured;
        evaluatedSubjectsCount++;
        if (!isPass) failedSubjectsCount++;
      } else {
        underEvaluationCount++;
      }

      subjectsData.push({
        sn: subjectsData.length + 1,
        subject: r.subject,
        maxMarks,
        passMarks,
        securedMarks: isUnlocked ? secured : null,
        percentage: isUnlocked ? pct : null,
        grade: isUnlocked ? grade : '---',
        status: isUnlocked ? (isPass ? 'PASS' : 'FAIL') : 'UNDER_EVALUATION',
        examDate: r.submittedAt || null,
        resultUnlocked: isUnlocked
      });
    }
  });

  const overallPercentage = totalMaxMarks > 0 ? Math.round((totalSecuredMarks / totalMaxMarks) * 100) : 0;
  const overallGrade = evaluatedSubjectsCount > 0 ? getCbseGrade(overallPercentage) : '---';

  let finalResultStatus = 'PENDING';
  if (evaluatedSubjectsCount > 0) {
    if (failedSubjectsCount === 0) {
      finalResultStatus = 'PASSED';
    } else if (failedSubjectsCount === 1) {
      finalResultStatus = 'COMPARTMENT';
    } else {
      finalResultStatus = 'ESSENTIAL REPEAT';
    }
  } else if (underEvaluationCount > 0) {
    finalResultStatus = 'UNDER EVALUATION';
  } else {
    finalResultStatus = 'NOT APPEARED';
  }

  const sessionLabel = session || (studentResults[0]?.session) || '2026-2027';

  res.json({
    success: true,
    marksheet: {
      student: {
        id: student.id || ('OCS-' + Math.random().toString(36).slice(2, 8).toUpperCase()),
        name: student.name || name,
        fatherName: student.fatherName || '-',
        class: cleanCls,
        section: student.section || '-',
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
      session: sessionLabel,
      examDate: studentResults[0]?.examDate || studentResults[0]?.submittedAt || null,
      subjects: subjectsData,
      totals: {
        maxMarks: totalMaxMarks,
        passMarks: totalPassMarks,
        securedMarks: totalSecuredMarks,
        percentage: overallPercentage,
        grade: overallGrade,
        status: finalResultStatus,
        evaluatedSubjectsCount,
        failedSubjectsCount,
        underEvaluationCount,
        totalSubjectsCount: subjectsData.length
      },
      verificationId: 'OCS-VRF-' + (student.id ? student.id.slice(-8).toUpperCase() : Math.random().toString(36).slice(2, 8).toUpperCase())
    }
  });
});

app.post('/api/questions', verifyTeacherOrAdmin, (req, res) => {
  const { cls: rawCls, class: rawClass, classNumber, subject, questions, timeLimit, session, year, examType } = req.body;
  const cls = rawCls || rawClass || classNumber;
  if (!cls || !subject || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Invalid data: cls/class, subject, and questions array are required' });
  }

  const et = examType || 'PT-1';
  const now = new Date();
  const subYear = now.getFullYear();
  const subMonth = now.getMonth() + 1;
  const autoSession = subMonth >= 4 ? `${subYear}-${subYear + 1}` : `${subYear - 1}-${subYear}`;

  const all = readJSON(QUESTIONS_FILE, {});
  const keyWithPT = `${cls}_${subject}_${et}`;
  questions.forEach((q, i) => { 
    if (!q.id) q.id = `${keyWithPT}_q${i + 1}_${Date.now()}`;
    if (timeLimit) q.timeLimit = timeLimit;
  });

  // Save as object with metadata
  all[keyWithPT] = {
    questions,
    examType: et,
    session: session || autoSession,
    year: year || String(subYear),
    savedAt: now.toISOString()
  };

  writeJSON(QUESTIONS_FILE, all);
  res.json({ success: true, count: questions.length, examType: et });
});

app.delete('/api/questions/:cls/:subject', verifyAdmin, (req, res) => {
  const { cls, subject } = req.params;
  const { examType } = req.query;
  const all = readJSON(QUESTIONS_FILE, {});
  if (examType) {
    delete all[`${cls}_${subject}_${examType}`];
  } else {
    delete all[`${cls}_${subject}`];
    ['PT-1', 'PT-2', 'PT-3', 'PT-4', 'Class Test', 'CT'].forEach(p => {
      delete all[`${cls}_${subject}_${p}`];
    });
  }
  writeJSON(QUESTIONS_FILE, all);
  res.json({ success: true });
});

// ─── CHATBOT API ──────────────────────────────────────────────────────────────
app.post('/api/chatbot', async (req, res) => {
  const { message, studentClass, subject, history } = req.body;
  if (!message || !message.trim()) {
    return res.json({ reply: "Please type your question!" });
  }
  try {
    const reply = await getChatbotResponse(message, studentClass || '', subject || '', history || []);
    res.json({ reply });
  } catch (e) {
    console.error('Chatbot error:', e.message);
    res.json({ reply: "Sorry, I am unable to answer right now. Please try again shortly!" });
  }
});

// ─── RESULTS ─────────────────────────────────────────────────────────────────
app.post('/api/results', async (req, res) => {
  const { studentName, cls: rawCls, classNumber, subject, answers, score: incomingScore, total: incomingTotal, session: reqSession, year: reqYear, examType } = req.body;
  const cls = rawCls || classNumber;
  if (!studentName || !cls || !subject) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const now = new Date();
  const subYear = now.getFullYear();
  const subMonth = now.getMonth() + 1;
  const autoSession = subMonth >= 4 ? `${subYear}-${subYear + 1}` : `${subYear - 1}-${subYear}`;
  const et = examType || 'PT-1';
  const isClassTest = (et === 'Class Test' || et === 'CT');

  // Compute Indian Standard Time (IST / UTC+5:30) exam date (YYYY-MM-DD)
  const pad = n => String(n).padStart(2, '0');
  const istOffsetMs = 330 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffsetMs);
  const defaultExamDate = `${istNow.getUTCFullYear()}-${pad(istNow.getUTCMonth() + 1)}-${pad(istNow.getUTCDate())}`;
  const resolvedExamDate = (req.body.examDate && /^\d{4}-\d{2}-\d{2}$/.test(req.body.examDate)) ? req.body.examDate : defaultExamDate;

  const evaluatedAnswers = Array.isArray(answers) ? [...answers] : [];

  // Ultra-fast parallel evaluation for One Word Answer (OWA) questions!
  const owaTasks = evaluatedAnswers
    .filter(a => a.type === 'owa')
    .map(async (a) => {
      try {
        const aiRes = await gradeOneWordAnswer(a.qText, a.userAnswer, a.correctAnswer, a.marks || 2);
        a.owaMarksAwarded = aiRes.awardedMarks;
        a.isCorrect = aiRes.isCorrect;
        a.aiGraded = true;
        if (!a.correctAnswer || a.correctAnswer === 0 || a.correctAnswer === '0') {
          a.correctAnswer = aiRes.expectedAnswer || '';
        }
        a.expectedAnswer = aiRes.expectedAnswer || a.correctAnswer;
        a.aiReason = aiRes.reason;
      } catch (err) {
        console.warn('AI OWA grading error:', err.message);
      }
    });

  if (owaTasks.length > 0) {
    await Promise.all(owaTasks);
  }

  // Recalculate score with AI OWA marks
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

  const results = readJSON(RESULTS_FILE, []);
  const entry = {
    id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    studentName: studentName.trim(),
    class: cls,
    subject,
    score: finalScore,
    total: finalTotal,
    answers: evaluatedAnswers,
    examType: et,
    session: reqSession || autoSession,
    year: reqYear || String(subYear),
    examDate: resolvedExamDate, // YYYY-MM-DD
    submittedAt: now.toISOString(),
    // ⚡ Class Test is published immediately! Periodic tests remain locked until teacher/admin unlocks.
    resultUnlocked: isClassTest ? true : false,
  };
  results.push(entry);
  writeJSON(RESULTS_FILE, results);
  res.json({ success: true, result: entry });
});

// ── Unique dates summary endpoint for Teacher & Admin ──
app.get('/api/results/dates-summary', verifyTeacherOrAdmin, (req, res) => {
  const results = readJSON(RESULTS_FILE, []);
  const map = {};

  results.forEach(r => {
    let d = r.examDate;
    if (!d && r.submittedAt) {
      d = r.submittedAt.slice(0, 10);
    }
    if (!d) return;

    if (!map[d]) {
      map[d] = {
        date: d,
        totalSubmissions: 0,
        subjects: new Set(),
        examTypes: new Set(),
        classes: new Set(),
        breakdown: {}
      };
    }
    map[d].totalSubmissions++;
    const et = r.examType || 'PT-1';
    const sub = r.subject || 'Unknown';
    const c = String(r.class || '-');

    map[d].subjects.add(sub);
    map[d].examTypes.add(et);
    map[d].classes.add(c);

    const bKey = `${et} | ${sub} | Class ${c}`;
    if (!map[d].breakdown[bKey]) {
      map[d].breakdown[bKey] = { examType: et, subject: sub, class: c, count: 0 };
    }
    map[d].breakdown[bKey].count++;
  });

  const list = Object.values(map).map(item => {
    return {
      date: item.date,
      totalSubmissions: item.totalSubmissions,
      subjects: Array.from(item.subjects),
      examTypes: Array.from(item.examTypes),
      classes: Array.from(item.classes).sort((a, b) => Number(a) - Number(b)),
      exams: Object.values(item.breakdown)
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  res.json(list);
});

app.get('/api/results', verifyTeacherOrAdmin, (req, res) => {
  const { cls: rawCls, class: rawClass, subject, year, session, examType, date } = req.query;
  const cls = rawCls || rawClass;
  let results = readJSON(RESULTS_FILE, []);
  if (cls) results = results.filter(r => String(r.class) === String(cls));
  if (subject) results = results.filter(r => r.subject.toLowerCase().includes(subject.toLowerCase()));
  if (examType && examType !== 'all') {
    results = results.filter(r => (r.examType || 'PT-1') === examType);
  }
  if (date && date !== 'all') {
    results = results.filter(r => {
      const rDate = r.examDate || (r.submittedAt ? r.submittedAt.slice(0, 10) : '');
      return rDate === date;
    });
  }
  if (year && year !== 'all') {
    results = results.filter(r => {
      const rYear = r.year || (r.submittedAt ? String(new Date(r.submittedAt).getFullYear()) : '');
      const rSession = r.session || '';
      return rYear === String(year) || rSession === String(year) || rSession.startsWith(String(year)) || String(year).includes(rYear);
    });
  }
  if (session && session !== 'all') {
    results = results.filter(r => (r.session === session || r.year === session));
  }
  res.json(results);
});

app.patch('/api/results/:id/unlock', verifyTeacherOrAdmin, (req, res) => {
  const results = readJSON(RESULTS_FILE, []);
  const idx = results.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Result not found' });
  results[idx].resultUnlocked = !results[idx].resultUnlocked;
  writeJSON(RESULTS_FILE, results);
  res.json({ success: true, resultUnlocked: results[idx].resultUnlocked });
});

app.patch('/api/results/unlock-all', verifyTeacherOrAdmin, (req, res) => {
  const { cls, subject, unlock } = req.body;
  const results = readJSON(RESULTS_FILE, []);
  results.forEach(r => {
    if ((!cls || String(r.class) === String(cls)) && (!subject || r.subject === subject)) {
      r.resultUnlocked = unlock !== false;
    }
  });
  writeJSON(RESULTS_FILE, results);
  res.json({ success: true });
});

app.patch('/api/results/:id/owa-mark', verifyTeacherOrAdmin, (req, res) => {
  const { qIndex, marks } = req.body;
  const results = readJSON(RESULTS_FILE, []);
  const result = results.find(r => r.id === req.params.id);
  if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
  if (!result.answers || !result.answers[qIndex]) {
    return res.status(400).json({ success: false, message: 'Invalid question index' });
  }

  const ans = result.answers[qIndex];
  const newAwarded = parseInt(marks) || 0;
  ans.owaMarksAwarded = newAwarded;
  ans.isCorrect = newAwarded > 0;

  // Recalculate score
  let totalScore = 0;
  result.answers.forEach(a => {
    if (a.type === 'owa') {
      totalScore += (a.owaMarksAwarded || 0);
    } else {
      if (a.isCorrect) totalScore += (a.marks || 1);
    }
  });
  result.score = totalScore;

  writeJSON(RESULTS_FILE, results);
  res.json({ success: true, score: result.score, total: result.total });
});

app.patch('/api/results/:id/owa-marks-bulk', verifyTeacherOrAdmin, (req, res) => {
  const { marksList } = req.body;
  const results = readJSON(RESULTS_FILE, []);
  const result = results.find(r => r.id === req.params.id);
  if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
  if (!Array.isArray(marksList)) {
    return res.status(400).json({ success: false, message: 'marksList must be an array' });
  }

  marksList.forEach(item => {
    const qIndex = parseInt(item.qIndex);
    if (result.answers && result.answers[qIndex]) {
      const ans = result.answers[qIndex];
      const maxMarks = ans.marks || 2;
      const newAwarded = Math.min(Math.max(parseInt(item.marks) || 0, 0), maxMarks);
      ans.owaMarksAwarded = newAwarded;
      ans.isCorrect = newAwarded > 0;
    }
  });

  // Recalculate score
  let totalScore = 0;
  result.answers.forEach(a => {
    if (a.type === 'owa') {
      totalScore += (a.owaMarksAwarded || 0);
    } else {
      if (a.isCorrect) totalScore += (a.marks || 1);
    }
  });
  result.score = totalScore;

  writeJSON(RESULTS_FILE, results);
  res.json({ success: true, score: result.score, total: result.total });
});

app.get('/api/results/check', (req, res) => {
  let { name, cls: rawCls, class: rawClass, subject, year, session, examType, rollNumber } = req.query;
  let cls = rawCls || rawClass;

  // ── SECURITY: Agar student token hai to naam/class sirf token se lo ──
  const studentToken = req.headers['x-student-token'];
  if (studentToken) {
    const studentFromToken = decodeStudentToken(studentToken);
    if (studentFromToken) {
      name = studentFromToken.name;  // override with real name
      cls  = String(studentFromToken.class); // override with real class
    } else {
      return res.status(401).json({ success: false, found: false, message: 'Invalid student session. Please login again.' });
    }
  }

  // Lookup by roll number if name not provided
  const students = readJSON(STUDENTS_FILE, []);
  if (!name && rollNumber) {
    const match = students.find(s => String(s.rollNumber || '').trim() === String(rollNumber).trim());
    if (match) {
      name = match.name;
      if (!cls) cls = String(match.class);
    }
  }

  if (!name || !cls) return res.status(400).json({ success: false, message: 'Student Name and Class are required' });
  const results = readJSON(RESULTS_FILE, []);
  let found = results.filter(r =>
    r.studentName.toLowerCase() === name.toLowerCase().trim() &&
    String(r.class) === String(cls) &&
    (!subject || r.subject === subject)
  );

  if (examType && examType !== 'all') {
    found = found.filter(r => (r.examType || 'PT-1') === examType);
  }

  if (year && year !== 'all') {
    found = found.filter(r => {
      const rYear = r.year || (r.submittedAt ? String(new Date(r.submittedAt).getFullYear()) : '');
      const rSession = r.session || '';
      return rYear === String(year) || rSession === String(year) || rSession.startsWith(String(year)) || String(year).includes(rYear);
    });
  }

  if (found.length === 0) return res.json({ success: true, found: false, results: [], message: 'No exam record found' });
  const unlocked = found.filter(r => r.resultUnlocked);
  if (unlocked.length === 0) return res.json({ success: true, found: true, unlocked: false, results: [], message: 'Your result is under evaluation. Please check back later.' });
  
  const safe = unlocked.map(r => {
    const std = students.find(s => s.name.toLowerCase() === r.studentName.toLowerCase() && String(s.class) === String(r.class));
    return {
      id: r.id, 
      studentName: r.studentName, 
      fatherName: std?.fatherName || '',
      section: std?.section || '',
      photo: std?.photo || '',
      class: r.class,
      subject: r.subject,
      examType: r.examType || 'PT-1',
      score: r.score, 
      total: r.total,
      session: r.session || (r.submittedAt ? `${new Date(r.submittedAt).getFullYear()}-${new Date(r.submittedAt).getFullYear()+1}` : '2025-2026'),
      year: r.year || (r.submittedAt ? String(new Date(r.submittedAt).getFullYear()) : '2026'),
      submittedAt: r.submittedAt, 
      resultUnlocked: true,
      answers: r.answers || []
    };
  });
  res.json({ success: true, found: true, unlocked: true, results: safe });
});

app.delete('/api/results', verifyAdmin, (req, res) => {
  writeJSON(RESULTS_FILE, []);
  res.json({ success: true });
});

app.delete('/api/results/:id', verifyAdmin, (req, res) => {
  let results = readJSON(RESULTS_FILE, []);
  results = results.filter(r => r.id !== req.params.id);
  writeJSON(RESULTS_FILE, results);
  res.json({ success: true });
});

// ─── EXCEL EXPORT & IMPORT (ADMIN FULL ACCESS ONLY) ───────────────────────────
app.get('/api/export/excel', verifyAdmin, async (req, res) => {
  const { cls, date, examType, all } = req.query;
  let results = readJSON(RESULTS_FILE, []);

  // If 'all' is not requested, filter by query params
  if (all !== 'true') {
    if (cls) results = results.filter(r => String(r.class) === String(cls));
    if (examType && examType !== 'all') results = results.filter(r => (r.examType || 'PT-1') === examType);
    if (date && date !== 'all') {
      results = results.filter(r => (r.examDate || (r.submittedAt ? r.submittedAt.slice(0, 10) : '')) === date);
    }
  }

  if (results.length === 0) {
    return res.status(404).json({ message: 'No student results found matching this selection' });
  }

  try {
    const filePath = await generateExcel(results);
    res.download(filePath, path.basename(filePath), err => {
      if (err) console.error('Excel download error:', err);
    });
  } catch (err) {
    console.error('Excel generation error:', err);
    res.status(500).json({ message: 'Error generating Excel file: ' + err.message });
  }
});

// Download sample Excel template for importing offline results
app.get('/api/export/template', verifyAdmin, async (req, res) => {
  try {
    const filePath = await generateExcelTemplate();
    res.download(filePath, 'oxford_results_import_template.xlsx', err => {
      if (err) console.error('Template download error:', err);
    });
  } catch (err) {
    console.error('Template generation error:', err);
    res.status(500).json({ message: 'Error generating Excel template: ' + err.message });
  }
});

// Import student results from Excel sheet (.xlsx or .csv)
app.post('/api/import/excel', verifyAdmin, uploadExcel.single('file'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'Please upload an Excel (.xlsx) or CSV file' });
  }

  try {
    const importedRows = await parseExcelResults(req.file.buffer);
    if (!importedRows || importedRows.length === 0) {
      return res.status(400).json({ message: 'No valid student result records found in the uploaded file. Please use the template format.' });
    }

    const currentResults = readJSON(RESULTS_FILE, []);
    currentResults.push(...importedRows);
    writeJSON(RESULTS_FILE, currentResults);

    res.json({
      success: true,
      count: importedRows.length,
      message: `Successfully imported ${importedRows.length} student results into Oxford records!`
    });
  } catch (err) {
    console.error('Excel import error:', err);
    res.status(500).json({ message: 'Error importing Excel file: ' + err.message });
  }
});

// ─── EMAIL ────────────────────────────────────────────────────────────────────
app.post('/api/email/send', verifyAdmin, async (req, res) => {
  const { cls } = req.body;
  let results = readJSON(RESULTS_FILE, []);
  if (cls) results = results.filter(r => String(r.class) === String(cls));
  if (results.length === 0) {
    return res.status(404).json({ message: 'No results found to send' });
  }
  try {
    const filePath = await generateExcel(results);
    await sendResultsEmail(filePath, results.length);
    res.json({ success: true, message: `Email sent successfully to ${process.env.EMAIL_TO}!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send email: ' + err.message });
  }
});

// Catch-all API 404 handler (Express 5 compatible)
app.use('/api', (req, res) => {
  console.warn(`⚠️ [404 NOT FOUND] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// ─── START (High-Capacity Multi-Computer & Zero-Password Cloudflare Tunnel) ───
const server = app.listen(PORT, '0.0.0.0', async () => {
  const localIps = getLocalIpAddresses();
  
  let publicIp = 'N/A';
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    publicIp = ipData.ip || 'N/A';
  } catch (e) {}

  console.log('\n================================================================');
  console.log('🏫  OXFORD CONVENT SCHOOL SASARAM — ONLINE EXAM SERVER');
  console.log('================================================================');
  console.log(`🌐  Local (Main PC)           : http://localhost:${PORT}`);
  localIps.forEach(ip => {
    console.log(`📡  School Wi-Fi / LAN IP     : http://${ip}:${PORT}`);
  });
  console.log(`🌍  Direct Public IP Access   : http://${publicIp}:${PORT}`);
  console.log('----------------------------------------------------------------');
  console.log('👨‍🏫  Teacher Password          : ' + (process.env.TEACHER_PASSWORD || 'Teacher@2011') + ' (or teacher123)');
  console.log('👑  Admin Password            : ' + (process.env.ADMIN_PASSWORD || 'Principal@2011') + ' (or admin123)');
  console.log('================================================================');

  if (process.env.ENABLE_TUNNEL === 'true') {
    try {
      const tunnel = await startTunnel({ url: `http://127.0.0.1:${PORT}`, port: PORT });
      const cloudflareUrl = await tunnel.getURL();
      console.log('\n================================================================');
      console.log('🚀  WORLDWIDE DIRECT ACCESS (ANY MOBILE DATA / HOME / NO PASSWORD)');
      console.log('================================================================');
      console.log(`🔗  Direct Link : ${cloudflareUrl}`);
      console.log('👉  Share this link with ANY student or teacher on any network!');
      console.log('================================================================\n');
    } catch (err) {
      console.log('ℹ️  Tunnel active over local network & public IP: ' + err.message);
    }
  } else {
    console.log('\n💡  Instant Local & School LAN Mode Active!');
    console.log(`🔗  Access at http://localhost:${PORT} or http://${localIps[0] || '127.0.0.1'}:${PORT}`);
    console.log('💡  (To enable Cloudflare WAN internet tunnel, set ENABLE_TUNNEL=true in .env)\n');
  }
});

server.maxConnections = 2000;
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
