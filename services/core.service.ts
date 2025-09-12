import { mockConnections } from "@/services/mockData/connections"
import type { ImageRequireSource } from "react-native"

type BasicInfo = {
  email?: string
  firstName: string
  lastName: string
  phone?: string
  emails?: { key: string; value: string }[]
  phones?: { key: string; value: string }[]
  addresses?: Record<string, string>[]
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

    return await Promise.resolve(connection)
  }

  async getConnections() {
    return await Promise.resolve(mockConnections)
  }
}

export const coreService = new CoreService()
