/**
 * MakeGetFilteredOptions - robust fast search for large flat lists.
 *
 * - Pre-normalizes every label (once) to: lowercased, non-alphanum -> space, collapse spaces.
 * - Order-insensitive: all query terms must appear somewhere.
 * - Ordered matches are scored higher than unordered ones.
 * - No fuzzy matching (Levenshtein removed for performance).
 * - Extremely fast even for 150k entries.
 *
 * @param {string[]} medicinesList
 * @param {object} opts - optional config { limit: number }
 * @returns {(inputVal: string) => string[]}
 */
function makeGetFilteredOptions(medicinesList, opts = {}) {
  const limit = Number(opts.limit || 15);

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // Pre-normalize once
  const normalizedList = medicinesList.map((lab) => normalize(lab));

  // Pre-tokenize once for fast loops
  const tokenizedList = normalizedList.map((lab) => lab.split(" "));

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

    for (let i = 0; i < tokenizedList.length; i++) {
      const tokens = tokenizedList[i];
      const matches = new Array(terms.length).fill(-1);

      // --- ORDER-INSENSITIVE MATCH: each term must match some token ---
      for (let t = 0; t < terms.length; t++) {
        const term = terms[t];
        let found = -1;

        // extremely fast loop: no DP, no big ops
        for (let k = 0; k < tokens.length; k++) {
          const tok = tokens[k];
          if (tok === term || tok.startsWith(term)) {
            found = k;
            break;
          }
        }

        if (found === -1) {
          // This label does NOT contain one term → reject fast
          found = null;
          break;
        }

        matches[t] = found;
      }

      if (matches.includes(null)) continue;

      // --- SCORING: ordered preferred ---
      let score = 0;
      const ordered = isStrictlyIncreasing(matches);

      if (ordered) score += 10;
      else score += 3;

      const first = Math.min(...matches);
      if (first === 0) score += 4;

      const span = Math.max(...matches) - first + 1;
      score += Math.max(0, 5 - span);

      score += terms.length;

      results.push({ idx: i, score });
    }

    if (results.length === 0) return [];

    results.sort((a, b) => b.score - a.score || a.idx - b.idx);

    const out = results.slice(0, limit).map(r => medicinesList[r.idx]);
    return out;
  };

  function isStrictlyIncreasing(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (!(arr[i] > arr[i - 1])) return false;
    }
    return true;
  }
}

export default makeGetFilteredOptions;
