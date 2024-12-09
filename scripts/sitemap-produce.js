#!/usr/bin/env node 
/**
 * Build sitemap.xml for a react web app, starting from the routes file, using only node.js
 */

import fs from "fs";
import config from "../src/config.json" assert { type: "json" };

const sitemapFileName = "public/sitemap.xml";
const componentsPath = "src/components/";
const hostName = config.siteUrl; // the url of the website: the protocol and the domain name
const routesPath = "src/components/Routing.jsx";
// const defaultFrequency = "monthly";
// const defaultPriority = 0.5;

const routes = [];
fs.readFile(routesPath, "utf8", (err, data) => {
  if (err) {
    throw err;
  }
  data.split(/\r?\n/).forEach(line => {
    const matchRoute = /^\s*<Route (.*)/.exec(line);
    if (matchRoute !== null) {
      //console.log("matchRoute.input:", matchRoute);
      const matchPath = /path=[\"\'](.*?)[\"\']/.exec(matchRoute);
      if (!matchPath || !matchPath[1]) { // not a route path row
        return;
      }
      //console.log("matchPath:", matchPath);
      const path = matchPath[1];
      //console.log("path:", path);
      if (!path.startsWith("/")) { // skip paths nkt starting with slash ("*", ...)
        return;
      }
      const matchElement = /element=\{<(.*?)\s.*\/>.*\}/.exec(matchRoute.input);
      if (!matchElement || !matchElement[1]) {
        console.warn("No element match for route", matchRoute.input);
        return;
      }
      const element = matchElement[1];
      //console.log("element:", element);
      const regexpFilename1 = new RegExp(String.raw`const\s*${element}\s*=\s*lazy\(\(\)\s*=>\s*import\("(.*)"\)\)`, "g");
      const regexpFilename2 = new RegExp(String.raw`import ${element} from "(.*)"`, "g");
      const matchFilename1 = regexpFilename1.exec(data);
      const matchFilename2 = regexpFilename2.exec(data);
      if (
        (!matchFilename1 || !matchFilename1[1]) &&
        (!matchFilename2 || !matchFilename2[1])
       ) {
          console.warn("No filename match for route element", element);
        return;
      }
      const filename = matchFilename1 ? matchFilename1[1] : matchFilename2[1];
      //const filename = matchFilename[1];
      //console.log("filename:", filename);
      const filenameFull = componentsPath + filename + ".jsx";
      if (!fs.existsSync(filenameFull)) {
        console.warn("No filename found for route file name", filenameFull);
        return;
      }

      const stats = fs.statSync(filenameFull)
      if (!stats || !stats.mtime) {
        console.warn("No mtime for file name", filename);
        return;
      }
      const lastmod = stats.mtime;
      //console.log("lastmod:", lastmod);
      if (path && lastmod) {
        routes.push({
          path,
          lastmod,
        });
      }
    }
  });

  const sitemapXml = generate_xml_sitemap(routes);

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
      <lastmod>${route.lastmod}</lastmod>
      <loc>${hostName}${route.path}</loc>
    </url>`;
  }
  xml += `
  </urlset>`;
  return xml;
}
