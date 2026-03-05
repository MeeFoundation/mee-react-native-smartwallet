import type Ajv from 'ajv'

import type { AttributeSchema } from '../model/types'

export const resolveSchema = (schema: AttributeSchema, ajv: Ajv): AttributeSchema | undefined => {
  if ('type' in schema) return schema

  if ('$ref' in schema && schema.$ref) {
    const resolvedByRef = ajv.getSchema(schema.$ref)?.schema
    return typeof resolvedByRef === 'object' ? resolvedByRef : schema
  }

  return undefined
}
