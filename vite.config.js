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
          intro: resolve(__dirname, './src/1-Basics/1-Intro/index.html'),
          cube: resolve(__dirname, './src/1-Basics/2-Cube/index.html'),
          basics: resolve(__dirname, './src/1-Basics/index.html'),
          lights: resolve(__dirname, './src/2-ClassicTechniques/15-Lights/index.html'),
          shadows: resolve(__dirname, './src/2-ClassicTechniques/16-Shadows/index.html'),
          hauntedHouse: resolve(__dirname, './src/2-ClassicTechniques/17-HauntedHouse/index.html'),
          particles: resolve(__dirname, './src/2-ClassicTechniques/18-Particles/index.html'),
          particlesWave: resolve(__dirname, './src/2-ClassicTechniques/18-ParticlesWave/index.html'),
        }
      },
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: true
    }
});
