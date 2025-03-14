import { Connection, coreService } from "@services/core.service"
import { atom } from "jotai"
import { atomFamily, atomWithDefault } from "jotai/utils"
import { atomWithMMKV } from "./atomWithMMKV"

export const ConnectionsStore = atomWithDefault<Connection[] | Promise<Connection[]>>(
  async () => await coreService.getConnections(),
)

export const ContactsStore = atom<
  | { data?: { ios?: Connection[]; android?: Connection[] }; error?: string }
  | Promise<{ data?: { ios?: Connection[]; android?: Connection[] }; error?: string }>
>({ data: undefined, error: undefined })

export const TagsStore = atom(async (get) => {
  const tags: string[] = []
  const connections = await get(ConnectionsStore)
  for (const c of connections) {
    tags.push(...c.tags)
  }
  return Array.from(new Set(tags))
})

export const ProfileStore = atom(async (get) => {
  const connections = await get(ConnectionsStore)
  const profiles: { title: string; count: number }[] = [
    { title: "All profiles", count: connections.length },
  ]
  const profilesObject: {
    [key: string]: number
  } = {}
  for (const c of connections) {
    const profile = c.profile || "Unspecified"
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

export const ConnectionDetails = atomFamily((id: string) =>
  atom(
    async (get) => {
      const connections = await get(ConnectionsStore)
      const connection = connections.find((c) => c.id === id)
      if (!connection) {
        console.error(`Connection with id ${id} not found`)
      }
      return connection!
    },
    async (get, set, connection: Connection) => {
      const connections = await get(ConnectionsStore)
      const updatedConnections = connections.map((c) => (c.id === connection.id ? connection : c))
      set(ConnectionsStore, updatedConnections)
    },
  ),
)

export const isWelcomeViewedAtom = atomWithMMKV("isWelcomeViewed", false)

export const isFirstTimeAuthState = atomWithMMKV("firstTimeAuth", true)

export const isAuthenticatedState = atom(false)
