/**
 * MakeGetFilteredOptions - robust ordered-match search for large flat lists.
 *
 * - Pre-normalizes every label (once) to: lowercased, non-alphanum -> space, collapse spaces.
 * - All query terms must appear (order-insensitive hybrid: ordered is preferred, unordered allowed)
 * - Fuzzy matching allowed (prefix OR Levenshtein up to distance 1–2)
 * - Fast even for large lists
 * - Handles numeric and alphanumeric words cleanly
 *
 * @param {string[]} medicinesList - array of display labels (ASCII is fine)
 * @param {object} opts - optional config { limit: number }
 * @returns {(inputVal: string) => string[]}
 */
function makeGetFilteredOptions(medicinesList, opts = {}) {
  const limit = Number(opts.limit || 15);

  // Normalization: lowercase, remove diacritics if any, replace any non-alphanumeric with a single space, collapse spaces
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const normalizedList = medicinesList.map((lab) => normalize(lab));

  // Pre-tokenize every normalized label for word-level matching
  const tokenizedList = normalizedList.map((lab) => lab.split(" "));

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

  // ---------- FUZZY HELPERS ----------

  // Levenshtein distance for fuzzy matching (optimized small version)
  const levenshtein = (a, b) => {
    if (a === b) return 0;
    const al = a.length, bl = b.length;
    if (Math.abs(al - bl) > 2) return 99; // early cutoff
    const dp = Array.from({ length: al + 1 }, (_, i) => [i]);
    for (let j = 1; j <= bl; j++) dp[0][j] = j;
    for (let i = 1; i <= al; i++) {
      for (let j = 1; j <= bl; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
        );
      }
    }
    return dp[al][bl];
  };

  // Return true if token ≈ term (exact, prefix, or fuzzy)
  const fuzzyMatch = (token, term) => {
    if (token === term) return true;
    if (token.startsWith(term)) return true;
    const d = levenshtein(token, term);
    if (term.length <= 4) return d <= 1;
    return d <= 2;
  };

  // ---------- MAIN FILTER FUNCTION ----------

  return function getFilteredOptions(inputVal) {
    if (!inputVal) return [];

    const terms = tokenize(inputVal);
    if (terms.length === 0) return [];

    const results = [];

    for (let i = 0; i < tokenizedList.length; i++) {
      const tokens = tokenizedList[i];

      // --- HYBRID ORDER INSENSITIVE MATCHING ---
      // All terms must appear somewhere (unordered allowed)
      const matches = new Array(terms.length).fill(-1); // stores token index for each term

      for (let t = 0; t < terms.length; t++) {
        const term = terms[t];
        let foundAt = -1;

        for (let k = 0; k < tokens.length; k++) {
          if (fuzzyMatch(tokens[k], term)) {
            foundAt = k;
            break;
          }
        }

        if (foundAt === -1) {
          // term not found anywhere → reject
          foundAt = null;
          break;
        }

        matches[t] = foundAt;
      }

      if (matches.includes(null)) continue; // some term not found

      // --- SCORING: ORDERED PREFERRED, UNORDERED ACCEPTED ---
      let score = 0;

      const ordered = isStrictlyIncreasing(matches);

      if (ordered) score += 10;    // strong bonus for natural order
      else score += 3;             // but unordered still acceptable

      const first = Math.min(...matches);
      if (first === 0) score += 4; // starts with good

      const span = Math.max(...matches) - first + 1;
      score += Math.max(0, 5 - span); // tighter grouping = better

      score += terms.length; // small bonus per-term

      results.push({ idx: i, score });
    }

    if (results.length === 0) return [];

    results.sort((a, b) => b.score - a.score || a.idx - b.idx);

    const outLen = Math.min(limit, results.length);
    const out = new Array(outLen);
    for (let k = 0; k < outLen; k++) {
      out[k] = medicinesList[results[k].idx];
    }
    return out;
  };

  // helper for ordered-match detection
  function isStrictlyIncreasing(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (!(arr[i] > arr[i - 1])) return false;
    }
    return true;
  }
}

export default makeGetFilteredOptions;
