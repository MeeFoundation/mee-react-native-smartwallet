import type { InferAttributeValue } from '@/entities/attribute/@x/group'

import type { mockRequestedAttributesSchema } from './mock-requested-attributes-schema'

export const mockMyGroupPersonalDetails: InferAttributeValue<typeof mockRequestedAttributesSchema> = {
  display_name: 'Jane Doe',
  email: 'jane@example.com',
  first_name: 'Jane',
  last_name: '',
  phone: '',
  date_of_birth: '1990-06-15',
  age: 34,
  preferred_language: 'english',
  interests: ['music', 'travel'],
  address: {
    address_country: 'US',
    address_street: '123 Main St',
    address_postal_code: '10001',
  },
}
