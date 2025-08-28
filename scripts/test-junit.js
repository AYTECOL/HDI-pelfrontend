const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running tests with JUnit XML output...');

// Ensure test-results directory exists
const testResultsDir = path.join(process.cwd(), 'test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

// Set environment variables for jest-junit
process.env.JEST_JUNIT_OUTPUT_DIR = './test-results';
process.env.JEST_JUNIT_OUTPUT_NAME = 'junit.xml';

try {
  // Run tests with jest-junit reporter
  execSync('npx react-scripts test --watchAll=false --reporters=default --reporters=jest-junit', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('Tests completed successfully!');
  console.log('JUnit XML report generated at: ./test-results/junit.xml');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}