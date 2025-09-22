import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { mapValues, pick, pickBy } from 'lodash-es'
import { type FC, useMemo, useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { PlusSmallIcon, XMarkIcon } from 'react-native-heroicons/outline'
import type { SvgProps } from 'react-native-svg'
import { array, object } from 'superstruct'

import BackgroundDull from '@/assets/images/background-dull.svg'

import { AddConnectionAttribute, ConnectionCard } from '@/entities/connection'
import { ContactsDetails, deleteContactAtom, updateContactAtom } from '@/entities/contact'

import { colors } from '@/shared/config'
import { InvalidRouteParamsError } from '@/shared/errors'
import type { MakeArraysValuesToObjects } from '@/shared/lib/ts-utils'
import { customValidate, emailStruct, requiredStringMoreThanStruct } from '@/shared/lib/validation'
import { Accordion } from '@/shared/ui/Accordion'
import { AppButton } from '@/shared/ui/AppButton'
import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'
import { MultipleFieldsBlock } from '@/shared/ui/MultipleFieldsBlock'
import { TextField } from '@/shared/ui/TextField'
import { Typography } from '@/shared/ui/Typography'

const InputCustomRightIconActive: FC<SvgProps> = ({ style, ...props }) => (
  // @ts-expect-error for svg, colors property works correctly
  <XMarkIcon style={[style, { color: colors['gray-800'] }]} {...props} />
)

const Fields_Keys = ['emails', 'firstName', 'lastName', 'phones', 'addresses'] as const

// FIXME add [id] segment to this file name
export default function ManageContact() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const { contact, platform: contactPlatform } = useAtomValue(ContactsDetails(id))
  const deleteContact = useSetAtom(deleteContactAtom)
  const updateContact = useSetAtom(updateContactAtom)

  const [isEditing, setIsEditing] = useState({ sharedWithYou: false })
  const [fields, setFields] = useState({ sharedWithYou: contact?.sharedInfo })
  const [fieldsVisibility, setFieldsVisibility] = useState({
    sharedWithYou: mapValues(contact?.sharedInfo, (val) => (Array.isArray(val) ? !!val && val.length > 0 : !!val)),
  })

  const [validationErrors, setValidationErrors] = useState<{
    sharedWithYou: Partial<MakeArraysValuesToObjects<typeof contact.sharedInfo>>
  }>({ sharedWithYou: {} })

  const contactCardActions = useMemo(
    () => [
      {
        icon: 'trash' as const,
        key: 'delete' as const,
        name: 'Delete contact',
        onPress: async () => {
          if (contact.contactInfo?.recordID) {
            const isDeleted = await deleteContact({ contact })
            if (isDeleted) router.navigate('/people')
          }
        },
      },
    ],
    [contact, deleteContact, router],
  )

  const onSaveOrEdit = () => {
    if (isEditing.sharedWithYou) {
      const visibleKeys = Object.keys(pickBy(fieldsVisibility.sharedWithYou, (val) => val))
      const ContactInfoValidationObject = object(
        pick(
          {
            addresses:
              (fields.sharedWithYou.addresses?.length ?? 0) > 0
                ? array(object(mapValues(fields.sharedWithYou.addresses?.[0], () => requiredStringMoreThanStruct(1))))
                : undefined,
            emails: array(
              object({
                key: requiredStringMoreThanStruct(1),
                value: emailStruct,
              }),
            ),
            firstName: requiredStringMoreThanStruct(1),
            lastName: requiredStringMoreThanStruct(1),
            phones: array(
              object({
                key: requiredStringMoreThanStruct(1),
                value: requiredStringMoreThanStruct(1),
              }),
            ),
          },
          visibleKeys,
        ),
      )

      const validationInfo = customValidate(pick(fields.sharedWithYou, visibleKeys), ContactInfoValidationObject)

      if (!validationInfo.valid) {
        setValidationErrors((state) => ({
          ...state,
          sharedWithYou: validationInfo.errors,
        }))
        return
      }

      setValidationErrors((state) => ({
        ...state,
        sharedWithYou: {},
      }))
      contact.contactInfo?.recordID &&
        updateContact({
          newContactInfo: fields.sharedWithYou,
          oldContact: contact,
          recordID: contact.contactInfo?.recordID,
        })
          // TODO add error handling
          .catch(() => {
            console.error('Error updating contact')
          })
    }
    setIsEditing((state) => ({ ...state, sharedWithYou: !state.sharedWithYou }))
  }

  return (
    <>
      <BackgroundLayout Svg={BackgroundDull} />
      <View style={styles.page}>
        {contact && (
          <View style={styles.container}>
            <ConnectionCard
              logo={contact.iconSrc}
              menuActions={Platform.OS === contact.contactInfo?.platform ? contactCardActions : undefined}
              name={contact.name}
              style={styles.card}
            />
            <View style={styles.accordionsContainer}>
              <Accordion
                collapsed={false}
                head={<Typography weight="500">Shared with you</Typography>}
                propsStyles={{
                  container: styles.infoContainer,
                  head: styles.accordionHead,
                }}
                rightHeadLabel={
                  contactPlatform === Platform.OS && (
                    <TouchableOpacity onPress={onSaveOrEdit}>
                      <Typography
                        style={{
                          color: isEditing.sharedWithYou ? colors.dangerLight : colors.blue,
                          fontSize: 14,
                          lineHeight: 20,
                        }}
                      >
                        {isEditing.sharedWithYou ? 'Save' : 'Edit'}
                      </Typography>
                    </TouchableOpacity>
                  )
                }
              >
                {isEditing.sharedWithYou ? (
                  <View>
                    <View style={styles.infoPaddingContainer}>
                      {fieldsVisibility.sharedWithYou?.emails && (
                        <View style={styles.infoInputCol}>
                          <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>Emails</Typography>
                          {fields.sharedWithYou.emails?.map((emailInfo, emailIndex) => (
                            <View key={emailInfo.key}>
                              <MultipleFieldsBlock
                                RightIconActive={InputCustomRightIconActive}
                                style={styles.infoInput}
                                valuesConfig={[
                                  {
                                    errorText: validationErrors.sharedWithYou.emails?.[emailIndex]?.key,
                                    label: 'Label',
                                    onChange: (text) => {
                                      setFields((state) => ({
                                        ...state,
                                        sharedWithYou: {
                                          ...state.sharedWithYou,
                                          emails: state.sharedWithYou.emails?.map((emInfo, idx) =>
                                            emailIndex === idx ? { ...emInfo, key: text } : emInfo,
                                          ),
                                        },
                                      }))
                                    },
                                    value: emailInfo.key,
                                  },
                                  {
                                    errorText: validationErrors.sharedWithYou.emails?.[emailIndex]?.value,
                                    label: 'Email',
                                    onChange: (text) => {
                                      setFields((state) => ({
                                        ...state,
                                        sharedWithYou: {
                                          ...state.sharedWithYou,
                                          emails: state.sharedWithYou.emails?.map((emInfo, idx) =>
                                            emailIndex === idx ? { ...emInfo, value: text } : emInfo,
                                          ),
                                        },
                                      }))
                                    },
                                    value: emailInfo.value,
                                  },
                                ]}
                              />
                            </View>
                          ))}
                          {Array.isArray(contact.sharedInfo.emails) && (contact.sharedInfo.emails?.length ?? 0) > 0 && (
                            <AppButton
                              IconLeft={PlusSmallIcon}
                              onPress={() => {
                                setFields({
                                  ...fields,
                                  sharedWithYou: {
                                    ...fields.sharedWithYou,
                                    emails: [
                                      ...(fields.sharedWithYou.emails ?? []),
                                      mapValues(fields.sharedWithYou.emails?.[0], '') as {
                                        key: string
                                        value: string
                                      },
                                    ],
                                  },
                                })
                              }}
                              style={styles.addNewListItem}
                              text={'Add another email'}
                              textStyles={styles.addNewListItemText}
                              variant="link"
                            />
                          )}
                        </View>
                      )}
                      <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                        <TextField
                          errorText={validationErrors.sharedWithYou.firstName}
                          label="First Name"
                          onChangeText={(text) => {
                            setFields((state) => ({
                              ...state,
                              sharedWithYou: {
                                ...state.sharedWithYou,
                                firstName: text,
                              },
                            }))
                          }}
                          propsStyles={{ container: styles.infoInput }}
                          RightIconActive={InputCustomRightIconActive}
                          value={fields.sharedWithYou.firstName}
                        />
                      </View>
                      <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                        <TextField
                          errorText={validationErrors.sharedWithYou.lastName}
                          label="Last Name"
                          onChangeText={(text) => {
                            setFields((state) => ({
                              ...state,
                              sharedWithYou: {
                                ...state.sharedWithYou,
                                lastName: text,
                              },
                            }))
                          }}
                          propsStyles={{ container: styles.infoInput }}
                          RightIconActive={InputCustomRightIconActive}
                          value={fields.sharedWithYou.lastName}
                        />
                      </View>
                      {fieldsVisibility.sharedWithYou?.phones && (
                        <View style={StyleSheet.compose(styles.infoInputCol, styles.infoBorder)}>
                          <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>Phone Numbers</Typography>
                          {fields.sharedWithYou.phones?.map((phoneInfo, phoneIndex) => (
                            <View key={phoneInfo.key}>
                              <MultipleFieldsBlock
                                RightIconActive={InputCustomRightIconActive}
                                style={styles.infoInput}
                                valuesConfig={[
                                  {
                                    errorText: validationErrors.sharedWithYou.emails?.[phoneIndex]?.key,
                                    label: 'Label',
                                    onChange: (text) => {
                                      setFields((state) => ({
                                        ...state,
                                        sharedWithYou: {
                                          ...state.sharedWithYou,
                                          phones: state.sharedWithYou.phones?.map((emInfo, idx) =>
                                            phoneIndex === idx ? { ...emInfo, key: text } : emInfo,
                                          ),
                                        },
                                      }))
                                    },
                                    value: phoneInfo.key,
                                  },
                                  {
                                    errorText: validationErrors.sharedWithYou.emails?.[phoneIndex]?.value,
                                    label: 'Number',
                                    onChange: (text) => {
                                      setFields((state) => ({
                                        ...state,
                                        sharedWithYou: {
                                          ...state.sharedWithYou,
                                          phones: state.sharedWithYou.phones?.map((emInfo, idx) =>
                                            phoneIndex === idx ? { ...emInfo, value: text } : emInfo,
                                          ),
                                        },
                                      }))
                                    },
                                    value: phoneInfo.value,
                                  },
                                ]}
                              />
                            </View>
                          ))}
                          {Array.isArray(contact.sharedInfo.phones) && (contact.sharedInfo.phones?.length ?? 0) > 0 && (
                            <AppButton
                              IconLeft={PlusSmallIcon}
                              onPress={() => {
                                setFields({
                                  ...fields,
                                  sharedWithYou: {
                                    ...fields.sharedWithYou,
                                    phones: [
                                      ...(fields.sharedWithYou.phones ?? []),
                                      mapValues(fields.sharedWithYou.phones?.[0], '') as {
                                        key: string
                                        value: string
                                      },
                                    ],
                                  },
                                })
                              }}
                              style={styles.addNewListItem}
                              text={'Add another phone'}
                              textStyles={styles.addNewListItemText}
                              variant="link"
                            />
                          )}
                        </View>
                      )}
                      {fieldsVisibility.sharedWithYou?.addresses && (
                        <View style={StyleSheet.compose(styles.infoInputCol, styles.infoBorder)}>
                          <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>Addresses</Typography>
                          {fields.sharedWithYou.addresses?.map((addressInfo, addressIndex) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: it must be index
                            <View key={addressIndex}>
                              <MultipleFieldsBlock
                                RightIconActive={InputCustomRightIconActive}
                                style={styles.infoInput}
                                valuesConfig={Object.entries(addressInfo).map(([key, value]) => ({
                                  errorText: validationErrors.sharedWithYou.addresses?.[addressIndex]?.[key],
                                  label: key,
                                  onChange: (text) => {
                                    setFields((state) => ({
                                      ...state,
                                      sharedWithYou: {
                                        ...state.sharedWithYou,
                                        addresses: state.sharedWithYou.addresses?.map((adInfo, idx) =>
                                          addressIndex === idx ? { ...adInfo, [key]: text } : adInfo,
                                        ),
                                      },
                                    }))
                                  },
                                  value: value,
                                }))}
                              />
                            </View>
                          ))}
                          {Array.isArray(contact.sharedInfo.addresses) &&
                            (contact.sharedInfo.addresses?.length ?? 0) > 0 && (
                              <AppButton
                                IconLeft={PlusSmallIcon}
                                onPress={() => {
                                  setFields({
                                    ...fields,
                                    sharedWithYou: {
                                      ...fields.sharedWithYou,
                                      addresses: [
                                        ...(fields.sharedWithYou.addresses ?? []),
                                        mapValues(fields.sharedWithYou.addresses?.[0], ''),
                                      ],
                                    },
                                  })
                                }}
                                style={styles.addNewListItem}
                                text={'Add another address'}
                                textStyles={styles.addNewListItemText}
                                variant="link"
                              />
                            )}
                        </View>
                      )}
                    </View>
                    <View style={styles.newFieldsSelectContainer}>
                      <AddConnectionAttribute
                        data={Fields_Keys.filter((key) => !fieldsVisibility.sharedWithYou[key])}
                        label="Add field"
                        onSelect={(data) => {
                          if (Array.isArray(fields.sharedWithYou[data])) {
                            if (data === 'addresses') {
                              setFields({
                                ...fields,
                                sharedWithYou: {
                                  ...fields.sharedWithYou,
                                  [data]: [
                                    {
                                      city: '',
                                      country: '',
                                      label: '',
                                      postCode: '',
                                      region: '',
                                      state: '',
                                      street: '',
                                    },
                                  ],
                                },
                              })
                            } else {
                              setFields({
                                ...fields,
                                sharedWithYou: {
                                  ...fields.sharedWithYou,
                                  [data]: [{ key: '', value: '' }],
                                },
                              })
                            }
                          }
                          setFieldsVisibility((state) => ({
                            sharedWithYou: {
                              ...state.sharedWithYou,
                              [data]: true,
                            },
                          }))
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.infoPaddingContainer}>
                    {fieldsVisibility.sharedWithYou?.emails && (
                      <View style={styles.infoRow}>
                        <Typography style={styles.infoLabel}>Emails</Typography>
                        {contact.sharedInfo.emails?.map((emailInfo) => (
                          <View key={emailInfo.key} style={styles.arrayItemBlock}>
                            <Typography style={styles.infoArrayText}>{emailInfo.value}</Typography>
                            <Typography style={styles.infoArrayLabel}>{emailInfo.key}</Typography>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                      <Typography style={styles.infoLabel}>First Name</Typography>
                      <Typography style={styles.infoText}>{contact.sharedInfo.firstName}</Typography>
                    </View>
                    <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                      <Typography style={styles.infoLabel}>Last Name</Typography>
                      <Typography style={styles.infoText}>{contact.sharedInfo.lastName}</Typography>
                    </View>
                    {fieldsVisibility.sharedWithYou?.phones && (
                      <View style={[styles.infoRow, styles.infoBorder]}>
                        <Typography style={styles.infoLabel}>Phone numbers</Typography>
                        {contact.sharedInfo.phones?.map((phoneInfo) => (
                          <View key={phoneInfo.key} style={styles.arrayItemBlock}>
                            <Typography style={styles.infoArrayText}>{phoneInfo.value}</Typography>
                            <Typography style={styles.infoArrayLabel}>{phoneInfo.key}</Typography>
                          </View>
                        ))}
                      </View>
                    )}
                    {fieldsVisibility.sharedWithYou?.addresses && (
                      <View style={[styles.infoRow, styles.infoBorder]}>
                        <Typography style={styles.infoLabel}>Addresses</Typography>
                        {contact.sharedInfo.addresses?.map((addressInfo, addressIndex) => (
                          <View
                            // biome-ignore lint/suspicious/noArrayIndexKey: it must be index
                            key={addressIndex}
                            style={[
                              styles.complexDataContainer,
                              styles.infoRow,
                              addressIndex !== 0 && styles.infoBorder,
                            ]}
                          >
                            {Object.entries(addressInfo).map(([key, value]) => (
                              <View key={key}>
                                <Typography style={styles.infoLabel}>{key}</Typography>
                                <Typography style={styles.infoText}>{value}</Typography>
                              </View>
                            ))}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </Accordion>
            </View>
          </View>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  accordionHead: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  accordionsContainer: {
    gap: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  addNewListItem: { marginBottom: 4, marginTop: 10 },

  addNewListItemText: { color: colors['blue-700'] },
  arrayItemBlock: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  complexDataContainer: { gap: 4 },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  infoArrayLabel: {
    color: colors['gray-600'],
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 20,
  },
  infoArrayText: { color: colors['blue-700'], lineHeight: 24 },
  infoBorder: { borderTopColor: colors.border, borderTopWidth: 1 },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    borderColor: 'rgba(255, 255, 255, 0.80)',
    borderRadius: 8,
    borderWidth: 1,
  },
  infoInput: { flexGrow: 1 },
  infoInputCol: { gap: 8, paddingVertical: 12 },
  infoInputRow: { flexDirection: 'row', gap: 8, paddingVertical: 12 },
  infoLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 16,
    marginBottom: -2,
  },
  infoPaddingContainer: {
    paddingBottom: 4,
    paddingHorizontal: 12,
  },
  infoRow: { paddingVertical: 8 },
  infoText: { color: colors.secondary, lineHeight: 24 },
  newFieldsSelectContainer: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  page: {
    flex: 1,
    padding: 8,
  },
  trashIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    borderColor: 'rgba(0, 0, 0, 0.10)',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 18,
    padding: 12,
  },
})
