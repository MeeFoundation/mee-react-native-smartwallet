import { ImageRequireSource } from "react-native"
import { mockConnections } from "./mockData/connections"

export const PlainSchemaTypes = [
  "plain",
  "plain-date",
  "plain-email",
  "plain-number",
  "plain-phone",
] as const
export const ArrayPlainSchemaTypes = [
  "array-plain",
  "array-plain-date",
  "array-plain-email",
  "array-plain-number",
  "array-plain-phone",
] as const
export const isPlainSchemaType = (type: string): type is PlainSchema["type"] => {
  return (PlainSchemaTypes as readonly string[]).includes(type)
}
export const isArrayPlainSchemaType = (type: string): type is PlainsArraySchema["type"] => {
  return (ArrayPlainSchemaTypes as readonly string[]).includes(type)
}

export type PlainSchema = {
  title: string
  data?: string
  type: "plain" | "plain-email" | "plain-phone" | "plain-date" | "plain-number"
}

export type PlainsArraySchema = {
  title: string
  data?: string[]
  type:
    | "array-plain"
    | "array-plain-email"
    | "array-plain-phone"
    | "array-plain-date"
    | "array-plain-number"
}

export type NoData<T> = Omit<T, "data">
// type ObjectsArrayOrObjectWithValues<T> = Record<string, T> | Record<string, T>[]

export type NestedDataArray = { [key: string]: string | NestedData }[]
export type NestedData = { [key: string]: string | NestedData } | NestedDataArray
export type NestedSchemaProperty = Record<string, NoData<PlainSchema> | NoData<NestedSchema>>

export type NestedSchema = {
  title: string
  type: "nested"
  data: NestedData
  schema: NestedSchemaProperty | NestedSchemaProperty[]
}

type BasicInfo = Record<string, PlainSchema | NestedSchema | PlainsArraySchema>
// {
//   email: { title: string; data?: string; type: "plain-email" }
//   firstName: { title: string; data?: string; type: "plain" }
//   lastName: { title: string; data?: string; type: "plain" }
//   phone: { title: string; data?: string; type: "plain-phone" }

//   emails?: {
//     title: string
//     data?: Record<string, string>[]
//     type: "array-object"
//     schema: {
//       label: { title: string; type: "plain" }
//       email: { title: string; type: "plain-email" }
//     }
//   }
//   phones?: {
//     title: string
//     data?: Record<string, string>[]
//     type: "array-object"
//     schema: {
//       label: { title: string; type: "plain" }
//       number: { title: string; type: "plain-phone" }
//     }
//   }

//   addresses?: {
//     title: string
//     data?: Record<string, string>[]
//     type: "array-object"
//     schema: Record<string, PlainSchemaWithoutData>
//   }

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
