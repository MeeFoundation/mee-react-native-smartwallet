import { BottomSheetTextInput, type BottomSheetModal } from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { CheckIcon, PencilSquareIcon, XMarkIcon } from 'react-native-heroicons/outline'
import QRCode from 'react-native-qrcode-svg'

import { colors } from '@/shared/config'
import { hexAlphaColor } from '@/shared/lib/styling'

import { BackButton, Header, ScreenLayout } from '@/widgets/navigation'

import { AttributeRenderer, type InferAttributeValue, type ObjectAttributeSchema } from '@/entities/attribute'

import { AppButton } from '@/shared/ui/AppButton'
import { BottomSheetBackModal } from '@/shared/ui/BottomSheetModal'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { Typography } from '@/shared/ui/Typography'

import { SECTION_ICONS, SECTION_TITLE_KEYS, WALLET_DOCUMENTS, type DocumentSection } from '../document-registry'
import { documentStateAtom, type DocumentState } from '../document-state.atom'

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

const SECTIONS: DocumentSection[] = ['life', 'work', 'health']

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
  sectionBadgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  badgeInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  sectionPickerContent: {
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionPickerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  sectionPickerSeparator: {
    backgroundColor: colors['gray-200'],
    height: StyleSheet.hairlineWidth,
  },
  sectionPickerLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
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
 * SectionPickerModal
 * -----------------------------------------------------------------------------------------------*/
type SectionPickerModalProps = {
  modalRef: React.RefObject<BottomSheetModal | null>
  currentSection: DocumentSection
  onSelect: (section: DocumentSection) => void
}

const SectionPickerModal: FC<SectionPickerModalProps> = ({ modalRef, currentSection, onSelect }) => {
  const { t } = useTranslation()

  return (
    <BottomSheetBackModal
      enableDynamicSizing
      ref={modalRef}
      snapPoints={[]}
      title={t('tabs.wallet.document_section')}
    >
      <View style={styles.sectionPickerContent}>
        {SECTIONS.map((section, index) => (
          <View key={section}>
            {index > 0 && <View style={styles.sectionPickerSeparator} />}
            <TouchableOpacity
              onPress={() => {
                onSelect(section)
                modalRef.current?.dismiss()
              }}
              style={styles.sectionPickerRow}
            >
              <View style={styles.sectionPickerLabel}>
                <IconSymbol color={colors['gray-800']} height={18} name={SECTION_ICONS[section]} width={18} />
                <Typography style={{ fontSize: 16 }}>{t(SECTION_TITLE_KEYS[section])}</Typography>
              </View>
              {currentSection === section && <CheckIcon color={colors.primary} size={20} />}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </BottomSheetBackModal>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DocumentDetails — generic typed form
 * -----------------------------------------------------------------------------------------------*/
type DocumentDetailsProps<TSchema extends ObjectAttributeSchema> = {
  schema: TSchema
  title: string
  state: DocumentState
  onStateChange: (state: DocumentState) => void
}

function DocumentDetails<TSchema extends ObjectAttributeSchema>({ schema, title, state, onStateChange }: DocumentDetailsProps<TSchema>) {
  const { t } = useTranslation()
  const router = useRouter()
  const [hasErrors, setHasErrors] = useState(false)
  const shareModalRef = useRef<BottomSheetModal>(null)
  const badgeEditModalRef = useRef<BottomSheetModal>(null)
  const sectionPickerModalRef = useRef<BottomSheetModal>(null)

  const sectionName = t(SECTION_TITLE_KEYS[state.section])

  return (
    <>
      <View className="gap-4 p-4">
        <View className="rounded-xl border border-black/7 bg-white/90 p-3">
          <AttributeRenderer
            onChange={(value) => onStateChange({ ...state, value: value as Record<string, unknown> })}
            onErrors={(errors) => setHasErrors(Object.keys(errors).length > 0)}
            schema={schema}
            value={state.value as InferAttributeValue<TSchema>}
          />
        </View>
        <View style={styles.sectionBadgeRow}>
          <View
            style={[
              styles.badge,
              styles.badgeInner,
              { backgroundColor: hexAlphaColor(BADGE_COLOR, 10), borderColor: hexAlphaColor(BADGE_COLOR, 40) },
            ]}
          >
            <IconSymbol color={BADGE_COLOR} height={16} name={SECTION_ICONS[state.section]} width={16} />
            <Typography style={[styles.badgeText, { color: BADGE_COLOR }]}>
              {t('tabs.wallet.document_section')}: {sectionName}
            </Typography>
          </View>
          <TouchableOpacity onPress={() => sectionPickerModalRef.current?.present()}>
            <PencilSquareIcon color={colors.primaryActive} size={18} />
          </TouchableOpacity>
        </View>
        <View style={styles.customBadgeRow}>
          {state.badges.map((badge) => (
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
          <AppButton disabled={hasErrors} fullWidth onPress={() => router.canGoBack() && router.back()} text="Save" variant="primary" />
          <AppButton fullWidth onPress={() => shareModalRef.current?.present()} text="Share" variant="secondary" />
        </View>
      </View>
      <ShareModal modalRef={shareModalRef} title={title} />
      <BadgeEditModal
        badges={state.badges}
        modalRef={badgeEditModalRef}
        onAdd={(badge) => onStateChange({ ...state, badges: [...state.badges, badge] })}
        onRemove={(badge) => onStateChange({ ...state, badges: state.badges.filter((b) => b !== badge) })}
      />
      <SectionPickerModal
        currentSection={state.section}
        modalRef={sectionPickerModalRef}
        onSelect={(section) => onStateChange({ ...state, section })}
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
  const [state, setState] = useAtom(documentStateAtom(document ?? ''))

  if (!entry) return <ScreenLayout.Root />

  const title = t(entry.translationKey)

  return (
    <ScreenLayout.Root>
      <WalletDocumentHeader title={title} />
      <ScreenLayout.Content>
        <DocumentDetails
          onStateChange={setState}
          schema={entry.schema}
          state={state}
          title={title}
        />
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}
