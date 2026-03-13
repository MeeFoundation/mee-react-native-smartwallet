import { BottomSheetTextInput, type BottomSheetModal } from '@gorhom/bottom-sheet'
import { useLocalSearchParams } from 'expo-router'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { PencilSquareIcon, XMarkIcon } from 'react-native-heroicons/outline'
import QRCode from 'react-native-qrcode-svg'

import { colors } from '@/shared/config'
import { hexAlphaColor } from '@/shared/lib/styling'

import { BackButton, Header, ScreenLayout } from '@/widgets/navigation'

import { AttributeRenderer, type InferAttributeValue, type ObjectAttributeSchema } from '@/entities/attribute'

import { AppButton } from '@/shared/ui/AppButton'
import { BottomSheetBackModal } from '@/shared/ui/BottomSheetModal'
import { Typography } from '@/shared/ui/Typography'

import { SECTION_TITLE_KEYS, WALLET_DOCUMENTS, type DocumentSection } from '../document-registry'

/* -------------------------------------------------------------------------------------------------
 * ShareModal
 * -----------------------------------------------------------------------------------------------*/
const MOCK_QR_VALUE = 'https://mee.foundation/share/doc/mock-token-a1b2c3d4e5f6'

type ShareModalProps = {
  title: string
  modalRef: React.RefObject<BottomSheetModal | null>
}

const ShareModal: FC<ShareModalProps> = ({ title, modalRef }) => {
  const { t } = useTranslation()

  return (
    <BottomSheetBackModal
      enableDynamicSizing
      ref={modalRef}
      snapPoints={[]}
      title={t('tabs.wallet.share_modal_title')}
    >
      <View style={styles.shareContent}>
        <Typography style={styles.shareSubtitle}>{title}</Typography>
        <View style={styles.qrContainer}>
          <QRCode size={220} value={MOCK_QR_VALUE} />
        </View>
        <Typography style={styles.shareHint}>{t('tabs.wallet.share_modal_hint')}</Typography>
      </View>
    </BottomSheetBackModal>
  )
}

const BADGE_COLOR = '#4A6CD7'
const CUSTOM_BADGE_COLOR = colors.primary

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  customBadgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  customBadgeChip: {
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeEditContent: {
    gap: 16,
    padding: 16,
    paddingBottom: 32,
  },
  badgeEditChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeEditChip: {
    alignItems: 'center',
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagInput: {
    backgroundColor: colors.white,
    borderColor: colors['gray-200'],
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: 44,
    paddingHorizontal: 16,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  shareContent: {
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  shareHint: {
    color: 'rgba(60,60,67,0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
  shareSubtitle: {
    fontSize: 15,
    marginBottom: 4,
    opacity: 0.6,
    textAlign: 'center',
  },
})

/* -------------------------------------------------------------------------------------------------
 * BadgeEditModal
 * -----------------------------------------------------------------------------------------------*/
type BadgeEditModalProps = {
  modalRef: React.RefObject<BottomSheetModal | null>
  badges: string[]
  onRemove: (badge: string) => void
  onAdd: (badge: string) => void
}

const BadgeEditModal: FC<BadgeEditModalProps> = ({ modalRef, badges, onRemove, onAdd }) => {
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (trimmed && !badges.includes(trimmed)) {
      onAdd(trimmed)
    }
    setInput('')
  }

  return (
    <BottomSheetBackModal
      enableDynamicSizing
      ref={modalRef}
      rightButtonAction={handleAdd}
      rightButtonText="Done"
      snapPoints={[]}
      title={t('tabs.wallet.edit_tags_title')}
    >
      <View style={styles.badgeEditContent}>
        {badges.length > 0 && (
          <View style={styles.badgeEditChipsRow}>
            {badges.map((badge) => (
              <TouchableOpacity
                key={badge}
                onPress={() => onRemove(badge)}
                style={[
                  styles.badgeEditChip,
                  { backgroundColor: hexAlphaColor(CUSTOM_BADGE_COLOR, 10), borderColor: hexAlphaColor(CUSTOM_BADGE_COLOR, 40) },
                ]}
              >
                <Typography style={[styles.badgeText, { color: CUSTOM_BADGE_COLOR }]}>{badge}</Typography>
                <XMarkIcon color={CUSTOM_BADGE_COLOR} size={14} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        <BottomSheetTextInput
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          placeholder={t('tabs.wallet.edit_tags_add_placeholder')}
          returnKeyType="done"
          style={styles.tagInput}
          value={input}
        />
      </View>
    </BottomSheetBackModal>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DocumentDetails — generic typed form
 * -----------------------------------------------------------------------------------------------*/
type DocumentDetailsProps<TSchema extends ObjectAttributeSchema> = {
  schema: TSchema
  defaultValue: InferAttributeValue<TSchema>
  title: string
  section: DocumentSection
  defaultBadges: string[]
}

function DocumentDetails<TSchema extends ObjectAttributeSchema>({ schema, defaultValue, title, section, defaultBadges }: DocumentDetailsProps<TSchema>) {
  const { t } = useTranslation()
  const [value, setValue] = useState(defaultValue)
  const [hasErrors, setHasErrors] = useState(false)
  const [customBadges, setCustomBadges] = useState<string[]>(() => [...defaultBadges])
  const shareModalRef = useRef<BottomSheetModal>(null)
  const badgeEditModalRef = useRef<BottomSheetModal>(null)

  const sectionName = t(SECTION_TITLE_KEYS[section])

  const handleAddBadge = (badge: string) => {
    setCustomBadges((prev) => [...prev, badge])
  }

  const handleRemoveBadge = (badge: string) => {
    setCustomBadges((prev) => prev.filter((b) => b !== badge))
  }

  return (
    <>
      <View className="gap-4 p-4">
        <View className="rounded-xl border border-black/7 bg-white/90 p-3">
          <AttributeRenderer
            onChange={setValue}
            onErrors={(errors) => setHasErrors(Object.keys(errors).length > 0)}
            schema={schema}
            value={value}
          />
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: hexAlphaColor(BADGE_COLOR, 10), borderColor: hexAlphaColor(BADGE_COLOR, 40) },
          ]}
        >
          <Typography style={[styles.badgeText, { color: BADGE_COLOR }]}>
            {t('tabs.wallet.document_section')}: {sectionName}
          </Typography>
        </View>
        <View style={styles.customBadgeRow}>
          {customBadges.map((badge) => (
            <View
              key={badge}
              style={[
                styles.customBadgeChip,
                { backgroundColor: hexAlphaColor(CUSTOM_BADGE_COLOR, 10), borderColor: hexAlphaColor(CUSTOM_BADGE_COLOR, 40) },
              ]}
            >
              <Typography style={[styles.badgeText, { color: CUSTOM_BADGE_COLOR }]}>{badge}</Typography>
            </View>
          ))}
          <TouchableOpacity onPress={() => badgeEditModalRef.current?.present()}>
            <PencilSquareIcon color={colors.primaryActive} size={18} />
          </TouchableOpacity>
        </View>
        <View className="gap-3">
          <AppButton disabled={hasErrors} fullWidth text="Save" variant="primary" />
          <AppButton fullWidth onPress={() => shareModalRef.current?.present()} text="Share" variant="secondary" />
        </View>
      </View>
      <ShareModal modalRef={shareModalRef} title={title} />
      <BadgeEditModal
        badges={customBadges}
        modalRef={badgeEditModalRef}
        onAdd={handleAddBadge}
        onRemove={handleRemoveBadge}
      />
    </>
  )
}

/* -------------------------------------------------------------------------------------------------
 * WalletDocumentHeader
 * -----------------------------------------------------------------------------------------------*/
type WalletDocumentHeaderProps = { title: string }

const WalletDocumentHeader: FC<WalletDocumentHeaderProps> = ({ title }) => (
  <Header.Root variant="primary">
    <Header.Actions position="left">
      <BackButton />
      <Header.TitleText>{title}</Header.TitleText>
    </Header.Actions>
  </Header.Root>
)

/* -------------------------------------------------------------------------------------------------
 * WalletDocumentScreen
 * -----------------------------------------------------------------------------------------------*/
export default function WalletDocumentScreen() {
  const { document } = useLocalSearchParams<{ document: string }>()
  const { t } = useTranslation()

  const entry = WALLET_DOCUMENTS.find((d) => d.slug === document)

  if (!entry) return <ScreenLayout.Root />

  const title = t(entry.translationKey)

  return (
    <ScreenLayout.Root>
      <WalletDocumentHeader title={title} />
      <ScreenLayout.Content>
        <DocumentDetails
          defaultBadges={entry.defaultBadges}
          defaultValue={entry.defaultValue as unknown as InferAttributeValue<ObjectAttributeSchema>}
          schema={entry.schema}
          section={entry.section}
          title={title}
        />
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}
