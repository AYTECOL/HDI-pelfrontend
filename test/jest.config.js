module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^common/(.*)$': '<rootDir>/../src/common/$1',
    '^assets/(.*)$': '<rootDir>/../src/assets/$1',
    '^store/(.*)$': '<rootDir>/../src/store/$1',
    '^store$': '<rootDir>/../src/store/index.js',
    '^services/(.*)$': '<rootDir>/../src/services/$1',
    '^config$': '<rootDir>/../src/config.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/**/*.test.js', '<rootDir>/**/*.test.jsx'],
  collectCoverageFrom: [
    '../src/**/*.{js,jsx}',
    '!../src/**/*.d.ts',
    '!../src/index.js',
  ],
  rootDir: __dirname,
};
