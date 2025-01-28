process.env.ENABLE_NEW_JSX_TRANSFORM = 'true';

// Resolve the absolute path of the caller location.
const rootPath = process.cwd();

/**
 * @type {import('jest').Config}
 */
module.exports = {
  displayName: 'test',
  globals: {
    'process.env': {
      NODE_ENV: 'test',
    },
  },
  moduleDirectories: ['packages', 'node_modules'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/transform-file.js',
    '\\.css$': 'identity-obj-proxy',
  },
  clearMocks: true,
  rootDir: rootPath,
  setupFiles: ['<rootDir>/jest.setup.js', 'jest-localstorage-mock'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'https://mc.europe-west1.gcp.commercetools.com',
  },
  testPathIgnorePatterns: ['generators', '/node_modules/'],
  testRegex: '\\.spec\\.[j|t]sx?$',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'babel-jest',
  },
};
