process.env.ENABLE_NEW_JSX_TRANSFORM = 'true';

/**
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'ts-jest',
  displayName: 'test-node',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.json'
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  setupFiles: [
    "<rootDir>/setupTests.cjs"
  ],
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.cjs'
  ],
  testRegex: '\\.spec\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  testPathIgnorePatterns: ['/node_modules/'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
