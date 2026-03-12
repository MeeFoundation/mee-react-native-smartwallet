import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useLocalSearchParams } from 'expo-router'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-native-qrcode-svg'

import { BackButton, Header, ScreenLayout } from '@/widgets/navigation'

import { AttributeRenderer, type InferAttributeValue, type ObjectAttributeSchema } from '@/entities/attribute'

import { AppButton } from '@/shared/ui/AppButton'
import { BottomSheetBackModal } from '@/shared/ui/BottomSheetModal'
import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 * Schemas
 * -----------------------------------------------------------------------------------------------*/
const driversLicenceSchema = {
  type: 'object',
  properties: {
    licence_number: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    date_of_birth: { type: 'date' },
    expiry_date: { type: 'date' },
    state_of_issue: { type: 'string' },
  },
  required: ['licence_number'],
} satisfies ObjectAttributeSchema

const birthCertificateSchema = {
  type: 'object',
  properties: {
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    date_of_birth: { type: 'date' },
    place_of_birth: { type: 'string' },
    registration_number: { type: 'string' },
  },
  required: ['first_name', 'last_name', 'date_of_birth'],
} satisfies ObjectAttributeSchema

const creditCardSchema = {
  type: 'object',
  properties: {
    cardholder_name: { type: 'string' },
    card_number: { type: 'string' },
    expiry_date: { type: 'date' },
    card_type: { type: 'select', options: ['visa', 'mastercard', 'amex', 'other'] },
  },
  required: ['cardholder_name', 'card_number'],
} satisfies ObjectAttributeSchema

const passportSchema = {
  type: 'object',
  properties: {
    passport_number: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    date_of_birth: { type: 'date' },
    expiry_date: { type: 'date' },
    nationality: { type: 'string' },
    country_of_issue: { type: 'string' },
  },
  required: ['passport_number', 'first_name', 'last_name'],
} satisfies ObjectAttributeSchema

const employmentContractSchema = {
  type: 'object',
  properties: {
    employer: { type: 'string' },
    position: { type: 'string' },
    start_date: { type: 'date' },
    contract_type: { type: 'select', options: ['permanent', 'fixed_term', 'contractor'] },
  },
  required: ['employer', 'position'],
} satisfies ObjectAttributeSchema

const taxReturnSchema = {
  type: 'object',
  properties: {
    tax_year: { type: 'string' },
    filing_status: { type: 'string' },
    tax_id_number: { type: 'string' },
    gross_income: { type: 'string' },
  },
  required: ['tax_year', 'tax_id_number'],
} satisfies ObjectAttributeSchema

const healthInsuranceSchema = {
  type: 'object',
  properties: {
    policy_number: { type: 'string' },
    provider: { type: 'string' },
    policy_holder: { type: 'string' },
    expiry_date: { type: 'date' },
    coverage_type: { type: 'select', options: ['individual', 'family', 'group'] },
  },
  required: ['policy_number', 'provider'],
} satisfies ObjectAttributeSchema

const vaccinationRecordSchema = {
  type: 'object',
  properties: {
    patient_name: { type: 'string' },
    date_of_birth: { type: 'date' },
    vaccine_name: { type: 'string' },
    administered_date: { type: 'date' },
    dose_number: { type: 'string' },
  },
  required: ['patient_name', 'vaccine_name'],
} satisfies ObjectAttributeSchema

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

const styles = StyleSheet.create({
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
 * DocumentDetails — generic typed form
 * -----------------------------------------------------------------------------------------------*/
type DocumentDetailsProps<TSchema extends ObjectAttributeSchema> = {
  schema: TSchema
  defaultValue: InferAttributeValue<TSchema>
  title: string
}

function DocumentDetails<TSchema extends ObjectAttributeSchema>({ schema, defaultValue, title }: DocumentDetailsProps<TSchema>) {
  const [value, setValue] = useState(defaultValue)
  const [hasErrors, setHasErrors] = useState(false)
  const shareModalRef = useRef<BottomSheetModal>(null)

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
        <View className="gap-3">
          <AppButton disabled={hasErrors} fullWidth text="Save" variant="primary" />
          <AppButton fullWidth onPress={() => shareModalRef.current?.present()} text="Share" variant="secondary" />
        </View>
      </View>
      <ShareModal modalRef={shareModalRef} title={title} />
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

  return (
    <ScreenLayout.Root>
      {document === 'drivers-licence' && (
        <>
          <WalletDocumentHeader title={t('tabs.wallet.drivers_licence')} />
          <ScreenLayout.Content>
            <DocumentDetails
              defaultValue={{
                licence_number: 'DL-4821093',
                first_name: 'Alex',
                last_name: 'Johnson',
                date_of_birth: '1990-06-15',
                expiry_date: '2028-06-15',
                state_of_issue: 'California',
              }}
              schema={driversLicenceSchema}
              title={t('tabs.wallet.drivers_licence')}
            />
          </ScreenLayout.Content>
        </>
      )}
      {document === 'birth-certificate' && (
        <>
          <WalletDocumentHeader title={t('tabs.wallet.birth_certificate')} />
          <ScreenLayout.Content>
            <DocumentDetails
              defaultValue={{
                first_name: 'Alex',
                last_name: 'Johnson',
                date_of_birth: '1990-06-15',
                place_of_birth: 'Los Angeles, CA',
                registration_number: 'BC-1990-774421',
              }}
              schema={birthCertificateSchema}
              title={t('tabs.wallet.birth_certificate')}
            />
          </ScreenLayout.Content>
        </>
      )}
      {document === 'credit-card' && (
        <>
          <WalletDocumentHeader title={t('tabs.wallet.credit_card')} />
          <ScreenLayout.Content>
            <DocumentDetails
              defaultValue={{
                cardholder_name: 'Alex Johnson',
                card_number: '4111 1111 1111 1111',
                expiry_date: '2027-09-30',
                card_type: 'visa',
              }}
              schema={creditCardSchema}
              title={t('tabs.wallet.credit_card')}
            />
          </ScreenLayout.Content>
        </>
      )}
      {document === 'passport' && (
        <>
          <WalletDocumentHeader title={t('tabs.wallet.passport')} />
          <ScreenLayout.Content>
            <DocumentDetails
              defaultValue={{
                passport_number: 'P-A3829041',
                first_name: 'Alex',
                last_name: 'Johnson',
                date_of_birth: '1990-06-15',
                expiry_date: '2030-03-22',
                nationality: 'American',
                country_of_issue: 'United States',
              }}
              schema={passportSchema}
              title={t('tabs.wallet.passport')}
            />
          </ScreenLayout.Content>
        </>
      )}
      {document === 'employment-contract' && (
        <>
          <WalletDocumentHeader title={t('tabs.wallet.employment_contract')} />
          <ScreenLayout.Content>
            <DocumentDetails
              defaultValue={{
                employer: 'Acme Corp',
                position: 'Software Engineer',
                start_date: '2022-03-01',
                contract_type: 'permanent',
              }}
              schema={employmentContractSchema}
              title={t('tabs.wallet.employment_contract')}
            />
          </ScreenLayout.Content>
        </>
      )}
      {document === 'tax-return' && (
        <>
          <WalletDocumentHeader title={t('tabs.wallet.tax_return')} />
          <ScreenLayout.Content>
            <DocumentDetails
              defaultValue={{
                tax_year: '2024',
                filing_status: 'Single',
                tax_id_number: '123-45-6789',
                gross_income: '85000',
              }}
              schema={taxReturnSchema}
              title={t('tabs.wallet.tax_return')}
            />
          </ScreenLayout.Content>
        </>
      )}
      {document === 'health-insurance' && (
        <>
          <WalletDocumentHeader title={t('tabs.wallet.health_insurance')} />
          <ScreenLayout.Content>
            <DocumentDetails
              defaultValue={{
                policy_number: 'HI-8834-2291',
                provider: 'Blue Shield',
                policy_holder: 'Alex Johnson',
                expiry_date: '2026-12-31',
                coverage_type: 'individual',
              }}
              schema={healthInsuranceSchema}
              title={t('tabs.wallet.health_insurance')}
            />
          </ScreenLayout.Content>
        </>
      )}
      {document === 'vaccination-record' && (
        <>
          <WalletDocumentHeader title={t('tabs.wallet.vaccination_record')} />
          <ScreenLayout.Content>
            <DocumentDetails
              defaultValue={{
                patient_name: 'Alex Johnson',
                date_of_birth: '1990-06-15',
                vaccine_name: 'Influenza',
                administered_date: '2025-10-05',
                dose_number: '1',
              }}
              schema={vaccinationRecordSchema}
              title={t('tabs.wallet.vaccination_record')}
            />
          </ScreenLayout.Content>
        </>
      )}
    </ScreenLayout.Root>
  )
}
