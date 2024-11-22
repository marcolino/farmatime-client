#!/home/marco/.nvm/versions/node/v18.16.0/bin/node --no-warnings

// import modules using ES module syntax
import fs from "fs/promises";
import config from "../src/config.json" assert { type: "json" };

const robotsFileName = "public/robots.txt";
const userAgents = [
  {
    name: `*`,
    disallow: ["/"],
    allow: [],
  },
]
const sitemapUrl = `${config.siteUrl}/sitemap.xml`;

let contents = "";
userAgents.forEach(userAgent => {
  contents += `User-agent: ${userAgent.name}\n`;
  userAgent.disallow.forEach(disallow => {
    contents += ` Disallow: ${disallow}\n`;
  });
  userAgent.allow.forEach(allow => {
    contents += ` Allow: ${allow}\n`;
  });
  contents += `\n`;
});
contents += `Sitemap: ${sitemapUrl}\n`;

try {
  await fs.writeFile(robotsFileName, contents);
  //console.log(`Robots file ${robotsFileName} created successfully.`);
} catch (err) {
  console.log(err);
}
