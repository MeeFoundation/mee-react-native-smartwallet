// TODO refactor
import { colors } from "@/constants/colors"
import { type FC } from "react"
import { StyleSheet, View } from "react-native"
import { AnimatedTouchable } from "./AnimatedTouchable"
import { Typography } from "./Typography"

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
              onPress={() => onSelect(item.title)}
              key={item.title}
              style={{
                ...styles.item,
                backgroundColor: isActive ? "white" : "transparent",
                borderWidth: isActive ? 2 : 1,
                borderColor: isActive ? colors.primaryActive : colors["gray-200"],
              }}
            >
              <View style={styles.itemRow}>
                <Typography>{item.title}</Typography>
                <Typography style={{ color: colors["gray-400"] }}>({item.count})</Typography>
              </View>
              <View
                style={{
                  ...styles.checkItem,
                  borderColor: isActive ? colors.primaryActive : colors["gray-400"],
                }}
              >
                {isActive && (
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
          )
        })}
      </View>
      {/* </ScrollView> */}
    </View>
  )
}

export const styles = StyleSheet.create({
  container: { gap: 8 },
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
