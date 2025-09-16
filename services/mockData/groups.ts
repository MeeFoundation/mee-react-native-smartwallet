import { IconSources } from "@/assets/index"
import type { Group } from "@/models/group"
import { mockConnections } from "@/services/mockData/connections"

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
    id: newGroupId(),
    status: "active",
    iconSrc: IconSources.disney,
    name: "Disneydasdas",
    connections: mockConnections.slice(0, 2),
  },
  {
    id: newGroupId(),
    status: "active",
    iconSrc: IconSources.disney,
    name: "Disney Plus",
    connections: mockConnections.slice(2, 4),
  },

  // Google tags
  {
    id: newGroupId(),
    status: "active",
    iconSrc: IconSources.google,
    name: "Google connection",
    connections: mockConnections.slice(4, 6),
  },
  {
    id: newGroupId(),
    status: "archived",
    iconSrc: IconSources.google,
    name: "Google connection",
    connections: mockConnections.slice(6, 8),
  },

  // Entertainments tags
  {
    id: newGroupId(),
    status: "active",
    iconSrc: IconSources.disney,
    name: "Disney",
    connections: mockConnections.slice(8, 10),
  },
  {
    id: newGroupId(),
    status: "archived",
    iconSrc: IconSources.disneyPlus,
    name: "Disney Plus",
    connections: [],
  },
] as any
