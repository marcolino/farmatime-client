import React from "react";
//import { i18n } from "../i18n";
import { useTranslation } from "react-i18next";


const HelpPages = () => { // Help content map
  const { t } = useTranslation();

  return {
    MedicineName: {
      title: t("Medicine Name"),
      content: (
        <>
          <p>{t('Enter the name of the medicine, its active ingredient, or its ATC code')}.</p>
          <p>
            {t('\
You can use the autocomplete feature to help you find the correct medicine: \
it is sufficent to start typing the medicine name. If you don\'t find your medicine in the list, digit one more letter: all Italian medicines are present.')
            }
          </p>
        </>
      ),
    },
    DateSince: {
      title: t("Date of first request"),
      content: (
        <>
          <p>{t('Enter the date when the first request to the doctor should be made')}.</p>
          <p>
            {t('\
For example, if you have some pills left, and you foresee to finish it \
in a week, you should enter the day after a week from now')
            }.
          </p>
        </>
      ),
    },
    Frequency: {
      title: t("Frequency of the requests"),
      content: (
        <>
          <p>{t('Enter the frequency of the requests, in days')}.</p>
          <p>
            {
              t('\
For example, if you have to take 2 pills a day, and the packaging contains 36 pills, \
you should enter 18 here, to request the medicine every 18 days')
            }.
            </p>
        </>
      ),
    },

    _PatientFirstName: { // disabled, too trivial...
      title: t("Patient first name"),
      content: (
        <>
          <p>{t('Enter the name of the patient')}.</p>
          <p></p>
        </>
      ),
    },
    _PatientLastName: { // disabled, too trivial...
      title: t("Patient last name"),
      content: (
        <>
          <p>{t('Enter the last name of the patient')}.</p>
          <p></p>
        </>
      ),
    },
    _PatientEmail: { // disabled, too trivial...
      title: t("Patient email"),
      content: (
        <>
          <p>{t('Enter the email of the patient')}.</p>
          <p></p>
        </>
      ),
    },
    
    _DoctorFirstName: { // disabled, too trivial...
      title: t("Doctor first name"),
      content: (
        <>
          <p>{t('Enter the name of the doctor')}.</p>
          <p></p>
        </>
      ),
    },
    _DoctorLastName: { // disabled, too trivial...
      title: t("Doctor last name"),
      content: (
        <>
          <p>{t('Enter the last name of the doctor')}.</p>
          <p></p>
        </>
      ),
    },
    _DoctorEmail: { // disabled, too trivial...
      title: t("Doctor email"),
      content: (
        <>
          <p>{t('Enter the email of the doctor')}.</p>
          <p></p>
        </>
      ),
    },

    EmailTemplateSubject: {
      title: t("Email subject"),
      content: (
        <>
          <p>{t('Edit the email subject')}.</p>
        </>
      ),
    },
    EmailTemplateToolbar: {
      title: t("Email toolbar"),
      content: (
        <>
          <p>{t('With this toolbar you can style a bit the email to request the medicines, and use "variables"')}.</p>
          <p>
            {
              t('\
Buttons: by pressing one of the [B], [I], [U] buttons and then writing some text you make that \
text style - respectively - Bold, Italic, Underlined; \
and if you select some existing text and then press one of those buttons, \
the selected text will get the corresponding style.\
\n\
\n\
Variables: by selecting one of the items in the "variables" selector (for example "[MEDICINE]"), you insert that "placeholder" in the email body (just after the caret), and it will be replaced by it\'s real value (for example "Aspirine") when email will be sent')
            }.
          </p>
        </>
      ),
    },
    EmailTemplateBody: {
      title: t("Email body"),
      content: (
        <>
          <p>{t('Edit the email body')}.</p>
          <p></p>
        </>
      ),
    },
    // EmailTemplateSignature: {
    //   title: t("Email signature"),
    //   content: (
    //     <>
    //       <p>{t('Edit the email signature.')}.</p>
    //       <p></p>
    //     </>
    //   ),
    // },
  };
};

export default HelpPages;