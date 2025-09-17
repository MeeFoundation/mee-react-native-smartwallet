import type { Locale } from "@/models/localization"
import { COMMON_NS, GROUPS_NS, PEOPLE_NS } from "./namespaces"

import commonEn from "./common.en.json"
import commonEs from "./common.es.json"

import groupsEn from "./groups.en.json"
import groupsEs from "./groups.es.json"

import peopleEn from "./people.en.json"
import peopleEs from "./people.es.json"

type Resource = {
  [COMMON_NS]: typeof commonEn
  [PEOPLE_NS]: ResourceShape<typeof peopleEn>
  [GROUPS_NS]: ResourceShape<typeof groupsEn>
}

type ResourceShape<TResource> = {
  [K in keyof TResource]: TResource[K] extends string ? string : ResourceShape<TResource[K]>
}

export const resources: Record<Locale, Resource> = {
  en: {
    [COMMON_NS]: commonEn,
    [PEOPLE_NS]: peopleEn,
    [GROUPS_NS]: groupsEn,
  },
  es: {
    [COMMON_NS]: commonEs,
    [PEOPLE_NS]: peopleEs,
    [GROUPS_NS]: groupsEs,
  },
}

type CurlyBracesResources<T> = {
  [K in keyof T]: T[K] extends string ? K : CurlyBracesResources<T[K]>
}

declare module "i18next" {
  export interface CustomTypeOptions {
    defaultNS: "common"
    fallbackNS: "common"
    resources: CurlyBracesResources<Resource>
  }
}
