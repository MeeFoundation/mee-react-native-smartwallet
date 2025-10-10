import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native'

import { ConnectionListCard } from '@/entities/connection/@x/group'

import { useShortGroupView } from '../lib/use-short-group-view'
import type { ShortGroup } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * GroupListCardSkeleton
 * -----------------------------------------------------------------------------------------------*/
const GroupListCardSkeleton: FC = ConnectionListCard.ConnectionListCardSkeleton

/* -------------------------------------------------------------------------------------------------
 * GroupListCard
 * -----------------------------------------------------------------------------------------------*/
type GroupListCardProps = Omit<TouchableOpacityProps, 'children'> & { group: ShortGroup }

const GroupListCard: FC<GroupListCardProps> = ({ group, ...rest }) => {
  const { t: groupsT } = useTranslation('groups')
  const shortGroupView = useShortGroupView(group)

  return (
    <TouchableOpacity {...rest}>
      <ConnectionListCard.Root>
        <ConnectionListCard.Content>
          <ConnectionListCard.Thumbnail src={shortGroupView.thumbnail} text={shortGroupView.name} />
          <ConnectionListCard.Description>
            <ConnectionListCard.Name>{shortGroupView.name}</ConnectionListCard.Name>

            {shortGroupView.status === 'archived' ? (
              <ConnectionListCard.Hint danger>{groupsT('status.archived.tip')}</ConnectionListCard.Hint>
            ) : null}
          </ConnectionListCard.Description>
          <ConnectionListCard.Actions>
            {!shortGroupView.connections.length ? null : (
              <ConnectionListCard.Count>{shortGroupView.connections?.length}</ConnectionListCard.Count>
            )}
          </ConnectionListCard.Actions>
        </ConnectionListCard.Content>
      </ConnectionListCard.Root>
    </TouchableOpacity>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupListCard, GroupListCardSkeleton }

export type { GroupListCardProps }
