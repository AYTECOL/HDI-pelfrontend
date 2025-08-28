const { execSync } = require('child_process');
const path = require('path');

// Add Node.js to PATH
process.env.PATH = `C:\\Program Files\\nodejs;${process.env.PATH}`;

try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  
  console.log('\nRunning tests...');
  execSync('npm test', { stdio: 'inherit', cwd: __dirname });
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}