module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.test.ts"
  ],
  preset: 'ts-jest',
  moduleNameMapper: {
    '@functions/(.*)': '<rootDir>/src/functions/$1',
    '@libs/(.*)': '<rootDir>/src/libs/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@mocks/(.*)': '<rootDir>/src/mocks/$1',
    '@repositories/(.*)': '<rootDir>/src/repositories/$1'
  }
};
