import { atom } from "jotai"
import { ConnectionsStore } from "./connection"

export const TagsStore = atom(async (get) => {
  const tags: string[] = []
  const connections = await get(ConnectionsStore)
  for (const c of connections) {
    tags.push(...c.tags)
  }
  return Array.from(new Set(tags))
})
