import type { ChatMessage } from '../../model/types'
import { mockBobUser, mockKristinUser, mockMeUser } from './users'

export const mockChat: ChatMessage[] = [
  {
    _id: '2',
    createdAt: new Date(),
    text: "Ok, I'll text you: test@test.com\nor call you: +1234567890\nor visit your website: www.test.com",
    user: mockMeUser,
  },
  {
    _id: '3',
    createdAt: new Date(),
    text: 'Text me: test@test.com\nor call me: +1234567890\nor visit my website: www.test.com',
    user: mockKristinUser,
  },
  {
    _id: '3',
    createdAt: new Date(),
    text: 'Yep, I see',
    user: mockKristinUser,
  },
  {
    _id: '3',
    createdAt: new Date(),
    text: "I'm here too =(",
    user: mockBobUser,
  },
  {
    _id: '3',
    createdAt: new Date(),
    text: 'I do, but please check the calendar for everyone’s availability and set the meeting.',
    user: mockMeUser,
  },

  {
    _id: '3',
    createdAt: new Date(),
    text: `I am great. Thank you!
  Do you all have time for a meeting in the afternoon?`,
    user: mockKristinUser,
  },

  {
    _id: '3',
    createdAt: new Date(),
    text: 'Ready for a new day?',
    user: mockMeUser,
  },

  {
    _id: '2',
    createdAt: new Date(),
    text: 'Hi Kristin! How are you?',
    user: mockMeUser,
  },

  {
    _id: '1',
    createdAt: new Date(),
    text: '☺️',
    user: mockKristinUser,
  },
  {
    _id: '1',
    createdAt: new Date(),
    text: '☺️',
    user: mockKristinUser,
  },
  {
    _id: '1',
    createdAt: new Date(),
    text: 'Hey team!',
    user: mockKristinUser,
  },
].map((message, index) => ({
  ...message,
  _id: index.toString(),
  createdAt: new Date(Date.now() - index * 1000),
  sent: true,
}))
