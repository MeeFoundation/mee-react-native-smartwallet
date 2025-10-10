import { useCallback } from 'react'

import type { ChatMessagesState } from '@/entities/chat'

type UseLoadEarlierMessagesParams = {
  state: ChatMessagesState
  loadEarlierMessages: (() => Promise<ChatMessagesState>) | undefined
}

export const useLoadEarlierMessages = ({ loadEarlierMessages, state }: UseLoadEarlierMessagesParams) =>
  useCallback(async () => {
    if (state.isLoadingEarlier || !state.hasEarlierMessages) return

    await loadEarlierMessages?.()
  }, [loadEarlierMessages, state.isLoadingEarlier, state.hasEarlierMessages])
