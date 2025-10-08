import { IconSources } from '@/assets/images'

import { mockConnections } from '@/entities/connection/@x/group'

import type { Group } from '../types'
import mockGroupSchema from './mock-group.schema.json'

export const mockGroups: Group[] = [
  {
    _short: false,
    attributes: {
      chat: true,
      name: 'Disney',
      status: 'active',
      thumbnail: IconSources.disney,
    },
    connections: mockConnections.slice(0, 2),
    id: '1',
    schema: mockGroupSchema,
  },
  {
    _short: false,
    attributes: {
      name: 'Disney Plus',
      status: 'active',
      thumbnail: IconSources.disneyPlus,
    },
    connections: mockConnections.slice(2, 4),
    id: '2',
    schema: mockGroupSchema,
  },

  // Google tags
  {
    _short: false,
    attributes: {
      chat: true,
      name: 'Google connection',
      status: 'active',
      thumbnail: IconSources.google,
    },
    connections: mockConnections.slice(4, 6),
    id: '3',
    schema: mockGroupSchema,
  },
  {
    _short: false,
    attributes: {
      name: 'Google connection',
      status: 'archived',
      thumbnail: IconSources.google,
    },
    connections: mockConnections.slice(6, 8),
    id: '4',
    schema: mockGroupSchema,
  },

  // Entertainments tags
  {
    _short: false,
    attributes: {
      name: 'Disney',
      status: 'active',
      thumbnail: IconSources.disney,
    },
    connections: mockConnections.slice(8, 10),
    id: '5',
    schema: mockGroupSchema,
  },
  {
    _short: false,
    attributes: {
      name: 'Disney Plus',
      status: 'archived',
      thumbnail: IconSources.disneyPlus,
    },
    connections: [],
    id: '6',
    schema: mockGroupSchema,
  },
]
