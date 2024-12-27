import ChevronDownIcon from "@assets/images/chevron-down.svg"
import { useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"

type Props = {
  head: React.ReactNode
  body: React.ReactNode
  collapsed?: boolean
}

export const Accordion = (props: Props) => {
  const [collapsed, setCollapsed] = useState<boolean>(props.collapsed ?? true)

  return (
    <View>
      <Pressable onPress={() => setCollapsed((x) => !x)} style={styles.head}>
        {props.head}
        <ChevronDownIcon
          width={24}
          height={24}
          style={{ transform: [{ rotate: collapsed ? "0deg" : "180deg" }] }}
        />
      </Pressable>
      {!collapsed && props.body}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: "column" },
  head: { flexDirection: "row", justifyContent: "space-between" },
})
