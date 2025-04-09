import { FC, PropsWithChildren, useRef, useState } from "react"
import { Animated, Easing, Keyboard, Pressable, StyleSheet, View, ViewStyle } from "react-native"
import { ChevronDownIcon } from "react-native-heroicons/outline"

type AccordionProps = {
  head: React.ReactNode
  collapsed?: boolean
  contentMaxHeight?: number
  onToggle?: (collapsed: boolean) => void
  propsStyles?: { container?: ViewStyle; head?: ViewStyle; body?: ViewStyle; arrow?: ViewStyle }
  rightHeadLabel?: React.ReactNode
}

const animationDuration = 300

export const Accordion: FC<PropsWithChildren<AccordionProps>> = ({
  head,
  collapsed = true,
  contentMaxHeight = 350,
  children,
  onToggle,
  propsStyles,
  rightHeadLabel,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed)
  const contentHeight = useRef(new Animated.Value(collapsed ? 0 : contentMaxHeight)).current
  const spinValue = useRef(new Animated.Value(collapsed ? 1 : 0)).current

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  const collapseContent = () => {
    setIsCollapsed(true)
    onToggle?.(true)

    Keyboard.dismiss()

    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(contentHeight, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const expandContent = () => {
    onToggle?.(false)

    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: 0,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(contentHeight, {
        toValue: contentMaxHeight,
        duration: animationDuration,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsCollapsed(false)
    })
  }

  const toggleContent = () => {
    if (isCollapsed) {
      expandContent()
    } else {
      collapseContent()
    }
  }

  return (
    <View style={propsStyles?.container}>
      <Pressable onPress={toggleContent} style={[styles.head, propsStyles?.head]}>
        {head}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          {rightHeadLabel}
          <Animated.View style={[propsStyles?.arrow, { transform: [{ rotateX: spin }] }]}>
            <ChevronDownIcon size={24} stroke="black" />
          </Animated.View>
        </View>
      </Pressable>
      <Animated.ScrollView
        nestedScrollEnabled={true}
        style={[
          { height: "auto", maxHeight: contentHeight },
          isCollapsed ? styles.collapsedContent : null,
        ]}
      >
        <View style={[{ height: "auto", zIndex: 10 }, propsStyles?.body]}>{children}</View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "space-between",
    marginBottom: 8,
  },
  collapsedContent: {
    overflow: "hidden",
  },
})
