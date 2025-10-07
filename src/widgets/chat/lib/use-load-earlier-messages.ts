import type { FlashListRef } from '@shopify/flash-list'
import type { RefObject } from 'react'
import { useCallback } from 'react'

import type { ChatMessagesState, Message } from '@/entities/chat'

type UseLoadEarlierMessagesParams = {
  state: ChatMessagesState
  listRef: RefObject<FlashListRef<Message> | null>
  scrollLockedRef: RefObject<boolean>
  loadEarlierMessages: (() => Promise<ChatMessagesState>) | undefined
}

export const useLoadEarlierMessages = ({
  loadEarlierMessages,
  state,
  listRef,
  scrollLockedRef,
}: UseLoadEarlierMessagesParams) =>
  useCallback(async () => {
    if (state.isLoadingEarlier || !state.hasEarlierMessages) return

    const currentScroll = listRef.current?.getAbsoluteLastScrollOffset()
    const dimentions = listRef.current?.getChildContainerDimensions()
    const windowSize = listRef.current?.getWindowSize()

    const delta =
      dimentions === undefined || windowSize === undefined || currentScroll === undefined
        ? undefined
        : dimentions.height - windowSize.height - currentScroll
    const lastItem = state.messages.at(-1)
    await loadEarlierMessages?.()

    if (lastItem && delta && delta > 10 && !scrollLockedRef.current) {
      setTimeout(() => listRef.current?.scrollToItem({ item: lastItem, viewOffset: -150, viewPosition: 0 }))
    }
  }, [loadEarlierMessages, state.messages, state.isLoadingEarlier, state.hasEarlierMessages, listRef, scrollLockedRef])
