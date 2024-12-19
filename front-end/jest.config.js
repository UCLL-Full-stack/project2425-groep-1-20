module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': 'esbuild-jest',
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy'
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
}