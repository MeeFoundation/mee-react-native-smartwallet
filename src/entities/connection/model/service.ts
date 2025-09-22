import { mockConnections } from "./mock/connections"
import type { Connection } from "./types"

class ConnectionService {
  async getConnectionDetails(id: string): Promise<Connection> {
    const connection = mockConnections.find((c) => c.id === id)

    if (!connection) {
      throw new Error("Connection not found")
    }

    return await Promise.resolve(connection)
  }

  async getConnections(): Promise<Connection[]> {
    return await Promise.resolve(mockConnections)
  }
}

export const connectionService = new ConnectionService()
