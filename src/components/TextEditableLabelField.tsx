import { FC } from "react"
import { StyleSheet, Text, View, ViewStyle } from "react-native"
import { InputSize, TextField, textFieldStyles } from "./TextField"

export type TextEditableLabelFieldProps = {
  value: string | undefined
  labelValue: string | undefined
  onChangeText: (text: string) => void
  onChangeLabel: (text: string) => void
  size?: InputSize
  style?: ViewStyle
  placeholder?: string
  labelPlaceholder?: string
  errorText?: string
  labelErrorText?: string
  disabled?: boolean
}

export const TextEditableLabelField: FC<TextEditableLabelFieldProps> = ({
  value,
  labelValue,
  onChangeText,
  onChangeLabel,
  placeholder,
  labelPlaceholder,
  style,
  size = "lg",
  errorText,
  labelErrorText,
  disabled,
}) => {
  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      <TextField
        value={labelValue}
        disabled={disabled}
        size={size}
        onChangeText={onChangeLabel}
        placeholder={labelPlaceholder}
        propsStyles={{ input: styles.inputTop }}
      />
      <TextField
        value={value}
        disabled={disabled}
        size={size}
        onChangeText={onChangeText}
        placeholder={placeholder}
        propsStyles={{ input: styles.inputBottom }}
      />
      {labelErrorText && <Text style={textFieldStyles.errorText}>Label: {labelErrorText}</Text>}
      {errorText && <Text style={textFieldStyles.errorText}>Value: {errorText}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  inputTop: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputBottom: {
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
})
