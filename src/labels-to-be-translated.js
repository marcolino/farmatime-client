/**
 * Strings for translations: they are listed here for i18next-parse to find them
 */
import i18n from "i18next";

// Strings in config.json, that cannot be translated there to avoid circular dependencies hell
i18n.t("INDEX_DESCRIPTION"); // app description

i18n.t("request");

// app modes
i18n.t("production");
i18n.t("staging");
i18n.t("development");
i18n.t("test");

// roles names, untranslatable tags from server
i18n.t("user");
i18n.t("dealer");
i18n.t("operator");
i18n.t("admin");

// payment types
i18n.t("unlimited");
i18n.t("standard");
i18n.t("free");

// products
i18n.t("MDA code");
i18n.t("OEM code");
i18n.t("Type");
i18n.t("Make");
i18n.t("Application");
i18n.t("kW");
i18n.t("Volt");
i18n.t("Ampere");
i18n.t("Teeth");
i18n.t("Rotation");
i18n.t("Regulator");
i18n.t("Notes");
