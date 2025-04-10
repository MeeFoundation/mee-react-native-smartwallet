import { colors } from "@utils/theme"
import { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { PlusIcon } from "react-native-heroicons/outline"
import { AnimatedTouchable } from "./AnimatedTouchable"
import { AppButton } from "./AppButton"
import { TextField } from "./TextField"
import { Typography } from "./Typography"

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
  const [email, setEmail] = useState<string>(filter.email ?? "")
  const [paymentDetails, setPaymentDetails] = useState<string>(filter.paymentDetails ?? "")
  const [password, setPassword] = useState<boolean>(filter.password ?? false)
  const [phone, setPhone] = useState<boolean>(filter.phone ?? false)

  useEffect(() => {
    setEmail(filter.email ?? "")
    setPaymentDetails(filter.paymentDetails ?? "")
    setPassword(filter.password ?? false)
    setPhone(filter.phone ?? false)
  }, [filter.email, filter.password, filter.paymentDetails, filter.phone])
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View style={styles.container}>
        <TextField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          size="md"
          RightIcon={PlusIcon}
          isBottomSheetTextInput
        />
        <AnimatedTouchable
          onPress={() => setPassword(!password)}
          style={{
            ...styles.item,
            borderWidth: password ? 2 : 1,
            borderColor: password ? colors.primaryActive : colors["gray-200"],
          }}
        >
          <View style={styles.itemRow}>
            <Typography>Password</Typography>
          </View>
          <View
            style={{
              ...styles.checkItem,
              borderColor: password ? colors.primaryActive : colors["gray-400"],
            }}
          >
            {password && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: colors.primaryActive,
                  borderRadius: 100,
                }}
              />
            )}
          </View>
        </AnimatedTouchable>
        <AnimatedTouchable
          onPress={() => setPhone(!phone)}
          style={{
            ...styles.item,
            borderWidth: phone ? 2 : 1,
            borderColor: phone ? colors.primaryActive : colors["gray-200"],
          }}
        >
          <View style={styles.itemRow}>
            <Typography>Phone</Typography>
          </View>
          <View
            style={{
              ...styles.checkItem,
              borderColor: phone ? colors.primaryActive : colors["gray-400"],
            }}
          >
            {phone && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: colors.primaryActive,
                  borderRadius: 100,
                }}
              />
            )}
          </View>
        </AnimatedTouchable>
        <TextField
          placeholder="Payment Details"
          value={paymentDetails}
          onChangeText={setPaymentDetails}
          size="md"
          RightIcon={PlusIcon}
          isBottomSheetTextInput
        />
        <AppButton
          onPress={() => onChangeFilter({ ...filter, email, paymentDetails })}
          text="Apply filters"
          style={{ flex: 1 }}
          fullWidth={true}
        />
      </View>
    </View>
  )
}

export const styles = StyleSheet.create({
  container: { gap: 8, flex: 1, width: "100%" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
    gap: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 44,
  },
  itemRow: { flexDirection: "row", gap: 5 },
  checkItem: {
    width: 16,
    height: 16,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
