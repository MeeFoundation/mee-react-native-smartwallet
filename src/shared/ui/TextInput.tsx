import { colors, fonts } from "@/shared/config"
import type { FC } from "react"
import { TextInput as NativeTextInput, StyleSheet, type TextInputProps } from "react-native"

const PLACEHOLDER_TEXT_COLOR = colors["gray-600"]

const textInputStyles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors["black/07"],
    fontFamily: fonts.publicSans.regular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors["gray-900"],
    paddingHorizontal: 10,
    height: 40,
  },
})

/* -------------------------------------------------------------------------------------------------
 * TextInput
 * -----------------------------------------------------------------------------------------------*/
const TextInput: FC<TextInputProps> = ({ style, ...props }) => (
  <NativeTextInput
    {...props}
    style={[textInputStyles.textInput, style]}
    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
  />
)

/* -----------------------------------------------------------------------------------------------*/

export { TextInput }

export type { TextInputProps }

export { PLACEHOLDER_TEXT_COLOR, textInputStyles }
