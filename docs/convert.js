const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const html = path.resolve(__dirname, '7th_Heaven_Cafe_Architecture_Design.html');
const pdf = path.resolve(__dirname, '7th_Heaven_Cafe_Architecture_Design.pdf');
const artifact = 'C:\\Users\\Aditya\\.gemini\\antigravity-ide\\brain\\9034f289-83c5-4252-bbea-817bac5f304e\\7th_Heaven_Cafe_Architecture_Design.pdf';

const fileUrl = 'file:///' + html.replace(/\\/g, '/');
const cmd = `"${edge}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdf}" "${fileUrl}"`;

console.log('Running cmd:', cmd);
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(pdf)) {
  const stat = fs.statSync(pdf);
  console.log(`Success! PDF generated at: ${pdf} (${stat.size} bytes)`);
  fs.copyFileSync(pdf, artifact);
  console.log(`Copied to artifact directory: ${artifact}`);
} else {
  console.error('PDF file was not created!');
}
