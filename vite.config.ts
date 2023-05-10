import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
// Configuration for sovryn-onboard package: https://onboard.blocknative.com/docs/modules/core#vite
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: [
        'node_modules/**/*.js',
        // eslint-disable-next-line prefer-regex-literals
        new RegExp('node_modules/.vite/.*js'),
        'http',
        'crypto',
      ],
    }),
  ],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
    },
  },
  build: {
    rollupOptions: {
      external: ['@sovryn/onboard-*'],
      plugins: [nodePolyfills({ include: ['crypto', 'http'] })],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    exclude: ['@ethersproject/hash', 'wrtc', 'http'],
    include: ['@sovryn/onboard-core', 'js-sha3', '@ethersproject/bignumber'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    'process.env': process.env,
    global: 'window',
  },
});
