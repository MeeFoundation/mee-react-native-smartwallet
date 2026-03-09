import { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import * as TextInput from '@/shared/ui/TextInput'

import type { ControlProps, StringAttributeSchema } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * StringAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type StringAttributeControlProps = ControlProps<StringAttributeSchema>

const StringAttributeControl: FC<StringAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const [value, setValue] = useState(props.value ?? '')

  const name = props.path.at(-1) ?? ''
  const label = t(`attribute_${props.path.join('.')}.label`, { defaultValue: name })

  return (
    <View className="mt-3">
      <TextInput.Root size="sm" empty={!value}>
        <TextInput.Label>{label}</TextInput.Label>
        <TextInput.Input onChangeText={setValue} value={value} />
      </TextInput.Root>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { StringAttributeControl }

export type { StringAttributeControlProps }
