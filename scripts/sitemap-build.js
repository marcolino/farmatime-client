#!/usr/bin/env yarn node
/**
 * Build sitemap.xml for a react web app, starting from the routes file, using only node.js
 */

import fs from "fs";
import config from "../src/config.js"; // ensure .js extension for ES module imports

const sitemapFileName = "./public/sitemap.xml";
const hostName = config.siteUrl; // the url of the website: the protocol and the domain name
const routesPath = "./src/components/Routes.js";
const defaultFrequency = "monthly";
const defaultPriority = 0.5;

const routes = [];
fs.readFile(routesPath, "utf8", (err, data) => {
  if (err) {
    throw err;
  }
  data.split(/\r?\n/).forEach(line => {
    const matchRoute = /^\s*<Route (.*)/.exec(line);
    if (matchRoute !== null) {
      const matchPath = /path=[\"\'](.*?)[\"\']/.exec(matchRoute);
      const matchFrequency = /sitemapFrequency=\{[\"\']?(.*?)[\"\']?\}/.exec(matchRoute);
      const matchPriority = /sitemapPriority=\{[\"\']?(.*?)[\"\']?\}/.exec(matchRoute);
      if (matchPath && matchFrequency) {
        routes.push({
          path: matchPath[1],
          frequency: matchFrequency ? matchFrequency[1] : defaultFrequency,
          priority: matchPriority ? matchPriority[1] : defaultPriority,
        });
      }
    }
  });

  sitemapXml = generate_xml_sitemap(routes);

  fs.writeFile(sitemapFileName, sitemapXml, (err) => {
    if (err) {
      return console.log(err);
    }
  });

});


function generate_xml_sitemap(routes) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;
  for (const route of routes) {
    xml += `
    <url>
      <loc>${hostName}${route.path}</loc>
      <changefreq>${route.frequency}</changefreq>
      <priority>${route.priority}</priority>
    </url>`;
  }
  xml += `
  </urlset>`;
  return xml;
}
