import type { AttributeSchema } from '@/entities/attribute/@x/group'

import mockRequestedAttributesSchema from './mock/mock-requested-attributes.schema.json'

export const getGroupRequestedAttributesSchema = async (_groupId: string): Promise<AttributeSchema> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockRequestedAttributesSchema as AttributeSchema
}
