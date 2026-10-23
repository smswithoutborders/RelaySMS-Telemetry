import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const PORT = 3000;
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_PATH || '/',
    server: {
      open: true,
      port: PORT,
      host: true,
      proxy: {
        '/v1': {
          target: env.ADMIN_API_PROXY_TARGET || 'http://127.0.0.1:16000',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => proxyReq.setHeader('host', req.headers.host));
          }
        }
      }
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window'
    },
    resolve: {
      // antd's DatePicker extends its own dayjs with plugins; a second copy breaks it (clone.weekday is not a function).
      dedupe: ['dayjs'],
      alias: [
        // { find: '', replacement: path.resolve(__dirname, 'src') },
        // {
        //   find: /^~(.+)/,
        //   replacement: path.join(process.cwd(), 'node_modules/$1')
        // },
        // {
        //   find: /^src(.+)/,
        //   replacement: path.join(process.cwd(), 'src/$1')
        // }
        // {
        //   find: 'assets',
        //   replacement: path.join(process.cwd(), 'src/assets')
        // },
      ]
    },
    plugins: [react(), jsconfigPaths()]
  };
});
