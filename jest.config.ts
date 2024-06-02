import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/?(*.)+(unit.test).ts"], // only look for files that are named *.unit.test.ts
};

export default config;
