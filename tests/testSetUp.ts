import { initDb, closeDb } from '../src/database';

// Silence console.log during tests to keep output clean
const originalConsoleLog = console.log;

beforeAll(async () => {
  originalConsoleLog('Running before all');
  console.log = () => {};

  const testPath = expect.getState().testPath || '';
  const isDbIntegrationTest = /tests[\\/]+dbIntergration[\\/]+/.test(testPath);

  if (isDbIntegrationTest) {
    await initDb();
  }
});

afterAll(async () => {
  const testPath = expect.getState().testPath || '';
  const isDbIntegrationTest = /tests[\\/]+dbIntergration[\\/]+/.test(testPath);

  if (isDbIntegrationTest) {
    await closeDb();
  }

  // restore console.log
  console.log = originalConsoleLog;
});
