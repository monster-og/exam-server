const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'services', 'studyMaterialService.js');
let code = fs.readFileSync(filePath, 'utf8');

// We will inject officialPdfs into each subject definition in studyMaterialService.js
const injections = [
  {
    target: 'code: "041 / 241",\n      icon: "📐",\n      color: "#3b82f6",',
    replacement: `code: "041 / 241",
      icon: "📐",
      color: "#3b82f6",
      officialPdfs: {
        sqp: { title: "CBSE Maths Standard Sample Paper (SQP 2024-25)", localUrl: "/cbse-materials/MathsStandard-SQP.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsStandard-SQP.pdf", filesize: "675 KB" },
        ms: { title: "CBSE Maths Standard Marking Scheme (MS 2024-25)", localUrl: "/cbse-materials/MathsStandard-MS.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsStandard-MS.pdf", filesize: "658 KB" },
        basicSqp: { title: "CBSE Maths Basic Sample Paper (SQP 2024-25)", localUrl: "/cbse-materials/MathsBasic-SQP.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsBasic-SQP.pdf", filesize: "375 KB" },
        basicMs: { title: "CBSE Maths Basic Marking Scheme (MS 2024-25)", localUrl: "/cbse-materials/MathsBasic-MS.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsBasic-MS.pdf", filesize: "239 KB" },
        questionBank: { title: "CBSE Official Class 10 Maths Question Bank (Full PDF)", localUrl: "/cbse-materials/CBSE-Maths-QuestionBank.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/QuestionBank/ClassX/MathsX.pdf", filesize: "1.85 MB" },
        mockTestLink: "exam.html?subject=Mathematics&type=Class+Test"
      },`
  },
  {
    target: 'code: "086",\n      icon: "🔬",\n      color: "#10b981",',
    replacement: `code: "086",
      icon: "🔬",
      color: "#10b981",
      officialPdfs: {
        sqp: { title: "CBSE Class 10 Science Sample Paper (SQP 2024-25)", localUrl: "/cbse-materials/Science-SQP.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Science-SQP.pdf", filesize: "896 KB" },
        ms: { title: "CBSE Class 10 Science Marking Scheme (MS 2024-25)", localUrl: "/cbse-materials/Science-MS.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Science-MS.pdf", filesize: "610 KB" },
        questionBank: { title: "CBSE Official Class 10 Science Question Bank (Full PDF)", localUrl: "/cbse-materials/CBSE-Science-QuestionBank.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/QuestionBank/ClassX/ScienceX.pdf", filesize: "1.28 MB" },
        mockTestLink: "exam.html?subject=Science&type=Class+Test"
      },`
  },
  {
    target: 'code: "087",\n      icon: "🌍",\n      color: "#f59e0b",',
    replacement: `code: "087",
      icon: "🌍",
      color: "#f59e0b",
      officialPdfs: {
        sqp: { title: "CBSE Social Science Sample Paper (SQP 2024-25)", localUrl: "/cbse-materials/SocialScience-SQP.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/SocialScience-SQP.pdf", filesize: "581 KB" },
        ms: { title: "CBSE Social Science Marking Scheme (MS 2024-25)", localUrl: "/cbse-materials/SocialScience-MS.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/SocialScience-MS.pdf", filesize: "539 KB" },
        mockTestLink: "exam.html?subject=Social+Science&type=Class+Test"
      },`
  },
  {
    target: 'code: "184",\n      icon: "🔤",\n      color: "#8b5cf6",',
    replacement: `code: "184",
      icon: "🔤",
      color: "#8b5cf6",
      officialPdfs: {
        sqp: { title: "CBSE English Language & Literature Sample Paper (SQP 2024-25)", localUrl: "/cbse-materials/EnglishL-SQP.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/EnglishL-SQP.pdf", filesize: "302 KB" },
        ms: { title: "CBSE English Language & Literature Marking Scheme (MS 2024-25)", localUrl: "/cbse-materials/EnglishL-MS.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/EnglishL-MS.pdf", filesize: "500 KB" },
        questionBank: { title: "CBSE Official Class 10 English Question Bank (Full PDF)", localUrl: "/cbse-materials/CBSE-English-QuestionBank.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/QuestionBank/ClassX/EnglishX.pdf", filesize: "10.1 MB" },
        mockTestLink: "exam.html?subject=English&type=Class+Test"
      },`
  },
  {
    target: 'code: "002",\n      icon: "🇮🇳",\n      color: "#ef4444",',
    replacement: `code: "002",
      icon: "🇮🇳",
      color: "#ef4444",
      officialPdfs: {
        sqp: { title: "सीबीएसई हिंदी अ आधिकारिक मॉडल प्रश्न पत्र (SQP 2024-25)", localUrl: "/cbse-materials/HindiCourseA-SQP.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/HindiCourseA-SQP.pdf", filesize: "1.24 MB" },
        ms: { title: "सीबीएसई हिंदी अ आधिकारिक अंकन योजना (MS 2024-25)", localUrl: "/cbse-materials/HindiCourseA-MS.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/HindiCourseA-MS.pdf", filesize: "1.14 MB" },
        mockTestLink: "exam.html?subject=Hindi&type=Class+Test"
      },`
  },
  {
    target: 'code: "402 / 165",\n      icon: "💻",\n      color: "#06b6d4",',
    replacement: `code: "402 / 165",
      icon: "💻",
      color: "#06b6d4",
      officialPdfs: {
        sqp: { title: "CBSE Computer Application (165) Sample Paper (SQP 2024-25)", localUrl: "/cbse-materials/ComputerApplication-SQP.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/ComputerApplication-SQP.pdf", filesize: "438 KB" },
        ms: { title: "CBSE Computer Application Marking Scheme (MS 2024-25)", localUrl: "/cbse-materials/ComputerApplication-MS.pdf", officialUrl: "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/ComputerApplication-MS.pdf", filesize: "192 KB" },
        mockTestLink: "exam.html?subject=Computer&type=Class+Test"
      },`
  }
];

let replacedCount = 0;
for (const inj of injections) {
  // Normalize windows newlines
  const normTarget = inj.target.replace(/\r\n/g, '\n');
  const normCode = code.replace(/\r\n/g, '\n');
  if (normCode.includes(normTarget)) {
    code = normCode.replace(normTarget, inj.replacement);
    replacedCount++;
  } else {
    console.warn('Could not find target:', inj.target.substring(0, 30));
  }
}

fs.writeFileSync(filePath, code, 'utf8');
console.log(`Successfully injected officialPdfs into ${replacedCount} subjects in studyMaterialService.js!`);
