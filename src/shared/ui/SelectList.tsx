import { type FC, type PropsWithChildren, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import CheckIcon from '@/assets/images/check.svg'
import CloseIcon from '@/assets/images/close.svg'

import { colors } from '@/shared/config'
import { hexAlphaColor } from '@/shared/lib/styling'

import { Accordion } from './Accordion'
import { Backdrop } from './Backdrop'
import { SearchTextField } from './SearchTextField'

type SelectListProps = {
  data: string[]
  showDropdown?: boolean
  maxHeight?: number
  onSelect: (value: string) => void
  searchPlaceholder?: string
  label?: string
  selected: string[]
  showCounter?: boolean
  onCreate?: (value: string) => void
}

export const SelectList: FC<SelectListProps> = ({
  data,
  showDropdown = false,
  maxHeight,
  selected,
  onSelect,
  searchPlaceholder,
  label,
  showCounter = false,
  onCreate,
}) => {
  const [_firstRender] = useState<boolean>(true)
  const [dropdown, setDropdown] = useState<boolean>(showDropdown)
  const [height, setHeight] = useState<number>(350)
  const dropdownHeight = useRef(new Animated.Value(0)).current
  const [filteredData, setFilteredData] = useState(data)
  const [search, setSearch] = useState<string>('')

  const expandDropdown = () => {
    setDropdown(true)

    Animated.timing(dropdownHeight, {
      duration: 300,
      easing: Easing.linear,
      toValue: height,
      useNativeDriver: false,
    }).start()
  }
  const collapseDropdown = () => {
    Keyboard.dismiss()

    Animated.timing(dropdownHeight, {
      duration: 300,
      easing: Easing.linear,
      toValue: 0,
      useNativeDriver: false,
    }).start(() => setDropdown(false))
  }

  const addOption = (value: string) => {
    if (onCreate) {
      onCreate(value)
      setSearch('')
    }
  }

  // Set initial height and filtered data
  useEffect(() => {
    if (maxHeight) {
      setHeight(maxHeight)
    }
  }, [maxHeight])

  useEffect(() => {
    if (search.length > 0) {
      const filtered = data.filter((item) => {
        return item.toLowerCase().includes(search.toLowerCase())
      })
      setFilteredData(filtered)
    } else {
      setFilteredData(data)
    }
  }, [data, search])

  // biome-ignore lint/correctness/useExhaustiveDependencies: react only on showDropdown
  useEffect(() => {
    if (!_firstRender) {
      if (showDropdown) {
        expandDropdown()
      } else {
        collapseDropdown()
      }
    }
  }, [showDropdown])

  return (
    <View>
      <Accordion
        collapsed={false}
        head={
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4 }}>
            <Text style={styles.label}>{label}</Text>
            {showCounter && (
              <View style={styles.counterWrapper}>
                <Text style={styles.counter}>{selected.length}</Text>
              </View>
            )}
          </View>
        }
        onToggle={(collapsed) => collapsed && collapseDropdown()}
        propsStyles={{ container: dropdown ? { zIndex: 999 } : {} }}
      >
        <SearchTextField
          onBlur={collapseDropdown}
          onChangeText={setSearch}
          onFocus={expandDropdown}
          placeholder={searchPlaceholder}
          style={dropdown && { zIndex: 99 }}
          value={search}
        />
        {selected.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {selected.map((item, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: index as a key
              <SelectedLabel key={index} onPress={() => onSelect(item)}>
                {item}
              </SelectedLabel>
            ))}
          </View>
        )}
        {dropdown && (
          <Animated.View style={[{ maxHeight: dropdownHeight }, styles.dropdown]}>
            <ScrollView nestedScrollEnabled={true} style={[{ maxHeight: height, zIndex: 999 }]}>
              {search.length > 0 && !data.includes(search) && (
                <View style={styles.option}>
                  <Text style={styles.optionText}>#{search}</Text>
                  {onCreate && (
                    <Pressable onPress={() => addOption(search)}>
                      <Text style={{ color: colors.link, fontSize: 12 }}>Create</Text>
                    </Pressable>
                  )}
                </View>
              )}
              {filteredData.length >= 1 ? (
                filteredData.map((item, index: number) => {
                  const value = item
                  const isSelected = selected?.indexOf(value) !== -1
                  return (
                    <TouchableOpacity
                      // biome-ignore lint/suspicious/noArrayIndexKey: index as a key
                      key={index}
                      onPress={() => onSelect(item)}
                      style={[
                        styles.option,
                        isSelected ? styles.optionSelected : {},
                        index !== filteredData.length - 1 ? styles.optionBordered : {},
                      ]}
                    >
                      <Text style={styles.optionText}>#{value}</Text>
                      {isSelected && <CheckIcon height={24} width={24} />}
                    </TouchableOpacity>
                  )
                })
              ) : (
                <TouchableOpacity onPress={() => setSearch('')} style={styles.option}>
                  <Text style={styles.optionText}>No data found</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </Animated.View>
        )}
        {dropdown && <Backdrop onClick={collapseDropdown} />}
      </Accordion>
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
      <Pressable hitSlop={8} onPress={onPress}>
        <CloseIcon color={colors.primary} height={18} width={18} />
      </Pressable>
    </View>
  )
}

export const styles = StyleSheet.create({
  counter: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14,
  },
  counterWrapper: {
    backgroundColor: colors['gray-100'],
    borderColor: hexAlphaColor(colors.primary, 50),
    borderRadius: 3,
    borderWidth: 1,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderColor: colors['gray-200'],
    borderRadius: 8,
    borderWidth: 1,
    boxShadow: '0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A',
    flex: 1,
    marginTop: 8,
    overflow: 'hidden',
    width: '100%',
    zIndex: 999,
  },
  label: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  labelWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  optionBordered: {
    borderBottomWidth: 1,
    borderColor: '#B2B3B6',
  },
  optionSelected: {
    backgroundColor: colors['gray-100'],
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
    alignItems: 'center',
    backgroundColor: hexAlphaColor(colors.primary, 10),
    borderColor: hexAlphaColor(colors.primary, 50),
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
  },
  selectedText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 24,
  },
})
