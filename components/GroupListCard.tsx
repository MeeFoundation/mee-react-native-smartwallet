import { AppButton } from "@/components/AppButton"
import * as ConnectionListCard from "@/components/ListConnectionCard"
import type { ShortGroup } from "@/models/group"
import { type FC, useState } from "react"
import { TouchableOpacity } from "react-native"
import { ChevronDownIcon, ChevronUpIcon } from "react-native-heroicons/outline"

/* -------------------------------------------------------------------------------------------------
 * GroupListCardSkeleton
 * -----------------------------------------------------------------------------------------------*/
const GroupListCardSkeleton: FC = ConnectionListCard.ConnectionListCardSkeleton

/* -------------------------------------------------------------------------------------------------
 * GroupListCard
 * -----------------------------------------------------------------------------------------------*/
type GroupListCardProps = { group: ShortGroup; onPress: () => void }

const GroupListCard: FC<GroupListCardProps> = ({ group, onPress }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpanded = () => setIsExpanded(!isExpanded)

  return (
    <TouchableOpacity onPress={onPress}>
      <ConnectionListCard.Root variant={isExpanded ? "expanded" : "default"}>
        <ConnectionListCard.Content>
          <ConnectionListCard.Thumbnail text={group.name} src={group.iconSrc} />
          <ConnectionListCard.Description>
            <ConnectionListCard.Name>{group.name}</ConnectionListCard.Name>

            {group.status === "archived" ? (
              <ConnectionListCard.Hint danger>Archived/Paused</ConnectionListCard.Hint>
            ) : null}
          </ConnectionListCard.Description>
          <ConnectionListCard.Actions>
            <ConnectionListCard.Count>{group.connections.length}</ConnectionListCard.Count>
            <ConnectionListCard.Button>
              <AppButton onPress={toggleExpanded} size="sm" variant="link">
                {isExpanded ? <ChevronUpIcon color="black" /> : <ChevronDownIcon color="black" />}
              </AppButton>
            </ConnectionListCard.Button>
          </ConnectionListCard.Actions>
        </ConnectionListCard.Content>
      </ConnectionListCard.Root>
    </TouchableOpacity>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupListCard, GroupListCardSkeleton }
export type { GroupListCardProps }
