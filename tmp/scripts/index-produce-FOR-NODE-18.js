// (note: use yarn node --no-warnings)

import fs from "fs";
import get from "lodash.get";
import config from "../src/config.json" assert { type: "json" };

const indexFileNameInput = "index-template.html";
const indexFileNameOutput = "index.html";

/**
 * Replaces tags in format %path.to.key% with values from config object
 * @param {string} template - Template string containing tags to replace
 * @param {Object} config - Configuration object with replacement values
 * @param {Object} options - Optional configuration
 * @param {string} options.tagStart - Start delimiter for tags (default: "%")
 * @param {string} options.tagEnd - End delimiter for tags (default: "%")
 * @returns {string} - String with all tags replaced
 */
const replaceConfigTags = (template, config, options = {}) => {
  const {
    tagStart = "%",
    tagEnd = "%"
  } = options;

  // escape special characters for regex
  const escStart = tagStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escEnd = tagEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // create regex that matches anything between tagStart and tagEnd
  const tagRegex = new RegExp(`${escStart}([^${escStart}${escEnd}]+)${escEnd}`, "g");
  
  return template.replace(tagRegex, (match, path) => {
    const value = get(config, path);
    
    if (value === undefined) {
      console.warn(`Warning: No value found for path "${path}" in config`);
      return match; // keep original tag if value not found
    }
    
    if (typeof value === "object") {
      console.warn(`Warning: Value at path "${path}" is an object, cannot convert to string`);
      return match;
    }
    
    return value.toString();
  });
}

const insertWarningComment = (template) => {
  const warningComment = "<!-- this file is built by the build process, do not edit this, but index-template.html -->\n";
  return template = warningComment + template;
};

let template;
try {
  template = fs.readFileSync(indexFileNameInput).toString();
} catch (err) {
  console.error(err);
  process.exit(-1);
}

template = await insertWarningComment(template);
const contents = await replaceConfigTags(template, config);

try {
  await fs.writeFile(indexFileNameOutput, contents);
  //console.log(`Index file ${indexFileNameOutput} created successfully.`);
} catch (err) {
  console.error(err);
  process.exit(-2);
}
