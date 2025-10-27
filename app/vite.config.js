import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'log-bad-urls',
      configureServer(server) {
        // Log server start
        server.httpServer?.once('listening', () => {
          const info = server.httpServer?.address();
          const protocol = server.config.server.https ? 'https' : 'http';

          let host = 'localhost';
          let port = 5173;

          if (typeof info === 'object' && info?.port) {
            port = info.port;
            host = info.address === '::' ? 'localhost' : info.address;
          }

          console.log(`\n🚀 Dev server running at: ${protocol}://${host}:${port}\n`);
        });

        // 🧠 Catch malformed URIs early
        server.middlewares.use((req, res, next) => {
          try {
            decodeURI(req.url);
          } catch (e) {
            console.error(
              `\x1b[41m\x1b[37m🚨 Malformed request URL:\x1b[0m ${req.url}`
            );
            res.statusCode = 400;
            res.end(`Bad Request: Malformed URL - ${req.url}`);
            return; // Don't pass to next middleware
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false // optional: hide crash overlay for now
    }
  }
});
