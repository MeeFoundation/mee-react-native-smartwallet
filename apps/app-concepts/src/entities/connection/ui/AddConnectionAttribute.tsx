import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { PlusSmallIcon } from 'react-native-heroicons/outline'

import CheckIcon from '@/assets/images/check.svg'

import { colors } from '@/shared/config'
import { BottomSheetBackModal } from '@/shared/ui/BottomSheetModal'
import { Typography } from '@/shared/ui/Typography'

export const AddConnectionAttribute = <T extends string>({
  data,
  selected,
  onSelect,
  label,
}: {
  data: T[]
  onSelect: (value: T) => void
  selected?: T
  label?: string
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (bottomSheetRef.current) {
            bottomSheetRef.current.present()
          }
        }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.90)',
            borderColor: '#FFF',
            borderWidth: 1,
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'center',
            paddingVertical: 8,
          }}
        >
          <PlusSmallIcon stroke={colors['blue-700']} />
          <Typography
            style={{
              color: colors['blue-700'],
              fontSize: 18,
              lineHeight: 28,
            }}
          >
            {label}
          </Typography>
        </View>
      </TouchableOpacity>
      <BottomSheetBackModal
        propsStyles={{
          contentContainer: {
            backgroundColor: 'rgb(248, 248, 248)',
          },
          sheetHandler: {
            backgroundColor: 'rgb(248, 248, 248)',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
        ref={bottomSheetRef}
        title={label}
      >
        <View style={styles.dropdown}>
          {data.length >= 1 ? (
            data.map((item) => {
              const value = item
              const isSelected = selected === value
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    onSelect(item)
                    bottomSheetRef.current?.close()
                  }}
                  style={[styles.option, isSelected ? styles.optionSelected : {}]}
                >
                  <Typography style={styles.optionText}>{value}</Typography>
                  {isSelected && <CheckIcon height={24} width={24} />}
                </TouchableOpacity>
              )
            })
          ) : (
            <View style={styles.option}>
              <Typography style={styles.optionText}>No data found</Typography>
            </View>
          )}
        </View>
      </BottomSheetBackModal>
    </View>
  )
}

export const styles = StyleSheet.create({
  dropdown: {
    gap: 8,
    padding: 16,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  optionSelected: {},
  optionText: {
    fontWeight: 500,
    lineHeight: 24,
  },
})
