import CheckIcon from "@assets/images/check.svg"
import { colors } from "@utils/theme"
import { FC } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Accordion } from "./Accordion"
import { TextField } from "./TextField"

type SingleSelectFieldProps = {
  data: string[]
  showDropdown?: boolean
  onSelect: (value: string) => void
  placeholder?: string
  selected?: string
}

export const SingleSelectField: FC<SingleSelectFieldProps> = ({
  data,
  showDropdown = false,
  selected,
  onSelect,
  placeholder,
}) => {
  return (
    <View>
      <Accordion
        collapsed={!showDropdown}
        contentMaxHeight={data.length ? data.length * 50 + 8 : 58}
        head={
          <View style={{ flexGrow: 1 }}>
            <TextField placeholder={placeholder} value={selected} onChangeText={() => {}} />
          </View>
        }
        propsStyles={{
          arrow: {
            position: "absolute",
            right: 20,
          },
        }}
      >
        <View style={styles.dropdown}>
          {data.length >= 1 ? (
            data.map((item, index: number) => {
              let value = item
              const isSelected = selected === value
              return (
                <TouchableOpacity
                  style={[
                    styles.option,
                    isSelected ? styles.optionSelected : {},
                    index !== data.length - 1 ? styles.optionBordered : {},
                  ]}
                  key={index}
                  onPress={() => onSelect(item)}
                >
                  <Text style={styles.optionText}>{value}</Text>
                  {isSelected && <CheckIcon width={24} height={24} />}
                </TouchableOpacity>
              )
            })
          ) : (
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>No data found</Text>
            </TouchableOpacity>
          )}
        </View>
      </Accordion>
    </View>
  )
}

export const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors["gray-200"],
    overflow: "hidden",
    boxShadow: "0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A",
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  optionBordered: {
    borderBottomWidth: 1,
    borderColor: "#B2B3B6",
  },
  optionSelected: {
    backgroundColor: colors["gray-100"],
  },
  optionText: {
    fontSize: 17,
    lineHeight: 24,
  },
})
