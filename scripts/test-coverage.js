const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run tests with coverage
console.log('Running tests with coverage...');
execSync('react-scripts test --coverage --watchAll=false', { stdio: 'inherit' });

// Create test/coverage directory if it doesn't exist
const testCoverageDir = path.join(process.cwd(), 'test', 'coverage');
if (!fs.existsSync(testCoverageDir)) {
  fs.mkdirSync(testCoverageDir, { recursive: true });
}

// Copy only the lcov.info file that Jenkins needs
const lcovFile = path.join(process.cwd(), 'coverage', 'lcov.info');
const destLcovFile = path.join(testCoverageDir, 'lcov.info');

if (fs.existsSync(lcovFile)) {
  fs.copyFileSync(lcovFile, destLcovFile);
  console.log('Coverage report (lcov.info) copied to test/coverage/');
} else {
  console.log('Warning: lcov.info not found in coverage directory');
}