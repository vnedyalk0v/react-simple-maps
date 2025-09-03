// Test setup file for vitest
import { beforeAll, afterAll, afterEach } from 'vitest';

// Setup global test environment
beforeAll(() => {
  // Global setup before all tests
});

afterEach(() => {
  // Cleanup after each test
});

afterAll(() => {
  // Global cleanup after all tests
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};
