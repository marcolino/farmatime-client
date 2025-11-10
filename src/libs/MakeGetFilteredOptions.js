/**
 * MakeGetFilteredOptions - robust ordered-match search for large flat lists.
 *
 * - Pre-normalizes every label (once) to: lowercased, non-alphanum -> space, collapse spaces.
 * - All query terms must appear in order (but may have text in between)
 * - Each term may start right after or slightly overlapping the previous one
 * - Fast even for 150k entries (single pass per label)
 * - Handles numeric and alphanumeric words cleanly
 *
 * @param {string[]} medicinesList - array of display labels (ASCII is fine)
 * @param {object} opts - optional config { limit: number }
 * @returns {(inputVal: string) => string[]}
 */
function makeGetFilteredOptions(medicinesList, opts = {}) {
  const limit = Number(opts.limit || 15);

  // Precompute a normalized version for each label once (fast on lookup)
  // Normalization: lowercase, remove diacritics if any, replace any non-alphanumeric with a single space, collapse spaces
  const normalize = (s) => String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents if present
    .replace(/[^a-z0-9]+/g, " ") // non-alnum -> space (keeps digits)
    .replace(/\s+/g, " ")
    .trim()
  ;

  const normalizedList = medicinesList.map((lab) => normalize(lab));

  // Tokenizer for the query (same normalization rules for tokens)
  const tokenize = (str) =>
    String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean);

  return function getFilteredOptions(inputVal) {
    if (!inputVal) return [];

    const terms = tokenize(inputVal);
    if (terms.length === 0) return [];

    const results = [];

    // Walk the pre-normalized list; use indexOf on normalized string for robust matching
    for (let i = 0; i < normalizedList.length; i++) {
      const norm = normalizedList[i];

      // Quick reject: first term must appear
      let start = norm.indexOf(terms[0]);
      if (start === -1) continue;

      // Ensure subsequent terms appear after the previous matched token end
      let ok = true;
      let lastEnd = start + terms[0].length;
      for (let t = 1; t < terms.length; t++) {
        const idx = norm.indexOf(terms[t], lastEnd);
        if (idx === -1) {
          ok = false;
          break;
        }
        lastEnd = idx + terms[t].length;
      }
      if (!ok) continue;

      // Scoring: prefer starts-with, prefer tighter span and more terms
      let score = 0;
      if (start === 0) score += 4; // label begins with first term

      const span = lastEnd - start;
      if (span >= 0) score += Math.max(0, 5 - Math.floor(span / 10)); // closer = better

      score += terms.length; // per-term small bonus

      results.push({ idx: i, score });
    }

    if (results.length === 0) return [];

    // sort and return original labels (stable tie-break by idx)
    results.sort((a, b) => b.score - a.score || a.idx - b.idx);

    const outLen = Math.min(limit, results.length);
    const out = new Array(outLen);
    for (let k = 0; k < outLen; k++) out[k] = medicinesList[results[k].idx];
    return out;
  };
}

export default makeGetFilteredOptions;

