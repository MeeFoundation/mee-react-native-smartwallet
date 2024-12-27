import { IconSources } from "@assets/index"
import { ImageRequireSource } from "react-native"

const idGenerator = () => {
  let lastId = Date.now()

  return () => {
    lastId += 1
    return lastId.toString()
  }
}

const newConnectionId = idGenerator()

type BasicInfo = {
  email: string
  firstName: string
  lastName: string
}

type SharedInfo = BasicInfo

export type Connection = {
  id: string
  name: string
  sharedInfo: SharedInfo
  tags: string[]
  iconSrc?: ImageRequireSource
}

const exampleInfo: BasicInfo = {
  email: "test@gmail.com",
  firstName: "John",
  lastName: "Doe",
}

const tags = {
  entertainment: "Entertainment",
  entertainments: "Entertainments",
  google: "Google",
  social: "Social",
  smths: "Smths",
  group: "Group",
}

const connections: Connection[] = [
  // Entertainment tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disneydasdas",
    tags: [tags.entertainment, tags.group],
    sharedInfo: exampleInfo,
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disney Plus",
    tags: [tags.entertainment],
    sharedInfo: exampleInfo,
  },

  // Google tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.google],
    sharedInfo: exampleInfo,
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.google],
    sharedInfo: exampleInfo,
  },

  // Entertainments tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disney",
    tags: [tags.entertainments],
    sharedInfo: exampleInfo,
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disneyPlus,
    name: "Disney Plus",
    tags: [tags.entertainments],
    sharedInfo: exampleInfo,
  },

  // Social tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.social],
    sharedInfo: exampleInfo,
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.social],
    sharedInfo: exampleInfo,
  },

  // Smths tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disney",
    tags: [tags.smths],
    sharedInfo: exampleInfo,
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disneyPlus,
    name: "Disney Plus",
    tags: [tags.smths],
    sharedInfo: exampleInfo,
  },
]

class CoreService {
  async getConnectionDetails(id: string) {
    const connection = connections.find((c) => c.id === id)

    if (!connection) {
      throw new Error("Connection not found")
    }

    return connection
  }

  async getConnections() {
    return connections
  }
}

export const coreService = new CoreService()
