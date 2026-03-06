import type { Locale } from '@/features/localization'

import chatEn from './chat.en.json'
import chatEs from './chat.es.json'
import commonEn from './common.en.json'
import commonEs from './common.es.json'
import groupsEn from './groups.en.json'
import groupsEs from './groups.es.json'
import { CHAT_NS, COMMON_NS, GROUPS_NS, PEOPLE_NS } from './namespaces'
import peopleEn from './people.en.json'
import peopleEs from './people.es.json'

type Resource = {
  [COMMON_NS]: typeof commonEn
  [PEOPLE_NS]: ResourceShape<typeof peopleEn>
  [GROUPS_NS]: ResourceShape<typeof groupsEn>
  [CHAT_NS]: ResourceShape<typeof chatEn>
}

type ResourceShape<TResource> = {
  [K in keyof TResource]: TResource[K] extends string ? string : ResourceShape<TResource[K]>
}

export const resources: Record<Locale, Resource> = {
  en: {
    [COMMON_NS]: commonEn,
    [PEOPLE_NS]: peopleEn,
    [GROUPS_NS]: groupsEn,
    [CHAT_NS]: chatEn,
  },
  es: {
    [COMMON_NS]: commonEs,
    [PEOPLE_NS]: peopleEs,
    [GROUPS_NS]: groupsEs,
    [CHAT_NS]: chatEs,
  },
}

type CurlyBracesResources<T> = {
  [K in keyof T]: T[K] extends string ? K : CurlyBracesResources<T[K]>
}

declare module 'i18next' {
  export interface CustomTypeOptions {
    defaultNS: 'common'
    fallbackNS: 'common'
    resources: CurlyBracesResources<Resource>
  }
}
