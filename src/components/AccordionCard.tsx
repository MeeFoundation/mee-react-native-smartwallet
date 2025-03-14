import { useNavigation } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { useState } from "react"
import { ImageSourcePropType, StyleSheet, Text, View } from "react-native"
import { Connection } from "../services/core.service"
import { Accordion } from "./Accordion"
import { ConnectionCard } from "./ConnectionCard"

type Props = {
  innerConnections: Connection[]
  title: string
  iconSrc: ImageSourcePropType
  innerElHeight: number
}

const INITIAL_COLLAPSED = true
export const AccordionCard = (props: Props) => {
  const { innerConnections, title, iconSrc, innerElHeight } = props

  const navigation = useNavigation()
  const [collapsed, setCollapsed] = useState(INITIAL_COLLAPSED)

  const handlePressOpen = (id: string) => {
    navigation.navigate("Manage Connection", {
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
        innerConnections.length * (innerElHeight + 8) + 8 > 400
          ? 400
          : innerConnections.length * (innerElHeight + 8) + 8
      }
      rightHeadLabel={<Text style={styles.rightHeadLabel}>({innerConnections.length})</Text>}
    >
      <View style={styles.contactsWrapper}>
        {innerConnections.map((connection) => (
          // <TouchableOpacity key={connection.id} onPress={() => handlePressOpen(connection.id)}>
          <ConnectionCard
            key={connection.id}
            name={connection.name}
            onPress={() => handlePressOpen(connection.id)}
            logo={connection.iconSrc}
            showActionMenu
          />
          // </TouchableOpacity>
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
