// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Handle unhandled promise rejections
process.on('unhandledRejection', () => {
  // Ignore unhandled promise rejections in tests
});

// Clean up after each test
afterEach(() => {
  jest.clearAllTimers();
});