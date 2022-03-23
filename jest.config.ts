/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default () => {
  process.env.TZ = 'UTC';

  return {
    clearMocks: true,
    preset: 'ts-jest',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.jest.json',
        diagnostics: false,
      },
    },
    moduleNameMapper: {
      '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
      '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/__mocks__/file-mock.ts',
    },
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '.+\\.(svg)$': 'jest-transform-stub',
    },
    setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
  };
};
