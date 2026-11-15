#!/usr/bin/env node
/**
 * Validation gate for extension-selectors.v1.json (TODO-EXT-21.5.3).
 * Ensures schema conformance and zero executable/JS payloads before publishing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, "../public/config/extension-selectors.v1.json");

const FORBIDDEN_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /eval\s*\(/i,
  /new\s+Function/i,
  /on\w+\s*=/i
];

function validateManifest(data) {
  const errors = [];
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return ["Root must be a JSON object"];
  }
  if (typeof data.schemaVersion !== "string" || !/^\d+\.\d+\.\d+$/.test(data.schemaVersion)) {
    errors.push("schemaVersion must match semver (e.g. 1.0.0)");
  }
  if (typeof data.updatedAt !== "string" || Number.isNaN(Date.parse(data.updatedAt))) {
    errors.push("updatedAt must be a valid ISO-8601 timestamp");
  }
  if (!data.platforms || typeof data.platforms !== "object" || Array.isArray(data.platforms)) {
    errors.push("platforms must be a non-empty object");
    return errors;
  }

  for (const requiredPlatform of ["classroom", "canvas", "moodle"]) {
    if (!data.platforms[requiredPlatform]) {
      errors.push(`Missing required platform: ${requiredPlatform}`);
    }
  }

  for (const [platform, keys] of Object.entries(data.platforms)) {
    if (!keys || typeof keys !== "object" || Array.isArray(keys) || Object.keys(keys).length === 0) {
      errors.push(`Platform '${platform}' must be a non-empty object of selector keys`);
      continue;
    }
    for (const [key, selectors] of Object.entries(keys)) {
      if (!Array.isArray(selectors) || selectors.length === 0) {
        errors.push(`Selector list '${platform}.${key}' must be a non-empty array`);
        continue;
      }
      for (const sel of selectors) {
        if (typeof sel !== "string" || sel.trim().length === 0) {
          errors.push(`Invalid empty selector in '${platform}.${key}'`);
          continue;
        }
        for (const pat of FORBIDDEN_PATTERNS) {
          if (pat.test(sel)) {
            errors.push(`Forbidden executable pattern detected in '${platform}.${key}': ${sel}`);
          }
        }
      }
    }
  }

  return errors;
}

const raw = fs.readFileSync(manifestPath, "utf8");
const parsed = JSON.parse(raw);
const errors = validateManifest(parsed);

if (errors.length > 0) {
  console.error("❌ extension-selectors.v1.json validation failed:");
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(`✅ extension-selectors.v1.json passed validation (v${parsed.schemaVersion}, ${Object.keys(parsed.platforms).length} platforms).`);
