import type { FlashListRef } from '@shopify/flash-list'
import type { RefObject } from 'react'
import { useCallback } from 'react'

import type { Message } from '@/entities/chat'

type UseLoadNewerMessagesParams = {
  isLoadingNewer: boolean
  hasNewerMessages: boolean
  listRef: RefObject<FlashListRef<Message> | null>
  scrollLockedRef: RefObject<boolean>
  loadNewerMessages: (() => Promise<void>) | undefined
}

export const useLoadNewerMessages = ({
  isLoadingNewer,
  hasNewerMessages,
  listRef,
  scrollLockedRef,
  loadNewerMessages,
}: UseLoadNewerMessagesParams) =>
  useCallback(async () => {
    if (isLoadingNewer || !hasNewerMessages) return

    const preventAnimation = scrollLockedRef.current
    await loadNewerMessages?.()

    const currentScroll = listRef.current?.getAbsoluteLastScrollOffset()

    setTimeout(() => {
      if (currentScroll === undefined) return
      if (preventAnimation) return

      listRef.current?.scrollToOffset({ animated: true, offset: currentScroll + 100, viewPosition: 0 })
    }, 100)
  }, [loadNewerMessages, isLoadingNewer, hasNewerMessages, listRef, scrollLockedRef])
