import { IconSources } from "@assets/index"
import { Connection } from "../core.service"

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
      email: { title: "Email", data: "test1@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
    },
    profile: "Family",
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disney,
    name: "Disney Plus",
    tags: [tags.entertainment],
    sharedInfo: {
      email: { title: "Email", data: "test2@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
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
      email: { title: "Email", data: "test3@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
    },
    profile: "Work",
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.google],
    sharedInfo: {
      email: { title: "Email", data: "test4@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
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
      email: { title: "Email", data: "test5@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
      phone: { title: "Phone", data: "+1 054 545 4544", type: "plain-phone" },
    },
    profile: "Private",
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disneyPlus,
    name: "Disney Plus",
    tags: [tags.entertainments],
    sharedInfo: {
      email: { title: "Email", data: "test6@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
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
      email: { title: "Email", data: "test7@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
    },
    profile: "Private",
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.google,
    name: "Google connection",
    tags: [tags.social],
    sharedInfo: {
      email: { title: "Email", data: "test8@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
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
      email: { title: "Email", data: "test9@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
    },
  },
  {
    id: newConnectionId(),
    iconSrc: IconSources.disneyPlus,
    name: "Disney Plus",
    tags: [tags.smths],
    sharedInfo: {
      email: { title: "Email", data: "test10@gmail.com", type: "plain-email" },
      firstName: { title: "First Name", data: "John", type: "plain" },
      lastName: { title: "Last Name", data: "Doe", type: "plain" },
    },
  },
]
