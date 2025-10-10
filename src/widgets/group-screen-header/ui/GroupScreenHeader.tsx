import type { FC } from 'react'

import { BackButton, Header, ToggleDrawerButton } from '@/widgets/navigation/@x/group-screen-header'

import type { GroupView } from '@/entities/group'

import { Avatar } from '@/shared/ui/Avatar'

/* -------------------------------------------------------------------------------------------------
 * GroupScreenHeader
 * -----------------------------------------------------------------------------------------------*/
type GroupScreenHeaderProps = {
  group: GroupView
}

const GroupScreenHeader: FC<GroupScreenHeaderProps> = ({ group }) => (
  <Header.Root>
    <Header.Actions position="left">
      <BackButton />
    </Header.Actions>
    <Header.Title>
      <Avatar src={group.thumbnail} text={group.name} />
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
