import { SYSTEM_USER } from '../../model/system-user'
import type { ChatMessage, UserJoinChatMessage } from '../../model/types'
import { mockBobUser, mockKristinUser, mockMeUser } from './users'

export const mockTripChatMessages: ChatMessage[] = [
  // Day 1 - Sept 12, 2025
  {
    _id: '1a2b-111',
    createdAt: new Date('2025-09-12T09:05:00'),
    text: 'Hey team! Just checking if we’re still on for the trip.',
    user: mockKristinUser,
  },
  {
    _id: '1a2b-112',
    createdAt: new Date('2025-09-12T09:06:00'),
    text: 'I’ve already packed half my wardrobe 🙈 because apparently, I think we’re moving to the beach, not just visiting.',
    user: mockKristinUser,
  },
  {
    _id: '1a2b-113',
    createdAt: new Date('2025-09-12T09:07:00'),
    text: 'Lol. Don’t forget sunscreen this time.',
    user: mockMeUser,
  },
  {
    _id: '1a2b-114',
    createdAt: new Date('2025-09-12T09:07:30'),
    text: 'Actually, bring two. Last trip you borrowed mine *and* Sam’s.',
    user: mockMeUser,
  },
  {
    _id: '1a2b-123',
    createdAt: new Date('2025-09-12T09:08:00'),
    system: true,
    text: '',
    type: 'user_join_chat',
    user: SYSTEM_USER,
    username: 'Bob',
  } satisfies UserJoinChatMessage,
  {
    _id: '1a2b-115',
    createdAt: new Date('2025-09-12T09:08:01'),
    text: 'Excuse me, I still have tan lines shaped like sunglasses from that disaster.',
    user: mockBobUser,
  },
  {
    _id: '1a2b-116',
    createdAt: new Date('2025-09-12T09:09:00'),
    text: '😂 Ok ok.',
    user: mockKristinUser,
  },
  {
    _id: '1a2b-117',
    createdAt: new Date('2025-09-12T09:09:30'),
    text: 'Btw, here’s the Chairbnb link I found: https://chairbnb.com/rooms/123456789 Looks nice, right?',
    user: mockKristinUser,
  },
  {
    _id: '1a2b-118',
    createdAt: new Date('2025-09-12T09:10:00'),
    text: 'The one with the hammock?? Count me in.',
    user: mockMeUser,
  },
  {
    _id: '1a2b-119',
    createdAt: new Date('2025-09-12T09:10:30'),
    text: 'Wait… is that the one with the “shared goat pasture” warning?',
    user: mockBobUser,
  },
  {
    _id: '1a2b-120',
    createdAt: new Date('2025-09-12T09:11:00'),
    text: '…yes.',
    user: mockKristinUser,
  },
  {
    _id: '1a2b-121',
    createdAt: new Date('2025-09-12T09:12:00'),
    text: 'Ok now I’m officially excited.',
    user: mockBobUser,
  },

  // Day 2 - Sept 13, 2025
  {
    _id: '2b3c-201',
    createdAt: new Date('2025-09-13T08:00:00'),
    text: 'Morninggg 🌞',
    user: mockMeUser,
  },
  {
    _id: '2b3c-202',
    createdAt: new Date('2025-09-13T08:00:30'),
    text: 'Quick question: do we actually have a plan for food, or are we trusting Anna’s “snack magic” again?',
    user: mockMeUser,
  },
  {
    _id: '2b3c-203',
    createdAt: new Date('2025-09-13T08:02:00'),
    text: 'Snack magic worked last time! Kinda.',
    user: mockKristinUser,
  },
  {
    _id: '2b3c-204',
    createdAt: new Date('2025-09-13T08:02:30'),
    text: 'Fine. I’ll order groceries. Do you guys want me to share the shopping list in the group?',
    user: mockKristinUser,
  },
  {
    _id: '2b3c-205',
    createdAt: new Date('2025-09-13T08:03:00'),
    text: 'Yes pls. And don’t forget drinks.',
    user: mockBobUser,
  },
  {
    _id: '2b3c-206',
    createdAt: new Date('2025-09-13T08:03:30'),
    text: 'Add cold brew. And gummy bears.',
    user: mockMeUser,
  },
  {
    _id: '2b3c-207',
    createdAt: new Date('2025-09-13T08:05:00'),
    text: 'Ok added. Sending you the receipt to confirm: anna.trips2025@email.com',
    user: mockKristinUser,
  },
  {
    _id: '2b3c-208',
    createdAt: new Date('2025-09-13T08:05:30'),
    text: 'And Mike, don’t think I didn’t notice you put 6 packs of gummy bears in there.',
    user: mockKristinUser,
  },
  {
    _id: '2b3c-209',
    createdAt: new Date('2025-09-13T08:06:00'),
    text: 'Totally essential. Doctor’s orders.',
    user: mockMeUser,
  },
  {
    _id: '2b3c-210',
    createdAt: new Date('2025-09-13T08:07:00'),
    text: 'Btw, if anyone gets lost: call me at +1 (202) 555-0147.',
    user: mockBobUser,
  },
  {
    _id: '2b3c-211',
    createdAt: new Date('2025-09-13T08:07:30'),
    text: 'Or just follow the sound of me arguing with Google Maps.',
    user: mockBobUser,
  },
  {
    _id: '2b3c-212',
    createdAt: new Date('2025-09-13T08:08:00'),
    text: '😂 noted.',
    user: mockKristinUser,
  },
  {
    _id: '2b3c-213',
    createdAt: new Date('2025-09-13T08:09:00'),
    text: 'Can we leave at 9 AM sharp?',
    user: mockMeUser,
  },
  {
    _id: '2b3c-214',
    createdAt: new Date('2025-09-13T08:09:30'),
    text: 'Sharp-ish. Like… 9:47.',
    user: mockBobUser,
  },
].reverse()
