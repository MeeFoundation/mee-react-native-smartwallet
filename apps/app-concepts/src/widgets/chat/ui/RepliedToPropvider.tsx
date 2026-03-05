import { createContext, useContext } from 'react'

type RepliedToContext = {
  onPressRepliedTo: (messageId: string) => void
}
export const RepliedToProvider = createContext<RepliedToContext>({
  onPressRepliedTo: () => {},
})

export const useRepliedTo = () => useContext(RepliedToProvider)
