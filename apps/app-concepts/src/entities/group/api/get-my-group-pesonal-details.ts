import type { InferAttributeValue } from '@/entities/attribute/@x/group'

import { mockMyGroupPersonalDetails } from './mock/mock-my-group-personal-details'
import type { mockRequestedAttributesSchema } from './mock/mock-requested-attributes-schema'

export const getMyGroupPersonalDetails = async (
  _groupId: string,
): Promise<InferAttributeValue<typeof mockRequestedAttributesSchema>> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockMyGroupPersonalDetails
}
