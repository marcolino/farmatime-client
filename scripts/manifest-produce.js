#!/usr/bin/env node
// (note: use yarn node)

import dotenv from "dotenv";
import fs from "fs/promises";
import { access } from "fs/promises"; // access as a promise-based version
import config from "../src/config.json" assert { type: "json" };

dotenv.config({ path: "./.env" });

const manifestJson = {
  "short_name": process.env.VITE_TITLE,
  "name": `${config.title} by ${config.company.homeSite.name}`,
  "description": process.env.VITE_DESCRIPTION,
  "theme_color": process.env.VITE_THEME_COLOR,
  "background_color": process.env.VITE_BACKGROUND_COLOR,
  "start_url": process.env.VITE_START_URL,
  "display": process.env.VITE_DISPLAY,
  "icons": [
    {
      "src": "favicon.ico",
      "type": "image/x-icon",
      "sizes": "64x64"
    },
    {
      "src": "favicon-16x16.png",
      "type": "image/png",
      "sizes": "16x16"
    },
    {
      "src": "favicon-32x32.png",
      "type": "image/png",
      "sizes": "32x32"
    },
    {
      "src": "favicon-64x64.png",
      "type": "image/png",
      "sizes": "64x64"
    },
    {
      "src": "apple-touch-icon.png",
      "type": "image/png",
      "sizes": "512x512"
    },
  ],
  "screenshots": [    
   {
     "src": "screenshot-narrow.png",
     "sizes": "360x636",
     "type": "image/png",
     "form_factor": "narrow",
     "label": "Mobile application"
    },
    {
      "src": "screenshot-wide.png",
      "sizes": "1024x1574",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Desktop application"
     }
   ],
   "start_url": config.manifest.startUrl,
  "display": config.manifest.display,
  "theme_color": process.env.VITE_THEME_COLOR,
  "background_color": process.env.VITE_BACKGROUND_COLOR,
};

const manifestFileName = "public/manifest.webmanifest";
const faviconSourcePath = "Logo.png";

// check favicons existence
const faviconsPaths = [
  "./public/favicon-16x16.png",
  "./public/favicon-32x32.png",
  "./public/favicon-64x64.png",
];

for (const faviconsPath of faviconsPaths) {
  try {
    await access(faviconsPath);
    // favicon exists
  } catch (err) {
    console.error(err.message);
    process.exit(-1);
  }
}

try {
  await access(faviconSourcePath);
  // favicon exists
} catch (err) {
  console.error(err.message);
  process.exit(-2);
}


try {
  await fs.writeFile(manifestFileName, JSON.stringify(manifestJson, null, 0));
  //console.log(`Manifest file ${manifestFileName} created successfully.`);
} catch (err) {
  console.error(err);
  process.exit(-3);
}
