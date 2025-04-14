import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { colors } from "@utils/theme"
import { ComponentProps, FC, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { SvgProps } from "react-native-svg"
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
  propsStyles?: { container?: ViewStyle; input?: ViewStyle }
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
}) => {
  const inputRef = useRef<TextInput>(null)

  const getInputHeight = (sz: InputSize) => {
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

  const inputStyle = StyleSheet.compose(
    inputRef.current?.isFocused()
      ? StyleSheet.compose(textFieldStyles.input, textFieldStyles.inputFocus)
      : textFieldStyles.input,
    getInputHeight(size),
  )

  const iconStyle = StyleSheet.compose(textFieldStyles.inputIcon, getInputIconSize(size))

  const focusHandler = () => {
    inputRef.current?.focus()
    onFocus && onFocus()
  }

  const blurHandler = () => {
    inputRef.current?.blur()
    onBlur && onBlur()
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
    style: [inputStyle, errorText && textFieldStyles.errorBorder, propsStyles?.input],
    placeholderTextColor: colors["gray-400"],
    onFocus: focusHandler,
    onSubmitEditing: blurHandler,
  }

  return (
    <View style={StyleSheet.compose(textFieldStyles.container, propsStyles?.container)}>
      {label && <Text style={textFieldStyles.label}>{label}</Text>}
      {isBottomSheetTextInput ? (
        <BottomSheetTextInput {...inputProps} />
      ) : (
        <TextInput {...inputProps} />
      )}
      {errorText && <Text style={textFieldStyles.errorText}>{errorText}</Text>}

      {RightIconActive && inputRef.current?.isFocused() && (
        <TouchableOpacity onPress={clearHandler}>
          <RightIconActive
            width={24}
            height={24}
            style={[iconStyle]}
            color={inputRef.current?.isFocused() ? "black" : colors["gray-400"]}
          />
        </TouchableOpacity>
      )}
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {RightIcon && ((RightIconActive && !inputRef.current?.isFocused()) || !RightIconActive) && (
        <TouchableOpacity onPress={focusHandler}>
          <RightIcon
            width={24}
            height={24}
            style={[iconStyle]}
            color={inputRef.current?.isFocused() ? "black" : colors["gray-400"]}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export const textFieldStyles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
  },
  inputIcon: {
    color: colors["gray-400"],
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
  input: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors["gray-200"],
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  inputFocus: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
})
