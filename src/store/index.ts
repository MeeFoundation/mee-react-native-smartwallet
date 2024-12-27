import { coreService } from "@services/core.service"
import { atom } from "jotai"

export const ConnectionsStore = atom(async () => {
  const connections = await coreService.getConnections()
  return connections
})

export const TagsStore = atom(async () => {
  const tags = await coreService.getTags()
  return tags
})
