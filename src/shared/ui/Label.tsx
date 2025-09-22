import { colors, fonts } from "@/shared/config"
import { Typography, type TypographyProps } from "@/shared/ui/Typography"
import { type FC } from "react"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: colors["gray-900"],
  },
})

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/
type LabelProps = TypographyProps

const Label: FC<LabelProps> = ({ style, ...rest }) => (
  <Typography fontFamily={fonts.publicSans.medium} style={[styles.label, style]} {...rest} />
)

/* -----------------------------------------------------------------------------------------------*/

export { Label }
export type { LabelProps }
