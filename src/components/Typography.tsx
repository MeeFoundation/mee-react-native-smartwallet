import { colors, fonts } from "@utils/theme"
import { NestedKeyOf } from "@utils/ts-utils"
import { get } from "lodash-es"
import { ComponentProps } from "react"
import { StyleSheet, Text } from "react-native"

type FontWeight = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"

export type TypographyProps = {
  fontFamily?: NestedKeyOf<typeof fonts>
  weight?: FontWeight
} & ComponentProps<typeof Text>

export const Typography = (props: TypographyProps) => {
  const { fontFamily = "publicSans.regular", weight = "400", style, ...rest } = props
  const _fontFamily = get(fonts, fontFamily) as string

  const defaultStyles = {
    fontSize: 16,
    fontFamily: _fontFamily,
    fontWeight: weight,
    color: colors.secondary,
  }

  return <Text {...rest} style={StyleSheet.compose(defaultStyles, style)} />
}
