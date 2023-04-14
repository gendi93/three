import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';

import { fileURLToPath } from 'url';

const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: './src/',
  publicDir: '../static/',
  base: './',
  server:
    {
      host: true,
      open: !isCodeSandbox // Open if it's not a CodeSandbox
    },
  build:
    {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
          intro: resolve(__dirname, './src/Basics/Intro/index.html'),
          cube: resolve(__dirname, './src/Basics/Cube/index.html'),
          diamondCube: resolve(__dirname, './src/Basics/DiamondCube/index.html'),
          door: resolve(__dirname, './src/Basics/Door/index.html'),
          donuts: resolve(__dirname, './src/Basics/Donuts/index.html'),
          shadows: resolve(__dirname, './src/ClassicTechniques/Shadows/index.html'),
          hauntedHouse: resolve(__dirname, './src/ClassicTechniques/HauntedHouse/index.html'),
          waves: resolve(__dirname, './src/ClassicTechniques/Waves/index.html'),
          ripple: resolve(__dirname, './src/ClassicTechniques/Ripple/index.html'),
          galaxy: resolve(__dirname, './src/ClassicTechniques/Galaxy/index.html'),
        }
      },
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: true
    }
});
