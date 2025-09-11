import { FC, useLayoutEffect, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Easing,
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native"

type BackdropProps = {
  onClick?: () => void
  color?: string
}

export const Backdrop: FC<BackdropProps> = ({ onClick, color = "transparent" }) => {
  const mainRef = useRef<View>(null)
  const backdropOpacity = new Animated.Value(0)
  const windowWidth = Dimensions.get("window").width
  const windowHeight = Dimensions.get("window").height
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const showBackdrop = () => {
    Animated.timing(backdropOpacity, {
      toValue: 0.6,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  const clickHandler = (e: GestureResponderEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onClick) {
      onClick()
    }
  }

  useLayoutEffect(() => {
    mainRef.current?.measureInWindow((x, y) => {
      setPos({ x: x > 1 ? -x : pos.x, y: y > 0 ? -y : pos.y })
    })
    // TODO Check whether thiere must be an empty dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TouchableWithoutFeedback onPress={clickHandler}>
      <Animated.View
        ref={mainRef}
        onLayout={() => {
          showBackdrop()
        }}
        style={[
          styles.backdrop,
          {
            backgroundColor: color,
            opacity: backdropOpacity,
            width: windowWidth,
            height: windowHeight,
            top: pos.y,
            left: pos.x,
          },
        ]}
      />
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    zIndex: 98,
  },
})
