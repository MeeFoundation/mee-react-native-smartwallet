import { type FC, useEffect, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View, useAnimatedValue } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MicrophoneIcon } from 'react-native-heroicons/outline'

import { colors } from '@/shared/config'
import { TextField } from '@/shared/ui/TextField'

type WalletSearchBarProps = {
  value: string
  onChangeText: (text: string) => void
}

const WalletSearchBar: FC<WalletSearchBarProps> = ({ value, onChangeText }) => {
  const { t } = useTranslation()
  const [voiceActive, setVoiceActive] = useState(false)
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

  return (
    <View style={styles.container}>
      <View style={styles.fieldWrapper}>
        <TextField
          disabled={voiceActive}
          onChangeText={onChangeText}
          placeholder={voiceActive ? t('tabs.wallet.search_placeholder_voice') : t('tabs.wallet.search_placeholder_ai')}
          propsStyles={{ input: styles.inputWithMic }}
          value={value}
        />
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  fieldWrapper: {
    position: 'relative',
  },
  inputWithMic: {
    paddingRight: 52,
  },
  micButton: {
    alignItems: 'center',
    bottom: 9,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
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
})

export { WalletSearchBar }
