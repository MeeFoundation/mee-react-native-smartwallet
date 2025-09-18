import { colors } from "@/constants/colors"
import { assertUnreachable } from "@/utils/assert-unreachable"
import type { FC } from "react"
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from "react-native"
import { IconSymbol, type IconSymbolName } from "./IconSymbol"

const iconButtonStyles = StyleSheet.create({
  iconButton: {
    outlineColor: colors.primary,
    outlineWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonSm: { width: 40, height: 40 },
  iconButtonMd: { width: 48, height: 48 },

  icon: {
    outlineColor: "red",
    outlineWidth: 1,
  },
  iconSm: { width: 24, height: 24 },
  iconMd: { width: 24, height: 24 },
})

/* -------------------------------------------------------------------------------------------------
 * IconButton
 * -----------------------------------------------------------------------------------------------*/
type IconButtonSize = "sm" | "md"

const resolveButtonSizeStyle = (size: IconButtonSize = "md") => {
  switch (size) {
    case "sm":
      return iconButtonStyles.iconButtonSm
    case "md":
      return iconButtonStyles.iconButtonMd
    default:
      assertUnreachable(size)
      return iconButtonStyles.iconButton
  }
}

const resolveIconSizeStyle = (size: IconButtonSize = "md") => {
  switch (size) {
    case "sm":
      return iconButtonStyles.iconSm
    case "md":
      return iconButtonStyles.iconMd
    default:
      assertUnreachable(size)
      return iconButtonStyles.icon
  }
}

type IconButtonProps = TouchableOpacityProps & {
  icon: IconSymbolName
  size?: IconButtonSize
}

const IconButton: FC<IconButtonProps> = ({ style, icon, size, ...props }) => (
  <TouchableOpacity
    {...props}
    style={[iconButtonStyles.iconButton, resolveButtonSizeStyle(size), style]}
  >
    <IconSymbol name={icon} style={[iconButtonStyles.icon, resolveIconSizeStyle(size)]} />
  </TouchableOpacity>
)

/* -----------------------------------------------------------------------------------------------*/

export { IconButton }

export type { IconButtonProps }

export { iconButtonStyles }
