import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { localizeRelativeDate } from '@/shared/lib/date-time'
import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 * ChatDate
 * -----------------------------------------------------------------------------------------------*/
type ChatDateProps = {
  date: Date | string | number
}

const ChatDate: FC<ChatDateProps> = (props) => {
  const { t } = useTranslation()
  const formattedDate = localizeRelativeDate(t, Date.now(), props.date)

  return (
    <View className="mx-auto my-4.5 rounded-[6] border border-black/7 bg-white/65 px-2.5 py-1">
      <Typography className="text-xs opacity-65">{formattedDate}</Typography>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatDate }

export type { ChatDateProps }
