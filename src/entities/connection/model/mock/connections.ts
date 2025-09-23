import { IconSources } from '@/assets/images'

import type { Connection } from '../types'

const idGenerator = () => {
  let lastId = 0

  return () => {
    lastId += 1
    return lastId.toString()
  }
}

const newConnectionId = idGenerator()

const tags = {
  entertainment: 'Entertainment',
  entertainments: 'Entertainments',
  google: 'Google',
  group: 'Group',
  smths: 'Smths',
  social: 'Social',
}
export const mockConnections: Connection[] = [
  // Entertainment tags
  {
    iconSrc: IconSources.disney,
    id: newConnectionId(),
    name: 'Disneydasdas',
    profile: 'Family',
    sharedInfo: {
      email: 'test1@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.entertainment, tags.group],
  },
  {
    iconSrc: IconSources.disney,
    id: newConnectionId(),
    name: 'Disney Plus',
    profile: 'Family',
    sharedInfo: {
      email: 'test2@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.entertainment],
  },

  // Google tags
  {
    iconSrc: IconSources.google,
    id: newConnectionId(),
    name: 'Google connection',
    profile: 'Work',
    sharedInfo: {
      email: 'test3@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.google],
  },
  {
    iconSrc: IconSources.google,
    id: newConnectionId(),
    name: 'Google connection',
    profile: 'Work',
    sharedInfo: {
      email: 'test4@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.google],
  },

  // Entertainments tags
  {
    iconSrc: IconSources.disney,
    id: newConnectionId(),
    name: 'Disney',
    profile: 'Private',
    sharedInfo: {
      email: 'test5@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 054 545 4544',
    },
    status: 'active',
    tags: [tags.entertainments],
  },
  {
    iconSrc: IconSources.disneyPlus,
    id: newConnectionId(),
    name: 'Disney Plus',
    profile: 'Private',
    sharedInfo: {
      email: 'test6@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.entertainments],
  },

  // Social tags
  {
    iconSrc: IconSources.google,
    id: newConnectionId(),
    name: 'Google connection',
    profile: 'Private',
    sharedInfo: {
      email: 'test7@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.social],
  },
  {
    iconSrc: IconSources.google,
    id: newConnectionId(),
    name: 'Google connection',
    profile: 'Private',
    sharedInfo: {
      email: 'test8@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.social],
  },

  // Smths tags
  {
    iconSrc: IconSources.disney,
    id: newConnectionId(),
    name: 'Disney',
    sharedInfo: {
      email: 'test9@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.smths],
  },
  {
    iconSrc: IconSources.disneyPlus,
    id: newConnectionId(),
    name: 'Disney Plus',
    sharedInfo: {
      email: 'test10@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    status: 'active',
    tags: [tags.smths],
  },
]
