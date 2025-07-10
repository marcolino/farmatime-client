import { i18n } from "../i18n";

// Variable tokens
const variableTokens = {
  [i18n.t('[DOCTOR NAME]')]: (job) => job?.doctor?.name ?? '',
  [i18n.t('[PATIENT NAME]')]: (job) =>
    job?.patient?.firstName || job?.patient?.lastName
      ? `${job?.patient?.firstName} ${job?.patient?.lastName}` : '',
  [i18n.t('[MEDICINE NAME]')]: (job) => job?.medicines?.[0]?.name ?? '',
  [i18n.t('[USER NAME]')]: (_, auth) =>
    auth?.user?.firstName && auth.user.lastName
      ? `${auth.user.firstName} ${auth.user.lastName}` : '',
  [i18n.t('[USER EMAIL]')]: (_, auth) => auth?.user?.email ?? '',
};

function variablesExpand(html, job, auth) {
  Object.entries(variableTokens).forEach((token) => {
    let replacement = variableTokens[token[0]](job, auth);
    html = html.replaceAll(token[0], replacement);
  });
  return html;
}

export { variablesExpand, variableTokens };
