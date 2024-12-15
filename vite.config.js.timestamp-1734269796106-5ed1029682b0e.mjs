// vite.config.js
import { defineConfig } from "file:///home/marco/apps/sistemisolari/acme-client/.yarn/__virtual__/vite-virtual-2048beb209/0/cache/vite-npm-5.4.11-9da365ef2b-8c5b31d174.zip/node_modules/vite/dist/node/index.js";
import react from "file:///home/marco/apps/sistemisolari/acme-client/.yarn/__virtual__/@vitejs-plugin-react-virtual-27edfe9813/0/cache/@vitejs-plugin-react-npm-4.3.3-36a77676a2-1ad449cb79.zip/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { VitePWA } from "file:///home/marco/apps/sistemisolari/acme-client/.yarn/__virtual__/vite-plugin-pwa-virtual-551700ddd3/0/cache/vite-plugin-pwa-npm-0.20.5-f1e0d20c81-976a1d99b4.zip/node_modules/vite-plugin-pwa/dist/index.js";
import { createHtmlPlugin } from "file:///home/marco/apps/sistemisolari/acme-client/.yarn/__virtual__/vite-plugin-html-virtual-f85f6e9bd8/0/cache/vite-plugin-html-npm-3.2.2-e0fe1a82c1-2fd6e1f91f.zip/node_modules/vite-plugin-html/dist/index.mjs";
import dotenv from "file:///home/marco/apps/sistemisolari/acme-client/.yarn/cache/dotenv-npm-16.4.5-bcb20eb95d-301a12c3d4.zip/node_modules/dotenv/lib/main.js";
var __vite_injected_original_dirname = "/home/marco/apps/sistemisolari/acme-client";
var publicDir = path.resolve(__vite_injected_original_dirname, "public");
var buildDir = path.resolve(__vite_injected_original_dirname, "build");
var publicAssets = [
  "favicon-16x16.ico",
  "favicon-32x32.ico",
  "favicon-64x64.ico",
  "apple-touch-icosn.png",
  "ms-tile.png",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "build-info.json",
  "screenshot-narrow.png",
  "screenshot-wide.png"
];
var vite_config_default = defineConfig({
  define: {
    __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER || "?"),
    __BUILD_TIMESTAMP__: JSON.stringify(process.env.BUILD_TIMESTAMP || "?")
  },
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true
      // minifies the index.html file
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
      //registerType: "autoUpdate", // ensures the service worker update is autonomous
      registerType: "prompt",
      // ensures the service worker update requires user interaction
      workbox: {
        clientsClaim: true,
        // ensure that all uncontrolled clients (i.e. pages) that are within scope will be controlled by new service worker immediately after that service worker activates
        skipWaiting: false,
        // ensure the old service worker to remain valid until the user consents
        //skipWaiting: true, // ensure the new service worker takes control immediately
        cleanupOutdatedCaches: true,
        globPatterns: [
          "**/*.{js,css,html,ico,png,jpg,svg,webp,wav,mp3,webmanifest}"
          // match all relevant static assets in build folder
        ],
        // Note: to disable workbox during development, set globPatterns to []
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst"
            // network first for HTML files
          },
          {
            urlPattern: ({ request }) => ["style", "script", "image", "font"].includes(request.destination),
            handler: "CacheFirst"
            // cache JS, CSS, images, and fonts
          },
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*$/,
            handler: "NetworkOnly"
            // fetch from the network without caching
          },
          // cache Google Fonts stylesheets
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets-cache",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365
                // 1 year
              }
            }
          },
          // cache Google Fonts web font files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts-cache",
              expiration: {
                maxEntries: 1,
                // limit the number of fonts cached
                maxAgeSeconds: 60 * 60 * 24 * 365
                // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
                // cache opaque responses (important for CORS)
              }
            }
          },
          // cache server responses in development mode
          {
            urlPattern: /^http:\/\/localhost:5000\/.*$/,
            // local development server
            handler: "NetworkFirst",
            // use NetworkFirst or CacheFirst as needed
            options: {
              cacheName: "local-api-cache",
              expiration: {
                maxEntries: 100,
                // cache up to 100 entries
                maxAgeSeconds: 60 * 60 * 24
                // cache for 1 day
              },
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          // cache server responses in production mode
          {
            urlPattern: /^https:\/\/acme-server-lingering-brook-4120\.fly\.dev\/api\/.*$/,
            handler: "NetworkFirst",
            // use "NetworkFirst" or "CacheFirst" depending on your use case
            options: {
              cacheName: "public-api-cache",
              expiration: {
                maxEntries: 100,
                // maximum number of entries in the cache
                maxAgeSeconds: 60 * 60 * 24 * 7
                // cache for 1 week
              },
              cacheableResponse: {
                statuses: [200]
                // cache only successful responses
              }
            }
          }
        ],
        navigateFallback: "/index.html",
        // required for SPA
        globDirectory: buildDir,
        maximumFileSizeToCacheInBytes: 10 * 1024 ** 2
        // 10 MB
      },
      includeAssets: publicAssets,
      devOptions: {
        enabled: false,
        // disable the service worker in development mode
        type: "module"
        // ensure compatibility with Vite's dev environment
      },
      manifest: false
    })
  ],
  server: {
    port: 5005
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:5000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  base: "/",
  // base application path
  build: {
    outDir: buildDir,
    emptyOutDir: true,
    rollupOptions: {
      // split output in manual chunks, to avoid too big chunks
      output: {
        manualChunks: void 0
        // do not show spurious "empty chunk" warnings
        // manualChunks(id) {
        //   if (id.includes("node_modules")) {
        //     return id.toString().split("node_modules/")[1].split("/")[0].toString();
        //   }
        // }
      }
    },
    chunkSizeWarningLimit: 1280
    // 1.2 MB, to avoid chunks size warning (chunk with react is usually ~800kB)
  },
  publicDir,
  logLevel: "info",
  // does not show console.log (at least) to production app (run from server, port 5000)
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js"
    // assuming the test folder is in the root of our project
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYXJjby9hcHBzL3Npc3RlbWlzb2xhcmkvYWNtZS1jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL21hcmNvL2FwcHMvc2lzdGVtaXNvbGFyaS9hY21lLWNsaWVudC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9tYXJjby9hcHBzL3Npc3RlbWlzb2xhcmkvYWNtZS1jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCc7XG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCBjb25maWcgZnJvbSBcIi4vc3JjL2NvbmZpZ1wiO1xuXG4vLyBsb2FkIGVudmlyb25tZW50IHZhcmlhYmxlcyBmcm9tIC5lbnZcbi8vZG90ZW52LmNvbmZpZygpO1xuXG5jb25zdCBwdWJsaWNEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpY1wiKTtcbmNvbnN0IGJ1aWxkRGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJidWlsZFwiKTtcblxuLy8gcHVibGljIGFzc2V0c1xuY29uc3QgcHVibGljQXNzZXRzID0gW1xuICBcImZhdmljb24tMTZ4MTYuaWNvXCIsXG4gIFwiZmF2aWNvbi0zMngzMi5pY29cIixcbiAgXCJmYXZpY29uLTY0eDY0Lmljb1wiLFxuICBcImFwcGxlLXRvdWNoLWljb3NuLnBuZ1wiLFxuICBcIm1zLXRpbGUucG5nXCIsXG4gIFwicm9ib3RzLnR4dFwiLFxuICBcInNpdGVtYXAueG1sXCIsXG4gIFwibWFuaWZlc3Qud2VibWFuaWZlc3RcIixcbiAgXCJidWlsZC1pbmZvLmpzb25cIixcbiAgXCJzY3JlZW5zaG90LW5hcnJvdy5wbmdcIixcbiAgXCJzY3JlZW5zaG90LXdpZGUucG5nXCIsXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBkZWZpbmU6IHtcbiAgICBfX0JVSUxEX05VTUJFUl9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5CVUlMRF9OVU1CRVIgfHwgXCI/XCIpLFxuICAgIF9fQlVJTERfVElNRVNUQU1QX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LkJVSUxEX1RJTUVTVEFNUCB8fCBcIj9cIiksXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xuICAgICAgbWluaWZ5OiB0cnVlLCAvLyBtaW5pZmllcyB0aGUgaW5kZXguaHRtbCBmaWxlXG4gICAgfSksXG4gICAgLy8gaHRtbFBsdWdpbih7XG4gICAgLy8gICBtaW5pZnk6IHtcbiAgICAvLyAgICAgY29sbGFwc2VXaGl0ZXNwYWNlOiB0cnVlLFxuICAgIC8vICAgICByZW1vdmVDb21tZW50czogdHJ1ZSxcbiAgICAvLyAgICAgcmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlczogdHJ1ZSxcbiAgICAvLyAgICAgcmVtb3ZlU2NyaXB0VHlwZUF0dHJpYnV0ZXM6IHRydWUsXG4gICAgLy8gICAgIHJlbW92ZVN0eWxlTGlua1R5cGVBdHRyaWJ1dGVzOiB0cnVlLFxuICAgIC8vICAgICB1c2VTaG9ydERvY3R5cGU6IHRydWUsXG4gICAgLy8gICB9XG4gICAgLy8gfSksXG4gICAgLy8gc3Zncih7IFxuICAgIC8vICAgc3Znck9wdGlvbnM6IHtcbiAgICAvLyAgIH0sXG4gICAgLy8gfSksXG4gICAgVml0ZVBXQSh7XG4gICAgICAvL3JlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsIC8vIGVuc3VyZXMgdGhlIHNlcnZpY2Ugd29ya2VyIHVwZGF0ZSBpcyBhdXRvbm9tb3VzXG4gICAgICByZWdpc3RlclR5cGU6IFwicHJvbXB0XCIsIC8vIGVuc3VyZXMgdGhlIHNlcnZpY2Ugd29ya2VyIHVwZGF0ZSByZXF1aXJlcyB1c2VyIGludGVyYWN0aW9uXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIGNsaWVudHNDbGFpbTogdHJ1ZSwgLy8gZW5zdXJlIHRoYXQgYWxsIHVuY29udHJvbGxlZCBjbGllbnRzIChpLmUuIHBhZ2VzKSB0aGF0IGFyZSB3aXRoaW4gc2NvcGUgd2lsbCBiZSBjb250cm9sbGVkIGJ5IG5ldyBzZXJ2aWNlIHdvcmtlciBpbW1lZGlhdGVseSBhZnRlciB0aGF0IHNlcnZpY2Ugd29ya2VyIGFjdGl2YXRlc1xuICAgICAgICBza2lwV2FpdGluZzogZmFsc2UsIC8vIGVuc3VyZSB0aGUgb2xkIHNlcnZpY2Ugd29ya2VyIHRvIHJlbWFpbiB2YWxpZCB1bnRpbCB0aGUgdXNlciBjb25zZW50c1xuICAgICAgICAvL3NraXBXYWl0aW5nOiB0cnVlLCAvLyBlbnN1cmUgdGhlIG5ldyBzZXJ2aWNlIHdvcmtlciB0YWtlcyBjb250cm9sIGltbWVkaWF0ZWx5XG4gICAgICAgIGNsZWFudXBPdXRkYXRlZENhY2hlczogdHJ1ZSxcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXG4gICAgICAgICAgXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLGpwZyxzdmcsd2VicCx3YXYsbXAzLHdlYm1hbmlmZXN0fVwiLCAvLyBtYXRjaCBhbGwgcmVsZXZhbnQgc3RhdGljIGFzc2V0cyBpbiBidWlsZCBmb2xkZXJcbiAgICAgICAgXSxcbiAgICAgICAgLy8gTm90ZTogdG8gZGlzYWJsZSB3b3JrYm94IGR1cmluZyBkZXZlbG9wbWVudCwgc2V0IGdsb2JQYXR0ZXJucyB0byBbXVxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHJlcXVlc3QgfSkgPT4gcmVxdWVzdC5kZXN0aW5hdGlvbiA9PT0gXCJkb2N1bWVudFwiLFxuICAgICAgICAgICAgaGFuZGxlcjogXCJOZXR3b3JrRmlyc3RcIiwgLy8gbmV0d29yayBmaXJzdCBmb3IgSFRNTCBmaWxlc1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogKHsgcmVxdWVzdCB9KSA9PlxuICAgICAgICAgICAgICBbXCJzdHlsZVwiLCBcInNjcmlwdFwiLCBcImltYWdlXCIsIFwiZm9udFwiXS5pbmNsdWRlcyhyZXF1ZXN0LmRlc3RpbmF0aW9uKSxcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLCAvLyBjYWNoZSBKUywgQ1NTLCBpbWFnZXMsIGFuZCBmb250c1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mbGFnY2RuXFwuY29tXFwvLiokLyxcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiTmV0d29ya09ubHlcIiwgLy8gZmV0Y2ggZnJvbSB0aGUgbmV0d29yayB3aXRob3V0IGNhY2hpbmdcbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIGNhY2hlIEdvb2dsZSBGb250cyBzdHlsZXNoZWV0c1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nb29nbGVhcGlzXFwuY29tXFwvLiovLFxuICAgICAgICAgICAgaGFuZGxlcjogXCJTdGFsZVdoaWxlUmV2YWxpZGF0ZVwiLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwiZ29vZ2xlLWZvbnRzLXN0eWxlc2hlZXRzLWNhY2hlXCIsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUsIC8vIDEgeWVhclxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIGNhY2hlIEdvb2dsZSBGb250cyB3ZWIgZm9udCBmaWxlc1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nc3RhdGljXFwuY29tXFwvLiovLFxuICAgICAgICAgICAgaGFuZGxlcjogXCJDYWNoZUZpcnN0XCIsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJnb29nbGUtZm9udHMtd2ViZm9udHMtY2FjaGVcIixcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEsIC8vIGxpbWl0IHRoZSBudW1iZXIgb2YgZm9udHMgY2FjaGVkXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1LCAvLyAxIHllYXJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF0sIC8vIGNhY2hlIG9wYXF1ZSByZXNwb25zZXMgKGltcG9ydGFudCBmb3IgQ09SUylcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAvLyBjYWNoZSBzZXJ2ZXIgcmVzcG9uc2VzIGluIGRldmVsb3BtZW50IG1vZGVcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHA6XFwvXFwvbG9jYWxob3N0OjUwMDBcXC8uKiQvLCAvLyBsb2NhbCBkZXZlbG9wbWVudCBzZXJ2ZXJcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiTmV0d29ya0ZpcnN0XCIsIC8vIHVzZSBOZXR3b3JrRmlyc3Qgb3IgQ2FjaGVGaXJzdCBhcyBuZWVkZWRcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcImxvY2FsLWFwaS1jYWNoZVwiLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLCAvLyBjYWNoZSB1cCB0byAxMDAgZW50cmllc1xuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCwgLy8gY2FjaGUgZm9yIDEgZGF5XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzZXM6IFsyMDBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIGNhY2hlIHNlcnZlciByZXNwb25zZXMgaW4gcHJvZHVjdGlvbiBtb2RlXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9hY21lLXNlcnZlci1saW5nZXJpbmctYnJvb2stNDEyMFxcLmZseVxcLmRldlxcL2FwaVxcLy4qJC8sXG4gICAgICAgICAgICBoYW5kbGVyOiBcIk5ldHdvcmtGaXJzdFwiLCAvLyB1c2UgXCJOZXR3b3JrRmlyc3RcIiBvciBcIkNhY2hlRmlyc3RcIiBkZXBlbmRpbmcgb24geW91ciB1c2UgY2FzZVxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwicHVibGljLWFwaS1jYWNoZVwiLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLCAvLyBtYXhpbXVtIG51bWJlciBvZiBlbnRyaWVzIGluIHRoZSBjYWNoZVxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDcsIC8vIGNhY2hlIGZvciAxIHdlZWtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWzIwMF0sIC8vIGNhY2hlIG9ubHkgc3VjY2Vzc2Z1bCByZXNwb25zZXNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgbmF2aWdhdGVGYWxsYmFjazogXCIvaW5kZXguaHRtbFwiLCAvLyByZXF1aXJlZCBmb3IgU1BBXG4gICAgICAgIGdsb2JEaXJlY3Rvcnk6IGJ1aWxkRGlyLFxuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMTAgKiAxMDI0ICoqIDIsIC8vIDEwIE1CXG4gICAgICB9LFxuICAgICAgaW5jbHVkZUFzc2V0czogcHVibGljQXNzZXRzLFxuICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSwgLy8gZGlzYWJsZSB0aGUgc2VydmljZSB3b3JrZXIgaW4gZGV2ZWxvcG1lbnQgbW9kZVxuICAgICAgICB0eXBlOiBcIm1vZHVsZVwiLCAvLyBlbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIFZpdGUncyBkZXYgZW52aXJvbm1lbnRcbiAgICAgIH0sXG4gICAgICBtYW5pZmVzdDogZmFsc2UsXG4gICAgfSksXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUwMDUsXG4gICAgLy8gcHJveHk6IHtcbiAgICAvLyAgIFwiL2FwaVwiOiB7XG4gICAgLy8gICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjUwMDBcIixcbiAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgIC8vICAgICBzZWN1cmU6IGZhbHNlLFxuICAgIC8vICAgfSxcbiAgICAvLyB9LFxuICB9LFxuICBiYXNlOiBcIi9cIiwgLy8gYmFzZSBhcHBsaWNhdGlvbiBwYXRoXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBidWlsZERpcixcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICByb2xsdXBPcHRpb25zOiB7IC8vIHNwbGl0IG91dHB1dCBpbiBtYW51YWwgY2h1bmtzLCB0byBhdm9pZCB0b28gYmlnIGNodW5rc1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogdW5kZWZpbmVkIC8vIGRvIG5vdCBzaG93IHNwdXJpb3VzIFwiZW1wdHkgY2h1bmtcIiB3YXJuaW5nc1xuICAgICAgICAvLyBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgLy8gICBpZiAoaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KFwibm9kZV9tb2R1bGVzL1wiKVsxXS5zcGxpdChcIi9cIilbMF0udG9TdHJpbmcoKTtcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEyODAsIC8vIDEuMiBNQiwgdG8gYXZvaWQgY2h1bmtzIHNpemUgd2FybmluZyAoY2h1bmsgd2l0aCByZWFjdCBpcyB1c3VhbGx5IH44MDBrQilcbiAgfSxcbiAgcHVibGljRGlyOiBwdWJsaWNEaXIsXG4gIGxvZ0xldmVsOiBcImluZm9cIiwgLy8gZG9lcyBub3Qgc2hvdyBjb25zb2xlLmxvZyAoYXQgbGVhc3QpIHRvIHByb2R1Y3Rpb24gYXBwIChydW4gZnJvbSBzZXJ2ZXIsIHBvcnQgNTAwMClcbiAgdGVzdDoge1xuICAgIGVudmlyb25tZW50OiBcImpzZG9tXCIsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBzZXR1cEZpbGVzOiBcIi4vdGVzdC9zZXR1cC5qc1wiLCAvLyBhc3N1bWluZyB0aGUgdGVzdCBmb2xkZXIgaXMgaW4gdGhlIHJvb3Qg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
