import type { GetChatMessagesFetchParams, GetChatMessagesPaginatedListResponse } from '../model/types'
import { mockChat } from './mock/chat'

export const getGroupChatMessages = async (
  _params: GetChatMessagesFetchParams,
): Promise<GetChatMessagesPaginatedListResponse> => {
  // FIXME Remove delay simulating the API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { items: mockChat, nextIndex: null, totalCount: mockChat.length }
}
