/**
 * MakeGetFilteredOptions - robust order-insensitive + lightweight fuzzy search.
 *
 * - Pre-normalizes every label (once) to: lowercased, non-alphanum -> space, collapse spaces.
 * - Order-insensitive: all query tokens must appear somewhere in the label (in any order)
 * - Lightweight fuzzy: allows small typos per token (Levenshtein ≤ 1)
 * - Extremely fast for large lists (150k rows)
 *
 * @param {string[]} medicinesList - array of display labels
 * @param {object} opts - optional config { limit: number, maxFuzzyDistance: number }
 * @returns {(inputVal: string) => string[]}
 */
function makeGetFilteredOptions(medicinesList, opts = {}) {
  const limit = Number(opts.limit || 15);
  const maxFuzzyDistance = Number(opts.maxFuzzyDistance ?? 1); // <=1 char difference allowed

  // ---- normalize text: lowercase, remove accents, replace non-alphanum with space, collapse spaces
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // ---- tokenize text
  const tokenize = (str) => normalize(str).split(" ").filter(Boolean);

  // ---- precompute tokens for all rows
  const preprocessed = medicinesList.map((label) => ({
    label,
    tokens: tokenize(label),
  }));

  // ---- simple Levenshtein distance (optimized for short strings)
  const levenshtein = (a, b) => {
    if (a === b) return 0;
    const alen = a.length;
    const blen = b.length;
    if (alen === 0) return blen;
    if (blen === 0) return alen;

    let prev = Array(blen + 1).fill(0).map((_, i) => i);
    let curr = Array(blen + 1).fill(0);

    for (let i = 1; i <= alen; i++) {
      curr[0] = i;
      for (let j = 1; j <= blen; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      }
      [prev, curr] = [curr, prev];
    }
    return prev[blen];
  };

  return function getFilteredOptions(inputVal) {
    if (!inputVal) return [];

    const queryTokens = tokenize(inputVal);
    if (queryTokens.length === 0) return [];

    const results = [];

    for (const { label, tokens: rowTokens } of preprocessed) {
      let allMatch = true;
      let minIdx = Infinity;
      let maxIdx = -1;

      for (const qt of queryTokens) {
        // Strict match first
        let matched = false;
        for (const rt of rowTokens) {
          if (rt.includes(qt)) {
            matched = true;
            const idx = normalize(label).indexOf(rt);
            minIdx = Math.min(minIdx, idx);
            maxIdx = Math.max(maxIdx, idx + rt.length);
            break;
          }
        }

        // If no strict match, try lightweight fuzzy
        if (!matched) {
          for (const rt of rowTokens) {
            if (levenshtein(rt, qt) <= maxFuzzyDistance) {
              matched = true;
              const idx = normalize(label).indexOf(rt);
              minIdx = Math.min(minIdx, idx);
              maxIdx = Math.max(maxIdx, idx + rt.length);
              break;
            }
          }
        }

        if (!matched) {
          allMatch = false;
          break;
        }
      }

      if (!allMatch) continue;

      // scoring: prefer starts-with, tighter span, more tokens
      let score = 0;
      const normLabel = normalize(label);
      if (normLabel.startsWith(queryTokens[0])) score += 4;
      const span = maxIdx - minIdx;
      if (span >= 0) score += Math.max(0, 5 - Math.floor(span / 10));
      score += queryTokens.length;

      results.push({ label, score });
    }

    // sort by score descending
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit).map((r) => r.label);
  };
}

export default makeGetFilteredOptions;
