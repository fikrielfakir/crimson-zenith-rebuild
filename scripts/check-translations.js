#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '../src/i18n/locales');
const SOURCE_LANG = 'en';
const TARGET_LANGS = ['fr', 'ar', 'es'];

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value, fullKey);
    }
    return [fullKey];
  });
}

function loadLocale(lang) {
  return JSON.parse(readFileSync(join(LOCALES_DIR, `${lang}.json`), 'utf-8'));
}

const RESET = '\x1b[0m';
const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BOLD  = '\x1b[1m';
const CYAN  = '\x1b[36m';

const sourceKeys = new Set(flattenKeys(loadLocale(SOURCE_LANG)));
let totalMissing = 0;
let anyMissing = false;

for (const lang of TARGET_LANGS) {
  const targetKeys = new Set(flattenKeys(loadLocale(lang)));
  const missing = [...sourceKeys].filter(k => !targetKeys.has(k));
  const extra   = [...targetKeys].filter(k => !sourceKeys.has(k));

  console.log(`\n${BOLD}${CYAN}── ${lang.toUpperCase()} ──────────────────────────────────────${RESET}`);

  if (missing.length === 0) {
    console.log(`${GREEN}✓ No missing keys${RESET}`);
  } else {
    anyMissing = true;
    totalMissing += missing.length;
    console.log(`${RED}✗ ${missing.length} missing key(s):${RESET}`);
    for (const key of missing) {
      console.log(`  ${YELLOW}${key}${RESET}`);
    }
  }

  if (extra.length > 0) {
    console.log(`${YELLOW}⚠ ${extra.length} extra key(s) not in English (safe to ignore):${RESET}`);
    for (const key of extra) {
      console.log(`  ${key}`);
    }
  }
}

console.log(`\n${BOLD}──────────────────────────────────────────────${RESET}`);
if (anyMissing) {
  console.log(`${RED}${BOLD}Total missing keys across all locales: ${totalMissing}${RESET}`);
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}All locales are complete!${RESET}`);
  process.exit(0);
}
