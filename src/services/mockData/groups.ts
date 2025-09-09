import { IconSources } from "@assets/index"
import type { Group } from "../core.service"
import { mockConnections } from "./connections"

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
    iconSrc: IconSources.disney,
    name: "Disneydasdas",
    connections: mockConnections.slice(0, 2),
  },
  {
    id: newGroupId(),
    iconSrc: IconSources.disney,
    name: "Disney Plus",
    connections: mockConnections.slice(2, 4),
  },

  // Google tags
  {
    id: newGroupId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    connections: mockConnections.slice(4, 6),
  },
  {
    id: newGroupId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    connections: mockConnections.slice(6, 8),
  },

  // Entertainments tags
  {
    id: newGroupId(),
    iconSrc: IconSources.disney,
    name: "Disney",
    connections: mockConnections.slice(8, 10),
  },
  {
    id: newGroupId(),
    iconSrc: IconSources.disneyPlus,
    name: "Disney Plus",
    connections: [],
  },
]
