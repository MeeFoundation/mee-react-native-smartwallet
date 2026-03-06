import type { UserJoinChatMessage } from '../../model/chat-system-message.types'
import type { Message } from '../../model/types'
import { mockAliceUser, mockCharlieUser, mockDianaUser, mockKristinUser, mockMeUser } from './users'

export const mockProjectChatMessages: Message[] = [
  // Day 1 - Project Kickoff
  {
    createdAt: new Date('2025-01-15T09:00:00').toISOString(),
    id: 'proj-001',
    text: 'Good morning team! Welcome to our new project kickoff meeting 🚀',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:01:00').toISOString(),
    id: 'proj-002',
    text: "Excited to be here! What's the timeline looking like?",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:02:00').toISOString(),
    id: 'proj-003',
    text: "We're aiming for a 3-month delivery. I'll share the roadmap in a bit.",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:03:00').toISOString(),
    id: 'proj-004',
    isSystem: true,
    text: '',
    type: 'user_join_chat',
    username: 'Charlie',
  } satisfies UserJoinChatMessage,
  {
    createdAt: new Date('2025-01-15T09:03:30').toISOString(),
    id: 'proj-005',
    text: "Sorry I'm late! Traffic was insane this morning.",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:04:00').toISOString(),
    id: 'proj-006',
    text: 'No worries! We were just getting started.',
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:05:00').toISOString(),
    id: 'proj-007',
    text: 'So, the main goal is to build a comprehensive dashboard for our analytics platform.',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:06:00').toISOString(),
    id: 'proj-008',
    text: 'Sounds interesting! What tech stack are we using?',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:07:00').toISOString(),
    id: 'proj-009',
    text: "React, TypeScript, and we're considering D3.js for the visualizations.",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:08:00').toISOString(),
    id: 'proj-010',
    text: 'Perfect! I have experience with D3. Happy to lead that part.',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:09:00').toISOString(),
    id: 'proj-011',
    text: "Great! I'll handle the backend API integration.",
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:10:00').toISOString(),
    id: 'proj-012',
    text: "And I'll take care of the UI/UX design and component library.",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-15T09:11:00').toISOString(),
    id: 'proj-013',
    text: "Excellent! Let's set up our first sprint planning for next week.",
    user: mockMeUser,
  } satisfies Message,

  // Day 2 - Technical Discussion
  {
    createdAt: new Date('2025-01-16T10:00:00').toISOString(),
    id: 'proj-014',
    text: "Morning everyone! I've been thinking about the architecture...",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:01:00').toISOString(),
    id: 'proj-015',
    text: 'What are your thoughts on using Redux for state management?',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:02:00').toISOString(),
    id: 'proj-016',
    text: "I'd prefer Zustand actually. It's lighter and more intuitive.",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:03:00').toISOString(),
    id: 'proj-017',
    text: 'Agreed! Zustand is perfect for this project size.',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:04:00').toISOString(),
    id: 'proj-018',
    text: 'Cool, Zustand it is then. What about testing?',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:05:00').toISOString(),
    id: 'proj-019',
    text: 'Jest + React Testing Library for unit tests, and Playwright for E2E.',
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:06:00').toISOString(),
    id: 'proj-020',
    text: "Perfect! I'll set up the testing infrastructure.",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:07:00').toISOString(),
    id: 'proj-021',
    text: 'Also, should we use Tailwind for styling?',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:08:00').toISOString(),
    id: 'proj-022',
    text: 'Yes! Tailwind + Headless UI for components.',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-16T10:09:00').toISOString(),
    id: 'proj-023',
    text: "Awesome! I'll create a design system with Tailwind.",
    user: mockAliceUser,
  } satisfies Message,

  // Day 3 - Design Review
  {
    createdAt: new Date('2025-01-17T14:00:00').toISOString(),
    id: 'proj-024',
    text: "Hey team! I've finished the initial wireframes. Ready for review?",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-17T14:01:00').toISOString(),
    id: 'proj-025',
    text: 'Yes! Please share them.',
    user: mockMeUser,
  } satisfies Message,
  {
    attachments: [
      {
        fileName: 'dashboard-wireframes.pdf',
        fileSize: 2048 * 1024,
        id: 'proj-026-1',
        type: 'file',
        url: 'https://example.com/wireframes.pdf',
      },
      {
        fileName: 'component-library.fig',
        fileSize: 5120 * 1024,
        id: 'proj-026-2',
        type: 'file',
        url: 'https://example.com/components.fig',
      },
    ],
    createdAt: new Date('2025-01-17T14:02:00').toISOString(),
    id: 'proj-026',
    text: 'Here are the wireframes and component library designs',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-17T14:03:00').toISOString(),
    id: 'proj-027',
    text: 'These look fantastic! I love the clean layout.',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-17T14:04:00').toISOString(),
    id: 'proj-028',
    text: 'The color scheme is perfect. Very professional.',
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-17T14:05:00').toISOString(),
    id: 'proj-029',
    text: 'One suggestion: maybe we could add a dark mode toggle?',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-17T14:06:00').toISOString(),
    id: 'proj-030',
    text: "Great idea! I'll add that to the designs.",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-17T14:07:00').toISOString(),
    id: 'proj-031',
    text: 'Also, the mobile responsiveness looks solid.',
    user: mockCharlieUser,
  } satisfies Message,

  // Day 4 - Development Updates
  {
    createdAt: new Date('2025-01-18T09:00:00').toISOString(),
    id: 'proj-032',
    text: "Morning! I've set up the project structure and basic routing.",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T09:01:00').toISOString(),
    id: 'proj-033',
    text: "Nice! I'm working on the API endpoints. Should have them ready by EOD.",
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T09:02:00').toISOString(),
    id: 'proj-034',
    text: "I've started on the first chart component. D3 is behaving well so far.",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T09:03:00').toISOString(),
    id: 'proj-035',
    text: "Perfect! I'm converting the designs to actual components.",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T09:04:00').toISOString(),
    id: 'proj-036',
    text: 'Team is crushing it! 🎉',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T11:30:00').toISOString(),
    id: 'proj-037',
    text: 'Quick question: should we use React Query for data fetching?',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T11:31:00').toISOString(),
    id: 'proj-038',
    text: 'Absolutely! React Query is perfect for this.',
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T11:32:00').toISOString(),
    id: 'proj-039',
    text: "I'll set it up with the API integration.",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T15:00:00').toISOString(),
    id: 'proj-040',
    text: "API endpoints are ready! Here's the documentation: https://docs.example.com/api",
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-18T15:01:00').toISOString(),
    id: 'proj-041',
    text: "Excellent! I'll start integrating them now.",
    user: mockMeUser,
  } satisfies Message,

  // Day 5 - Issues and Solutions
  {
    createdAt: new Date('2025-01-19T10:00:00').toISOString(),
    id: 'proj-042',
    text: "Hey team, I'm running into an issue with the chart animations.",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-19T10:01:00').toISOString(),
    id: 'proj-043',
    text: "What's the problem?",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-19T10:02:00').toISOString(),
    id: 'proj-044',
    text: 'The transitions are stuttering on mobile devices.',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-19T10:03:00').toISOString(),
    id: 'proj-045',
    text: 'Try using CSS transforms instead of D3 transitions for mobile.',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-19T10:04:00').toISOString(),
    id: 'proj-046',
    text: "Good suggestion! I'll try that approach.",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-19T10:05:00').toISOString(),
    id: 'proj-047',
    text: 'Also, make sure to use will-change: transform for better performance.',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-19T10:06:00').toISOString(),
    id: 'proj-048',
    text: 'Will do! Thanks for the tips.',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-19T14:00:00').toISOString(),
    id: 'proj-049',
    text: 'Fixed! The animations are much smoother now.',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-19T14:01:00').toISOString(),
    id: 'proj-050',
    text: 'Awesome! Great problem-solving.',
    user: mockMeUser,
  } satisfies Message,

  // Day 6 - New Team Member
  {
    createdAt: new Date('2025-01-20T09:00:00').toISOString(),
    id: 'proj-051',
    isSystem: true,
    text: '',
    type: 'user_join_chat',
    username: 'Diana',
  } satisfies UserJoinChatMessage,
  {
    createdAt: new Date('2025-01-20T09:01:00').toISOString(),
    id: 'proj-052',
    text: "Hi everyone! I'm Diana, the new QA engineer.",
    user: mockDianaUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-20T09:02:00').toISOString(),
    id: 'proj-053',
    text: 'Welcome Diana! Great to have you on the team.',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-20T09:03:00').toISOString(),
    id: 'proj-054',
    text: "Thanks! I'm excited to work on this project.",
    user: mockDianaUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-20T09:04:00').toISOString(),
    id: 'proj-055',
    text: "I'll set up the testing environment and start writing test cases.",
    user: mockDianaUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-20T09:05:00').toISOString(),
    id: 'proj-056',
    text: 'Perfect! Let me know if you need access to anything.',
    user: mockKristinUser,
  } satisfies Message,

  // Day 7 - Sprint Review
  {
    createdAt: new Date('2025-01-21T15:00:00').toISOString(),
    id: 'proj-057',
    text: "Time for our first sprint review! How's everyone doing?",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-21T15:01:00').toISOString(),
    id: 'proj-058',
    text: "I've completed the main dashboard layout and navigation.",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-21T15:02:00').toISOString(),
    id: 'proj-059',
    text: "Charts are working well. I've implemented 3 different chart types.",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-21T15:03:00').toISOString(),
    id: 'proj-060',
    text: 'API integration is complete. All endpoints are tested and working.',
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-21T15:04:00').toISOString(),
    id: 'proj-061',
    text: "I've written comprehensive test suites for all components.",
    user: mockDianaUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-21T15:05:00').toISOString(),
    id: 'proj-062',
    text: "Amazing work everyone! We're ahead of schedule.",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-21T15:06:00').toISOString(),
    id: 'proj-063',
    text: 'Should we demo what we have so far?',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-21T15:07:00').toISOString(),
    id: 'proj-064',
    text: "Yes! Let's schedule a demo for tomorrow.",
    user: mockMeUser,
  } satisfies Message,

  // Day 8 - Demo Preparation
  {
    createdAt: new Date('2025-01-22T09:00:00').toISOString(),
    id: 'proj-065',
    text: 'Good morning! Demo day! 🎯',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-22T09:01:00').toISOString(),
    id: 'proj-066',
    text: "I've prepared a demo script. Should I share it?",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-22T09:02:00').toISOString(),
    id: 'proj-067',
    text: 'Yes please!',
    user: mockMeUser,
  } satisfies Message,
  {
    attachments: [
      {
        fileName: 'demo-script.md',
        fileSize: 512 * 1024,
        id: 'proj-068-1',
        type: 'file',
        url: 'https://example.com/demo-script.md',
      },
    ],
    createdAt: new Date('2025-01-22T09:03:00').toISOString(),
    id: 'proj-068',
    text: "Here's the demo script with all the key features to showcase",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-22T09:04:00').toISOString(),
    id: 'proj-069',
    text: "Perfect! I'll make sure all the charts are working smoothly.",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-22T09:05:00').toISOString(),
    id: 'proj-070',
    text: "I'll have the staging environment ready with sample data.",
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-22T09:06:00').toISOString(),
    id: 'proj-071',
    text: "And I'll run a final test suite to make sure everything is stable.",
    user: mockDianaUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-22T09:07:00').toISOString(),
    id: 'proj-072',
    text: 'Team is so well coordinated! This demo is going to be great.',
    user: mockMeUser,
  } satisfies Message,

  // Day 9 - Post Demo
  {
    createdAt: new Date('2025-01-23T10:00:00').toISOString(),
    id: 'proj-073',
    text: 'Demo went amazing! Stakeholders were really impressed.',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-23T10:01:00').toISOString(),
    id: 'proj-074',
    text: 'They loved the interactive charts and smooth animations.',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-23T10:02:00').toISOString(),
    id: 'proj-075',
    text: 'Awesome! All that hard work paid off.',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-23T10:03:00').toISOString(),
    id: 'proj-076',
    text: 'They also appreciated the mobile responsiveness.',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-23T10:04:00').toISOString(),
    id: 'proj-077',
    text: "Great feedback! What's next on the roadmap?",
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-23T10:05:00').toISOString(),
    id: 'proj-078',
    text: 'We need to add export functionality and user preferences.',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-23T10:06:00').toISOString(),
    id: 'proj-079',
    text: "I'll start working on the export features.",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-23T10:07:00').toISOString(),
    id: 'proj-080',
    text: "And I'll design the user preferences interface.",
    user: mockAliceUser,
  } satisfies Message,

  // Day 10 - Final Sprint
  {
    createdAt: new Date('2025-01-24T09:00:00').toISOString(),
    id: 'proj-081',
    text: "Final sprint! Let's finish strong 💪",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:01:00').toISOString(),
    id: 'proj-082',
    text: 'Export functionality is working. PDF and CSV formats are ready.',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:02:00').toISOString(),
    id: 'proj-083',
    text: 'User preferences are implemented. Dark mode toggle is working perfectly.',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:03:00').toISOString(),
    id: 'proj-084',
    text: 'API performance optimizations are complete.',
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:04:00').toISOString(),
    id: 'proj-085',
    text: 'All tests are passing. Coverage is at 95%.',
    user: mockDianaUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:05:00').toISOString(),
    id: 'proj-086',
    text: "Incredible work everyone! We're ready for production.",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:06:00').toISOString(),
    id: 'proj-087',
    text: 'This has been such a great project to work on!',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:07:00').toISOString(),
    id: 'proj-088',
    text: 'Agreed! The team collaboration was fantastic.',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:08:00').toISOString(),
    id: 'proj-089',
    text: 'Thanks for having me on the team!',
    user: mockDianaUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:09:00').toISOString(),
    id: 'proj-090',
    text: 'Team dinner to celebrate? 🍕',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:10:00').toISOString(),
    id: 'proj-091',
    text: "Yes! I'm in!",
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:11:00').toISOString(),
    id: 'proj-092',
    text: 'Count me in too!',
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:12:00').toISOString(),
    id: 'proj-093',
    text: 'Me three!',
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:13:00').toISOString(),
    id: 'proj-094',
    text: "Perfect! Let's celebrate this amazing achievement! 🎉",
    user: mockDianaUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:14:00').toISOString(),
    id: 'proj-095',
    text: "Pizza place at 7 PM? I'll make reservations.",
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:15:00').toISOString(),
    id: 'proj-096',
    text: 'Sounds perfect! See you all there!',
    user: mockAliceUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:16:00').toISOString(),
    id: 'proj-097',
    text: "Can't wait! 🍕",
    user: mockCharlieUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:17:00').toISOString(),
    id: 'proj-098',
    text: 'This project was a blast! Thanks everyone!',
    user: mockKristinUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:18:00').toISOString(),
    id: 'proj-099',
    text: 'Best team ever! 🚀',
    user: mockMeUser,
  } satisfies Message,
  {
    createdAt: new Date('2025-01-24T09:19:00').toISOString(),
    id: 'proj-100',
    text: 'Until the next project! 👋',
    user: mockDianaUser,
  } satisfies Message,
].reverse()
