import { resolve } from 'path';
import { defineConfig } from 'vite';

const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env;

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
          main: resolve('./src/', 'index.html'),
          basics: resolve('./src/1-Basics/', 'index.html'),
          lights: resolve('./src/2-ClassicTechniques/15-Lights/', 'index.html'),
          shadows: resolve('./src/2-ClassicTechniques/16-Shadows/', 'index.html'),
          hauntedHouse: resolve('./src/2-ClassicTechniques/17-HauntedHouse/', 'index.html'),
          particles: resolve('./src/2-ClassicTechniques/18-Particles/', 'index.html'),
          particlesWave: resolve('./src/2-ClassicTechniques/18-ParticlesWave/', 'index.html'),
        }
      },
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: true
    }
});
