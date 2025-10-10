import { useCallback } from 'react'

import type { ChatMessagesState } from '@/entities/chat'

type UseLoadNewerMessagesParams = {
  state: ChatMessagesState
  loadNewerMessages: (() => Promise<ChatMessagesState>) | undefined
}

export const useLoadNewerMessages = ({ loadNewerMessages, state }: UseLoadNewerMessagesParams) =>
  useCallback(async () => {
    if (state.isLoadingNewer || !state.hasNewerMessages) return

    await loadNewerMessages?.()
  }, [loadNewerMessages, state.isLoadingNewer, state.hasNewerMessages])
