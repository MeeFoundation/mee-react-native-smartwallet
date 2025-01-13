import { hexAlphaColor } from "@utils/color"
import { colors } from "@utils/theme"
import { Animated, Dimensions, View } from "react-native"

type PaginatorProps<T> = {
  data: T[]
  scrollX: Animated.Value
}

export const Paginator = <T,>({ data, scrollX }: PaginatorProps<T>) => {
  const width = Dimensions.get("screen").width

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 20, 8],
          extrapolate: "clamp",
        })

        const dotColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            hexAlphaColor(colors.primary, 50),
            colors.primary,
            hexAlphaColor(colors.primary, 50),
          ],
          extrapolate: "clamp",
        })

        return (
          <Animated.View
            key={i}
            style={{
              width: dotWidth,
              height: 8,
              borderRadius: 4,
              backgroundColor: dotColor,
            }}
          />
        )
      })}
    </View>
  )
}
