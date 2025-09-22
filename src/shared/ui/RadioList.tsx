// TODO refactor

import type { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@/shared/config'

import { AnimatedTouchable } from './AnimatedTouchable'
import { Typography } from './Typography'

type RadioListProps = {
  data: { title: string; count: number }[]
  onSelect: (value: string) => void
  selected: string
}

export const RadioList: FC<RadioListProps> = ({ data, selected, onSelect }) => {
  return (
    <View style={[{ zIndex: 999 }]}>
      {/* <ScrollView nestedScrollEnabled={true} style={[{ zIndex: 999 }]}> */}
      <View style={styles.container}>
        {data.map((item) => {
          const isActive = selected === item.title
          return (
            <AnimatedTouchable
              key={item.title}
              onPress={() => onSelect(item.title)}
              style={{
                ...styles.item,
                backgroundColor: isActive ? 'white' : 'transparent',
                borderColor: isActive ? colors.primaryActive : colors['gray-200'],
                borderWidth: isActive ? 2 : 1,
              }}
            >
              <View style={styles.itemRow}>
                <Typography>{item.title}</Typography>
                <Typography style={{ color: colors['gray-400'] }}>({item.count})</Typography>
              </View>
              <View
                style={{
                  ...styles.checkItem,
                  borderColor: isActive ? colors.primaryActive : colors['gray-400'],
                }}
              >
                {isActive && (
                  <View
                    style={{
                      backgroundColor: colors.primaryActive,
                      borderRadius: 100,
                      height: 12,
                      width: 12,
                    }}
                  />
                )}
              </View>
            </AnimatedTouchable>
          )
        })}
      </View>
      {/* </ScrollView> */}
    </View>
  )
}

export const styles = StyleSheet.create({
  checkItem: {
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  container: { gap: 8 },
  item: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 16,
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  itemRow: { flexDirection: 'row', gap: 5 },
})
