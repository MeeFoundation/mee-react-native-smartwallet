import type { FC } from 'react'
import { TextInput as NativeTextInput, StyleSheet, type TextInputProps } from 'react-native'

import { colors, fonts } from '@/shared/config'

const PLACEHOLDER_TEXT_COLOR = colors['gray-600']

const textInputStyles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.white,
    borderColor: colors['black/07'],
    borderRadius: 8,
    borderWidth: 1,
    color: colors['gray-900'],
    fontFamily: fonts.publicSans.regular,
    fontSize: 14,
    fontWeight: '400',
    height: 40,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
})

/* -------------------------------------------------------------------------------------------------
 * TextInput
 * -----------------------------------------------------------------------------------------------*/
const TextInput: FC<TextInputProps> = ({ style, ...props }) => (
  <NativeTextInput
    {...props}
    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
    style={[textInputStyles.textInput, style]}
  />
)

/* -----------------------------------------------------------------------------------------------*/

export { TextInput }

export type { TextInputProps }

export { PLACEHOLDER_TEXT_COLOR, textInputStyles }
