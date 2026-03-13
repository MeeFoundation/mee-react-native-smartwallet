import { type FC, useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View, useAnimatedValue } from 'react-native'
import { useTranslation } from 'react-i18next'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  GlobeAltIcon,
  MicrophoneIcon,
} from 'react-native-heroicons/outline'

import { colors } from '@/shared/config'
import { MultilineTextField } from '@/shared/ui/MultilineTextField'

type SearchScope = 'current' | 'global'

type WalletSearchBarProps = {
  value: string
  onChangeText: (text: string) => void
}

const SCOPE_CONFIG = {
  current: { Icon: FolderIcon, key: 'tabs.wallet.search_scope_current' },
  global: { Icon: GlobeAltIcon, key: 'tabs.wallet.search_scope_global' },
} as const

const WalletSearchBar: FC<WalletSearchBarProps> = ({ value, onChangeText }) => {
  const { t } = useTranslation()
  const [voiceActive, setVoiceActive] = useState(false)
  const [isFieldFocused, setIsFieldFocused] = useState(false)
  const [scope, setScope] = useState<SearchScope>('current')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pulseScale = useAnimatedValue(1)
  const pulseOpacity = useAnimatedValue(0)

  useEffect(() => {
    if (voiceActive) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseScale, { toValue: 1.8, duration: 700, useNativeDriver: true }),
            Animated.timing(pulseOpacity, { toValue: 0.3, duration: 200, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(pulseScale, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(pulseOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
          ]),
        ]),
      ).start()
    } else {
      pulseScale.setValue(1)
      pulseOpacity.setValue(0)
    }
  }, [voiceActive, pulseScale, pulseOpacity])

  const onMicPressIn = () => {
    onChangeText('')
    setVoiceActive(true)
  }

  const onMicPressOut = () => {
    setVoiceActive(false)
  }

  const selectScope = (newScope: SearchScope) => {
    setScope(newScope)
    setDropdownOpen(false)
  }

  const { Icon: ScopeIcon } = SCOPE_CONFIG[scope]
  const ChevronIcon = dropdownOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <View style={styles.container}>
      <View style={styles.fieldWrapper}>
        <MultilineTextField
          disabled={voiceActive}
          numberOfLines={3}
          onBlur={() => setIsFieldFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFieldFocused(true)}
          propsStyles={{ container: styles.textFieldContainer, input: styles.inputInner }}
          value={value}
        />

        {!value && !isFieldFocused && (
          <View pointerEvents="none" style={styles.placeholderOverlay}>
            <Text style={styles.placeholderText}>
              {voiceActive ? t('tabs.wallet.search_placeholder_voice') : t('tabs.wallet.search_placeholder_ai')}
            </Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setDropdownOpen((v) => !v)}
          style={styles.scopeTrigger}
        >
          <ScopeIcon color={colors['gray-400']} height={18} width={18} />
          <ChevronIcon color={colors['gray-400']} height={12} width={12} />
        </TouchableOpacity>

        <View style={styles.scopeDivider} />

        <TouchableOpacity
          activeOpacity={1}
          onPressIn={onMicPressIn}
          onPressOut={onMicPressOut}
          style={styles.micButton}
        >
          <Animated.View
            style={[
              styles.pulseCircle,
              { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
            ]}
          />
          <View style={[styles.micCircle, voiceActive && styles.micCircleActive]}>
            <MicrophoneIcon
              color={voiceActive ? colors.white : colors.primary}
              height={20}
              width={20}
            />
          </View>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdown}>
            {(Object.entries(SCOPE_CONFIG) as [SearchScope, (typeof SCOPE_CONFIG)[SearchScope]][]).map(
              ([option, { Icon, key }]) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={option}
                  onPress={() => selectScope(option)}
                  style={[styles.dropdownItem, scope === option && styles.dropdownItemActive]}
                >
                  <Icon
                    color={scope === option ? colors.primary : colors['gray-400']}
                    height={18}
                    width={18}
                  />
                  <Text style={[styles.dropdownItemText, scope === option && styles.dropdownItemTextActive]}>
                    {t(key)}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 12,
    zIndex: 10,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderColor: colors['gray-200'],
    borderRadius: 8,
    borderWidth: 1,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    top: 88,
    zIndex: 20,
  },
  dropdownItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dropdownItemActive: {
    backgroundColor: colors['gray-100'],
  },
  dropdownItemText: {
    color: colors['gray-800'],
    fontSize: 14,
    fontWeight: '400',
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: '500',
  },
  fieldWrapper: {
    position: 'relative',
  },
  inputInner: {
    paddingLeft: 58,
    paddingRight: 52,
  },
  placeholderOverlay: {
    bottom: 0,
    justifyContent: 'center',
    left: 58,
    position: 'absolute',
    right: 52,
    top: 0,
  },
  placeholderText: {
    color: colors['gray-400'],
    fontSize: 16,
  },
  textFieldContainer: {
    paddingHorizontal: 0,
  },
  micButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 0,
  },
  micCircle: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  micCircleActive: {
    backgroundColor: colors.primary,
  },
  pulseCircle: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 32,
    position: 'absolute',
    width: 32,
  },
  scopeDivider: {
    backgroundColor: colors['gray-200'],
    bottom: 0,
    left: 52,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  scopeTrigger: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
    left: 10,
    position: 'absolute',
    top: 0,
    width: 36,
  },
})

export { WalletSearchBar }
