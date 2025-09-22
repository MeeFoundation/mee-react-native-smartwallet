import { ConnectionsStore } from "@/entities/connection/@x/profile"
import { atom } from "jotai"

export const ProfileStore = atom(async (get) => {
  const connections = await get(ConnectionsStore)
  const profiles: { title: string; count: number }[] = [
    { title: "All profiles", count: connections.length },
  ]
  const profilesObject: {
    [key: string]: number
  } = {}
  for (const c of connections) {
    const profile = c.profile ?? "Unspecified"
    if (!profilesObject[profile]) {
      profilesObject[profile] = 0
    }
    ++profilesObject[profile]
  }

  Object.keys(profilesObject).map((profile) => {
    profiles.push({ title: profile, count: profilesObject[profile] })
  })

  return Array.from(new Set(profiles))
})
