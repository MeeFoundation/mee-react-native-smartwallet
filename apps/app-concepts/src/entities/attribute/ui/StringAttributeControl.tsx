import { type FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { IconButton } from '@/shared/ui/IconButton'
import * as TextInput from '@/shared/ui/TextInput'

import type { ControlProps, StringAttributeSchema } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * StringAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type StringAttributeControlProps = ControlProps<StringAttributeSchema>

const StringAttributeControl: FC<StringAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState(props.value ?? '')

  const name = props.path.at(-1) ?? ''
  const label = t(`attribute_${props.path.join('.')}.label`, { defaultValue: name })

  const handleFocus = useCallback(() => setFocused(true), [])
  const handleBlur = useCallback(() => setFocused(false), [])
  const clearValue = useCallback(() => setValue(''), [])

  return (
    <View>
      <TextInput.Root empty={!value} variant="plain">
        <TextInput.Label>{label}</TextInput.Label>
        <TextInput.Input onBlur={handleBlur} onChangeText={setValue} onFocus={handleFocus} value={value} />
        <TextInput.Actions>
          {focused && (
            <>
              <TextInput.Action>
                <IconButton icon="x-mark.outlined" onPress={clearValue} size="full" />
              </TextInput.Action>
              <TextInput.Action>
                <IconButton icon="trash.outlined" iconClassName="text-danger" size="full" />
              </TextInput.Action>
            </>
          )}
        </TextInput.Actions>
      </TextInput.Root>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { StringAttributeControl }

export type { StringAttributeControlProps }
