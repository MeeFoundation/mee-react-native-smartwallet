import { Connection } from "@services/core.service"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"

export const ConnectionsStore = atom<Connection[]>([])

export const TagsStore = atom((get) => {
  const tags: string[] = []
  const connections = get(ConnectionsStore)
  for (const c of connections) {
    tags.push(...c.tags)
  }
  return Array.from(new Set(tags))
})

export const ConnectionDetails = atomFamily((id: string) =>
  atom(async (get) => {
    const connections = get(ConnectionsStore)
    const connection = connections.find((c) => c.id === id)
    if (!connection) {
      console.error(`Connection with id ${id} not found`)
    }
    return connection!
  }),
)
