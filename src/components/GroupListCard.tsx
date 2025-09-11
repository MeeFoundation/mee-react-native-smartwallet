import { AppButton } from "@components/AppButton"
import * as ConnectionListCard from "@components/ListConnectionCard"
import * as ConnectionListExpandableCard from "@components/ListConnectionExpandableCard"
import { PersonListCard } from "@components/PersonListCard"
import { Group } from "@services/group.service"
import { FC, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ChevronDownIcon, ChevronUpIcon } from "react-native-heroicons/outline"

const styles = StyleSheet.create({
  peopleList: {
    gap: 8,
  },
})

/* -------------------------------------------------------------------------------------------------
 * GroupListCard
 * -----------------------------------------------------------------------------------------------*/
type GroupListCardProps = { group: Group; onPress: () => void }

const GroupListCard: FC<GroupListCardProps> = ({ group, onPress }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpanded = () => setIsExpanded(!isExpanded)

  return (
    <ConnectionListExpandableCard.Root expanded={isExpanded}>
      <ConnectionListExpandableCard.CardHolder expanded={isExpanded}>
        <TouchableOpacity onPress={onPress}>
          <ConnectionListCard.Root variant={isExpanded ? "expanded" : "default"}>
            <ConnectionListCard.Content>
              <ConnectionListCard.Thumbnail text={group.name} src={group.iconSrc} />
              <ConnectionListCard.Description>
                <ConnectionListCard.Name>{group.name}</ConnectionListCard.Name>
                <ConnectionListCard.Hint danger={group.status === "archived"}>
                  {group.status !== "archived" ? null : "Archived/Paused"}
                </ConnectionListCard.Hint>
              </ConnectionListCard.Description>
              <ConnectionListCard.Actions>
                <ConnectionListCard.Count>{group.connections.length}</ConnectionListCard.Count>
                <ConnectionListCard.Button>
                  <AppButton onPress={toggleExpanded} size="sm" variant="link">
                    {isExpanded ? (
                      <ChevronUpIcon color="black" />
                    ) : (
                      <ChevronDownIcon color="black" />
                    )}
                  </AppButton>
                </ConnectionListCard.Button>
              </ConnectionListCard.Actions>
            </ConnectionListCard.Content>
          </ConnectionListCard.Root>
        </TouchableOpacity>
      </ConnectionListExpandableCard.CardHolder>
      <ConnectionListExpandableCard.ContentHolder expanded={isExpanded}>
        <View style={styles.peopleList}>
          {group.connections.map((connection) => (
            <PersonListCard key={connection.id} person={connection} />
          ))}
        </View>
      </ConnectionListExpandableCard.ContentHolder>
    </ConnectionListExpandableCard.Root>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupListCard }
export type { GroupListCardProps }
