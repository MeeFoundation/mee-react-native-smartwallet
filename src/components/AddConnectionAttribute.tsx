import CheckIcon from "@assets/images/check.svg"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { colors } from "@utils/theme"
import { useRef } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { PlusSmallIcon } from "react-native-heroicons/outline"
import { BottomSheetBackModal } from "./BottomSheetModal"
import { Typography } from "./Typography"

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
            borderColor: "#FFF",
            borderWidth: 1,
            backgroundColor: "rgba(255, 255, 255, 0.90)",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 8,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <PlusSmallIcon stroke={colors["blue-700"]} />
          <Typography
            style={{
              fontSize: 18,
              lineHeight: 28,
              color: colors["blue-700"],
            }}
          >
            {label}
          </Typography>
        </View>
      </TouchableOpacity>
      <BottomSheetBackModal
        ref={bottomSheetRef}
        title={label}
        propsStyles={{
          contentContainer: {
            backgroundColor: "rgb(248, 248, 248)",
          },
          sheetHandler: {
            backgroundColor: "rgb(248, 248, 248)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <View style={styles.dropdown}>
          {data.length >= 1 ? (
            data.map((item, index: number) => {
              const value = item
              const isSelected = selected === value
              return (
                <TouchableOpacity
                  style={[styles.option, isSelected ? styles.optionSelected : {}]}
                  key={index}
                  onPress={() => {
                    onSelect(item)
                    bottomSheetRef.current?.close()
                  }}
                >
                  <Typography style={styles.optionText}>{value}</Typography>
                  {isSelected && <CheckIcon width={24} height={24} />}
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
    padding: 16,
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.07)",
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  optionText: {
    lineHeight: 24,
    fontWeight: 500,
  },
  optionSelected: {},
})
