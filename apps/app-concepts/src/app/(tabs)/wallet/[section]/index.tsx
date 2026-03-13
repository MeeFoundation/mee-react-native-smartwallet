import type { FC } from 'react'
import { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { useTranslation } from 'react-i18next'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { BackButton, Header, ScreenLayout } from '@/widgets/navigation'
import { WalletSearchBar } from '@/widgets/wallet'

import { ConnectionListCard } from '@/entities/connection'

import { colors } from '@/shared/config'
import { AppButton } from '@/shared/ui/AppButton'
import { IconSymbol, type IconSymbolName } from '@/shared/ui/IconSymbol'
import * as ListLayout from '@/shared/ui/ListLayout'

import { SECTION_TITLE_KEYS, WALLET_DOCUMENTS, type DocumentSection } from '../document-registry'

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
  const [search, setSearch] = useState('')

  const titleKey = SECTION_TITLE_KEYS[section as DocumentSection]

  if (!titleKey) return <ScreenLayout.Root />

  const sectionDocs = WALLET_DOCUMENTS.filter((d) => d.section === section)

  return (
    <ScreenLayout.Root>
      <Header.Root variant="primary">
        <Header.Actions position="left">
          <BackButton />
          <Header.TitleText>{t(titleKey)}</Header.TitleText>
        </Header.Actions>
      </Header.Root>
      <WalletSearchBar onChangeText={setSearch} value={search} />
      <ScreenLayout.Content scrollable={false}>
        <ListLayout.Root>
          <ListLayout.Content style={styles.cardList}>
            {sectionDocs.map((doc) => (
              <DocumentCard
                key={doc.slug}
                icon={doc.icon}
                label={t(doc.translationKey)}
                onPress={() => router.push(`/wallet/${doc.section}/${doc.slug}`)}
              />
            ))}
          </ListLayout.Content>
        </ListLayout.Root>
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}
