import type { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { SearchTextField } from '@/shared/ui/SearchTextField'

type WalletSearchBarProps = {
  value: string
  onChangeText: (text: string) => void
}

const WalletSearchBar: FC<WalletSearchBarProps> = ({ value, onChangeText }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <SearchTextField
        onChangeText={onChangeText}
        placeholder={t('tabs.wallet.search_placeholder')}
        value={value}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
})

export { WalletSearchBar }
