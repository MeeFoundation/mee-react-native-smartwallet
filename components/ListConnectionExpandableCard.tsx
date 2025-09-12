import { colors } from "@/constants/colors"
import { type FC, useEffect, useRef } from "react"
import { Animated, Easing, StyleSheet, View, type ViewProps } from "react-native"

const styles = StyleSheet.create({
  root: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
  },

  holder: {
    gap: 8,
  },

  expandableContentHolder: {
    padding: 8,
    paddingTop: 0,
    zIndex: 10,
  },
})

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardExpandableContentHolder
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardExpandableContentHolderProps = ViewProps & {
  expanded: boolean
  animationDuration?: number
  contentMaxHeight?: number
}

const ConnectionListCardExpandableContentHolder: FC<
  ConnectionListCardExpandableContentHolderProps
> = ({ style, children, expanded, animationDuration = 300, contentMaxHeight = 350, ...rest }) => {
  const contentHeightRef = useRef(new Animated.Value(0))

  useEffect(() => {
    if (expanded) {
      Animated.timing(contentHeightRef.current, {
        toValue: contentMaxHeight,
        duration: animationDuration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start()
    } else {
      Animated.timing(contentHeightRef.current, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start()
    }
  }, [expanded, animationDuration, contentMaxHeight])

  return (
    <Animated.ScrollView
      nestedScrollEnabled={true}
      style={[{ overflow: "hidden", maxHeight: contentHeightRef.current }, style]}
      {...rest}
    >
      <View style={styles.expandableContentHolder}>{children}</View>
    </Animated.ScrollView>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardExpandableCardHolder
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardExpandableCardHolderProps = ViewProps & {
  expanded: boolean
}

const ConnectionListCardExpandableCardHolder: FC<ConnectionListCardExpandableCardHolderProps> = ({
  style,
  children,
  ...rest
}) => (
  <View style={[style]} {...rest}>
    {children}
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardExpandable
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardExpandableProps = ViewProps & {
  expanded: boolean
  animationDuration?: number
}

const ConnectionListCardExpandable: FC<ConnectionListCardExpandableProps> = ({
  style,
  children,
  expanded,
  animationDuration = 200,
  ...rest
}) => {
  const animatedRef = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(animatedRef.current, {
      toValue: expanded ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start()
  }, [expanded, animationDuration])

  const color = animatedRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", colors.primary],
  })

  return (
    <Animated.View style={[styles.root, { borderColor: color }, style]} {...rest}>
      <Animated.View style={styles.holder}>{children}</Animated.View>
    </Animated.View>
  )
}

/* -----------------------------------------------------------------------------------------------*/
const Root = ConnectionListCardExpandable
const ContentHolder = ConnectionListCardExpandableContentHolder
const CardHolder = ConnectionListCardExpandableCardHolder

export {
  CardHolder,
  //
  ConnectionListCardExpandable,
  ConnectionListCardExpandableCardHolder,
  ConnectionListCardExpandableContentHolder,
  ContentHolder,
  Root,
}
export type {
  ConnectionListCardExpandableCardHolderProps,
  ConnectionListCardExpandableContentHolderProps,
  ConnectionListCardExpandableProps,
}
