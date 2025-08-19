import type { Config } from "jest";
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/tests/e2e/**/*.test.ts"],
  roots: ["<rootDir>"],
  moduleFileExtensions: ["ts", "js", "json"],
  verbose: true
};
export default config;
