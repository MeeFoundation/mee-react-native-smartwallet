import type { ChatMessage, ChatUser } from "../types"

export const mockMeUser: ChatUser = {
  _id: 1,
  name: "Me",
  avatar: "https://picsum.photos/140",
}

export const mockKristinUser: ChatUser = {
  _id: 2,
  name: "Kristin",
  avatar: "https://picsum.photos/140",
}

export const mockBobUser: ChatUser = {
  _id: 3,
  name: "Bob",
}

export const mockChat: ChatMessage[] = [
  {
    text: "Yep, I see",
    user: mockKristinUser,
    _id: "3",
    createdAt: new Date(),
  },
  {
    text: "I'm here too =(",
    user: mockBobUser,
    _id: "3",
    createdAt: new Date(),
  },
  {
    text: "I do, but please check the calendar for everyone’s availability and set the meeting.",
    user: mockMeUser,
    _id: "3",
    createdAt: new Date(),
  },

  {
    text: `I am great. Thank you!
  Do you all have time for a meeting in the afternoon?`,
    user: mockKristinUser,
    _id: "3",
    createdAt: new Date(),
  },

  {
    text: "Ready for a new day?",
    user: mockMeUser,
    _id: "3",
    createdAt: new Date(),
  },

  {
    text: "Hi Kristin! How are you?",
    user: mockMeUser,
    _id: "2",
    createdAt: new Date(),
  },

  {
    text: "☺️",
    user: mockKristinUser,
    _id: "1",
    createdAt: new Date(),
  },
  {
    text: "☺️",
    user: mockKristinUser,
    _id: "1",
    createdAt: new Date(),
  },
  {
    text: "Hey team!",
    user: mockKristinUser,
    _id: "1",
    createdAt: new Date(),
  },
].map((message, index) => ({
  ...message,
  _id: index.toString(),
  createdAt: new Date(Date.now() - index * 1000),
}))
