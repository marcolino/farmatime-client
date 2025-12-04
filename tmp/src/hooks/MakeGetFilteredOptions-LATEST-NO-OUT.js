/**
 * MakeGetFilteredOptions - robust ordered-match search for large flat lists.
 *
 * - Pre-normalizes every label (once) to: lowercased, non-alphanum -> space, collapse spaces.
 * - Now supports ORDER-INSENSITIVE matching (tokens can be in any order)
 * - Still extremely fast for 150k entries
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
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents if present
      .replace(/[^a-z0-9]+/g, " ")     // non-alnum -> space (keeps digits)
      .replace(/\s+/g, " ")
      .trim();

  const normalizedList = medicinesList.map((lab) => normalize(lab));
  console.log("normalizedList:", normalizedList.filter((x) => x.includes("tachipirina") && x.includes("1000")));

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
    console.log("terms:", terms);

    const results = [];

    // Fast order-INSENSITIVE filtering based on substring matches
    for (let i = 0; i < normalizedList.length; i++) {
      const norm = normalizedList[i];

      // Quick reject: every term must appear somewhere
      let allFound = true;
      for (let t = 0; t < terms.length; t++) {
        if (norm.indexOf(terms[t]) === -1) {
          allFound = false;
          break;
        }
      }
      if (!allFound) continue;
      if (terms[1] === "tachipirina") console.log("allFound");

      // --- Scoring logic preserved (but adapted for order-insensitive) ---
      // First term appearing at beginning gives extra score
      let score = 0;
      const firstTerm = terms[0];
      const start = norm.indexOf(firstTerm);

      if (start === 0) score += 4;
      if (terms[1] === "tachipirina") console.log("score after start:", score);

      // Compute minimal span covering all term occurrences
      let minIdx = Infinity;
      let maxIdx = -1;

      for (let t = 0; t < terms.length; t++) {
        const idx = norm.indexOf(terms[t]);
        if (idx !== -1) {
          if (idx < minIdx) minIdx = idx;
          const end = idx + terms[t].length;
          if (end > maxIdx) maxIdx = end;
        }
      }

      const span = maxIdx - minIdx;
      if (span >= 0) score += Math.max(0, 5 - Math.floor(span / 10));

      score += terms.length; // per-term small bonus

      results.push({ idx: i, score });
    }
    if (terms[1] === "tachipirina") console.log("results:", results);

    if (results.length === 0) return [];

    // sort and return original labels (stable tie-break by idx)
    results.sort((a, b) => b.score - a.score || a.idx - b.idx);

    const outLen = Math.min(limit, results.length);
    const out = new Array(outLen);

    /*
    for (let k = 0; k < outLen; k++) {
      out[k] = medicinesList[results[k].idx];
    }
    */
    /*
    for (let k = 0; k < outLen; k++) {
      const label = medicinesList[results[k].idx];
      out[k] = { id: label, label }; // normalized option object
    }
    */
    for (let k = 0; k < outLen; k++) {
      out[k] = medicinesList[results[k].idx];
    }

    if (terms[1] === "tachipirina") console.log("out:", out);

    return out;
  };
}

export default makeGetFilteredOptions;
