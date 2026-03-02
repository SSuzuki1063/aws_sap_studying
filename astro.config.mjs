import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ssuzuki1063.github.io',
  base: '/aws_sap_studying',
  output: 'static',
  build: {
    format: 'file',  // networking/foo.html（NOT networking/foo/index.html）
  },
  vite: {
    build: {
      // Don't hash asset filenames — preserve original CSS/JS paths
      rollupOptions: {
        output: {
          assetFileNames: '[name][extname]',
        },
      },
    },
  },
});
