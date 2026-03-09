import type { ObjectAttributeSchema } from '@/entities/attribute/@x/group'

export const mockRequestedAttributesSchema = {
  type: 'object',
  properties: {
    display_name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    status: { type: 'string' },
    address: {
      type: 'object',
      properties: {
        address_country: { type: 'string' },
        address_description: { type: 'string' },
        address_locality: { type: 'string' },
        address_postal_code: { type: 'string' },
        address_region: { type: 'string' },
        address_street: { type: 'string' },
      },
    },
  },
  required: ['display_name', 'email'],
} satisfies ObjectAttributeSchema
