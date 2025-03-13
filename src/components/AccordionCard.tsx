import { useNavigation } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { useState } from "react"
import { ImageSourcePropType, StyleSheet, TouchableOpacity } from "react-native"
import { Connection } from "../services/core.service"
import { Accordion } from "./Accordion"
import { ConnectionCard } from "./ConnectionCard"

type Props = {
  innerConnections: Connection[]
  title: string
  iconSrc: ImageSourcePropType
}

const INITIAL_COLLAPSED = true
export const AccordionCard = (props: Props) => {
  const { innerConnections, title, iconSrc } = props

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
        container: { ...styles.contaner, ...(collapsed ? {} : styles.border) },
        body: styles.body,
        head: { ...styles.head, ...(collapsed ? {} : styles.headNotCollapsed) },
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
    >
      {innerConnections.map((connection) => (
        <TouchableOpacity onPress={() => handlePressOpen(connection.id)}>
          <ConnectionCard
            name={connection.name}
            onPress={() => handlePressOpen(connection.id)}
            logo={connection.iconSrc}
          />
        </TouchableOpacity>
      ))}
    </Accordion>
  )
}

const styles = StyleSheet.create({
  contaner: {
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
  image: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
  open: {
    color: colors.link,
    fontSize: 12,
  },
  name: {
    flexGrow: 1,
  },
  border: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  headNotCollapsed: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
})
