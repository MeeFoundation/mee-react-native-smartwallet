import { Connection, coreService } from "@services/core.service"
import { atom } from "jotai"
import { atomFamily, atomWithDefault } from "jotai/utils"

export const ConnectionsStore = atomWithDefault<Connection[] | Promise<Connection[]>>(
  async () => await coreService.getConnections(),
)

export const TagsStore = atom(async (get) => {
  const tags: string[] = []
  const connections = await get(ConnectionsStore)
  for (const c of connections) {
    tags.push(...c.tags)
  }
  return Array.from(new Set(tags))
})

export const ConnectionDetails = atomFamily((id: string) =>
  atom(
    async (get) => {
      const connections = await get(ConnectionsStore)
      const connection = connections.find((c) => c.id === id)
      if (!connection) {
        throw new Error("Connection not found")
      }
      return connection
    },
    async (get, set, connection: Connection) => {
      const connections = await get(ConnectionsStore)
      const updatedConnections = connections.map((c) => (c.id === connection.id ? connection : c))
      set(ConnectionsStore, updatedConnections)
    },
  ),
)
