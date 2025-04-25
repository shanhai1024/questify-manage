
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins:[vue(),svgLoader()],
  resolve:{ alias:{ '@': path.resolve(__dirname,'src') } },
  server:{ port:9527 }
});
