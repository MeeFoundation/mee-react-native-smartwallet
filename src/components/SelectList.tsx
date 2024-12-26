import CheckIcon from "@assets/images/check.svg"
import ChevronDownIcon from "@assets/images/chevron-down.svg"
import CloseIcon from "@assets/images/close.svg"
import { hexAlphaColor } from "@utils/color"
import { colors } from "@utils/theme"
import { FC, PropsWithChildren, useEffect, useRef, useState } from "react"
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { TextField } from "./TextField"

type SelectListProps = {
  data: string[]
  showDropdown?: boolean
  maxHeight?: number
  onSelect: (value: string) => void
  searchPlaceholder?: string
  label?: string
  selected: string[]
}

export const SelectList: FC<SelectListProps> = ({
  data,
  showDropdown = false,
  maxHeight,
  selected,
  onSelect,
  searchPlaceholder,
  label,
}) => {
  const [_firstRender, _setFirstRender] = useState<boolean>(true)
  const [dropdown, setDropdown] = useState<boolean>(showDropdown)
  const [height, setHeight] = useState<number>(350)
  const dropdownHeight = useRef(new Animated.Value(0)).current
  const [filteredData, setFilteredData] = useState(data)
  const [search, setSearch] = useState<string>("")
  const [collapsed, setCollapsed] = useState<boolean>(false)

  const expandDropdown = () => {
    setDropdown(true)

    Animated.timing(dropdownHeight, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }
  const collapseDropdown = () => {
    Animated.timing(dropdownHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setDropdown(false))
  }

  const toggleContent = () => {
    setCollapsed(!collapsed)
    if (!collapsed) {
      collapseDropdown()
    }
  }

  // Set initial height and filtered data
  useEffect(() => {
    if (maxHeight) setHeight(maxHeight)
  }, [maxHeight])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  useEffect(() => {
    if (!_firstRender) {
      if (showDropdown) {
        expandDropdown()
      } else {
        collapseDropdown()
      }
    }
  }, [showDropdown])

  useEffect(() => {
    if (search.length > 0) {
      let filtered = data.filter((item) => {
        return item.toLowerCase().includes(search.toLowerCase())
      })
      setFilteredData(filtered)
    } else {
      setFilteredData(data)
    }
  }, [search])

  return (
    <View>
      <View style={[styles.labelWrapper, collapsed ? { marginBottom: 0 } : null]}>
        <Text style={styles.label}>{label}</Text>
        <Pressable onPress={toggleContent}>
          <ChevronDownIcon
            width={24}
            height={24}
            style={{ transform: [{ rotate: collapsed ? "0deg" : "180deg" }] }}
          />
        </Pressable>
      </View>
      <View style={collapsed ? styles.collapsedContent : null}>
        <TextField
          placeholder={searchPlaceholder}
          onChangeText={setSearch}
          value={search}
          onFocus={expandDropdown}
          onBlur={collapseDropdown}
        />
        {selected.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {selected.map((item, index) => (
              <SelectedLabel key={index} onPress={() => onSelect(item)}>
                {item}
              </SelectedLabel>
            ))}
          </View>
        )}
        {dropdown && (
          <Animated.ScrollView style={[{ maxHeight: dropdownHeight }, styles.dropdown]}>
            <View style={[{ maxHeight: height }]}>
              <ScrollView nestedScrollEnabled={true}>
                {filteredData.length >= 1 ? (
                  filteredData.map((item, index: number) => {
                    let value = item
                    const isSelected = selected?.indexOf(value) != -1
                    return (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          isSelected ? styles.optionSelected : {},
                          index != filteredData.length - 1 ? styles.optionBordered : {},
                        ]}
                        key={index}
                        onPress={() => onSelect(item)}
                      >
                        <Text style={styles.optionText}>#{value}</Text>
                        {isSelected && <CheckIcon width={24} height={24} />}
                      </TouchableOpacity>
                    )
                  })
                ) : (
                  <TouchableOpacity style={styles.option} onPress={() => setSearch("")}>
                    <Text style={styles.optionText}>No data found</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </Animated.ScrollView>
        )}
      </View>
    </View>
  )
}

type SelectedLabelProps = {
  onPress: () => void
} & PropsWithChildren

const SelectedLabel: FC<SelectedLabelProps> = ({ children, onPress }) => {
  return (
    <View style={styles.selectedItem}>
      <Text style={styles.selectedText}>{children}</Text>
      <Pressable onPress={onPress}>
        <CloseIcon width={18} height={18} color={colors.primary} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    position: "absolute",
    top: 58,
    left: 0,
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors["gray-200"],
    overflow: "hidden",
    boxShadow: "0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A",
    zIndex: 100,
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
  placeholderText: {
    color: colors.gray,
    fontSize: 18,
    fontWeight: 500,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: hexAlphaColor(colors.primary, 50),
    backgroundColor: hexAlphaColor(colors.primary, 10),
  },
  selectedText: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 24,
    color: colors.primary,
  },
  labelWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    color: colors.secondary,
  },
  collapsedContent: {
    display: "none",
  },
})
