import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-pluralrules/polyfill-force'
import 'intl-pluralrules'

import { shouldPolyfill } from '@formatjs/intl-pluralrules/should-polyfill'

export const initializeLocalizations = async (locale: string) => {
  const unsupportedLocale = shouldPolyfill(locale)
  if (!unsupportedLocale) return

  await import('@formatjs/intl-pluralrules/polyfill-force')

  switch (unsupportedLocale) {
    case 'en':
      await import('@formatjs/intl-pluralrules/locale-data/en')
      break
    default:
  }
}
