import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { useAtomValue } from 'jotai'

import { attributeDefinitionsAtom } from '../model/attribute-definitions.atom'
import type { AttributeSchema } from '../model/types'

export const useAjv = (schema: AttributeSchema) => {
  const definitionsSchema = useAtomValue(attributeDefinitionsAtom)
  const ajv = new Ajv({ schemas: [schema, definitionsSchema] })

  addFormats(ajv)

  return ajv
}
