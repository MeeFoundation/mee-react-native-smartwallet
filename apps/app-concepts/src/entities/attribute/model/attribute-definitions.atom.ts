import { atomWithDefault } from 'jotai/utils'

import { getAttributeDefinitions } from '../api/get-attribute-definitions'
import type { AttributeSchema } from './types'

export const attributeDefinitionsAtom = atomWithDefault<AttributeSchema | Promise<AttributeSchema>>(
  getAttributeDefinitions,
)
