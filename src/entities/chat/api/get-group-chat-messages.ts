import type { GetChatMessagesPaginatedListFetchParams, GetChatMessagesPaginatedListResponse } from '../model/types'
import { mockChat } from './mock/chat'
import { mockTripChatMessages } from './mock/trip'

export const getGroupChatMessages = async (
  params: GetChatMessagesPaginatedListFetchParams,
): Promise<GetChatMessagesPaginatedListResponse> => {
  // FIXME Remove delay simulating the API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const mockItems = params.groupId === '1' ? mockTripChatMessages : mockChat
  const items = mockItems.slice(params.startIndex, params.startIndex + params.limit)
  return {
    items,
    nextIndex: params.startIndex + params.limit > mockItems.length ? null : params.startIndex + params.limit,
    totalCount: mockItems.length,
  }
}
