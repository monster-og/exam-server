const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const os = require('os');

// Vercel or Netlify Functions (AWS Lambda): filesystem is read-only except the tmp dir
const IS_SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const EXPORTS_DIR = IS_SERVERLESS
  ? path.join(os.tmpdir(), 'exports')
  : path.join(__dirname, '..', 'exports');

const STUDENTS_FILE = IS_SERVERLESS
  ? path.join(os.tmpdir(), 'exam-server-data', 'students.json')
  : path.join(__dirname, '..', 'data', 'students.json');

function getStudentsMap(students) {
  try {
    let list = Array.isArray(students) ? students : null;
    if (!list) {
      let filePath = STUDENTS_FILE;
      if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, '..', 'data', 'students.json');
      }
      if (fs.existsSync(filePath)) {
        list = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
      }
    }
    if (list) {
      const map = {};
      list.forEach(s => {
        const name = (s.name || '').trim().toLowerCase();
        const cls = String(s.class || '').trim().toLowerCase().replace(/^class\s*/, '');
        const kFull = `${name}_${cls}`;
        if (!map[kFull]) map[kFull] = s;
        if (!map[name]) map[name] = s;
      });
      return map;
    }
  } catch (err) {
    console.warn('Error reading students map for excel:', err.message);
  }
  return {};
}

function getGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
}

async function generateExcel(results, students) {
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }

  const studentsMap = getStudentsMap(students);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Oxford Convent School Admin Portal';
  workbook.created = new Date();

  // Group results by class
  const byClass = {};
  results.forEach(r => {
    let cKey = String(r.class || 'Unknown').trim();
    if (!cKey.toLowerCase().startsWith('class ') && !cKey.toLowerCase().includes('th')) {
      cKey = `Class ${cKey}`;
    }
    if (!byClass[cKey]) byClass[cKey] = [];
    byClass[cKey].push(r);
  });

  // 1. "All Students Results" master sheet
  const allSheet = workbook.addWorksheet('All Students Results', {
    views: [{ state: 'frozen', ySplit: 3 }]
  });
  buildSheetHeader(allSheet, 'OXFORD CONVENT SCHOOL, SASARAM — ALL EXAMINATION RESULTS');
  styleColumns(allSheet);
  addResultRows(allSheet, results, studentsMap);

  // 2. Class-wise sheets for classes present in results + standard 1 to 12
  const classKeys = Object.keys(byClass).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 99;
    const numB = parseInt(b.replace(/\D/g, '')) || 99;
    return numA - numB;
  });

  classKeys.forEach(key => {
    const sheetName = key.length > 30 ? key.slice(0, 30) : key;
    const sheet = workbook.addWorksheet(sheetName, {
      views: [{ state: 'frozen', ySplit: 3 }]
    });
    buildSheetHeader(sheet, `OXFORD CONVENT SCHOOL, SASARAM — ${key.toUpperCase()} RESULTS`);
    styleColumns(sheet);
    addResultRows(sheet, byClass[key] || [], studentsMap);
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filePath = path.join(EXPORTS_DIR, `oxford_results_${timestamp}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

function buildSheetHeader(sheet, bannerText) {
  sheet.mergeCells('A1:P1');
  const bannerRow = sheet.getRow(1);
  bannerRow.height = 30;
  const bannerCell = bannerRow.getCell(1);
  bannerCell.value = bannerText;
  bannerCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  bannerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } }; // Navy Blue
  bannerCell.alignment = { vertical: 'middle', horizontal: 'center' };

  sheet.mergeCells('A2:P2');
  const subRow = sheet.getRow(2);
  subRow.height = 20;
  const subCell = subRow.getCell(1);
  subCell.value = `Report Generated: ${new Date().toLocaleString('en-IN')} | Principal: Dr. Priti Singh | Official School Records`;
  subCell.font = { italic: true, size: 10, color: { argb: 'FFDBEAFE' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }; // Royal Blue
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
}

function styleColumns(sheet) {
  sheet.getRow(3).values = [
    'S.No',
    'Roll No',
    'Student Name',
    'Father Name',
    'Class',
    'Section',
    'Exam Type',
    'Subject',
    'Exam Date',
    'Marks Obtained',
    'Total Marks',
    'Percentage',
    'Grade',
    'Result Status',
    'Published',
    'Mobile / Contact'
  ];

  sheet.columns = [
    { key: 'sno',         width: 7 },
    { key: 'rollNo',      width: 12 },
    { key: 'studentName', width: 24 },
    { key: 'fatherName',  width: 22 },
    { key: 'class',       width: 12 },
    { key: 'section',     width: 10 },
    { key: 'examType',    width: 14 },
    { key: 'subject',     width: 20 },
    { key: 'examDate',    width: 14 },
    { key: 'score',       width: 15 },
    { key: 'total',       width: 13 },
    { key: 'percentage',  width: 14 },
    { key: 'grade',       width: 10 },
    { key: 'status',      width: 16 },
    { key: 'published',   width: 13 },
    { key: 'mobile',      width: 16 }
  ];

  const headerRow = sheet.getRow(3);
  headerRow.height = 26;
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Slate dark
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: 'FF94A3B8' } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } }
    };
  });

  // Enable AutoFilter on row 3 across columns A to P
  sheet.autoFilter = 'A3:P3';
}

function addResultRows(sheet, results, studentsMap) {
  results.forEach((r, idx) => {
    const sNameNorm = (r.studentName || '').trim().toLowerCase();
    const sClsNorm = String(r.class || '').trim().toLowerCase().replace(/^class\s*/, '');
    const matchedProfile = studentsMap[`${sNameNorm}_${sClsNorm}`] || studentsMap[sNameNorm] || {};

    const roll = matchedProfile.rollNumber || matchedProfile.rollNo || r.rollNo || r.rollNumber || '-';
    const father = matchedProfile.fatherName || r.fatherName || '-';
    const sec = matchedProfile.section || r.section || '-';
    const mob = matchedProfile.mobile || r.mobile || '-';

    const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
    const grade = getGrade(pct);
    const isPassed = pct >= 33;
    const isPub = Boolean(r.resultUnlocked || r.examType === 'Class Test');

    let examDateStr = r.examDate || '';
    if (!examDateStr && r.submittedAt) {
      examDateStr = r.submittedAt.slice(0, 10);
    }

    const row = sheet.addRow({
      sno:         idx + 1,
      rollNo:      roll,
      studentName: r.studentName,
      fatherName:  father,
      class:       r.class,
      section:     sec,
      examType:    r.examType || 'PT-1',
      subject:     r.subject,
      examDate:    examDateStr,
      score:       r.score,
      total:       r.total,
      percentage:  `${pct}%`,
      grade:       grade,
      status:      isPassed ? 'PASSED' : 'NEEDS REVISION',
      published:   isPub ? 'YES' : 'PENDING',
      mobile:      mob
    });

    row.height = 22;
    const isEven = idx % 2 === 0;
    const rowBg = isEven ? 'FFF8FAFC' : 'FFFFFFFF';

    row.eachCell((cell, colNumber) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      if (colNumber === 3 || colNumber === 4) {
        // Name and Father left align
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }

      // Colorize Grade cell (col 13)
      if (colNumber === 13) {
        const gradeFills = {
          'A+': 'FF16A34A', // Rich green
          'A':  'FF22C55E',
          'B':  'FF3B82F6', // Blue
          'C':  'FFF59E0B', // Amber
          'D':  'FFF97316', // Orange
          'F':  'FFEF4444'  // Red
        };
        const fillColor = gradeFills[grade] || 'FF64748B';
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      }

      // Colorize Status cell (col 14)
      if (colNumber === 14) {
        cell.font = { bold: true, color: { argb: isPassed ? 'FF16A34A' : 'FFDC2626' } };
      }

      // Colorize Published cell (col 15)
      if (colNumber === 15) {
        cell.font = { bold: true, color: { argb: isPub ? 'FF059669' : 'FFD97706' } };
      }
    });
  });
}

/**
 * Generate a blank Excel import template for Admin
 */
async function generateExcelTemplate() {
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Oxford Convent School';
  const sheet = workbook.addWorksheet('Results Import Template');

  sheet.mergeCells('A1:J1');
  const bannerRow = sheet.getRow(1);
  bannerRow.height = 28;
  const bannerCell = bannerRow.getCell(1);
  bannerCell.value = 'OXFORD CONVENT SCHOOL — RESULTS IMPORT TEMPLATE (ADMIN ONLY)';
  bannerCell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  bannerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  bannerCell.alignment = { vertical: 'middle', horizontal: 'center' };

  sheet.getRow(2).values = [
    'Student Name*',
    'Roll No',
    'Class*',
    'Subject*',
    'Exam Type*',
    'Exam Date (YYYY-MM-DD)',
    'Marks Obtained*',
    'Total Marks*',
    'Session',
    'Result Unlocked (true/false)'
  ];

  sheet.columns = [
    { key: 'studentName', width: 22 },
    { key: 'rollNo',      width: 12 },
    { key: 'class',       width: 14 },
    { key: 'subject',     width: 18 },
    { key: 'examType',    width: 16 },
    { key: 'examDate',    width: 22 },
    { key: 'score',       width: 16 },
    { key: 'total',       width: 14 },
    { key: 'session',     width: 14 },
    { key: 'unlocked',    width: 25 }
  ];

  const headerRow = sheet.getRow(2);
  headerRow.height = 24;
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Sample row 1
  sheet.addRow({
    studentName: 'Rahul Kumar',
    rollNo: '101',
    class: 'Class 10',
    subject: 'Computer',
    examType: 'Class Test',
    examDate: new Date().toISOString().slice(0, 10),
    score: 18,
    total: 20,
    session: '2026-2027',
    unlocked: 'true'
  });

  // Sample row 2
  sheet.addRow({
    studentName: 'Priya Sharma',
    rollNo: '102',
    class: 'Class 8',
    subject: 'Science',
    examType: 'PT-1',
    examDate: new Date().toISOString().slice(0, 10),
    score: 19,
    total: 20,
    session: '2026-2027',
    unlocked: 'false'
  });

  const filePath = path.join(EXPORTS_DIR, 'oxford_results_import_template.xlsx');
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

/**
 * Parses uploaded Excel / CSV buffer into valid result records
 */
async function parseExcelResults(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error('Uploaded Excel workbook contains no worksheets');

  const rows = [];
  let headerRowIndex = 2; // Default to row 2 (or 1 if no banner)
  let headerMap = {};

  // Find header row containing "student name" or "student"
  for (let r = 1; r <= 5; r++) {
    const row = sheet.getRow(r);
    let found = false;
    row.eachCell((cell, colNumber) => {
      const val = String(cell.value || '').trim().toLowerCase();
      if (val.includes('student') || val.includes('name')) {
        found = true;
      }
    });
    if (found) {
      headerRowIndex = r;
      row.eachCell((cell, colNumber) => {
        const val = String(cell.value || '').trim().toLowerCase();
        headerMap[colNumber] = val;
      });
      break;
    }
  }

  const now = new Date();
  const subYear = now.getFullYear();
  const defaultSession = `${subYear}-${subYear + 1}`;

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowIndex) return; // Skip headers

    const record = {};
    row.eachCell((cell, colNumber) => {
      const h = headerMap[colNumber] || '';
      let cellVal = cell.value;
      if (cellVal && typeof cellVal === 'object') {
        if (cellVal.result !== undefined) cellVal = cellVal.result;
        else if (cellVal.text !== undefined) cellVal = cellVal.text;
      }
      const strVal = String(cellVal || '').trim();

      if (h.includes('student') || h.includes('name')) record.studentName = strVal;
      else if (h.includes('roll')) record.rollNumber = strVal;
      else if (h.includes('class')) record.cls = strVal;
      else if (h.includes('subject')) record.subject = strVal;
      else if (h.includes('type') || h.includes('pt')) record.examType = strVal;
      else if (h.includes('date')) record.examDate = strVal;
      else if (h.includes('score') || h.includes('obtained') || h.includes('marks obtained')) record.score = Number(strVal) || 0;
      else if (h.includes('total')) record.total = Number(strVal) || 0;
      else if (h.includes('session')) record.session = strVal;
      else if (h.includes('unlock') || h.includes('publish')) record.resultUnlocked = (strVal.toLowerCase() === 'true' || strVal.toLowerCase() === 'yes');
    });

    if (record.studentName && record.cls && record.subject) {
      const et = record.examType || 'PT-1';
      const isCT = (et === 'Class Test' || et === 'CT');
      const resolvedDate = (/^\d{4}-\d{2}-\d{2}$/.test(record.examDate)) ? record.examDate : now.toISOString().slice(0, 10);

      rows.push({
        id: `res_imp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        studentName: record.studentName,
        class: record.cls,
        subject: record.subject,
        rollNumber: record.rollNumber || '',
        score: record.score !== undefined ? record.score : 0,
        total: record.total || 20,
        answers: [],
        examType: et,
        session: record.session || defaultSession,
        year: String(subYear),
        examDate: resolvedDate,
        submittedAt: now.toISOString(),
        resultUnlocked: record.resultUnlocked !== undefined ? record.resultUnlocked : isCT
      });
    }
  });

  return rows;
}

module.exports = {
  generateExcel,
  generateExcelTemplate,
  parseExcelResults
};
