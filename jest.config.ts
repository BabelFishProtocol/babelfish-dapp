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
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '.+\\.(svg)$': 'jest-transform-stub',
    },
  };
};
