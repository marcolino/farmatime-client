import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";

// load environment variables from .env
// dotenv.config();

const publicDir = path.resolve(__dirname, "public");
const buildDir = path.resolve(__dirname, "build");

// public assets
const publicAssets = [
  "favicon-16x16.ico",
  "favicon-32x32.ico",
  "favicon-64x64.ico",
  "apple-touch-icon.png",
  "ms-tile.png",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "build-info-client.json",
  "screenshot-narrow.png",
  "screenshot-wide.png",
];

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const keepConsole = process.env.KEEP_CONSOLE === 'true';
  const keepDebugger = process.env.KEEP_DEBUGGER === 'true';

  return {
    define: {
      __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER || "?"),
      __BUILD_TIMESTAMP__: JSON.stringify(process.env.BUILD_TIMESTAMP || "?"),
      global: {},
    },
    esbuild: {
      keepNames: true,
    },
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true, // minifies the index.html file
      }),
      VitePWA({
        registerType: isProduction ? "prompt" : "autoUpdate",
        devOptions: {
          enabled: !isProduction, // enable the service worker in development mode
          type: "module", // ensure compatibility with Vite's dev environment
        },
        includeAssets: publicAssets,
        manifest: false,
        //workbox: isProduction ?
        workbox: {
          clientsClaim: true,
          skipWaiting: false,
          cleanupOutdatedCaches: true,
          globPatterns: isProduction ? [
            "**/*.{js,css,html,ico,png,jpg,svg,webp,wav,mp3,mp4,webmanifest}",
          ] : [],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "document-assets-cache",
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                ["style", "script", "image"].includes(request.destination),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "style-script-image-assets-cache",
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ request }) => ["font"].includes(request.destination),
              handler: "CacheFirst",
              options: {
                cacheName: "font-assets-cache",
                expiration: {
                  maxEntries: 3,
                  maxAgeSeconds: 60 * 60 * 24 * 180,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                ["audio", "video"].includes(request.destination),
              handler: "CacheFirst",
              options: {
                cacheName: "audio-video-assets-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 180,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/flagcdn\.com\/.*$/,
              handler: "NetworkOnly",
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts-stylesheets-cache",
                expiration: {
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-webfonts-cache",
                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^http:\/\/localhost:5000\/.*$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "local-api-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/farmatime-server-lingering-brook-4120\.fly\.dev\/api\/.*$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "public-api-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
          ],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//, /^\/auth\//, /^\/static\//],
          globDirectory: buildDir,
          maximumFileSizeToCacheInBytes: 30 * (1024 ** 2),
        },
        //} : undefined
      }),
    ],
    optimizeDeps: {
      include: ['@mui/x-date-pickers'],
       esbuildOptions: {
        define: {
          global: 'globalThis'
        }
      }
    },
    server: {
      port: 5005,
      //host: true,
    },
    base: "/",
    build: {
      outDir: buildDir,
      emptyOutDir: true,
      // rollupOptions: {
      //   output: {
      //     manualChunks: undefined,
      //   },
      // },
      // THESE ROLLUT OPTIONS DO BREAK EVERYTHING!
      // rollupOptions: {
      //   output: {
      //     manualChunks(id) {
      //       if (id.includes('node_modules')) {
      //         return id.toString().split('node_modules/')[1].split('/')[0];
      //       }
      //     }
      //   }
      // },
      chunkSizeWarningLimit: 1792,
      sourcemap: true,
      // Disable console.log removal
      terserOptions: {
        compress: {
          drop_console: !keepConsole,
          drop_debugger: !keepDebugger,
        }
      },
      minify: 'terser', // Optional: make sure minification still happens
    },
    publicDir: publicDir,
    logLevel: "info",
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./test/setup.js",
    },
    resolve: {
      alias: {
        'mui-material-custom': path.resolve(__dirname, 'src/components/mui-material-custom'),
        setimmediate: 'setimmediate/setImmediate.js',
        buffer: 'buffer',
        process: 'process/browser',
        stream: 'stream-browserify',
        assert: 'assert',
        util: 'util',
        path: 'path-browserify',
        querystring: 'querystring-es3'
      }
    },
    // optimizeDeps: {
    //   esbuildOptions: {
    //     define: {
    //       global: 'globalThis'
    //     }
    //   }
    // }
  };
});