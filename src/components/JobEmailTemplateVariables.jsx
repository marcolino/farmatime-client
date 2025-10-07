import { i18n } from "../i18n";

// Variable tokens
const variableTokens = {
  [i18n.t('[DOCTOR NAME]')]: (job) => job?.doctor?.name ?? i18n.t('[DOCTOR NAME]'),
  [i18n.t('[PATIENT NAME]')]: (job) =>
    (job?.patient?.firstName || job?.patient?.lastName) ? `${job?.patient?.firstName} ${job?.patient?.lastName}` : i18n.t('[PATIENT NAME]'),
  [i18n.t('[MEDICINE NAME]')]: (job) => job?.medicines?.[0]?.name ?? i18n.t('[MEDICINE NAME]'),
  [i18n.t('[USER NAME]')]: (_, user) =>
    user?.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}` : i18n.t('[USER NAME]'),
  [i18n.t('[USER EMAIL]')]: (_, user) => user?.email ?? i18n.t('[USER EMAIL]'),
};

/** 
 * Original variablesExpand, much simpler, did not consider html tags...
 * I.e.: if user changes a style for a tag, the expansion is not performed anymore...
 *
const variablesExpand = (html, job, user) => {
  Object.entries(variableTokens).forEach(tokenAndJob => {
    const token = tokenAndJob[0];
    const tokenReplacement = variableTokens[token](job, user); // e.g.: ASPIRINA
    html = html.replaceAll(token, tokenReplacement);
  });
  return html;
}
*/

const variablesExpand = (html, job, user) => {
  const doc = document;

  Object.entries(variableTokens).forEach(([token, fn]) => {
    const tokenPlain = token.replace(/[[\]]/g, "").trim(); // e.g.: MEDICINE NAME
    const replacement = fn(job, user); // e.g.: Aspirine

    // Escape regex special chars
    const escaped = tokenPlain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const between = "(?:\\s|<[^>]+>)*";
    const spaced = escaped.replace(/\s+/g, between);
    const pattern = new RegExp(
      `\\[\\s*(?:<[^>]+>\\s*)*${spaced}(?:\\s*<[^>]+>)*\\s*\\]`,
      "gi"
    );

    html = html.replace(pattern, (match) => {
      // Handle plain [TOKEN]
      if (!/[<>]/.test(match)) return escapeHtml(replacement);

      // Parse HTML fragment
      const wrapper = doc.createElement("div");
      wrapper.innerHTML = match;

      const text = wrapper.textContent || "";
      const startBracket = text.indexOf("[");
      const endBracket = text.lastIndexOf("]");
      if (startBracket === -1 || endBracket === -1 || endBracket <= startBracket) {
        const tokenRegex = new RegExp(escaped, "i");
        wrapper.innerHTML = wrapper.innerHTML.replace(tokenRegex, replacement);
        return wrapper.innerHTML;
      }

      // Replace inside the brackets only
      const walker = doc.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT, null, false);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      const plainRegex = new RegExp(escaped, "i");
      for (const node of nodes) {
        node.nodeValue = node.nodeValue.replace(plainRegex, replacement);
      }

      return wrapper.innerHTML;
    });
  });

  return html;

  // A utility internal function
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
    ;
  };
};

export { variablesExpand, variableTokens };
