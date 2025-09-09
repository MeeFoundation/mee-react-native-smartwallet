import { BackgroundLayout } from "@components/BackgroundLayout"
import { Footer } from "@components/Footer"
import { GroupListCard } from "@components/GroupListCard"
import * as ListLayout from "@components/ListLayout"
import { Group } from "@services/core.service"
import { FC } from "react"
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const styles = StyleSheet.create({
  sectionSeparator: {
    height: 12,
    width: "100%",
  },
  sectionContainer: {
    flex: 1,
    marginTop: 8,
  },
})

const groups: Group[] = [
  {
    id: "1",
    name: "Group 1",
    connections: [
      {
        id: "1",
        name: "Connection 1",
        sharedInfo: {
          email: "test1@gmail.com",
          firstName: "John",
          lastName: "Doe",
        },
        tags: [],
        profile: "Family",
      },
    ],
  },
  {
    id: "2",
    name: "Group 2",
    connections: [
      {
        id: "2",
        name: "Connection 2",
        sharedInfo: {
          email: "test2@gmail.com",
          firstName: "John",
          lastName: "Doe",
        },
        tags: [],
        profile: "Family",
      },
    ],
  },
]

/* -------------------------------------------------------------------------------------------------
 * SectionSeparator
 * -----------------------------------------------------------------------------------------------*/
const SectionSeparator: FC = () => <View style={styles.sectionSeparator} />

/* -------------------------------------------------------------------------------------------------
 * Groups
 * -----------------------------------------------------------------------------------------------*/
const Groups: FC = () => {
  const handleGroupItemPress = (item: Group) => {
    console.log("[handleGroupItemPress]: item", item)
  }

  return (
    <>
      <BackgroundLayout />
      <ListLayout.Root>
        <ListLayout.Header>
          <Text>Groups</Text>
        </ListLayout.Header>
        <ListLayout.Content>
          <SectionList
            contentContainerStyle={{ gap: 8 }}
            sections={[{ data: groups }]}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleGroupItemPress(item)}>
                <GroupListCard group={item} />
              </TouchableOpacity>
            )}
            renderSectionFooter={() => <View style={{ height: 8 }} />}
            SectionSeparatorComponent={SectionSeparator}
            style={styles.sectionContainer}
          />
        </ListLayout.Content>
      </ListLayout.Root>
      <Footer activePage="groups" />
    </>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { Groups }
