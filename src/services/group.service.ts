import { Connection } from "./core.service"
import { mockConnections } from "./mockData/connections"
import { mockGroups } from "./mockData/groups"

export type Group = {
  id: string
  connections: Connection[]
  name: string
}

class GroupService {
  async getGroupDetails(id: string) {
    const connection = mockConnections.find((c) => c.id === id)

    if (!connection) {
      throw new Error("Connection not found")
    }

    return connection
  }

  async getGroups() {
    return mockGroups
  }
}

export const groupService = new GroupService()
