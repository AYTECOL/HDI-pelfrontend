const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running tests with JUnit XML output...');

// Ensure reports/junit directory exists
const reportsDir = path.join(process.cwd(), 'reports', 'junit');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Set environment variables for jest-junit
process.env.JEST_JUNIT_OUTPUT_DIR = './reports/junit';
process.env.JEST_JUNIT_OUTPUT_NAME = 'junit.xml';

try {
  // Run tests with jest-junit reporter
  execSync('npx react-scripts test --watchAll=false --reporters=default --reporters=jest-junit', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('Tests completed successfully!');
  console.log('JUnit XML report generated at: ./reports/junit/junit.xml');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}