
module.exports = {
  // ...existing code...
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '@testing-library/jest-dom',
  ],
  // ...existing code...
};