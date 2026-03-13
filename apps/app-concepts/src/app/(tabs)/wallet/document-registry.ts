import type { ParseKeys } from 'i18next'

import type { InferAttributeValue, ObjectAttributeSchema } from '@/entities/attribute'
import type { IconSymbolName } from '@/shared/ui/IconSymbol'

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

const creditCardMC5555Schema = {
  type: 'object',
  properties: {
    cardholder_name: { type: 'string' },
    card_number: { type: 'string' },
    expiry_date: { type: 'date' },
    card_type: { type: 'select', options: ['visa', 'mastercard', 'amex', 'other'] },
  },
  required: ['cardholder_name', 'card_number'],
} satisfies ObjectAttributeSchema

const creditCardVisa1111Schema = {
  type: 'object',
  properties: {
    cardholder_name: { type: 'string' },
    card_number: { type: 'string' },
    expiry_date: { type: 'date' },
    card_type: { type: 'select', options: ['visa', 'mastercard', 'amex', 'other'] },
  },
  required: ['cardholder_name', 'card_number'],
} satisfies ObjectAttributeSchema

const passport041Schema = {
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

const employmentContractAcmeeSchema = {
  type: 'object',
  properties: {
    employer: { type: 'string' },
    position: { type: 'string' },
    start_date: { type: 'date' },
    contract_type: { type: 'select', options: ['permanent', 'fixed_term', 'contractor'] },
  },
  required: ['employer', 'position'],
} satisfies ObjectAttributeSchema

const taxReturn2024Schema = {
  type: 'object',
  properties: {
    tax_year: { type: 'string' },
    filing_status: { type: 'string' },
    tax_id_number: { type: 'string' },
    gross_income: { type: 'string' },
  },
  required: ['tax_year', 'tax_id_number'],
} satisfies ObjectAttributeSchema

const healthInsurance2291Schema = {
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

const vaccinationRecord123Schema = {
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
 * Registry types
 * -----------------------------------------------------------------------------------------------*/
export type DocumentSection = 'life' | 'work' | 'health'

export type DocumentEntry = {
  slug: string
  translationKey: ParseKeys
  section: DocumentSection
  icon: IconSymbolName
  schema: ObjectAttributeSchema
  defaultValue: Record<string, unknown>
  defaultBadges: string[]
}

export const SECTION_TITLE_KEYS: Record<DocumentSection, ParseKeys> = {
  life: 'tabs.wallet.section_life',
  work: 'tabs.wallet.section_work',
  health: 'tabs.wallet.section_health',
}

/* -------------------------------------------------------------------------------------------------
 * Helper — preserves type-safety at definition time, stores as DocumentEntry
 * -----------------------------------------------------------------------------------------------*/
function defineDocument<TSchema extends ObjectAttributeSchema>(entry: {
  slug: string
  translationKey: ParseKeys
  section: DocumentSection
  icon: IconSymbolName
  schema: TSchema
  defaultValue: InferAttributeValue<TSchema>
  defaultBadges: string[]
}): DocumentEntry {
  return entry as DocumentEntry
}

/* -------------------------------------------------------------------------------------------------
 * Registry
 * -----------------------------------------------------------------------------------------------*/
export const WALLET_DOCUMENTS: DocumentEntry[] = [
  defineDocument({
    slug: 'drivers-licence-dl4821093',
    translationKey: 'tabs.wallet.drivers_licence',
    section: 'life',
    icon: 'identification.outlined',
    schema: driversLicenceSchema,
    defaultValue: {
      licence_number: 'DL-4821093',
      first_name: 'Alex',
      last_name: 'Johnson',
      date_of_birth: '1990-06-15',
      expiry_date: '2028-06-15',
      state_of_issue: 'California',
    },
    defaultBadges: ['Identity', 'Government ID', 'Driving'],
  }),
  defineDocument({
    slug: 'passport-a3829041',
    translationKey: 'tabs.wallet.passport',
    section: 'life',
    icon: 'identification.outlined',
    schema: passport041Schema,
    defaultValue: {
      passport_number: 'P-A3829041',
      first_name: 'Alex',
      last_name: 'Johnson',
      date_of_birth: '1990-06-15',
      expiry_date: '2030-03-22',
      nationality: 'American',
      country_of_issue: 'United States',
    },
    defaultBadges: ['Identity', 'Travel', 'International'],
  }),
  defineDocument({
    slug: 'birth-certificate-bc774421',
    translationKey: 'tabs.wallet.birth_certificate',
    section: 'life',
    icon: 'document-text.outlined',
    schema: birthCertificateSchema,
    defaultValue: {
      first_name: 'Alex',
      last_name: 'Johnson',
      date_of_birth: '1990-06-15',
      place_of_birth: 'Los Angeles, CA',
      registration_number: 'BC-1990-774421',
    },
    defaultBadges: ['Identity', 'Legal', 'Personal'],
  }),
  defineDocument({
    slug: 'credit-card-visa-1111',
    translationKey: 'tabs.wallet.credit_card',
    section: 'life',
    icon: 'credit-card.outlined',
    schema: creditCardVisa1111Schema,
    defaultValue: {
      cardholder_name: 'Alex Johnson',
      card_number: '4111 1111 1111 1111',
      expiry_date: '2027-09-30',
      card_type: 'visa',
    },
    defaultBadges: ['Finance', 'Payment', 'Banking'],
  }),
  defineDocument({
    slug: 'credit-card-mc-5555',
    translationKey: 'tabs.wallet.credit_card_mc',
    section: 'life',
    icon: 'credit-card.outlined',
    schema: creditCardMC5555Schema,
    defaultValue: {
      cardholder_name: 'Alex Johnson',
      card_number: '5500 0000 0000 5555',
      expiry_date: '2028-11-30',
      card_type: 'mastercard',
    },
    defaultBadges: ['Finance', 'Payment', 'Banking'],
  }),
  defineDocument({
    slug: 'employment-contract-acmee',
    translationKey: 'tabs.wallet.employment_contract',
    section: 'work',
    icon: 'briefcase.outlined',
    schema: employmentContractAcmeeSchema,
    defaultValue: {
      employer: 'Acme Corp',
      position: 'Software Engineer',
      start_date: '2022-03-01',
      contract_type: 'permanent',
    },
    defaultBadges: ['Work', 'Contract', 'Active'],
  }),
  defineDocument({
    slug: 'tax-return-2024',
    translationKey: 'tabs.wallet.tax_return',
    section: 'work',
    icon: 'document.outlined',
    schema: taxReturn2024Schema,
    defaultValue: {
      tax_year: '2024',
      filing_status: 'Single',
      tax_id_number: '123-45-6789',
      gross_income: '85000',
    },
    defaultBadges: ['Finance', 'Tax', '2024'],
  }),
  defineDocument({
    slug: 'health-insurance-2291',
    translationKey: 'tabs.wallet.health_insurance',
    section: 'health',
    icon: 'shield-check.outlined',
    schema: healthInsurance2291Schema,
    defaultValue: {
      policy_number: 'HI-8834-2291',
      provider: 'Blue Shield',
      policy_holder: 'Alex Johnson',
      expiry_date: '2026-12-31',
      coverage_type: 'individual',
    },
    defaultBadges: ['Health', 'Insurance', 'Active'],
  }),
  defineDocument({
    slug: 'vaccination-record-123',
    translationKey: 'tabs.wallet.vaccination_record',
    section: 'health',
    icon: 'plus.outlined',
    schema: vaccinationRecord123Schema,
    defaultValue: {
      patient_name: 'Alex Johnson',
      date_of_birth: '1990-06-15',
      vaccine_name: 'Influenza',
      administered_date: '2025-10-05',
      dose_number: '1',
    },
    defaultBadges: ['Health', 'Medical', 'Vaccination'],
  }),
]
