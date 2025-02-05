module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: [
    "<rootDir>/setupTests.cjs",
  ],
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.cjs"
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.json'
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: '\\.spec\\.[jt]sx?$',
  // ...existing code...
};