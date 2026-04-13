import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      outDir: 'dist',
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'classNames/index': resolve(__dirname, 'src/classNames/index.ts'),
        'mixin/index': resolve(__dirname, 'src/mixin/index.ts'),
        'mixin/styles': resolve(__dirname, 'src/mixin/styles.ts'),
        'scopedStyle/index': resolve(__dirname, 'src/scopedStyle/index.tsx'),
        'layoutUtils/index': resolve(__dirname, 'src/layoutUtils/index.ts'),
        'layoutUtils/styles': resolve(__dirname, 'src/layoutUtils/styles.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        preserveModules: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            const source = assetInfo.originalFileNames?.[0] || '';
            if (source.includes('mixin')) {
              return 'mixin/mixin.css';
            }
            if (source.includes('layoutUtils')) {
              return 'layoutUtils/layoutUtils.css';
            }
          }
          return 'assets/[name][extname]';
        },
      },
    },
    cssCodeSplit: true,
  },
});
