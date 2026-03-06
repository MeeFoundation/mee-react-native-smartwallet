import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Spinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'

import { ChatToolbar } from './ChatToolbar'

/* -------------------------------------------------------------------------------------------------
 *  ChatLoading
 * -----------------------------------------------------------------------------------------------*/
const ChatLoading: FC = () => {
  const { t: chatT } = useTranslation('chat')

  return (
    <View style={{ flex: 1 }}>
      <View className="items-center justify-center gap-3" style={{ flex: 1 }}>
        <View className="h-10 w-10">
          <Spinner />
        </View>
        <Typography>{chatT('loading messages')}</Typography>
      </View>

      <ChatToolbar disabled />
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatLoading }
