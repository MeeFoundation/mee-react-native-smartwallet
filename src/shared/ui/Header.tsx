import { colors, fonts } from "@/shared/config"
import { useThemeColor } from "@/shared/lib/useThemeColor"
import { drawerIsOpenedAtom } from "@/shared/model"
import { Typography } from "@/shared/ui/Typography"
import { useSetAtom } from "jotai"
import { type FC, useCallback } from "react"
import { StyleSheet, TouchableOpacity, View, type ViewProps } from "react-native"
import { IconSymbol } from "./IconSymbol"

/* -------------------------------------------------------------------------------------------------
 * HeaderRight
 * -----------------------------------------------------------------------------------------------*/
export const HeaderRight = () => {
  const setDrawerIsOpened = useSetAtom(drawerIsOpenedAtom)
  const openDrawer = useCallback(() => setDrawerIsOpened(true), [setDrawerIsOpened])

  const iconColor = useThemeColor("white")

  return (
    <View style={[styles.menu, styles.headerRight]}>
      <TouchableOpacity style={styles.pressable}>
        <IconSymbol name="magnifying-glass.outlined" strokeWidth={2} color={iconColor} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.pressable}>
        <IconSymbol name="bell.outlined" strokeWidth={2} color={iconColor} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.pressable} onPress={openDrawer}>
        <IconSymbol name="bars-3.outlined" strokeWidth={2} color={iconColor} />
      </TouchableOpacity>
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * HeaderLeft
 * -----------------------------------------------------------------------------------------------*/
type HeaderLeftProps = ViewProps

export const HeaderLeft: FC<HeaderLeftProps> = ({ style, children, ...rest }) => (
  <View style={[styles.headerLeft, style]} {...rest}>
    <Typography style={styles.text} fontFamily={fonts.publicSans.bold} weight="700">
      {children}
    </Typography>
  </View>
)

/* -----------------------------------------------------------------------------------------------*/

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 24,
    color: colors.white,
  },
  menu: { flexDirection: "row" },
  pressable: { padding: 8 },
  headerRight: {
    paddingHorizontal: 0,
    // FIXME adjust padding
    paddingEnd: 22,
  },
  headerLeft: {
    paddingHorizontal: 0,
    // FIXME adjust padding
    paddingStart: 16,
  },
})
