import { atom } from 'jotai'

import { ConnectionsStore } from '@/entities/connection/@x/profile'

export const ProfileStore = atom(async (get) => {
  const connections = await get(ConnectionsStore)
  const profiles: { title: string; count: number }[] = [{ count: connections.length, title: 'All profiles' }]
  const profilesObject: {
    [key: string]: number
  } = {}
  for (const c of connections) {
    const profile = c.profile ?? 'Unspecified'
    if (!profilesObject[profile]) {
      profilesObject[profile] = 0
    }
    ++profilesObject[profile]
  }

  Object.keys(profilesObject).forEach((profile) => {
    profiles.push({ count: profilesObject[profile], title: profile })
  })

  return Array.from(new Set(profiles))
})
