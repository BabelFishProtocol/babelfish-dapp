import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import path from 'path';

/* eslint-disable */
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.NODE_ENV !== 'production'
      ? nodePolyfills({
          include: [
            'node_modules/**/*.js',
            new RegExp('node_modules/.vite/.*js'),
          ], //https://github.com/blocknative/web3-onboard/issues/762#issuecomment-997246672
        })
      : undefined,
  ],
  resolve: {
    alias: {
      util: path.resolve(__dirname, './node_modules/util'),
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills(), nodeResolve({ preferBuiltins: false })],
    },
  },
  define: {
    'process.env': process.env,
  },
});
