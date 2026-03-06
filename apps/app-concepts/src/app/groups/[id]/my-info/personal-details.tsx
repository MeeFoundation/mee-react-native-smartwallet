import { useLocalSearchParams } from 'expo-router'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { PersonalDetails } from '@/widgets/group-my-info'
import { BackButton, Header, ScreenLayout, ToggleDrawerButton } from '@/widgets/navigation'

import { getGroupAtom } from '@/entities/group'

import { InvalidRouteParamsError } from '@/shared/errors'

/* -------------------------------------------------------------------------------------------------
 * PersonalDetailsScreen
 * -----------------------------------------------------------------------------------------------*/
const PersonalDetailsScreen: FC = () => {
  const { id } = useLocalSearchParams()
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const group = useAtomValue(getGroupAtom(id))

  const { t: groupsT } = useTranslation('groups')

  return (
    <ScreenLayout.Root>
      <Header.Root>
        <Header.Actions position="left">
          <BackButton />
        </Header.Actions>
        <Header.Title>
          <Header.TitleText>{groupsT('my_info_tabs.personal_details.title')}</Header.TitleText>
        </Header.Title>
        <Header.Actions position="right">
          <ToggleDrawerButton />
        </Header.Actions>
      </Header.Root>

      <ScreenLayout.Content className="p-2" safeBottomInset>
        <PersonalDetails group={group} />
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export default PersonalDetailsScreen
