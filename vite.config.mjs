import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const PORT = 3000;
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: PORT,
      host: true,
      proxy: {
        // Serve the admin API same-origin so its SameSite=strict session cookie works.
        '/v1': {
          target: env.ADMIN_API_PROXY_TARGET || 'http://127.0.0.1:16000',
          // Forward the browser's Host so the API's Origin check sees this server as its own origin.
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
