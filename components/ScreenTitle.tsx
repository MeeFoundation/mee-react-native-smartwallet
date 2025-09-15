import { Typography } from "@/components/Typography"
import { fonts } from "@/constants/fonts"
import type { FC, ReactNode } from "react"
import { StyleSheet, View, type ViewProps } from "react-native"

const styles = StyleSheet.create({
  screenTitle: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  title: {
    fontSize: 18,
  },

  thumbnail: {
    width: 28,
    height: 28,
  },
})

/* -------------------------------------------------------------------------------------------------
 * ScreenTitle
 * -----------------------------------------------------------------------------------------------*/
type ScreenTitleProps = ViewProps & {
  thumbnail?: ReactNode
}

const ScreenTitle: FC<ScreenTitleProps> = ({ thumbnail, style, children, ...rest }) => {
  return (
    <View style={[styles.screenTitle, style]} {...rest}>
      {!thumbnail ? null : <View style={styles.thumbnail}>{thumbnail}</View>}
      <Typography
        numberOfLines={1}
        style={styles.title}
        fontFamily={fonts.publicSans.medium}
        weight="600"
      >
        {children}
      </Typography>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ScreenTitle }
export type { ScreenTitleProps }
