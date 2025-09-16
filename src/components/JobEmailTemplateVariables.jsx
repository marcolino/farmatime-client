import { i18n } from "../i18n";


// Variable tokens
const variableTokens = {
  [i18n.t('[DOCTOR NAME]')]: (job) => job?.doctor?.name ?? i18n.t('[DOCTOR NAME]'),
  [i18n.t('[PATIENT NAME]')]: (job) =>
    job?.patient?.firstName || job?.patient?.lastName ? `${job?.patient?.firstName} ${job?.patient?.lastName}` : i18n.t('[PATIENT NAME]'),
  [i18n.t('[MEDICINE NAME]')]: (job) => job?.medicines?.[0]?.name ?? i18n.t('[MEDICINE NAME]'),
  [i18n.t('[USER NAME]')]: (_, user) =>
    user?.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}` : i18n.t('[USER NAME]'),
  [i18n.t('[USER EMAIL]')]: (_, user) => user?.email ?? i18n.t('[USER EMAIL]'),
};

const variablesExpand = (html, job, user) => {
  Object.entries(variableTokens).forEach((token) => {
    let replacement = variableTokens[token[0]](job, user);
    html = html.replaceAll(token[0], replacement);
  });
  return html;
}

export { variablesExpand, variableTokens };
