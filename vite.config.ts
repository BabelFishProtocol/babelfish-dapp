import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
// import * as cryptoPlugin from 'crypto-browserify';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // stream: 'stream-browserify',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      // crypto3: cryptoPlugin,
    },
  },
  plugins: [
    react(),
    NodeGlobalsPolyfillPlugin(),
    NodeModulesPolyfillPlugin(),
    rollupNodePolyFill(),
  ],
  define: {
    'process.env': process.env,
    // global: {},
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeModulesPolyfillPlugin(),
        {
          name: 'fix-node-globals-polyfill',
          setup(build) {
            build.onResolve(
              { filter: /_virtual-process-polyfill_\.js/ },
              ({ path }) => ({ path })
            );
          },
        },
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill,
      ],
    },
  },
});
