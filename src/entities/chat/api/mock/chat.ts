import type { Message } from '../../model/types'
import { mockBobUser, mockKristinUser, mockMeUser } from './users'

export const mockChat: Message[] = [
  {
    createdAt: new Date(),
    id: '2',
    text: "Ok, I'll text you: test@test.com\nor call you: +1234567890\nor visit your website: www.test.com",
    user: mockMeUser,
  },
  {
    createdAt: new Date(),
    id: '3',
    text: 'Text me: test@test.com\nor call me: +1234567890\nor visit my website: www.test.com',
    user: mockKristinUser,
  },
  {
    createdAt: new Date(),
    id: '3',
    text: 'Yep, I see',
    user: mockKristinUser,
  },
  {
    createdAt: new Date(),
    id: '3',
    text: "I'm here too =(",
    user: mockBobUser,
  },
  {
    createdAt: new Date(),
    id: '3',
    text: 'I do, but please check the calendar for everyone’s availability and set the meeting.',
    user: mockMeUser,
  },

  {
    createdAt: new Date(),
    id: '3',
    text: `I am great. Thank you!
  Do you all have time for a meeting in the afternoon?`,
    user: mockKristinUser,
  },

  {
    createdAt: new Date(),
    id: '3',
    text: 'Ready for a new day?',
    user: mockMeUser,
  },

  {
    createdAt: new Date(),
    id: '2',
    text: 'Hi Kristin! How are you?',
    user: mockMeUser,
  },

  {
    createdAt: new Date(),
    id: '1',
    text: '☺️',
    user: mockKristinUser,
  },
  {
    createdAt: new Date(),
    id: '1',
    text: '☺️',
    user: mockKristinUser,
  },
  {
    createdAt: new Date(),
    id: '1',
    text: 'Hey team!',
    user: mockKristinUser,
  },
].map((message, index) => ({
  ...message,
  createdAt: new Date(Date.now() - index * 1000).toISOString(),
  id: index.toString(),
  sent: true,
}))
