import type { FC } from 'react'

import { BackButton, Header, ToggleDrawerButton } from '@/widgets/navigation/@x/group-screen-header'

import type { Group } from '@/entities/group'

import { Avatar } from '@/shared/ui/Avatar'

/* -------------------------------------------------------------------------------------------------
 * GroupScreenHeader
 * -----------------------------------------------------------------------------------------------*/
type GroupScreenHeaderProps = {
  group: Group
}

const GroupScreenHeader: FC<GroupScreenHeaderProps> = ({ group }) => (
  <Header.Root>
    <Header.Actions position="left">
      <BackButton />
    </Header.Actions>
    <Header.Title>
      <Avatar src={group.iconSrc} text={group.name} />
      <Header.TitleText>{group.name}</Header.TitleText>
    </Header.Title>
    <Header.Actions position="right">
      <ToggleDrawerButton />
    </Header.Actions>
  </Header.Root>
)

/* -----------------------------------------------------------------------------------------------*/

export { GroupScreenHeader }

export type { GroupScreenHeaderProps }
