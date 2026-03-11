import { useLocalSearchParams } from 'expo-router'
import type { FC } from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { BackButton, Header, ScreenLayout } from '@/widgets/navigation'

import { AttributeRenderer, type InferAttributeValue, type ObjectAttributeSchema } from '@/entities/attribute'

import { AppButton } from '@/shared/ui/AppButton'

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

/* -------------------------------------------------------------------------------------------------
 * DocumentDetails — generic typed form
 * -----------------------------------------------------------------------------------------------*/
type DocumentDetailsProps<TSchema extends ObjectAttributeSchema> = {
  schema: TSchema
  defaultValue: InferAttributeValue<TSchema>
}

function DocumentDetails<TSchema extends ObjectAttributeSchema>({ schema, defaultValue }: DocumentDetailsProps<TSchema>) {
  const [value, setValue] = useState(defaultValue)
  const [hasErrors, setHasErrors] = useState(false)

  return (
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
        <AppButton fullWidth text="Share" variant="secondary" />
      </View>
    </View>
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
export type WalletDocumentId = 'drivers-licence' | 'birth-certificate' | 'credit-card' | 'passport'

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
            />
          </ScreenLayout.Content>
        </>
      )}
    </ScreenLayout.Root>
  )
}
