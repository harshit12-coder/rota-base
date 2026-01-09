const fs = require('fs');
const filePath = 'c:\\Users\\HarshitKushwah\\OneDrive - Sinhal Udyog pvt ltd\\Desktop\\Event Horizon\\anti-roster\\src\\ROTAScheduler.jsx';
const content = fs.readFileSync(filePath, 'utf8').split('\n');
// Line 3211 is index 3210
content[3210] = content[3210].replace('}', ')}');
fs.writeFileSync(filePath, content.join('\n'));
