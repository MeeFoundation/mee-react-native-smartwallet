import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 * ChatTypingIndicator
 * -----------------------------------------------------------------------------------------------*/
type ChatTypingIndicatorProps = {
  typingUsers: string[]
}

const ChatTypingIndicator: FC<ChatTypingIndicatorProps> = ({ typingUsers }) => {
  const { t: chatT } = useTranslation('chat')

  const text =
    typingUsers.length > 1
      ? chatT('{{names}} are typing', { names: typingUsers.join(', ') })
      : chatT('{{name}} is typing', { name: typingUsers[0] })

  return <Typography className="mt-2 text-xs opacity-65">{text}</Typography>
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatTypingIndicator }

export type { ChatTypingIndicatorProps }
