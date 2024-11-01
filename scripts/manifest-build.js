#!/usr/bin/env node

// import modules using ES module syntax
import dotenv from "dotenv";
import fs from "fs/promises";
import { access } from "fs/promises"; // access as a promise-based version

import config from "../src/config.json" assert { type: "json" };

dotenv.config({ path: "./.env" });


const manifestFileName = "./public/manifest.json";

// Check favicons existence
const faviconsPaths = [
  "./public/favicon.ico",
  "./public/favicon-192.png",
  "./public/favicon-512.png",
];

let error = false;
for (const faviconsPath of faviconsPaths) {
  try {
    await access(faviconsPath); // fs.access as a promise
    // favicon exists
  } catch (err) {
    error = true;
    console.error(err.message);
  }
}

if (!error) {
  const manifestJson = {
    "//note": "This file is generated automatically, please do not change directly, use environment, and rebuild using scripts/manifest-build",
    //"short_name": config.title,
    //"name": `${config.title} by ${config.company.homeSite.name}`,
    "icons": [
      {
        "src": "favicon.ico",
        "type": "image/x-icon",
        "sizes": "64x64"
      },
      {
        "src": "favicon-192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "favicon.ico",
        "type": "image/png",
        "sizes": "512x512"
      },
    ],
    "start_url": config.manifest.startUrl,
    "display": config.manifest.display,
    "theme_color": process.env.VITE_THEME_COLOR,
    "background_color": process.env.VITE_BACKGROUND_COLOR,
  };

  try {
    await fs.writeFile(manifestFileName, JSON.stringify(manifestJson, null, 2) + "\n");
    //console.log(`Manifest file ${manifestFileName} created successfully.`);
  } catch (err) {
    console.log(err);
  }
}