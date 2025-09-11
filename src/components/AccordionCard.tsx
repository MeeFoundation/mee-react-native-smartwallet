import { useNavigation } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { useSetAtom } from "jotai"
import { compact } from "lodash-es"
import { useState } from "react"
import {
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Connection } from "../services/core.service"
import { deleteContactAtom } from "../store/contacts"
import { Accordion } from "./Accordion"
import { ConnectionCard } from "./ConnectionCard"

type Props = {
  innerConnections: Connection[]
  title: string
  iconSrc: ImageSourcePropType
  innerElHeight: number
}

const GAP_SIZE = 8
const INITIAL_COLLAPSED = true
export const AccordionCard = (props: Props) => {
  const { innerConnections, title, iconSrc, innerElHeight } = props

  const navigation = useNavigation()
  const [collapsed, setCollapsed] = useState(INITIAL_COLLAPSED)

  const deleteContact = useSetAtom(deleteContactAtom)

  const handlePressOpen = (id: string) => {
    navigation.navigate("Manage Contact", {
      id,
    })
  }

  return (
    <Accordion
      propsStyles={{
        container: { ...styles.container, ...(collapsed ? {} : styles.border) },
        body: styles.body,
        head: {
          ...styles.head,
          ...(collapsed ? {} : styles.headNotCollapsed),
          ...(!collapsed && innerConnections.length === 0 ? { borderRadius: 8 } : {}),
        },
        arrow: styles.arrow,
      }}
      head={
        <ConnectionCard
          style={{ padding: 0, backgroundColor: undefined }}
          name={title}
          logo={iconSrc}
        />
      }
      collapsed={INITIAL_COLLAPSED}
      onToggle={setCollapsed}
      contentMaxHeight={
        innerConnections.length * (innerElHeight + GAP_SIZE) + GAP_SIZE > 400
          ? 400
          : innerConnections.length * (innerElHeight + GAP_SIZE) + GAP_SIZE
      }
      rightHeadLabel={<Text style={styles.rightHeadLabel}>({innerConnections.length})</Text>}
    >
      <View style={styles.contactsWrapper}>
        {innerConnections.map((connection) => (
          <TouchableOpacity key={connection.id} onPress={() => handlePressOpen(connection.id)}>
            <ConnectionCard
              name={connection.name}
              logo={connection.iconSrc}
              menuActions={compact([
                Platform.OS === connection.contactInfo?.platform && {
                  name: "Delete contact",
                  key: "delete",
                  onPress: () => {
                    if (connection.contactInfo?.recordID) {
                      // TODO add error handling
                      deleteContact({ contact: connection }).catch((err) => {
                        console.error("error deleting contact", err)
                      })
                    }
                  },
                  icon: "trash",
                },
                {
                  name: "Manage contact",
                  key: "edit",
                  onPress: () => handlePressOpen(connection.id),
                  icon: "pencil",
                },
              ])}
            />
          </TouchableOpacity>
        ))}
      </View>
    </Accordion>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  body: {
    padding: 8,
  },
  head: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  arrow: {
    padding: 4,
  },
  contactsWrapper: {
    gap: 8,
  },
  border: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  headNotCollapsed: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  rightHeadLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: colors["gray-600"],
  },
})
