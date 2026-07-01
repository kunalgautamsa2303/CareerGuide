const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const externalPrefixes = [
  "http:",
  "https:",
  "mailto:",
  "tel:",
  "javascript:",
  "data:",
  "#"
];

function walk(dir, matcher, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, matcher, files);
    } else if (matcher(full)) {
      files.push(full);
    }
  }
  return files;
}

function isExternal(value) {
  return externalPrefixes.some(prefix => value.startsWith(prefix));
}

function stripQueryAndHash(value) {
  return value.split("#")[0].split("?")[0];
}

function checkLinks() {
  const htmlFiles = walk(root, file => file.endsWith(".html"));
  const missing = [];

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const attrPattern = /\b(?:href|src)=["']([^"']+)["']/g;
    let match;

    while ((match = attrPattern.exec(html))) {
      const raw = match[1].trim();
      if (!raw || isExternal(raw)) continue;

      const clean = stripQueryAndHash(raw);
      if (!clean) continue;

      const resolved = path.resolve(path.dirname(file), clean);
      if (!resolved.startsWith(root)) {
        missing.push({ file, raw, reason: "outside project" });
        continue;
      }

      if (!fs.existsSync(resolved)) {
        missing.push({ file, raw, reason: "missing" });
      }
    }
  }

  return missing;
}

function checkJSON() {
  const jsonFiles = walk(root, file => file.endsWith(".json"));
  const errors = [];

  for (const file of jsonFiles) {
    try {
      const text = fs.readFileSync(file, "utf8").trim();
      if (text) JSON.parse(text);
    } catch (error) {
      errors.push({ file, message: error.message });
    }
  }

  return errors;
}

function checkPlaceholderLinks() {
  const htmlFiles = walk(root, file => file.endsWith(".html"));
  const placeholders = [];

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const attrPattern = /\bhref=["']#["']/g;
    let match;
    while ((match = attrPattern.exec(html))) {
      placeholders.push({ file, index: match.index });
    }
  }

  return placeholders;
}

const missingLinks = checkLinks();
const jsonErrors = checkJSON();
const placeholders = checkPlaceholderLinks();

console.log(`Missing local links/assets: ${missingLinks.length}`);
for (const item of missingLinks.slice(0, 80)) {
  console.log(`${path.relative(root, item.file)} -> ${item.raw} (${item.reason})`);
}

console.log(`JSON parse errors: ${jsonErrors.length}`);
for (const item of jsonErrors) {
  console.log(`${path.relative(root, item.file)} -> ${item.message}`);
}

console.log(`href="#" placeholders: ${placeholders.length}`);
for (const item of placeholders.slice(0, 80)) {
  console.log(`${path.relative(root, item.file)} at ${item.index}`);
}

if (missingLinks.length || jsonErrors.length) {
  process.exitCode = 1;
}
