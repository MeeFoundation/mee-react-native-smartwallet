import { type FC, useCallback, useState } from 'react'
import { View } from 'react-native'

import { IconButton } from '@/shared/ui/IconButton'
import * as TextInput from '@/shared/ui/TextInput'

import type { AttributeSchema } from '../model/types'
import type { AttributeRendererProps } from './AttributeRenderer.types'

/* -------------------------------------------------------------------------------------------------
 * StringAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type StringAttributeControlProps = AttributeRendererProps

const StringAttributeControl: FC<AttributeRendererProps<AttributeSchema>> = (props) => {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState(typeof props.value === 'string' ? props.value : '')

  const handleFocus = useCallback(() => setFocused(true), [])
  const handleBlur = useCallback(() => setFocused(false), [])
  const clearValue = useCallback(() => setValue(''), [])

  return (
    <View>
      <TextInput.Root empty={!value} variant="plain">
        <TextInput.Label>{props.name}</TextInput.Label>
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
