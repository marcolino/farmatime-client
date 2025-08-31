#!/usr/bin/env yarn node

// #!/usr/bin/env node
// // (note: use yarn node)

//import dotenv from "dotenv";
import fs from "fs/promises";
import config from "../src/config.json" with { type: "json" };

//dotenv.config({ path: "./.env" });

const manifestJson = {
  "short_name": config.title,
  "name": `${config.name} by ${config.company.homeSite.name}`,
  "description": config.description,
  "theme_color": config.ui.defaultThemeColor,
  "background_color": config.ui.defaultThemeBackgroundColor,
  "start_url": config.manifest.startUrl,
  "scope": config.manifest.scope,
  "display": config.manifest.display,
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
    }
  ],
  "screenshots": [    
    {
      "src": "screenshot-narrow.png",
      "sizes": "420x683",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Mobile application"
    },
    {
      "src": "screenshot-wide.png",
      "sizes": "1856x882",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Desktop application"
    }
  ]
};

const manifestFileName = "public/manifest.webmanifest";
const faviconSourcePath = "base-assets/LogoMain.png";

async function buildManifest() {
  try {
    // check favicons existence
    const faviconsPaths = [
      "./public/favicon-16x16.png",
      "./public/favicon-32x32.png",
      "./public/favicon-64x64.png"
    ];

    for (const faviconsPath of faviconsPaths) {
      try {
        await fs.access(faviconsPath);
        // favicon exists
      } catch (err) {
        console.error(`Favicon not found: ${faviconsPath}`);
        console.error(err.message);
        process.exit(1);
      }
    }

    try {
      await fs.access(faviconSourcePath);
      // favicon source exists
    } catch (err) {
      console.error(`Favicon source not found: ${faviconSourcePath}`);
      console.error(err.message);
      process.exit(2);
    }

    await fs.writeFile(manifestFileName, JSON.stringify(manifestJson, null, 2), "utf8");
    console.log(`Manifest file ${manifestFileName} created successfully.`);
    
  } catch (err) {
    console.error("Error creating manifest:", err);
    process.exit(3);
  }
}

// Run the manifest builder
buildManifest();
    
process.exit(0);
