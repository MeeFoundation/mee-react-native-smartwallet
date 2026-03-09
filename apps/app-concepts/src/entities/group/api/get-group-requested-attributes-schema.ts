import type { ObjectAttributeSchema } from '@/entities/attribute/@x/group'

import { mockRequestedAttributesSchema } from './mock/mock-requested-attributes-schema'

export const getGroupRequestedAttributesSchema = async (_groupId: string): Promise<ObjectAttributeSchema> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockRequestedAttributesSchema
}
