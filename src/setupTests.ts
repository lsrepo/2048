import '@testing-library/jest-dom';

// Mock fetch for LangChain - simplified to avoid TypeScript issues
(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock console methods to prevent output during testing
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
};

beforeAll(() => {
  // Mock all console methods to prevent output during tests
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
});

afterAll(() => {
  // Restore original console methods after all tests
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
});

// Mock import.meta.env for Vite environment variables
(global as any).import = {
  meta: {
    env: {
      VITE_ANTHROPIC_API_KEY: 'test-api-key'
    }
  }
}; 