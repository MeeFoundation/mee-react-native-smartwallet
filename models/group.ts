import type { Connection } from "@/models/connection"
import type { ImageRequireSource } from "react-native"

export type Group = {
  id: string
  name: string
  status: "active" | "archived"
  iconSrc?: ImageRequireSource | string
  connections: Connection[]
}
