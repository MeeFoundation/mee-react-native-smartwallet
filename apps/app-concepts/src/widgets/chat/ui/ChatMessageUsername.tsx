import type { FC } from 'react'

import type { User } from '@/entities/chat'

import { cn } from '@/shared/lib/styling'
import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 * ChatMessageUsername
 * -----------------------------------------------------------------------------------------------*/
type ChatMessageUsernameProps = {
  user: User
  className?: string
}

const ChatMessageUsername: FC<ChatMessageUsernameProps> = ({ className, user }) => (
  <Typography className={cn('font-semibold text-primary text-xs', className)}>{user.name}</Typography>
)

/* -----------------------------------------------------------------------------------------------*/

export { ChatMessageUsername }

export type { ChatMessageUsernameProps }
