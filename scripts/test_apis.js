const http = require('http');
const app = require('../server'); // if exported, or let's start the server briefly

// Let's test questions.json directly first
const questions = require('../data/questions.json');
const keys = [
  'Class 10_Mathematics_Class Test',
  'Class 10_Science_Class Test',
  'Class 10_Social Science_Class Test',
  'Class 10_English_Class Test',
  'Class 10_Hindi_Class Test'
];

console.log('Testing questions in questions.json:');
keys.forEach(k => {
  const qList = questions[k] || [];
  console.log(`- ${k}: ${qList.length} questions`);
});

// Test studyMaterialService
const studyService = require('../services/studyMaterialService');
const hub = studyService.getClass10BoardHub();
console.log('\nTesting studyMaterialService Class 10 Board Hub:');
console.log(`- Title: ${hub.meta.title}`);
console.log(`- Subjects: ${Object.keys(hub.subjects).join(', ')}`);
Object.keys(hub.subjects).forEach(s => {
  const sub = hub.subjects[s];
  const pdfKeys = Object.keys(sub.officialPdfs || {});
  console.log(`  * ${sub.name} (Code ${sub.code}): ${pdfKeys.length} PDF resources`);
});
