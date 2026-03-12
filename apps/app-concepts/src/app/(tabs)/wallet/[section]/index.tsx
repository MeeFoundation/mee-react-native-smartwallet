import type { FC } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { useTranslation } from 'react-i18next'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { BackButton, Header, ScreenLayout } from '@/widgets/navigation'

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
 * DocumentCard
 * -----------------------------------------------------------------------------------------------*/
type DocumentCardProps = { label: string; icon: IconSymbolName; onPress?: () => void }

const DocumentCard: FC<DocumentCardProps> = ({ label, icon, onPress }) => (
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
 * SectionDocumentsScreen
 * -----------------------------------------------------------------------------------------------*/
export default function SectionDocumentsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { section } = useLocalSearchParams<{ section: string }>()

  return (
    <ScreenLayout.Root>
      {section === 'life' && (
        <>
          <Header.Root variant="primary">
            <Header.Actions position="left">
              <BackButton />
              <Header.TitleText>{t('tabs.wallet.section_life')}</Header.TitleText>
            </Header.Actions>
          </Header.Root>
          <ScreenLayout.Content scrollable={false}>
            <ListLayout.Root>
              <ListLayout.Content style={styles.cardList}>
                <DocumentCard
                  icon="identification.outlined"
                  label={t('tabs.wallet.drivers_licence')}
                  onPress={() => router.push('/wallet/life/drivers-licence')}
                />
                <DocumentCard
                  icon="identification.outlined"
                  label={t('tabs.wallet.passport')}
                  onPress={() => router.push('/wallet/life/passport')}
                />
                <DocumentCard
                  icon="document-text.outlined"
                  label={t('tabs.wallet.birth_certificate')}
                  onPress={() => router.push('/wallet/life/birth-certificate')}
                />
                <DocumentCard
                  icon="credit-card.outlined"
                  label={t('tabs.wallet.credit_card')}
                  onPress={() => router.push('/wallet/life/credit-card')}
                />
              </ListLayout.Content>
            </ListLayout.Root>
          </ScreenLayout.Content>
        </>
      )}
      {section === 'work' && (
        <>
          <Header.Root variant="primary">
            <Header.Actions position="left">
              <BackButton />
              <Header.TitleText>{t('tabs.wallet.section_work')}</Header.TitleText>
            </Header.Actions>
          </Header.Root>
          <ScreenLayout.Content scrollable={false}>
            <ListLayout.Root>
              <ListLayout.Content style={styles.cardList}>
                <DocumentCard
                  icon="briefcase.outlined"
                  label={t('tabs.wallet.employment_contract')}
                  onPress={() => router.push('/wallet/work/employment-contract')}
                />
                <DocumentCard
                  icon="document.outlined"
                  label={t('tabs.wallet.tax_return')}
                  onPress={() => router.push('/wallet/work/tax-return')}
                />
              </ListLayout.Content>
            </ListLayout.Root>
          </ScreenLayout.Content>
        </>
      )}
      {section === 'health' && (
        <>
          <Header.Root variant="primary">
            <Header.Actions position="left">
              <BackButton />
              <Header.TitleText>{t('tabs.wallet.section_health')}</Header.TitleText>
            </Header.Actions>
          </Header.Root>
          <ScreenLayout.Content scrollable={false}>
            <ListLayout.Root>
              <ListLayout.Content style={styles.cardList}>
                <DocumentCard
                  icon="shield-check.outlined"
                  label={t('tabs.wallet.health_insurance')}
                  onPress={() => router.push('/wallet/health/health-insurance')}
                />
                <DocumentCard
                  icon="plus.outlined"
                  label={t('tabs.wallet.vaccination_record')}
                  onPress={() => router.push('/wallet/health/vaccination-record')}
                />
              </ListLayout.Content>
            </ListLayout.Root>
          </ScreenLayout.Content>
        </>
      )}
    </ScreenLayout.Root>
  )
}
