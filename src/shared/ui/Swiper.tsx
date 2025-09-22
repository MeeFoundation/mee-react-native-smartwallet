// TODO refactor
import { colors } from "@/shared/config"
import { hexAlphaColor } from "@/shared/lib/color"
import { useRef, useState } from "react"
import { Animated, Dimensions, FlatList, type ListRenderItem, StyleSheet, View } from "react-native"
import { ChevronLeftIcon } from "react-native-heroicons/outline"
import { AnimatedTouchable } from "./AnimatedTouchable"

type PaginatorProps<T> = {
  data: T[]
  scrollX: Animated.Value
}

const Paginator = <T,>({ data, scrollX }: PaginatorProps<T>) => {
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

type SwiperProps<T> = {
  data: T[]
  renderItem: ListRenderItem<T>
  showPaginator?: boolean
  bounces?: boolean
}

export const Swiper = <T,>({
  data,
  renderItem,
  showPaginator = true,
  bounces = true,
}: SwiperProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderPos = useRef(new Animated.Value(0)).current
  const slidesRef = useRef<FlatList>(null)

  const scrollPrev = () => {
    if (slidesRef.current && currentIndex > 0) {
      slidesRef.current.scrollToIndex({ index: currentIndex - 1 })
    }
  }

  const scrollNext = () => {
    if (slidesRef.current && currentIndex < data.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 })
    }
  }

  return (
    <View
      style={{
        position: "relative",
        flex: data.length,
        backgroundColor: colors.warning,
        paddingBottom: 90,
        paddingTop: 20,
      }}
    >
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: sliderPos } } }], {
          useNativeDriver: false,
        })}
        bounces={bounces}
        scrollEventThrottle={16}
        onViewableItemsChanged={({ viewableItems }) => setCurrentIndex(viewableItems[0].index ?? 0)}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        ref={slidesRef}
      />
      {showPaginator && (
        <View style={styles.paginatorContainer}>
          <AnimatedTouchable
            style={[styles.btn, { opacity: currentIndex === 0 ? 0 : 1 }]}
            onPress={scrollPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeftIcon color={colors.primary} size={24} strokeWidth={2} />
          </AnimatedTouchable>
          <Paginator data={data} scrollX={sliderPos} />
          <AnimatedTouchable
            style={[styles.btn, { opacity: currentIndex >= data.length - 1 ? 0 : 1 }]}
            onPress={scrollNext}
            disabled={currentIndex >= data.length - 1}
          >
            <ChevronLeftIcon
              color={colors.primary}
              style={{ transform: [{ rotate: "180deg" }] }}
              size={24}
              strokeWidth={2}
            />
          </AnimatedTouchable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  paginatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 36,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  btn: {
    padding: 12,
  },
})
