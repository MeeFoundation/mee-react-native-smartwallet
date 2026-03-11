import type { FC } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'

import { Header, ScreenLayout, ToggleDrawerButton } from '@/widgets/navigation'

import { ConnectionListCard } from '@/entities/connection'

import { colors } from '@/shared/config'
import { AppButton } from '@/shared/ui/AppButton'
import { IconSymbol, type IconSymbolName } from '@/shared/ui/IconSymbol'
import * as ListLayout from '@/shared/ui/ListLayout'

const styles = StyleSheet.create({
  cardList: {
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors['white/60'],
    borderColor: colors['white/80'],
    borderRadius: 9999,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
})

/* -------------------------------------------------------------------------------------------------
 * WalletCard
 * -----------------------------------------------------------------------------------------------*/
type WalletCardProps = { label: string; icon: IconSymbolName; onPress?: () => void }

const WalletCard: FC<WalletCardProps> = ({ label, icon, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <ConnectionListCard.Root>
      <ConnectionListCard.Content>
        <View style={styles.iconContainer}>
          <IconSymbol color={colors['gray-800']} height={24} name={icon} width={24} />
        </View>
        <ConnectionListCard.Description>
          <ConnectionListCard.Name>{label}</ConnectionListCard.Name>
        </ConnectionListCard.Description>
        <ConnectionListCard.Actions>
          <ConnectionListCard.Button>
            <AppButton onPress={() => {}} size="sm" variant="link">
              <ChevronRightIcon color="black" />
            </AppButton>
          </ConnectionListCard.Button>
        </ConnectionListCard.Actions>
      </ConnectionListCard.Content>
    </ConnectionListCard.Root>
  </TouchableOpacity>
)

/* -------------------------------------------------------------------------------------------------
 * WalletScreenHeader
 * -----------------------------------------------------------------------------------------------*/
const WalletScreenHeader: FC = () => {
  const { t } = useTranslation()

  return (
    <Header.Root variant="primary">
      <Header.Actions position="left">
        <Header.TitleText>{t('tabs.wallet.title')}</Header.TitleText>
      </Header.Actions>
      <Header.Actions position="right">
        <ToggleDrawerButton />
      </Header.Actions>
    </Header.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * WalletScreen
 * -----------------------------------------------------------------------------------------------*/
export default function WalletScreen() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <ScreenLayout.Root>
      <WalletScreenHeader />
      <ScreenLayout.Content scrollable={false}>
        <ListLayout.Root>
          <ListLayout.Content style={styles.cardList}>
            <WalletCard
              icon="identification.outlined"
              label={t('tabs.wallet.drivers_licence')}
              onPress={() => router.push('/wallet/drivers-licence')}
            />
            <WalletCard
              icon="document-text.outlined"
              label={t('tabs.wallet.birth_certificate')}
              onPress={() => router.push('/wallet/birth-certificate')}
            />
            <WalletCard
              icon="credit-card.outlined"
              label={t('tabs.wallet.credit_card')}
              onPress={() => router.push('/wallet/credit-card')}
            />
          </ListLayout.Content>
        </ListLayout.Root>
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}
