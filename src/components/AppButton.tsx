import { colors, hexAlphaColor } from "@utils/theme"
import { ComponentPropsWithoutRef, ElementRef, Fragment, forwardRef } from "react"
import { Animated, GestureResponderEvent, Pressable, StyleSheet } from "react-native"
import { SvgProps } from "react-native-svg"
import { Typography } from "./Typography"

type Variant = "primary" | "danger" | "tertiary"

type Size = "md" | "sm"

type AppButtonRef = ElementRef<typeof Pressable>

const ANUMATION_DURATION = 100

const bgColorMap: Record<Variant, [string, string]> = {
  primary: [colors.primary, colors.primaryActive],
  danger: [colors.white, colors.transparentActive],
  tertiary: [colors.transparent, hexAlphaColor(colors.transparentActive, 20)],
}

const textColorMap: Record<Variant, string> = {
  primary: colors.white,
  danger: colors.danger,
  tertiary: colors.secondary,
}

const sizeMap = {
  md: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  sm: {
    padding: 10,
  },
}

type AppButtonProps = {
  text?: string
  IconLeft?: React.FunctionComponent<SvgProps>
  IconRight?: React.FunctionComponent<SvgProps>
  variant?: Variant
  justifyStart?: boolean
  fullWidth?: boolean
  children?: React.ReactNode
  size?: Size
} & Omit<ComponentPropsWithoutRef<typeof Pressable>, "children">

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
    size = "md",
    ...rest
  } = props
  const backgroundColorRef = new Animated.Value(0)
  const backgroundColor = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: bgColorMap[variant],
  })
  const textColor = textColorMap[variant]
  const sizes = sizeMap[size]

  const borderRef = new Animated.Value(0)
  const borderColor = borderRef.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.transparent, colors.transparentActive],
  })

  const conditionalStyles = variant === "tertiary" ? { borderColor, borderWidth: 1 } : {}

  const handlePress = (event: GestureResponderEvent) => {
    Animated.parallel([
      Animated.timing(backgroundColorRef, {
        toValue: 1,
        useNativeDriver: true,
        duration: ANUMATION_DURATION,
      }),
      Animated.timing(borderRef, {
        toValue: 1,
        useNativeDriver: true,
        duration: ANUMATION_DURATION,
      }),
    ]).start()

    onPress?.(event)
  }

  const onRelease = (event: GestureResponderEvent) => {
    Animated.parallel([
      Animated.timing(backgroundColorRef, {
        toValue: 0,
        useNativeDriver: true,
        duration: ANUMATION_DURATION,
      }),
      Animated.timing(borderRef, {
        toValue: 0,
        useNativeDriver: true,
        duration: ANUMATION_DURATION,
      }),
    ]).start()

    onPressOut?.(event)
  }

  return (
    <Pressable
      ref={ref}
      role="button"
      style={{ width: props.fullWidth ? "100%" : "auto" }}
      onPress={handlePress}
      onPressOut={onRelease}
      {...rest}
    >
      <Animated.View
        style={{
          justifyContent: justifyStart ? "space-between" : "center",
          alignItems: "center",
          ...sizes,
          ...styles.container,
          backgroundColor,
          ...conditionalStyles,
        }}
      >
        {children ? (
          children
        ) : (
          <Fragment>
            {IconLeft && <IconLeft color={textColor} />}
            <Typography style={{ color: textColor, ...styles.text }}>{text}</Typography>
            {IconRight && <IconRight color={textColor} />}
          </Fragment>
        )}
      </Animated.View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 10,
  },
  text: { fontWeight: 700 },
})
