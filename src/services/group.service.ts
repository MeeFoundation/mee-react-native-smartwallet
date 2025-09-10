import { ImageRequireSource } from "react-native"
import { Connection } from "./core.service"
import { mockConnections } from "./mockData/connections"
import { mockGroups } from "./mockData/groups"

export type Group = {
  id: string
  name: string
  status: "active" | "archived"
  iconSrc?: ImageRequireSource | string
  connections: Connection[]
}

export type GroupFilter = {
  status: Group["status"] | null
}

export const defaultGroupFilter: GroupFilter = {
  status: "active",
}

export const emptyGroupFilter: GroupFilter = {
  status: null,
}

export const filterGroups = (groups: Group[], filter: GroupFilter) => {
  const filterStatus = (group: Group) =>
    filter.status === null ? true : group.status === filter.status

  return groups.filter(filterStatus)
}

class GroupService {
  async getGroupDetails(id: string) {
    const connection = mockConnections.find((c) => c.id === id)
    if (!connection) {
      throw new Error("Group not found")
    }

    return connection
  }

  async getGroups() {
    return mockGroups
  }
}

export const groupService = new GroupService()
