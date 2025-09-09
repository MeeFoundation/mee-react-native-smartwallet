import { AppButton } from "@components/AppButton"
import * as ConnectionListCard from "@components/ListConnectionCard"
import * as ConnectionListExpandableCard from "@components/ListConnectionExpandableCard"
import { PersonListCard } from "@components/PersonListCard"
import { Group } from "@services/core.service"
import { FC, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "react-native-heroicons/outline"

/* -------------------------------------------------------------------------------------------------
 * GroupListCard
 * -----------------------------------------------------------------------------------------------*/
type GroupListCardProps = { group: Group }

const GroupListCard: FC<GroupListCardProps> = ({ group }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpanded = () => setIsExpanded(!isExpanded)

  return (
    <ConnectionListExpandableCard.Root expanded={isExpanded}>
      <ConnectionListExpandableCard.CardHolder expanded={isExpanded}>
        <ConnectionListCard.Root variant={isExpanded ? "expanded" : "default"}>
          <ConnectionListCard.Content>
            <ConnectionListCard.Thumbnail text={group.name} />
            <ConnectionListCard.Description
              name={group.name}
              hint={`${group.connections.length} connections`}
            />
            <ConnectionListCard.Actions>
              <ConnectionListCard.Count>{group.connections.length}</ConnectionListCard.Count>
              <ConnectionListCard.Button>
                <AppButton onPress={toggleExpanded} size="sm" variant="tertiary">
                  {isExpanded ? <ChevronUpIcon color="black" /> : <ChevronDownIcon color="black" />}
                </AppButton>
              </ConnectionListCard.Button>
            </ConnectionListCard.Actions>
          </ConnectionListCard.Content>
        </ConnectionListCard.Root>
      </ConnectionListExpandableCard.CardHolder>
      <ConnectionListExpandableCard.ContentHolder expanded={isExpanded}>
        {group.connections.map((connection) => (
          <PersonListCard key={connection.id} person={connection} />
        ))}
      </ConnectionListExpandableCard.ContentHolder>
    </ConnectionListExpandableCard.Root>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupListCard }
export type { GroupListCardProps }
