const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET_DIR = path.join(__dirname, '..', 'public', 'cbse-materials');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const FILES_TO_DOWNLOAD = [
  { name: 'MathsStandard-SQP.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsStandard-SQP.pdf' },
  { name: 'MathsStandard-MS.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsStandard-MS.pdf' },
  { name: 'MathsBasic-SQP.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsBasic-SQP.pdf' },
  { name: 'MathsBasic-MS.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsBasic-MS.pdf' },
  { name: 'Science-SQP.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Science-SQP.pdf' },
  { name: 'Science-MS.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Science-MS.pdf' },
  { name: 'SocialScience-SQP.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/SocialScience-SQP.pdf' },
  { name: 'SocialScience-MS.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/SocialScience-MS.pdf' },
  { name: 'EnglishLL-SQP.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/EnglishLL-SQP.pdf' },
  { name: 'EnglishLL-MS.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/EnglishLL-MS.pdf' },
  { name: 'HindiCourseA-SQP.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/HindiCourseA-SQP.pdf' },
  { name: 'HindiCourseA-MS.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/HindiCourseA-MS.pdf' },
  { name: 'ComputerApplication-SQP.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/ComputerApplication-SQP.pdf' },
  { name: 'ComputerApplication-MS.pdf', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/ComputerApplication-MS.pdf' },
  { name: 'CBSE-Maths-QuestionBank.pdf', url: 'https://cbseacademic.nic.in/web_material/QuestionBank/ClassX/MathsX.pdf' },
  { name: 'CBSE-Science-QuestionBank.pdf', url: 'https://cbseacademic.nic.in/web_material/QuestionBank/ClassX/ScienceX.pdf' },
  { name: 'CBSE-English-QuestionBank.pdf', url: 'https://cbseacademic.nic.in/web_material/QuestionBank/ClassX/EnglishX.pdf' }
];

function downloadFile(item) {
  return new Promise((resolve) => {
    const destPath = path.join(TARGET_DIR, item.name);
    // If already downloaded and size > 10KB, skip
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 10240) {
      console.log(`[Already Exists] ${item.name} (${fs.statSync(destPath).size} bytes)`);
      return resolve({ success: true, item, bytes: fs.statSync(destPath).size });
    }

    const fileStream = fs.createWriteStream(destPath);
    https.get(item.url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // follow redirect
        https.get(response.headers.location, (redirRes) => {
          redirRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            const sz = fs.statSync(destPath).size;
            console.log(`[Downloaded (Redirect)] ${item.name} (${sz} bytes)`);
            resolve({ success: true, item, bytes: sz });
          });
        }).on('error', (err) => {
          console.error(`[Error] ${item.name}: ${err.message}`);
          resolve({ success: false, item, error: err.message });
        });
        return;
      }

      if (response.statusCode !== 200) {
        console.warn(`[Failed HTTP ${response.statusCode}] ${item.name}`);
        fileStream.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve({ success: false, item, status: response.statusCode });
      }

      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const sz = fs.statSync(destPath).size;
        console.log(`[Downloaded] ${item.name} (${sz} bytes)`);
        resolve({ success: true, item, bytes: sz });
      });
    }).on('error', (err) => {
      console.error(`[Error] ${item.name}: ${err.message}`);
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve({ success: false, item, error: err.message });
    });
  });
}

async function run() {
  console.log(`Starting CBSE Official Material Downloads into ${TARGET_DIR}...`);
  for (const item of FILES_TO_DOWNLOAD) {
    await downloadFile(item);
  }
  console.log('Finished downloading CBSE materials!');
}

run();
