import { initDb, closeDb } from '../src/database';

// Silence console.log during tests to keep output clean
const originalConsoleLog = console.log;

beforeAll(async () => {
  originalConsoleLog('Running before all');
  console.log = () => {};

  // Ensure DB is initialized before tests run
  await initDb();
});

afterAll(async () => {
  // Close DB after all tests
  await closeDb();

  // restore console.log
  console.log = originalConsoleLog;
});
