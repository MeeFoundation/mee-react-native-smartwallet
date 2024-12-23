import SearchIcon from "@assets/images/search.svg"
import { colors } from "@utils/theme"
import { ComponentProps, FC, useState } from "react"
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native"

type TextFieldProps = {
  value: string
  onChangeText: (text: string) => void
  label?: string
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
} & ComponentProps<typeof TextInput>

export const TextField: FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  onFocus,
  onBlur,
}) => {
  const [focus, setFocus] = useState(false)

  const inputStyle = focus ? StyleSheet.compose(styles.input, styles.inputFocus) : styles.input

  const focusHandler = () => {
    onFocus && onFocus()
    setFocus(true)
  }

  const blurHandler = () => {
    onBlur && onBlur()
    setFocus(false)
  }

  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onSubmitEditing={Keyboard.dismiss}
      />
      {!focus && <SearchIcon width={24} height={24} style={styles.inputIcon} />}
    </View>
  )
}

const styles = StyleSheet.create({
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
    right: 16,
    bottom: 13,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    color: colors.secondary,
    marginBottom: 8,
  },
  input: {
    height: 50,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors["gray-200"],
    borderRadius: 8,
  },
  inputFocus: {
    borderColor: colors.primary,
  },
})
