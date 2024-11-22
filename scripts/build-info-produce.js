// (note: use yarn node --no-warnings)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fileName = "build-info.json";

//const filePath = path.resolve(__dirname, "..", fileName);
//const buildFolderPath = path.resolve(__dirname, "../build");
const buildInfoPath = path.resolve(__dirname, "../public", fileName);

/*
const buildNumberFilePath = path.resolve(__dirname, "../build-number.txt");

// Ensure the build folder exists
if (!fs.existsSync(buildFolderPath)) {
  fs.mkdirSync(buildFolderPath, { recursive: true });
}

// Read or initialize the build number
let buildNumber = 1;
if (fs.existsSync(buildNumberFilePath)) {
  buildNumber = parseInt(fs.readFileSync(buildNumberFilePath, "utf8"), 10) + 1;
}

// Update the build number file
fs.writeFileSync(buildNumberFilePath, buildNumber.toString());

// Generate the build timestamp
const buildTimestamp = new Date().toISOString();

// Write the build info JSON
const buildInfo = {
  buildNumber,
  buildTimestamp,
};
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log("Build info generated:", buildInfo);
*/

// read the current build number or initialize it to 1 if the file doesn't exist
let buildNumber = 1;
if (fs.existsSync(buildInfoPath)) {
  buildNumber = parseInt(JSON.parse(fs.readFileSync(buildInfoPath, "utf8"))["buildNumber"], 10) + 1;
}
const buildTimestamp = new Date().toISOString();

// write the new build number and timestamp back to the file
fs.writeFileSync(buildInfoPath, JSON.stringify({
  buildNumber,
  buildTimestamp
}, null, 2) + "\n");
//console.log(`Bumped build number to ${buildNumber}`);
console.log(` (${buildNumber}, ${buildTimestamp})`);

// // expose the build number for use in the environment
// process.env.BUILD_NUMBER = buildNumber;
// process.env.BUILD_TIMESTAMP = buildTimestamp;
