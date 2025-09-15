import { IconSources } from "@/assets/index"
import type { Connection } from "@/models/connection"

const idGenerator = () => {
  let lastId = 0

  return () => {
    lastId += 1
    return lastId.toString()
  }
}

const newConnectionId = idGenerator()

const tags = {
  entertainment: "Entertainment",
  entertainments: "Entertainments",
  google: "Google",
  social: "Social",
  smths: "Smths",
  group: "Group",
}
export const mockConnections: Connection[] = [
  // Entertainment tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disneydasdas",
    tags: [tags.entertainment, tags.group],
    sharedInfo: {
      email: "test1@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
    profile: "Family",
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disney Plus",
    tags: [tags.entertainment],
    sharedInfo: {
      email: "test2@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
    profile: "Family",
  },

  // Google tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.google],
    sharedInfo: {
      email: "test3@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
    profile: "Work",
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.google],
    sharedInfo: {
      email: "test4@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
    profile: "Work",
  },

  // Entertainments tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disney",
    tags: [tags.entertainments],
    sharedInfo: {
      email: "test5@gmail.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+1 054 545 4544",
    },
    profile: "Private",
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disneyPlus,
    name: "Disney Plus",
    tags: [tags.entertainments],
    sharedInfo: {
      email: "test6@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
    profile: "Private",
  },

  // Social tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.social],
    sharedInfo: {
      email: "test7@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
    profile: "Private",
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.social],
    sharedInfo: {
      email: "test8@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
    profile: "Private",
  },

  // Smths tags
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disney",
    tags: [tags.smths],
    sharedInfo: {
      email: "test9@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disneyPlus,
    name: "Disney Plus",
    tags: [tags.smths],
    sharedInfo: {
      email: "test10@gmail.com",
      firstName: "John",
      lastName: "Doe",
    },
  },
]
