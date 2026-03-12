import { type FC, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MicrophoneIcon, SparklesIcon } from 'react-native-heroicons/outline'

import { colors } from '@/shared/config'
import { MultilineTextField } from '@/shared/ui/MultilineTextField'
import { SearchTextField } from '@/shared/ui/SearchTextField'
import { SearchModeSwitch, type SearchMode } from '@/shared/ui/SearchModeSwitch'

type WalletSearchBarProps = {
  value: string
  onChangeText: (text: string) => void
}

const WalletSearchBar: FC<WalletSearchBarProps> = ({ value, onChangeText }) => {
  const { t } = useTranslation()
  const [mode, setMode] = useState<SearchMode>('text')

  const handleModeChange = (newMode: SearchMode) => {
    onChangeText('')
    setMode(newMode)
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          {mode === 'text' && (
            <SearchTextField
              onChangeText={onChangeText}
              placeholder={t('tabs.wallet.search_placeholder')}
              value={value}
            />
          )}
          {mode === 'ai' && (
            <MultilineTextField
              action={{ Icon: SparklesIcon, onPress: () => {} }}
              numberOfLines={3}
              onChangeText={onChangeText}
              placeholder={t('tabs.wallet.search_placeholder_ai')}
              value={value}
            />
          )}
          {mode === 'voice' && (
            <View style={styles.voiceContainer}>
              <TouchableOpacity activeOpacity={0.7} style={styles.micButton}>
                <MicrophoneIcon color={colors.white} height={32} width={32} />
              </TouchableOpacity>
              <Text style={styles.voiceHint}>{t('tabs.wallet.search_placeholder_voice')}</Text>
            </View>
          )}
        </View>
        <SearchModeSwitch value={mode} onChange={handleModeChange} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors['white/80'],
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 8,
  },
  container: {
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  inputContainer: {},
  micButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 36,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  voiceContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  voiceHint: {
    color: colors['gray-400'],
    fontSize: 14,
    fontWeight: '400',
  },
})

export { WalletSearchBar }
