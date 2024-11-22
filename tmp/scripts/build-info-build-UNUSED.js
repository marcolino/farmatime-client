// (note: use yarn node --no-warnings)

// const fs = require("fs");
// const path = require("path");
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildNumber = process.env.BUILD_NUMBER || "0.0.1";
const timestamp = new Date().toISOString();

// save the build info as JSON
const buildInfo = {
  buildNumber,
  timestamp,
};

const filePath = path.resolve(__dirname, "../public/build-info.json");
fs.writeFileSync(filePath, JSON.stringify(buildInfo, null, 2));

console.log(`Build info saved to ${filePath}:`, buildInfo);
