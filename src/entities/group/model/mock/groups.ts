import { IconSources } from '@/assets/images'

import { mockConnections } from '@/entities/connection/@x/group'

import type { Group } from '../types'

const idGenerator = () => {
  let lastId = 0

  return () => {
    lastId += 1
    return lastId.toString()
  }
}

const newGroupId = idGenerator()

export const mockGroups: Group[] = [
  {
    connections: mockConnections.slice(0, 2),
    iconSrc: IconSources.disney,
    id: newGroupId(),
    name: 'Disneydasdas',
    status: 'active',
  },
  {
    connections: mockConnections.slice(2, 4),
    iconSrc: IconSources.disney,
    id: newGroupId(),
    name: 'Disney Plus',
    status: 'active',
  },

  // Google tags
  {
    connections: mockConnections.slice(4, 6),
    iconSrc: IconSources.google,
    id: newGroupId(),
    name: 'Google connection',
    status: 'active',
  },
  {
    connections: mockConnections.slice(6, 8),
    iconSrc: IconSources.google,
    id: newGroupId(),
    name: 'Google connection',
    status: 'archived',
  },

  // Entertainments tags
  {
    connections: mockConnections.slice(8, 10),
    iconSrc: IconSources.disney,
    id: newGroupId(),
    name: 'Disney',
    status: 'active',
  },
  {
    connections: [],
    iconSrc: IconSources.disneyPlus,
    id: newGroupId(),
    name: 'Disney Plus',
    status: 'archived',
  },
]
