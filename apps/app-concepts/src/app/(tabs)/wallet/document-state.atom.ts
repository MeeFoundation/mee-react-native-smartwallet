import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import type { DocumentSection } from './document-registry'
import { WALLET_DOCUMENTS } from './document-registry'

export type DocumentState = {
  value: Record<string, unknown>
  badges: string[]
  section: DocumentSection
}

export const documentStateAtom = atomFamily((slug: string) => {
  const entry = WALLET_DOCUMENTS.find((d) => d.slug === slug)
  return atom<DocumentState>({
    value: entry?.defaultValue ?? {},
    badges: entry ? [...entry.defaultBadges] : [],
    section: entry?.section ?? 'life',
  })
})
