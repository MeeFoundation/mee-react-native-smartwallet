// TODO refactor

import { useRef, useState } from 'react'
import { Animated, Dimensions, FlatList, type ListRenderItem, StyleSheet, View } from 'react-native'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'

import { colors } from '@/shared/config'
import { hexAlphaColor } from '@/shared/lib/styling'

import { AnimatedTouchable } from './AnimatedTouchable'

type PaginatorProps<T> = {
  data: T[]
  scrollX: Animated.Value
}

const Paginator = <T,>({ data, scrollX }: PaginatorProps<T>) => {
  const width = Dimensions.get('screen').width

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4 }}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

        const dotWidth = scrollX.interpolate({
          extrapolate: 'clamp',
          inputRange,
          outputRange: [8, 20, 8],
        })

        const dotColor = scrollX.interpolate({
          extrapolate: 'clamp',
          inputRange,
          outputRange: [hexAlphaColor(colors.primary, 50), colors.primary, hexAlphaColor(colors.primary, 50)],
        })

        return (
          <Animated.View
            // biome-ignore lint/suspicious/noArrayIndexKey: only index is available here
            key={i}
            style={{
              backgroundColor: dotColor,
              borderRadius: 4,
              height: 8,
              width: dotWidth,
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

export const Swiper = <T,>({ data, renderItem, showPaginator = true, bounces = true }: SwiperProps<T>) => {
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
        backgroundColor: colors.warning,
        flex: data.length,
        paddingBottom: 90,
        paddingTop: 20,
        position: 'relative',
      }}
    >
      <FlatList
        bounces={bounces}
        data={data}
        horizontal
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: sliderPos } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={({ viewableItems }) => setCurrentIndex(viewableItems[0].index ?? 0)}
        pagingEnabled
        ref={slidesRef}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      {showPaginator && (
        <View style={styles.paginatorContainer}>
          <AnimatedTouchable
            disabled={currentIndex === 0}
            onPress={scrollPrev}
            style={[styles.btn, { opacity: currentIndex === 0 ? 0 : 1 }]}
          >
            <ChevronLeftIcon color={colors.primary} size={24} strokeWidth={2} />
          </AnimatedTouchable>
          <Paginator data={data} scrollX={sliderPos} />
          <AnimatedTouchable
            disabled={currentIndex >= data.length - 1}
            onPress={scrollNext}
            style={[styles.btn, { opacity: currentIndex >= data.length - 1 ? 0 : 1 }]}
          >
            <ChevronLeftIcon
              color={colors.primary}
              size={24}
              strokeWidth={2}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </AnimatedTouchable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  btn: {
    padding: 12,
  },
  paginatorContainer: {
    alignItems: 'center',
    bottom: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    width: '100%',
  },
})
