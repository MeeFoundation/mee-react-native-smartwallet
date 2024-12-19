import { colors } from "@utils/theme"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import { Animated, GestureResponderEvent, Pressable, StyleSheet } from "react-native"
import { SvgProps } from "react-native-svg"
import { Typography } from "./Typography"

type Variant = "primary" | "danger" | "tertiary"

type AppButtonRef = ElementRef<typeof Pressable>

const ANUMATION_DURATION = 100

const bgColorMap: Record<Variant, [string, string]> = {
  primary: [colors.primary, colors.primaryActive],
  danger: [colors.danger, colors.dangerActive],
  tertiary: [colors.transparent, colors.transparentActive],
}

const textColorMap: Record<Variant, string> = {
  primary: colors.white,
  danger: colors.white,
  tertiary: colors.primary,
}

type AppButtonProps = {
  text?: string
  IconLeft?: React.FunctionComponent<SvgProps>
  IconRight?: React.FunctionComponent<SvgProps>
  variant?: Variant
  justifyStart?: boolean
  fullWidth?: boolean
} & ComponentPropsWithoutRef<typeof Pressable>

export const AppButton = forwardRef<AppButtonRef, AppButtonProps>((props, ref) => {
  const {
    children,
    text,
    IconLeft,
    IconRight,
    variant = "primary",
    justifyStart,
    onPress,
    onPressOut,
  } = props
  const backgroundColorRef = new Animated.Value(0)
  const backgroundColor = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: bgColorMap[variant],
  })
  const textColor = textColorMap[variant]

  const handlePress = (event: GestureResponderEvent) => {
    Animated.timing(backgroundColorRef, {
      toValue: 1,
      useNativeDriver: true,
      duration: ANUMATION_DURATION,
    }).start()
    onPress?.(event)
  }

  const onRelease = (event: GestureResponderEvent) => {
    Animated.timing(backgroundColorRef, {
      toValue: 0,
      useNativeDriver: true,
      duration: ANUMATION_DURATION,
    }).start()
    onPressOut?.(event)
  }

  return (
    <Pressable
      ref={ref}
      role="button"
      style={{ width: props.fullWidth ? "100%" : "auto" }}
      onPress={handlePress}
      onPressOut={onRelease}
      {...props}
    >
      {children ? (
        children
      ) : (
        <Animated.View
          style={{
            justifyContent: justifyStart ? "space-between" : "center",
            alignItems: "center",
            ...styles.container,
            backgroundColor,
          }}
        >
          {IconLeft && <IconLeft color={textColor} />}
          <Typography style={{ color: textColor, ...styles.text }}>{text}</Typography>
          {IconRight && <IconRight color={textColor} />}
        </Animated.View>
      )}
    </Pressable>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 10,
  },
  text: { fontWeight: 700 },
})
