import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Spinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 *  ChatMessagesLoading
 * -----------------------------------------------------------------------------------------------*/
type ChatMessagesLoadingProps = {
  isLoading: boolean
}

const ChatMessagesLoading: FC<ChatMessagesLoadingProps> = ({ isLoading }) => {
  const { t: chatT } = useTranslation('chat')

  return !isLoading ? null : (
    <View className="pointer-events-none top-0 left-0 my-2 w-full items-center gap-1">
      <View className="h-4 w-4">
        <Spinner />
      </View>
      <View>
        <Typography className="text-gray-900 text-xs opacity-65">{chatT('loading messages')}</Typography>
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatMessagesLoading }

export type { ChatMessagesLoadingProps }
