import type { ComponentProps, FC } from "react"
import { StyleSheet, View } from "react-native"

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})

/* -------------------------------------------------------------------------------------------------
 * Separator
 * -----------------------------------------------------------------------------------------------*/
type SeparatorProps = ComponentProps<typeof View>

const Separator: FC<SeparatorProps> = ({ style }) => (
  <View style={StyleSheet.compose(styles.separator, style)} />
)

/* -----------------------------------------------------------------------------------------------*/

export { Separator }
export type { SeparatorProps }
