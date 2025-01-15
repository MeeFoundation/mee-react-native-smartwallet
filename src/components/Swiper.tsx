import { ChevronLeftSvg } from "@assets/index"
import { colors } from "@utils/theme"
import { useRef, useState } from "react"
import { Animated, FlatList, ListRenderItem, StyleSheet, View } from "react-native"
import { AnimatedTouchable } from "./AnimatedTouchable"
import { Paginator } from "./swiper/Paginator"

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
            <ChevronLeftSvg color={colors.primary} />
          </AnimatedTouchable>
          <Paginator data={data} scrollX={sliderPos} />
          <AnimatedTouchable
            style={[styles.btn, { opacity: currentIndex >= data.length - 1 ? 0 : 1 }]}
            onPress={scrollNext}
            disabled={currentIndex >= data.length - 1}
          >
            <ChevronLeftSvg color={colors.primary} style={{ transform: [{ rotate: "180deg" }] }} />
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
