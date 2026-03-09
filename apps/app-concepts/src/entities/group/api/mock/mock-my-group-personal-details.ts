import type { InferAttributeValue } from '@/entities/attribute/@x/group'

import type { mockRequestedAttributesSchema } from './mock-requested-attributes-schema'

export const mockMyGroupPersonalDetails: InferAttributeValue<typeof mockRequestedAttributesSchema> = {
  display_name: 'Jane Doe',
  email: 'jane@example.com',
  first_name: 'Jane',
  last_name: 'Doe',
  status: 'active',
  address: {
    address_country: 'US',
    address_locality: 'New York',
    address_street: '123 Main St',
    address_postal_code: '10001',
    address_region: 'NY',
    address_description: '',
  },
}
