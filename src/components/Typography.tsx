import { fonts } from "@utils/theme"
import { NestedKeyOf } from "@utils/ts-utils"
import { get } from "lodash-es"
import { ComponentProps } from "react"
import { Text } from "react-native"

type Props = {
  fontFamily?: NestedKeyOf<typeof fonts>
} & ComponentProps<typeof Text>

export const Typography = (props: Props) => {
  const { fontFamily = "publicSans.regular", style, ...rest } = props
  const _fontFamily = get(fonts, fontFamily) as string
  const styles =
    typeof style === "object"
      ? { fontSize: 16, ...style, fontFamily: _fontFamily }
      : { fontSize: 16, fontFamily: _fontFamily }

  return <Text {...rest} style={styles} />
}
