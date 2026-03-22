import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.d.ts',
        'src/components/ui/**',
      ],
    },
    alias: [
      { find: /^@\/components\/(.*)$/, replacement: path.resolve(__dirname, './components/$1') },
      { find: /^@\/app\/(.*)$/, replacement: path.resolve(__dirname, './app/$1') },
      { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, './src/$1') },
    ],
  },
  resolve: {
    alias: [
      { find: /^@\/components\/(.*)$/, replacement: path.resolve(__dirname, './components/$1') },
      { find: /^@\/app\/(.*)$/, replacement: path.resolve(__dirname, './app/$1') },
      { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, './src/$1') },
    ],
  },
});
