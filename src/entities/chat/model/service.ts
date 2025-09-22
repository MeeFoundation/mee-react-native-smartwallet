import { mockChat } from "./mock/chat"
import type {
  ChatMessage,
  GetChatMessagesPaginatedListFetchParams,
  GetChatMessagesPaginatedListResponse,
} from "./types"

class ChatService {
  #mockChats = new Map<string, ChatMessage[]>()

  async getGroupMessages(
    params: GetChatMessagesPaginatedListFetchParams,
  ): Promise<GetChatMessagesPaginatedListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const chat = this.#mockChats.get(params.groupId)
    if (chat)
      return {
        items: chat.slice(params.startIndex, params.startIndex + params.limit),
        nextIndex:
          chat.length > params.startIndex + params.limit ? params.startIndex + params.limit : null,
        totalCount: chat.length,
      }

    const newChat: ChatMessage[] = mockChat
    this.#mockChats.set(params.groupId, newChat)
    return { items: newChat, nextIndex: null, totalCount: newChat.length }
  }

  async sendMessage(groupId: string, message: ChatMessage | ChatMessage[]): Promise<null> {
    const chat = this.#mockChats.get(groupId) ?? []
    chat.push(...[message].flat())
    this.#mockChats.set(groupId, chat)
    return null
  }
}

export const chatService = new ChatService()
