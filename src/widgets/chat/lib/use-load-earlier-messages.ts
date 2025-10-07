import type { FlashListRef } from '@shopify/flash-list'
import type { RefObject } from 'react'
import { useCallback } from 'react'

import type { Message } from '@/entities/chat'

type UseLoadEarlierMessagesParams = {
  messages: Message[]
  isLoadingEarlier: boolean
  hasEarlierMessages: boolean
  listRef: RefObject<FlashListRef<Message> | null>
  scrollLockedRef: RefObject<boolean>
  loadEarlierMessages: (() => Promise<void>) | undefined
}

export const useLoadEarlierMessages = ({
  loadEarlierMessages,
  messages,
  isLoadingEarlier,
  hasEarlierMessages,
  listRef,
  scrollLockedRef,
}: UseLoadEarlierMessagesParams) =>
  useCallback(async () => {
    if (isLoadingEarlier || !hasEarlierMessages) return

    const currentScroll = listRef.current?.getAbsoluteLastScrollOffset()
    const dimentions = listRef.current?.getChildContainerDimensions()
    const windowSize = listRef.current?.getWindowSize()

    const delta =
      dimentions === undefined || windowSize === undefined || currentScroll === undefined
        ? undefined
        : dimentions.height - windowSize.height - currentScroll
    const lastItem = messages.at(-1)
    await loadEarlierMessages?.()

    if (lastItem && delta && delta > 10 && !scrollLockedRef.current) {
      setTimeout(() => listRef.current?.scrollToItem({ item: lastItem, viewOffset: -150, viewPosition: 0 }))
    }
  }, [loadEarlierMessages, messages, isLoadingEarlier, hasEarlierMessages, listRef, scrollLockedRef])
