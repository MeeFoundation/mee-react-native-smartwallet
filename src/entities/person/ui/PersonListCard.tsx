import type { FC } from 'react'
import { TouchableOpacity } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'

import { ConnectionListCard } from '@/entities/connection/@x/person'

import { AppButton } from '@/shared/ui/AppButton'

import type { ShortPerson } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * PersonListSkeleton
 * -----------------------------------------------------------------------------------------------*/
type PersonListSkeletonProps = ConnectionListCard.ConnectionListCardSkeletonProps

const PersonListSkeleton: FC<PersonListSkeletonProps> = ConnectionListCard.Skeleton

/* -------------------------------------------------------------------------------------------------
 * PersonListCard
 * -----------------------------------------------------------------------------------------------*/
type PersonListCardProps = { person: ShortPerson; onPress?: () => void }

const PersonListCard: FC<PersonListCardProps> = ({ onPress, person }) => (
  <TouchableOpacity onPress={onPress}>
    <ConnectionListCard.Root>
      <ConnectionListCard.Content>
        <ConnectionListCard.Thumbnail text={person.name} />
        <ConnectionListCard.Description>
          <ConnectionListCard.Name>{person.name}</ConnectionListCard.Name>
        </ConnectionListCard.Description>
        <ConnectionListCard.Actions>
          <ConnectionListCard.Button>
            <AppButton onPress={() => {}} size="sm" variant="link">
              <ChevronRightIcon color="black" />
            </AppButton>
          </ConnectionListCard.Button>
        </ConnectionListCard.Actions>
      </ConnectionListCard.Content>
    </ConnectionListCard.Root>
  </TouchableOpacity>
)

/* -----------------------------------------------------------------------------------------------*/

export { PersonListCard, PersonListSkeleton }
export type { PersonListCardProps, PersonListSkeletonProps }
