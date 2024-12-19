import { ComponentProps, FC } from "react"
import { StyleSheet, View } from "react-native"

type SeparatorProps = ComponentProps<typeof View>

export const Separator: FC<SeparatorProps> = ({ style }) => (
  <View style={StyleSheet.compose(styles.separator, style)} />
)

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
