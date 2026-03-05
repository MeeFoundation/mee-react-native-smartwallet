import type { AttributeSchema } from '../model/types'
import definitionsSchema from './mock/definitions.schema.json'

export const getAttributeDefinitions = async (): Promise<AttributeSchema> => {
  await new Promise((resolve) => setTimeout(resolve, 10))
  return definitionsSchema
}
