import i18n from "i18next"
import ICU from "i18next-icu"
import { initReactI18next } from "react-i18next"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../config/constants"

import { resources } from "../config/resources"
import { COMMON_NS } from "../config/resources/namespaces"

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: DEFAULT_LOCALE,
    resources: resources,
    defaultNS: COMMON_NS,
    interpolation: { escapeValue: true },
    supportedLngs: [...SUPPORTED_LOCALES],
  })

export default i18n
