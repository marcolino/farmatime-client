import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Global setup and teardown
    // setupFiles: ["./test/setup.js"],
    // testTimeout: 10000,

    // Glob patterns to match test files
    include: ["test/**/*.{js,ts}"],
    exclude: ["node_modules", "dist", "cypress"],

    // Environment
    // environment: "node",

    // Coverage
    // coverage: {
    //   provider: "c8",
    //   reporter: ["text", "json", "html"],
    // },
  },
});
