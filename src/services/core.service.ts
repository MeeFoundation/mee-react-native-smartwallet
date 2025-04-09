import { ImageRequireSource } from "react-native"
import { mockConnections } from "./mockData/connections"

type BasicInfo = {
  email?: string
  firstName: string
  lastName: string
  phone?: string
}

export type SharedInfo = BasicInfo

export type Connection = {
  id: string
  name: string
  sharedInfo: SharedInfo
  tags: string[]
  iconSrc?: ImageRequireSource | string
  profile?: string
  contactInfo?: {
    recordID: string
    platform?: "ios" | "android"
  }
}

class CoreService {
  async getConnectionDetails(id: string) {
    const connection = mockConnections.find((c) => c.id === id)

    if (!connection) {
      throw new Error("Connection not found")
    }

    return connection
  }

  async getConnections() {
    return mockConnections
  }
}

export const coreService = new CoreService()
