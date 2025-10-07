import { createContext, useContext } from 'react'

export type ChatContext = {
  onRepliedToPress: ((messageId: string) => void) | undefined
}

export const ChatProvider = createContext<ChatContext>({
  onRepliedToPress: () => {},
})

export const useChatContext = () => useContext(ChatProvider)
