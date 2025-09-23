// TODO refactor

import { type FC, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { PlusIcon } from 'react-native-heroicons/outline'

import { colors } from '@/shared/config'
import { AnimatedTouchable } from '@/shared/ui/AnimatedTouchable'
import { AppButton } from '@/shared/ui/AppButton'
import { TextField } from '@/shared/ui/TextField'
import { Typography } from '@/shared/ui/Typography'

export type FilterValue = {
  email?: string
  paymentDetails?: string
  password?: boolean
  phone?: boolean
}

type FilterConnectionsProps = {
  onChangeFilter: (value: FilterValue) => void
  filter: FilterValue
}

export const FilterConnections: FC<FilterConnectionsProps> = ({ filter, onChangeFilter }) => {
  const [email, setEmail] = useState<string>(filter.email ?? '')
  const [paymentDetails, setPaymentDetails] = useState<string>(filter.paymentDetails ?? '')
  const [password, setPassword] = useState<boolean>(filter.password ?? false)
  const [phone, setPhone] = useState<boolean>(filter.phone ?? false)

  useEffect(() => {
    setEmail(filter.email ?? '')
    setPaymentDetails(filter.paymentDetails ?? '')
    setPassword(filter.password ?? false)
    setPhone(filter.phone ?? false)
  }, [filter.email, filter.password, filter.paymentDetails, filter.phone])
  return (
    <View style={{ height: '100%', width: '100%' }}>
      <View style={styles.container}>
        <TextField
          isBottomSheetTextInput
          onChangeText={setEmail}
          placeholder="Email"
          RightIcon={PlusIcon}
          size="md"
          value={email}
        />
        <AnimatedTouchable
          onPress={() => setPassword(!password)}
          style={{
            ...styles.item,
            borderColor: password ? colors.primaryActive : colors['gray-200'],
            borderWidth: password ? 2 : 1,
          }}
        >
          <View style={styles.itemRow}>
            <Typography>Password</Typography>
          </View>
          <View
            style={{
              ...styles.checkItem,
              borderColor: password ? colors.primaryActive : colors['gray-400'],
            }}
          >
            {password && (
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
        <AnimatedTouchable
          onPress={() => setPhone(!phone)}
          style={{
            ...styles.item,
            borderColor: phone ? colors.primaryActive : colors['gray-200'],
            borderWidth: phone ? 2 : 1,
          }}
        >
          <View style={styles.itemRow}>
            <Typography>Phone</Typography>
          </View>
          <View
            style={{
              ...styles.checkItem,
              borderColor: phone ? colors.primaryActive : colors['gray-400'],
            }}
          >
            {phone && (
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
        <TextField
          isBottomSheetTextInput
          onChangeText={setPaymentDetails}
          placeholder="Payment Details"
          RightIcon={PlusIcon}
          size="md"
          value={paymentDetails}
        />
        <AppButton
          fullWidth={true}
          onPress={() => onChangeFilter({ ...filter, email, paymentDetails })}
          style={{ flex: 1 }}
          text="Apply filters"
        />
      </View>
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
  container: { flex: 1, gap: 8, width: '100%' },
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
