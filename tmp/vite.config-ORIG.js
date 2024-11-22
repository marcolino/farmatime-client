import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "@svgr/rollup";
import { VitePWA } from "vite-plugin-pwa";
import dotenv from "dotenv";
import config from "./src/config";

// load environment variables from .env
dotenv.config();

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

export default defineConfig({
  define: {
    __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER || "?"),
    __BUILD_TIMESTAMP__: JSON.stringify(process.env.BUILD_TIMESTAMP || "?"),
  },
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
      devOptions: {
        enabled: true, // enables the service worker in development mode
      },
      manifest: false,
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
    //manifest: false, // we produce it manually
  },
  publicDir: publicDir,
  logLevel: "info", // does not show console.log (at least) to production app (run from server, port 5000)
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js", // assuming the test folder is in the root of our project
  },
});
