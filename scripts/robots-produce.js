#!/usr/bin/env node

// import modules using ES module syntax
import fs from "fs/promises";
import config from "../src/config.json" with { type: "json" };

const robotsFileName = "public/robots.txt";
const userAgents = [
  {
    name: `*`,
    disallow: ["/"],
    allow: [],
  },
];
const sitemapUrl = `${config.siteUrl}/sitemap.xml`;

async function buildRobots() {
  try {
    let contents = "";
    
    userAgents.forEach(userAgent => {
      contents += `User-agent: ${userAgent.name}\n`;
      userAgent.disallow.forEach(disallow => {
        contents += `Disallow: ${disallow}\n`;
      });
      userAgent.allow.forEach(allow => {
        contents += `Allow: ${allow}\n`;
      });
      contents += `\n`;
    });
    
    contents += `Sitemap: ${sitemapUrl}\n`;

    await fs.writeFile(robotsFileName, contents, "utf8");
    console.log(`Robots file ${robotsFileName} created successfully.`);
    
  } catch (err) {
    console.error("Error creating robots.txt:", err);
    process.exit(1);
  }
}

// Run the robots builder
buildRobots();
