import ChevronDownIcon from "@assets/images/chevron-down.svg"
import { useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"

type Props = {
  head: React.ReactNode
  body: React.ReactNode
}

export const Accordion = (props: Props) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)

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
      {props.body}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: "column" },
  head: { flexDirection: "row", justifyContent: "space-between" },
})
