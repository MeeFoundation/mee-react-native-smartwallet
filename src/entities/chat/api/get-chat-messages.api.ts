import type { Message } from '@/entities/chat'

import { mockTripChatMessages } from './mock/trip'

type GetChatMessagesFetchParams = {
  // FIXME there must be no group in common chat
  groupId: string
  anchorId?: string
  beforeId?: string
  afterId?: string
  limit: number
}

type GetChatMessagesResponse = {
  messages: Message[]
  hasNewerMessages?: boolean
  hasEarlierMessages?: boolean
}

export const getChatMessagesApi = async (params: GetChatMessagesFetchParams): Promise<GetChatMessagesResponse> => {
  const mockMessages = mockTripChatMessages

  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (params.beforeId === undefined && params.afterId === undefined && !params.anchorId) {
    return {
      hasEarlierMessages: mockMessages.length > params.limit,
      hasNewerMessages: false,
      messages: mockMessages.slice(0, params.limit),
    }
  }

  if (params.beforeId !== undefined && params.afterId === undefined) {
    const currentIndex = mockMessages.findIndex((item) => item.id === params.beforeId)
    const hasEarlierMessages = currentIndex + params.limit < mockMessages.length

    return {
      hasEarlierMessages,
      messages: mockMessages.slice(currentIndex + 1, currentIndex + params.limit),
    }
  }

  if (params.afterId !== undefined && params.beforeId === undefined) {
    const currentIndex = mockMessages.findIndex((item) => item.id === params.afterId)
    const hasNewerMessages = currentIndex > 0

    return {
      hasNewerMessages,
      messages: mockMessages.slice(Math.max(0, currentIndex - params.limit), currentIndex),
    }
  }

  if (params.anchorId) {
    const anchorIndex = mockMessages.findIndex((item) => item.id === params.anchorId)
    if (anchorIndex !== -1) {
      const startIndex = Math.max(anchorIndex - Math.floor(params.limit / 2), 0)
      const endIndex = Math.min(anchorIndex + Math.floor(params.limit / 2), mockMessages.length)
      const messages = mockMessages.slice(startIndex, endIndex)

      return {
        hasEarlierMessages: endIndex < mockMessages.length,
        hasNewerMessages: startIndex > 0,
        messages,
      }
    }
  }

  return {
    hasEarlierMessages: false,
    hasNewerMessages: false,
    messages: [],
  }
}
