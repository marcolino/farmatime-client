import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "@svgr/rollup";
import { VitePWA } from "vite-plugin-pwa";
import sitemap from "vite-plugin-sitemap";
import config from "./src/config";

const publicDir = path.resolve(__dirname, "public");
const buildDir = path.resolve(__dirname, "build");

// public assets
const publicAssets = [
  "favicon-192.ico",
  "favicon-512.ico",
  "favicon.ico",
  "apple-touch-icon.png",
  "robots.txt",
  "sitemap.xml",
];

export default defineConfig({
  plugins: [
    react(),
    svgr({ 
      svgrOptions: {
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // disable workbox during development
        clientsClaim: config.mode.production,
        skipWaiting: config.mode.production,
        globPatterns: config.mode.production ? [
          "../index.html",
          "**/*.{js,jsx,css,html}",
          "**/assets/**/*.{png,svg,wav,mp3}"
        ] : [], // empty patterns in development
        globDirectory: buildDir,
      },
      includeAssets: publicAssets,
      manifest: {
        name: "ACME",
        short_name: "acme",
        description: "Your app description", // TODO
        theme_color: "#ffffff", // TODO
        background_color: "#ffffff", // TODO
        start_url: "/", // TODO
        display: "standalone",
        icons: [
          {
            src: "favicon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true // enables the service worker in development mode
      }
    }),
    sitemap({
      hostname: `${config.siteUrl}`, // TODO: production URL, with the protocol, without trailing slash
      outDir: buildDir,
      dynamicRoutes: [
        "/",
        "/signup",
        "/signin",
        "/social-signin-success",
        "/social-signin-error",
        "/profile",
        "/forgot-password",
        "/products",
        "/notifications",
        "/edit-user/:userId",
        "/terms-of-use",
        "/privacy-policy",
        "/contacts",
        "/admin-panel",
        "/handle-users",
        "/handle-products",
        "/page-not-found"
      ],
      //exclude: ["/admin", "/private"], // TODO...
      //exclude: ["/robots.txt"],
    }),
  ],
  server: {
    port: 5005,
  },
  base: "/", // base application path
  build: {
    outDir: buildDir,
    emptyOutDir: true,
    rollupOptions: { // split output in manual chunks, to avoid too big chunks
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      },
      // plugins: [
      //   {
      //     name: "workbox-disable",
      //     resolveId(source) {
      //       if (source.startsWith("workbox")) {
      //         return false;
      //       }
      //     },
      //   },
      // ],
    },
  },
  publicDir: publicDir,
  logLevel: "info", // does not show console.log (at least) to production app (run from server, port 5000)
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js", // assuming the test folder is in the root of our project
  },
});
