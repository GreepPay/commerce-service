import "reflect-metadata";
import { beforeAll, afterAll } from "bun:test";

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = "test";
  process.env.APP_STATE = "test";
});

// Global test teardown
afterAll(async () => {
  // Clean up environment variables
  delete process.env.APP_STATE;
});
