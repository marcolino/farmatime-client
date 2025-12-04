/**
 * MakeGetFilteredOptions - fast, order-insensitive + simple fuzzy search
 *
 * - Pre-normalizes every label once
 * - Order-insensitive: all query tokens must appear somewhere
 * - Simple fuzzy: substring OR first 3 chars OR chars in order
 * - Very fast on 150k rows
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

  const tokenize = (str) => normalize(str).split(" ").filter(Boolean);

  // Preprocess all rows
  const preprocessed = medicinesList.map((label) => ({
    label,
    tokens: tokenize(label),
    normLabel: normalize(label),
  }));

  // Simple fuzzy: chars in order (allow 1 missing), very cheap
  const simpleFuzzyMatch = (token, rowToken) => {
    if (rowToken.includes(token)) return true; // exact substring

    // if numeric, only exact substring
    if (/^\d+$/.test(token)) return false;

    // first 4 chars must match AND row token is long enough
    if (token.length >= 4 && rowToken.length >= token.length && token.slice(0, 4) === rowToken.slice(0, 4)) {
      return true;
    }

    // allow 1 char missing only if lengths are almost equal
    if (Math.abs(token.length - rowToken.length) <= 1) {
      let ti = 0;
      let ri = 0;
      let misses = 0;
      while (ti < token.length && ri < rowToken.length) {
        if (token[ti] === rowToken[ri]) {
          ti++;
          ri++;
        } else {
          ri++;
          misses++;
          if (misses > 1) return false;
        }
      }
      if (ti === token.length) return true;
    }

    return false;
  };

  return function getFilteredOptions(inputVal) {
    if (!inputVal) return [];
    const queryTokens = tokenize(inputVal);
    if (queryTokens.length === 0) return [];

    const results = [];

    for (const { label, tokens: rowTokens, normLabel } of preprocessed) {
      let allMatch = true;
      let firstIdx = Infinity;
      let lastIdx = -1;

      for (const qt of queryTokens) {
        const matched = rowTokens.some((rt) => simpleFuzzyMatch(qt, rt));
        if (!matched) {
          allMatch = false;
          break;
        }

        // update span for scoring
        const idx = normLabel.indexOf(qt);
        if (idx !== -1) {
          firstIdx = Math.min(firstIdx, idx);
          lastIdx = Math.max(lastIdx, idx + qt.length);
        }
      }

      if (!allMatch) continue;

      // scoring
      let score = 0;
      if (normLabel.startsWith(queryTokens[0])) score += 4;
      const span = lastIdx - firstIdx;
      if (span >= 0) score += Math.max(0, 5 - Math.floor(span / 10));
      score += queryTokens.length;

      results.push({ label, score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map((r) => r.label);
  };
}

export default makeGetFilteredOptions;
