import type { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import {
  MagnifyingGlassIcon,
  MicrophoneIcon,
  SparklesIcon,
} from 'react-native-heroicons/outline'

import { colors } from '@/shared/config'

export type SearchMode = 'text' | 'ai' | 'voice'

type SearchModeSwitchProps = {
  value: SearchMode
  onChange: (mode: SearchMode) => void
}

type Segment = {
  mode: SearchMode
  labelKey:
    | 'tabs.wallet.search_mode_text'
    | 'tabs.wallet.search_mode_ai'
    | 'tabs.wallet.search_mode_voice'
  Icon: React.FC<{ color: string; width: number; height: number }>
}

const SEGMENTS: Segment[] = [
  { mode: 'text', labelKey: 'tabs.wallet.search_mode_text', Icon: MagnifyingGlassIcon },
  { mode: 'ai', labelKey: 'tabs.wallet.search_mode_ai', Icon: SparklesIcon },
  { mode: 'voice', labelKey: 'tabs.wallet.search_mode_voice', Icon: MicrophoneIcon },
]

const SearchModeSwitch: FC<SearchModeSwitchProps> = ({ value, onChange }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.track}>
      {SEGMENTS.map(({ mode, labelKey, Icon }) => {
        const isActive = value === mode
        return (
          <TouchableOpacity
            key={mode}
            activeOpacity={0.7}
            onPress={() => onChange(mode)}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <Icon
              color={isActive ? colors.primary : colors['gray-400']}
              height={16}
              width={16}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(labelKey)}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    color: colors['gray-400'],
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  labelActive: {
    color: colors.primary,
  },
  segment: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 7,
  },
  segmentActive: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  track: {
    backgroundColor: colors['gray-100'],
    borderRadius: 10,
    flexDirection: 'row',
    padding: 2,
  },
})

export { SearchModeSwitch }
