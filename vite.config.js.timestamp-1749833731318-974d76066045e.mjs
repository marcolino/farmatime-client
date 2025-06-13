// vite.config.js
import { defineConfig } from "file:///home/marco/apps/sistemisolari/med-client/node_modules/vite/dist/node/index.js";
import react from "file:///home/marco/apps/sistemisolari/med-client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { VitePWA } from "file:///home/marco/apps/sistemisolari/med-client/node_modules/vite-plugin-pwa/dist/index.js";
import { createHtmlPlugin } from "file:///home/marco/apps/sistemisolari/med-client/node_modules/vite-plugin-html/dist/index.mjs";
var __vite_injected_original_dirname = "/home/marco/apps/sistemisolari/med-client";
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
var vite_config_default = defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  return {
    define: {
      __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER || "?"),
      __BUILD_TIMESTAMP__: JSON.stringify(process.env.BUILD_TIMESTAMP || "?"),
      global: {}
    },
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true
        // minifies the index.html file
      }),
      VitePWA({
        registerType: isProduction ? "prompt" : "autoUpdate",
        devOptions: {
          enabled: !isProduction,
          // enable the service worker in development mode
          type: "module"
          // ensure compatibility with Vite's dev environment
        },
        includeAssets: publicAssets,
        manifest: false,
        workbox: {
          clientsClaim: true,
          skipWaiting: false,
          cleanupOutdatedCaches: true,
          globPatterns: [
            "**/*.{js,css,html,ico,png,jpg,svg,webp,wav,mp3,mp4,webmanifest}"
          ],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "document-assets-cache",
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: ({ request }) => ["style", "script", "image"].includes(request.destination),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "style-script-image-assets-cache",
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: ({ request }) => ["font"].includes(request.destination),
              handler: "CacheFirst",
              options: {
                cacheName: "font-assets-cache",
                expiration: {
                  maxEntries: 3,
                  maxAgeSeconds: 60 * 60 * 24 * 180
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: ({ request }) => ["audio", "video"].includes(request.destination),
              handler: "CacheFirst",
              options: {
                cacheName: "audio-video-assets-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 180
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/flagcdn\.com\/.*$/,
              handler: "NetworkOnly"
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts-stylesheets-cache",
                expiration: {
                  maxAgeSeconds: 60 * 60 * 24 * 365
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-webfonts-cache",
                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^http:\/\/localhost:5000\/.*$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "local-api-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24
                },
                cacheableResponse: {
                  statuses: [200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/med-server-lingering-brook-4120\.fly\.dev\/api\/.*$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "public-api-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7
                },
                cacheableResponse: {
                  statuses: [200]
                }
              }
            }
          ],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//, /^\/auth\//, /^\/static\//],
          globDirectory: buildDir,
          maximumFileSizeToCacheInBytes: 30 * 1024 ** 2
        }
      })
    ],
    optimizeDeps: {
      include: ["@mui/x-date-pickers"],
      esbuildOptions: {
        define: {
          global: "globalThis"
        }
      }
    },
    server: {
      port: 5005
    },
    base: "/",
    build: {
      outDir: buildDir,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: void 0
        }
      },
      chunkSizeWarningLimit: 1280
    },
    publicDir,
    logLevel: "info",
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./test/setup.js"
    },
    resolve: {
      alias: {
        setimmediate: "setimmediate/setImmediate.js",
        buffer: "buffer",
        process: "process/browser",
        stream: "stream-browserify",
        assert: "assert",
        util: "util",
        path: "path-browserify",
        querystring: "querystring-es3"
      }
    }
    // optimizeDeps: {
    //   esbuildOptions: {
    //     define: {
    //       global: 'globalThis'
    //     }
    //   }
    // }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYXJjby9hcHBzL3Npc3RlbWlzb2xhcmkvbWVkLWNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbWFyY28vYXBwcy9zaXN0ZW1pc29sYXJpL21lZC1jbGllbnQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbWFyY28vYXBwcy9zaXN0ZW1pc29sYXJpL21lZC1jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLWh0bWxcIjtcblxuLy8gbG9hZCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgZnJvbSAuZW52XG4vLyBkb3RlbnYuY29uZmlnKCk7XG5cbmNvbnN0IHB1YmxpY0RpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwicHVibGljXCIpO1xuY29uc3QgYnVpbGREaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImJ1aWxkXCIpO1xuXG4vLyBwdWJsaWMgYXNzZXRzXG5jb25zdCBwdWJsaWNBc3NldHMgPSBbXG4gIFwiZmF2aWNvbi0xNngxNi5pY29cIixcbiAgXCJmYXZpY29uLTMyeDMyLmljb1wiLFxuICBcImZhdmljb24tNjR4NjQuaWNvXCIsXG4gIFwiYXBwbGUtdG91Y2gtaWNvc24ucG5nXCIsXG4gIFwibXMtdGlsZS5wbmdcIixcbiAgXCJyb2JvdHMudHh0XCIsXG4gIFwic2l0ZW1hcC54bWxcIixcbiAgXCJtYW5pZmVzdC53ZWJtYW5pZmVzdFwiLFxuICBcImJ1aWxkLWluZm8uanNvblwiLFxuICBcInNjcmVlbnNob3QtbmFycm93LnBuZ1wiLFxuICBcInNjcmVlbnNob3Qtd2lkZS5wbmdcIixcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgaXNQcm9kdWN0aW9uID0gbW9kZSA9PT0gXCJwcm9kdWN0aW9uXCI7XG5cbiAgcmV0dXJuIHtcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fQlVJTERfTlVNQkVSX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LkJVSUxEX05VTUJFUiB8fCBcIj9cIiksXG4gICAgICBfX0JVSUxEX1RJTUVTVEFNUF9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5CVUlMRF9USU1FU1RBTVAgfHwgXCI/XCIpLFxuICAgICAgZ2xvYmFsOiB7fSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgICAgbWluaWZ5OiB0cnVlLCAvLyBtaW5pZmllcyB0aGUgaW5kZXguaHRtbCBmaWxlXG4gICAgICB9KSxcbiAgICAgIFZpdGVQV0Eoe1xuICAgICAgICByZWdpc3RlclR5cGU6IGlzUHJvZHVjdGlvbiA/IFwicHJvbXB0XCIgOiBcImF1dG9VcGRhdGVcIixcbiAgICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICAgIGVuYWJsZWQ6ICFpc1Byb2R1Y3Rpb24sIC8vIGVuYWJsZSB0aGUgc2VydmljZSB3b3JrZXIgaW4gZGV2ZWxvcG1lbnQgbW9kZVxuICAgICAgICAgIHR5cGU6IFwibW9kdWxlXCIsIC8vIGVuc3VyZSBjb21wYXRpYmlsaXR5IHdpdGggVml0ZSdzIGRldiBlbnZpcm9ubWVudFxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBwdWJsaWNBc3NldHMsXG4gICAgICAgIG1hbmlmZXN0OiBmYWxzZSxcbiAgICAgICAgd29ya2JveDoge1xuICAgICAgICAgIGNsaWVudHNDbGFpbTogdHJ1ZSxcbiAgICAgICAgICBza2lwV2FpdGluZzogZmFsc2UsXG4gICAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxuICAgICAgICAgIGdsb2JQYXR0ZXJuczogW1xuICAgICAgICAgICAgXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLGpwZyxzdmcsd2VicCx3YXYsbXAzLG1wNCx3ZWJtYW5pZmVzdH1cIixcbiAgICAgICAgICBdLFxuICAgICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHJlcXVlc3QgfSkgPT4gcmVxdWVzdC5kZXN0aW5hdGlvbiA9PT0gXCJkb2N1bWVudFwiLFxuICAgICAgICAgICAgICBoYW5kbGVyOiBcIk5ldHdvcmtGaXJzdFwiLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcImRvY3VtZW50LWFzc2V0cy1jYWNoZVwiLFxuICAgICAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHJlcXVlc3QgfSkgPT5cbiAgICAgICAgICAgICAgICBbXCJzdHlsZVwiLCBcInNjcmlwdFwiLCBcImltYWdlXCJdLmluY2x1ZGVzKHJlcXVlc3QuZGVzdGluYXRpb24pLFxuICAgICAgICAgICAgICBoYW5kbGVyOiBcIlN0YWxlV2hpbGVSZXZhbGlkYXRlXCIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwic3R5bGUtc2NyaXB0LWltYWdlLWFzc2V0cy1jYWNoZVwiLFxuICAgICAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHJlcXVlc3QgfSkgPT4gW1wiZm9udFwiXS5pbmNsdWRlcyhyZXF1ZXN0LmRlc3RpbmF0aW9uKSxcbiAgICAgICAgICAgICAgaGFuZGxlcjogXCJDYWNoZUZpcnN0XCIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwiZm9udC1hc3NldHMtY2FjaGVcIixcbiAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAzLFxuICAgICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMTgwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXJsUGF0dGVybjogKHsgcmVxdWVzdCB9KSA9PlxuICAgICAgICAgICAgICAgIFtcImF1ZGlvXCIsIFwidmlkZW9cIl0uaW5jbHVkZXMocmVxdWVzdC5kZXN0aW5hdGlvbiksXG4gICAgICAgICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcImF1ZGlvLXZpZGVvLWFzc2V0cy1jYWNoZVwiLFxuICAgICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxuICAgICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMTgwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mbGFnY2RuXFwuY29tXFwvLiokLyxcbiAgICAgICAgICAgICAgaGFuZGxlcjogXCJOZXR3b3JrT25seVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi8sXG4gICAgICAgICAgICAgIGhhbmRsZXI6IFwiU3RhbGVXaGlsZVJldmFsaWRhdGVcIixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJnb29nbGUtZm9udHMtc3R5bGVzaGVldHMtY2FjaGVcIixcbiAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nc3RhdGljXFwuY29tXFwvLiovLFxuICAgICAgICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJnb29nbGUtZm9udHMtd2ViZm9udHMtY2FjaGVcIixcbiAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxLFxuICAgICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwOlxcL1xcL2xvY2FsaG9zdDo1MDAwXFwvLiokLyxcbiAgICAgICAgICAgICAgaGFuZGxlcjogXCJOZXR3b3JrRmlyc3RcIixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJsb2NhbC1hcGktY2FjaGVcIixcbiAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMDAsXG4gICAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzZXM6IFsyMDBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL21lZC1zZXJ2ZXItbGluZ2VyaW5nLWJyb29rLTQxMjBcXC5mbHlcXC5kZXZcXC9hcGlcXC8uKiQvLFxuICAgICAgICAgICAgICBoYW5kbGVyOiBcIk5ldHdvcmtGaXJzdFwiLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcInB1YmxpYy1hcGktY2FjaGVcIixcbiAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMDAsXG4gICAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiA3LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMjAwXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIG5hdmlnYXRlRmFsbGJhY2s6IFwiL2luZGV4Lmh0bWxcIixcbiAgICAgICAgICBuYXZpZ2F0ZUZhbGxiYWNrRGVueWxpc3Q6IFsvXlxcL2FwaVxcLy8sIC9eXFwvYXV0aFxcLy8sIC9eXFwvc3RhdGljXFwvL10sXG4gICAgICAgICAgZ2xvYkRpcmVjdG9yeTogYnVpbGREaXIsXG4gICAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDMwICogKDEwMjQgKiogMiksXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogWydAbXVpL3gtZGF0ZS1waWNrZXJzJ10sXG4gICAgICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgZ2xvYmFsOiAnZ2xvYmFsVGhpcydcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA1MDA1LFxuICAgIH0sXG4gICAgYmFzZTogXCIvXCIsXG4gICAgYnVpbGQ6IHtcbiAgICAgIG91dERpcjogYnVpbGREaXIsXG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMjgwLFxuICAgIH0sXG4gICAgcHVibGljRGlyOiBwdWJsaWNEaXIsXG4gICAgbG9nTGV2ZWw6IFwiaW5mb1wiLFxuICAgIHRlc3Q6IHtcbiAgICAgIGVudmlyb25tZW50OiBcImpzZG9tXCIsXG4gICAgICBnbG9iYWxzOiB0cnVlLFxuICAgICAgc2V0dXBGaWxlczogXCIuL3Rlc3Qvc2V0dXAuanNcIixcbiAgICB9LFxuICAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBzZXRpbW1lZGlhdGU6ICdzZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzJyxcbiAgICAgICAgYnVmZmVyOiAnYnVmZmVyJyxcbiAgICAgICAgcHJvY2VzczogJ3Byb2Nlc3MvYnJvd3NlcicsXG4gICAgICAgIHN0cmVhbTogJ3N0cmVhbS1icm93c2VyaWZ5JyxcbiAgICAgICAgYXNzZXJ0OiAnYXNzZXJ0JyxcbiAgICAgICAgdXRpbDogJ3V0aWwnLFxuICAgICAgICBwYXRoOiAncGF0aC1icm93c2VyaWZ5JyxcbiAgICAgICAgcXVlcnlzdHJpbmc6ICdxdWVyeXN0cmluZy1lczMnXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBvcHRpbWl6ZURlcHM6IHtcbiAgICAvLyAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgLy8gICAgIGRlZmluZToge1xuICAgIC8vICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnXG4gICAgLy8gICAgIH1c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
