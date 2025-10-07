import type { FlashListRef } from '@shopify/flash-list'
import type { RefObject } from 'react'
import { useCallback } from 'react'

import type { ChatMessagesState, Message } from '@/entities/chat'

type UseLoadNewerMessagesParams = {
  state: ChatMessagesState
  listRef: RefObject<FlashListRef<Message> | null>
  scrollLockedRef: RefObject<boolean>
  loadNewerMessages: (() => Promise<ChatMessagesState>) | undefined
}

export const useLoadNewerMessages = ({
  listRef,
  scrollLockedRef,
  loadNewerMessages,
  state,
}: UseLoadNewerMessagesParams) =>
  useCallback(async () => {
    if (state.isLoadingNewer || !state.hasNewerMessages) return

    const preventAnimation = scrollLockedRef.current
    await loadNewerMessages?.()

    const currentScroll = listRef.current?.getAbsoluteLastScrollOffset()

    setTimeout(() => {
      if (currentScroll === undefined) return
      if (preventAnimation) return

      listRef.current?.scrollToOffset({ animated: true, offset: currentScroll + 100, viewPosition: 0 })
    }, 100)
  }, [loadNewerMessages, state.isLoadingNewer, state.hasNewerMessages, listRef, scrollLockedRef])
