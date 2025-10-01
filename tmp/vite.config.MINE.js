import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
// import dotenv from "dotenv";
// import config from "./src/config";

// load environment variables from .env
//dotenv.config();

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
  "build-info.json",
  "screenshot-narrow.png",
  "screenshot-wide.png",
];

export default defineConfig(({ mode }) => {
  // console.log("vite config - current mode:", mode); // Add this line to debug
  // const isProductionLike = mode === "production" || mode === "staging";

  return {
    define: {
      __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER || "?"),
      __BUILD_TIMESTAMP__: JSON.stringify(process.env.BUILD_TIMESTAMP || "?"),
    },
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true, // minifies the index.html file
      }),
      // htmlPlugin({
      //   minify: {
      //     collapseWhitespace: true,
      //     removeComments: true,
      //     removeRedundantAttributes: true,
      //     removeScriptTypeAttributes: true,
      //     removeStyleLinkTypeAttributes: true,
      //     useShortDoctype: true,
      //   }
      // }),
      // svgr({ 
      //   svgrOptions: {
      //   },
      // }),
      VitePWA({
        registerType: mode === "production" ? "prompt" /*autoUpdate"*/ : "disabled",
        //registerType: "disabled", // completely disable service worker in dev
        //registerType: "autoUpdate", // ensures the service worker update is autonomous // better for development
        //registerType: "prompt", // ensures the service worker update requires user interaction
        devOptions: {
          enabled: false,
        },
        // devOptions: {
        //   enabled: true, // enable the service worker in development mode
        //   type: "module", // ensure compatibility with Vite's dev environment
        // },
        includeAssets: publicAssets,
        manifest: false,
        workbox: {
          clientsClaim: true, // ensure that all uncontrolled clients (i.e. pages) that are within scope will be controlled by new service worker immediately after that service worker activates
          skipWaiting: false, // ensure the old service worker to remain valid until the user consents
          //skipWaiting: true, // ensure the new service worker takes control immediately
          cleanupOutdatedCaches: true,
          globPatterns: [
            "**/*.{js,css,html,ico,png,jpg,svg,webp,wav,mp3,mp4,webmanifest}", // match all relevant static assets in build folder
          ],
          runtimeCaching: [
            // { // exclude /coverage from PWA caching
            //   urlPattern: /^\/coverage\/.*$/,
            //   handler: "NetworkOnly", // Prevents caching
            // },
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst", // network first for HTML files
              options: {
                cacheName: "document-assets-cache",
                cacheableResponse: {
                  statuses: [0, 200], // cache opaque and successful responses
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                ["style", "script", "image"].includes(request.destination),
              handler: "NetworkFirst", // network first JS, CSS, images
              options: {
                cacheName: "style-script-image-assets-cache",
                cacheableResponse: {
                  statuses: [0, 200], // cache opaque and successful responses
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                ["font"].includes(request.destination),
              handler: "CacheFirst", // cache first fonts
              options: {
                cacheName: "font-assets-cache",
                expiration: {
                  maxEntries: 3,
                  maxAgeSeconds: 60 * 60 * 24 * 180, // cache for 180 days
                },
                cacheableResponse: {
                  statuses: [0, 200], // cache opaque and successful responses
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                ["audio", "video"].includes(request.destination), // match audio and video assets
              handler: "CacheFirst", // cache first audio and video files
              options: {
                cacheName: "audio-video-assets-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 180, // cache for 180 days
                },
                cacheableResponse: {
                  statuses: [0, 200], // cache opaque and successful responses
                },
              },
            },
            {
              urlPattern: /^https:\/\/flagcdn\.com\/.*$/,
              handler: "NetworkOnly", // fetch from the network without caching
            },
            // cache Google Fonts stylesheets
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts-stylesheets-cache",
                expiration: {
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            // cache Google Fonts web font files
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-webfonts-cache",
                expiration: {
                  maxEntries: 1, // limit the number of fonts cached
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200], // cache opaque responses (important for CORS)
                },
              },
            },
            // cache server responses in development mode
            {
              urlPattern: /^http:\/\/localhost:5000\/.*$/, // local development server
              handler: "NetworkFirst", // use NetworkFirst or CacheFirst as needed
              options: {
                cacheName: "local-api-cache",
                expiration: {
                  maxEntries: 100, // cache up to 100 entries
                  maxAgeSeconds: 60 * 60 * 24, // cache for 1 day
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
            // cache server responses in production mode
            {
              urlPattern: /^https:\/\/farmaperte-server-lingering-brook-4120\.fly\.dev\/api\/.*$/,
              handler: "NetworkFirst", // use "NetworkFirst" or "CacheFirst" depending on your use case
              options: {
                cacheName: "public-api-cache",
                expiration: {
                  maxEntries: 100, // maximum number of entries in the cache
                  maxAgeSeconds: 60 * 60 * 24 * 7, // cache for 1 week
                },
                cacheableResponse: {
                  statuses: [200], // cache only successful responses
                },
              },
            },
          ],
          navigateFallback: "/index.html", // required for SPA
          navigateFallbackDenylist: [/^\/api\//, /^\/auth\//, /^\/static\//], // to let social login work correctly
          globDirectory: buildDir,
          maximumFileSizeToCacheInBytes: 30 * (1024 ** 2), // 30 MB
        },
      }),
    ],
    server: {
      port: 5005,
      // proxy: {
      //   "/coverage": {
      //     target: "http://localhost:5000", // the express backend
      //     changeOrigin: true,
      //     secure: false,
      //   },
      // },
    },
    base: "/", // base application path
    build: {
      outDir: buildDir,
      emptyOutDir: true,
      rollupOptions: { // split output in manual chunks, to avoid too big chunks
        output: {
          manualChunks: undefined // do not show spurious "empty chunk" warnings
          // manualChunks(id) {
          //   if (id.includes("node_modules")) {
          //     return id.toString().split("node_modules/")[1].split("/")[0].toString();
          //   }
          // }
        },
      },
      chunkSizeWarningLimit: 1280, // 1.2 MB, to avoid chunks size warning (chunk with react is usually ~800kB)
    },
    publicDir: publicDir,
    logLevel: "info", // does not show console.log (at least) to production app (run from server, port 5000)
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./test/setup.js", // assuming the test folder is in the root of our project
    },
  };
});
