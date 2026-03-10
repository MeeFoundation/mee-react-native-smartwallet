import DateTimePicker from '@react-native-community/datetimepicker'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native'

import * as TextInput from '@/shared/ui/TextInput'

import type { ControlProps, DateAttributeSchema } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * DateAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type DateAttributeControlProps = ControlProps<DateAttributeSchema> & {
  onChange: (value: string) => void
}

const toDateObject = (iso: string | undefined): Date => (iso ? new Date(iso) : new Date())

const toISODate = (date: Date): string => date.toISOString().split('T')[0]

const formatDisplayDate = (iso: string | undefined): string => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString()
}

const DateAttributeControl: FC<DateAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const [showPicker, setShowPicker] = useState(false)

  const keyPath = `attribute_${props.path.join('.')}`
  const name = props.path.at(-1) ?? ''
  const label = t(`${keyPath}.label`, { defaultValue: name })
  const displayValue = formatDisplayDate(props.value)

  const handleChange = (_: unknown, selectedDate: Date | undefined) => {
    if (Platform.OS === 'android') setShowPicker(false)
    if (selectedDate) props.onChange(toISODate(selectedDate))
  }

  return (
    <View className="mt-4">
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput.Root empty={!props.value} invalid={!!props.error} size="sm">
          <TextInput.Label>{label}</TextInput.Label>
          <TextInput.Input editable={false} pointerEvents="none" value={displayValue} />
        </TextInput.Root>
      </TouchableOpacity>
      {props.error && <Text className="mt-1 ml-1 text-danger text-xs">{props.error}</Text>}

      {Platform.OS === 'ios' ? (
        <Modal animationType="slide" transparent visible={showPicker}>
          <Pressable className="flex-1 bg-black/30" onPress={() => setShowPicker(false)} />
          <View className="bg-white pb-6">
            <View className="flex-row justify-end px-4 pt-2">
              <Pressable onPress={() => setShowPicker(false)}>
                <Text className="font-medium text-base text-primary">
                  {t('common.done', { defaultValue: 'Done' })}
                </Text>
              </Pressable>
            </View>
            <DateTimePicker
              display="spinner"
              mode="date"
              onChange={handleChange}
              value={toDateObject(props.value)}
            />
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            display="default"
            mode="date"
            onChange={handleChange}
            value={toDateObject(props.value)}
          />
        )
      )}
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { DateAttributeControl }

export type { DateAttributeControlProps }
