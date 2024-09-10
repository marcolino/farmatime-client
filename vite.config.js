import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({ 
      svgrOptions: {
      },
    }),
  ],
  server: {
    port: 5005,
  },
  base: "/", // base application path
  build: {
    outDir: "./build",
    emptyOutDir: true,
    rollupOptions: { // split output in manual chunks, to avoid too big chunks
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    },
  },
  //logLevel: "info", // does not show console.info (at least) to production app (run from server, port 5000)
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js", // assuming the test folder is in the root of our project
  },
});
