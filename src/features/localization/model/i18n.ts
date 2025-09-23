import i18n from 'i18next'
import ICU from 'i18next-icu'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../config/constants'
import { resources } from '../config/resources'
import { COMMON_NS } from '../config/resources/namespaces'

i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    defaultNS: COMMON_NS,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: true },
    lng: 'en',
    resources: resources,
    supportedLngs: [...SUPPORTED_LOCALES],
  })

export default i18n
