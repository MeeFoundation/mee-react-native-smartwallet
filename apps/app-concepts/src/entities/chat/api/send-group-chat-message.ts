import type { SendChatMessageFetchParams } from '../model/types'

// TODO Maybe add status result?
export const sendGroupChatMessage = async (_params: SendChatMessageFetchParams): Promise<null> => {
  // FIXME Remove delay simulating the API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return null
}
