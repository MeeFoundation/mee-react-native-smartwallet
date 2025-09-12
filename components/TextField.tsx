import { colors } from "@/constants/colors"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { type ComponentProps, type FC, useRef, useState } from "react"
import {
  Animated,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
  useAnimatedValue,
} from "react-native"
import { TextInput } from "react-native-gesture-handler"
import type { SvgProps } from "react-native-svg"

export type InputSize = "md" | "lg"

export type TextFieldProps = {
  value: string | undefined
  onChangeText: (text: string) => void
  label?: string
  size?: InputSize
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
  RightIcon?: React.FunctionComponent<SvgProps>
  RightIconActive?: React.FunctionComponent<SvgProps>
  errorText?: string
  disabled?: boolean
  isBottomSheetTextInput?: boolean
  isLabelInside?: boolean
  propsStyles?: { container?: StyleProp<ViewStyle>; input?: StyleProp<TextStyle> }
} & ComponentProps<typeof TextInput>

export const TextField: FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  propsStyles,
  onFocus,
  onBlur,
  RightIcon,
  RightIconActive,
  size = "lg",
  errorText,
  disabled,
  isBottomSheetTextInput,
  isLabelInside,
}) => {
  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)
  const insideLabelTranslateYValue = useAnimatedValue(value ? 0 : 9)

  const getInputHeight = (sz: InputSize) => {
    if (isLabelInside) {
      return
    }
    if (sz === "md") {
      return { height: 44 }
    }
    return { height: 50 }
  }
  const getInputIconSize = (sz: InputSize) => {
    if (sz === "md") {
      return { right: 16, bottom: 9 }
    }
    return { right: 16, bottom: 13 }
  }

  const inputStyle = [
    ...(isFocused ? [textFieldStyles.input, textFieldStyles.inputFocus] : [textFieldStyles.input]),
    getInputHeight(size),
  ]

  const iconStyle = [textFieldStyles.inputIcon, getInputIconSize(size)]

  const focusHandler = () => {
    onFocus && onFocus()
    inputRef.current?.focus()
    setIsFocused(true)

    if (isLabelInside && !value) {
      Animated.timing(insideLabelTranslateYValue, {
        toValue: 0,
        useNativeDriver: true,
        duration: 150,
      }).start()
    }
  }

  const blurHandler = () => {
    onBlur && onBlur()
    inputRef.current?.blur()
    setIsFocused(false)

    if (isLabelInside && !value) {
      Animated.timing(insideLabelTranslateYValue, {
        toValue: 9,
        useNativeDriver: true,
        duration: 150,
      }).start()
    }
  }

  const clearHandler = () => {
    onChangeText("")
  }

  const inputProps = {
    ref: inputRef,
    value: value,
    editable: !disabled,
    onChangeText: onChangeText,
    placeholder: placeholder,
    style: [
      inputStyle,
      errorText && textFieldStyles.errorBorder,
      propsStyles?.input,
      isLabelInside && textFieldStyles.labelInsideInput,
      isLabelInside && errorText && { paddingBottom: 22 },
    ] satisfies StyleProp<TextStyle>,
    placeholderTextColor: colors["gray-400"],
    onFocus: focusHandler,
    onBlur: blurHandler,
    onSubmitEditing: blurHandler,
  }

  return (
    <View style={[textFieldStyles.container, propsStyles?.container]}>
      {label && (
        <Animated.Text
          style={[
            textFieldStyles.label,
            isLabelInside && textFieldStyles.labelInsideLabel,
            isLabelInside && {
              transform: [
                {
                  scale: insideLabelTranslateYValue.interpolate({
                    inputRange: [0, 9],
                    outputRange: [1, 1.25],
                  }),
                },
                { translateY: insideLabelTranslateYValue },
              ],
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}
      {isBottomSheetTextInput ? (
        <BottomSheetTextInput {...inputProps} />
      ) : (
        <TextInput {...inputProps} />
      )}
      {errorText && (
        <Text
          style={[textFieldStyles.errorText, isLabelInside && textFieldStyles.labelInsideError]}
        >
          {errorText}
        </Text>
      )}
      {RightIconActive && inputRef.current?.isFocused() && (
        <TouchableOpacity onPress={clearHandler}>
          <RightIconActive width={24} height={24} style={iconStyle} color={"black"} />
        </TouchableOpacity>
      )}
      {}
      {RightIcon && ((RightIconActive && !inputRef.current?.isFocused()) || !RightIconActive) && (
        <TouchableOpacity onPress={focusHandler}>
          <RightIcon
            width={24}
            height={24}
            style={iconStyle}
            color={inputRef.current?.isFocused() ? "black" : colors["gray-400"]}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export const textFieldStyles = StyleSheet.create({
  container: {
    position: "relative",
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
  },
  inputIcon: {
    position: "absolute",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    color: colors.secondary,
    marginBottom: 2,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  labelInsideError: {
    position: "absolute",
    bottom: 8,
    left: 16,
  },
  labelInsideLabel: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 10,
    color: colors["gray-800"],
  },
  labelInsideInput: {
    paddingTop: 24,
    paddingBottom: 6,
    fontWeight: "500",
  },
  input: {
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors["gray-200"],
    backgroundColor: colors.white,
    borderRadius: 8,
    lineHeight: 20,
    fontSize: 16,
  },
  inputFocus: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
})
