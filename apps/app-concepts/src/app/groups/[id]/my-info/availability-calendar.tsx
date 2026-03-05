import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { BackButton, Header, ToggleDrawerButton } from '@/widgets/navigation'

import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'

/* -------------------------------------------------------------------------------------------------
 * AvailabilityCalendarScreen
 * -----------------------------------------------------------------------------------------------*/
const AvailabilityCalendarScreen: FC = () => {
  const { t: groupsT } = useTranslation('groups')

  return (
    <View style={{ flex: 1 }}>
      <BackgroundLayout />
      <Header.Root>
        <Header.Actions position="left">
          <BackButton />
        </Header.Actions>
        <Header.Title>
          <Header.TitleText>{groupsT('my_info_tabs.availability_calendar.title')}</Header.TitleText>
        </Header.Title>
        <Header.Actions position="right">
          <ToggleDrawerButton />
        </Header.Actions>
      </Header.Root>

      <View>
        <Text>{groupsT('my_info_tabs.availability_calendar.title')}</Text>
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export default AvailabilityCalendarScreen
