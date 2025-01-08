import ChevronDownIcon from "@assets/images/chevron-down.svg"
import { FC, PropsWithChildren, useRef, useState } from "react"
import { Animated, Easing, Keyboard, Pressable, StyleSheet, View, ViewStyle } from "react-native"

type AccordionProps = {
  head: React.ReactNode
  collapsed?: boolean
  contentMaxHeight?: number
  onCollapse?: () => void
  style?: ViewStyle
}

const animationDuration = 300

export const Accordion: FC<PropsWithChildren<AccordionProps>> = ({
  head,
  collapsed = true,
  contentMaxHeight = 350,
  children,
  onCollapse,
  style,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed)
  const contentHeight = useRef(new Animated.Value(contentMaxHeight)).current
  const spinValue = useRef(new Animated.Value(0)).current

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  const collapseContent = () => {
    setIsCollapsed(true)

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
    ]).start(() => onCollapse && onCollapse())
  }

  const expandContent = () => {
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
    ]).start(() => setIsCollapsed(false))
  }

  const toggleContent = () => {
    if (isCollapsed) {
      expandContent()
    } else {
      collapseContent()
    }
  }

  return (
    <View style={style}>
      <Pressable onPress={toggleContent} style={styles.head}>
        {head}
        <Animated.View style={{ transform: [{ rotateX: spin }] }}>
          <ChevronDownIcon width={24} height={24} />
        </Animated.View>
      </Pressable>
      <Animated.View
        style={[
          { height: "auto", maxHeight: contentHeight },
          isCollapsed ? styles.collapsedContent : null,
        ]}
      >
        <View style={{ height: "auto", zIndex: 10 }}>{children}</View>
      </Animated.View>
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
