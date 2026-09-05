// Recomputes total career experience ("N년 M개월") each month and
// updates README.md and assets/badges.svg in place.
//
// Baseline is anchored to a known-correct value (from the résumé) rather
// than re-deriving every employment period's exact day boundaries.
import { readFileSync, writeFileSync } from "node:fs";

const BASELINE_YEAR = 2026;
const BASELINE_MONTH = 9; // September, 1-indexed
const BASELINE_TOTAL_MONTHS = 8 * 12 + 1; // "8년 1개월" as of the baseline month

const now = new Date();
const nowYear = now.getUTCFullYear();
const nowMonth = now.getUTCMonth() + 1;

const deltaMonths = (nowYear - BASELINE_YEAR) * 12 + (nowMonth - BASELINE_MONTH);
const totalMonths = BASELINE_TOTAL_MONTHS + deltaMonths;

const years = Math.floor(totalMonths / 12);
const months = totalMonths % 12;
const totalStr = months === 0 ? `${years}년` : `${years}년 ${months}개월`;

function updateFile(path, replacer) {
  const before = readFileSync(path, "utf8");
  const after = replacer(before);
  if (before !== after) {
    writeFileSync(path, after, "utf8");
    console.log(`updated ${path}`);
  } else {
    console.log(`no change needed for ${path}`);
  }
}

updateFile("README.md", (text) =>
  text.replace(
    /(## 💼 Career — 총 )\S+년(?: \S+개월)?/,
    `$1${totalStr}`
  )
);

updateFile("assets/badges.svg", (text) =>
  text.replace(
    /(<text x="130" y="19"[^>]*>)[^<]+(<\/text>)/,
    `$1${totalStr}$2`
  )
);

console.log(`Total experience is now: ${totalStr}`);
