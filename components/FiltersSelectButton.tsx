import { Typography } from "@/components/Typography"
import { colors } from "@/constants/colors"
import type { FC, ReactNode } from "react"
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from "react-native"
import { AdjustmentsVerticalIcon } from "react-native-heroicons/outline"

const styles = StyleSheet.create({
  filterSelectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
    gap: 8,
    borderRadius: 8,
    backgroundColor: colors["white/95"],
    borderColor: colors["black/10"],
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    height: 44,
    alignItems: "center",
  },

  text: {
    fontWeight: 500,
  },
})

/* -------------------------------------------------------------------------------------------------
 * FiltersSelectButton
 * -----------------------------------------------------------------------------------------------*/
type FiltersSelectButtonProps = TouchableOpacityProps & {
  icon?: ReactNode
}

const FiltersSelectButton: FC<FiltersSelectButtonProps> = ({ style, icon, ...props }) => (
  <TouchableOpacity style={styles.filterSelectButton} onPress={props.onPress}>
    <Typography style={styles.text}>{props.children ?? "Filters"}</Typography>
    {icon ?? <AdjustmentsVerticalIcon size={20} color={colors.black} />}
  </TouchableOpacity>
)

/* -----------------------------------------------------------------------------------------------*/

export { FiltersSelectButton }
export type { FiltersSelectButtonProps }
