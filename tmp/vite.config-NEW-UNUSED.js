import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";
import { VitePWA } from "vite-plugin-pwa";
import sitemap from "vite-plugin-sitemap";
import config from "./src/config";
import path from 'path';

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
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,wav,mp3}",
        ],
      },
      includeAssets: [
        "favicon-192.ico",
        "favicon-512.ico",
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg",
        "robots.txt",
        "sitemap.xml",
      ],
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
        enabled: true
      }
    }),
    sitemap({
      hostname: `${config.siteUrl}`,
      dynamicRoutes: [
        "/",
        "/signup",
        "/signin",
        "/social-signin-success",
        "/social-signin-error",
        "/profile",
        "/signout",
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
    }),
  ],
  server: {
    port: 5005,
  },
  base: "/",
  build: {
    outDir: path.resolve(__dirname, "build"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    },
  },
  publicDir: path.resolve(__dirname, "public"),
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js",
  },
});
