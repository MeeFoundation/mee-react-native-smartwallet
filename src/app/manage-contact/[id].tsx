import BackgroundDull from "@/assets/images/background-dull.svg"
import { AddConnectionAttribute, ConnectionCard } from "@/entities/connection"
import { ContactsDetails, deleteContactAtom, updateContactAtom } from "@/entities/contact"
import { colors } from "@/shared/config"
import { InvalidRouteParamsError } from "@/shared/errors"
import { type MakeArraysValuesToObjects } from "@/shared/lib/ts-utils"
import { customValidate, emailStruct, requiredStringMoreThanStruct } from "@/shared/lib/validation"
import { Accordion } from "@/shared/ui/Accordion"
import { AppButton } from "@/shared/ui/AppButton"
import { BackgroundLayout } from "@/shared/ui/BackgroundLayout"
import { MultipleFieldsBlock } from "@/shared/ui/MultipleFieldsBlock"
import { TextField } from "@/shared/ui/TextField"
import { Typography } from "@/shared/ui/Typography"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import { mapValues, pick, pickBy } from "lodash-es"
import React, { type FC, useMemo, useState } from "react"
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native"
import { PlusSmallIcon, XMarkIcon } from "react-native-heroicons/outline"
import type { SvgProps } from "react-native-svg"
import { array, object } from "superstruct"

const InputCustomRightIconActive: FC<SvgProps> = ({ style, ...props }) => (
  // @ts-expect-error for svg, colors property works correctly
  <XMarkIcon style={[style, { color: colors["gray-800"] }]} {...props} />
)

const Fields_Keys = ["emails", "firstName", "lastName", "phones", "addresses"] as const

// FIXME add [id] segment to this file name
export default function ManageContact() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  if (typeof id !== "string") throw new InvalidRouteParamsError()

  const { contact, platform: contactPlatform } = useAtomValue(ContactsDetails(id))
  const deleteContact = useSetAtom(deleteContactAtom)
  const updateContact = useSetAtom(updateContactAtom)

  const [isEditing, setIsEditing] = useState({ sharedWithYou: false })
  const [fields, setFields] = useState({ sharedWithYou: contact?.sharedInfo })
  const [fieldsVisibility, setFieldsVisibility] = useState({
    sharedWithYou: mapValues(contact?.sharedInfo, (val) =>
      Array.isArray(val) ? !!val && val.length > 0 : !!val,
    ),
  })

  const [validationErrors, setValidationErrors] = useState<{
    sharedWithYou: Partial<MakeArraysValuesToObjects<typeof contact.sharedInfo>>
  }>({ sharedWithYou: {} })

  const contactCardActions = useMemo(
    () => [
      {
        name: "Delete contact",
        key: "delete" as const,
        onPress: async () => {
          if (contact.contactInfo?.recordID) {
            const isDeleted = await deleteContact({ contact })
            if (isDeleted) router.navigate("/people")
          }
        },
        icon: "trash" as const,
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
            addresses:
              (fields.sharedWithYou.addresses?.length ?? 0) > 0
                ? array(
                    object(
                      mapValues(fields.sharedWithYou.addresses?.[0], () =>
                        requiredStringMoreThanStruct(1),
                      ),
                    ),
                  )
                : undefined,
          },
          visibleKeys,
        ),
      )

      const validationInfo = customValidate(
        pick(fields.sharedWithYou, visibleKeys),
        ContactInfoValidationObject,
      )

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
          recordID: contact.contactInfo?.recordID,
          newContactInfo: fields.sharedWithYou,
          oldContact: contact,
        })
          // TODO add error handling
          .catch(() => {
            console.error("Error updating contact")
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
              name={contact.name}
              logo={contact.iconSrc}
              menuActions={
                Platform.OS === contact.contactInfo?.platform ? contactCardActions : undefined
              }
              style={styles.card}
            />
            <View style={styles.accordionsContainer}>
              <Accordion
                head={<Typography weight="500">Shared with you</Typography>}
                collapsed={false}
                rightHeadLabel={
                  contactPlatform === Platform.OS && (
                    <TouchableOpacity onPress={onSaveOrEdit}>
                      <Typography
                        style={{
                          fontSize: 14,
                          lineHeight: 20,
                          color: isEditing.sharedWithYou ? colors.dangerLight : colors.blue,
                        }}
                      >
                        {isEditing.sharedWithYou ? "Save" : "Edit"}
                      </Typography>
                    </TouchableOpacity>
                  )
                }
                propsStyles={{
                  container: styles.infoContainer,
                  head: styles.accordionHead,
                }}
              >
                {isEditing.sharedWithYou ? (
                  <View>
                    <View style={styles.infoPaddingContainer}>
                      {fieldsVisibility.sharedWithYou?.emails && (
                        <View style={styles.infoInputCol}>
                          <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>
                            Emails
                          </Typography>
                          {fields.sharedWithYou.emails?.map((emailInfo, emailIndex) => (
                            <View key={emailIndex}>
                              <MultipleFieldsBlock
                                valuesConfig={[
                                  {
                                    label: "Label",
                                    value: emailInfo.key,
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
                                    errorText:
                                      validationErrors.sharedWithYou.emails?.[emailIndex]?.key,
                                  },
                                  {
                                    label: "Email",
                                    value: emailInfo.value,
                                    onChange: (text) => {
                                      setFields((state) => ({
                                        ...state,
                                        sharedWithYou: {
                                          ...state.sharedWithYou,
                                          emails: state.sharedWithYou.emails?.map((emInfo, idx) =>
                                            emailIndex === idx
                                              ? { ...emInfo, value: text }
                                              : emInfo,
                                          ),
                                        },
                                      }))
                                    },
                                    errorText:
                                      validationErrors.sharedWithYou.emails?.[emailIndex]?.value,
                                  },
                                ]}
                                style={styles.infoInput}
                                RightIconActive={InputCustomRightIconActive}
                              />
                            </View>
                          ))}
                          {Array.isArray(contact.sharedInfo.emails) &&
                            (contact.sharedInfo.emails?.length ?? 0) > 0 && (
                              <AppButton
                                IconLeft={PlusSmallIcon}
                                text={"Add another email"}
                                onPress={() => {
                                  setFields({
                                    ...fields,
                                    sharedWithYou: {
                                      ...fields.sharedWithYou,
                                      emails: [
                                        ...(fields.sharedWithYou.emails ?? []),
                                        mapValues(fields.sharedWithYou.emails?.[0], "") as {
                                          key: string
                                          value: string
                                        },
                                      ],
                                    },
                                  })
                                }}
                                variant="link"
                                textStyles={styles.addNewListItemText}
                                style={styles.addNewListItem}
                              />
                            )}
                        </View>
                      )}
                      <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                        <TextField
                          label="First Name"
                          propsStyles={{ container: styles.infoInput }}
                          value={fields.sharedWithYou.firstName}
                          errorText={validationErrors.sharedWithYou.firstName}
                          onChangeText={(text) => {
                            setFields((state) => ({
                              ...state,
                              sharedWithYou: {
                                ...state.sharedWithYou,
                                firstName: text,
                              },
                            }))
                          }}
                          RightIconActive={InputCustomRightIconActive}
                        />
                      </View>
                      <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                        <TextField
                          label="Last Name"
                          propsStyles={{ container: styles.infoInput }}
                          value={fields.sharedWithYou.lastName}
                          errorText={validationErrors.sharedWithYou.lastName}
                          onChangeText={(text) => {
                            setFields((state) => ({
                              ...state,
                              sharedWithYou: {
                                ...state.sharedWithYou,
                                lastName: text,
                              },
                            }))
                          }}
                          RightIconActive={InputCustomRightIconActive}
                        />
                      </View>
                      {fieldsVisibility.sharedWithYou?.phones && (
                        <View style={StyleSheet.compose(styles.infoInputCol, styles.infoBorder)}>
                          <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>
                            Phone Numbers
                          </Typography>
                          {fields.sharedWithYou.phones?.map((phoneInfo, phoneIndex) => (
                            <View key={phoneIndex}>
                              <MultipleFieldsBlock
                                valuesConfig={[
                                  {
                                    label: "Label",
                                    value: phoneInfo.key,
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
                                    errorText:
                                      validationErrors.sharedWithYou.emails?.[phoneIndex]?.key,
                                  },
                                  {
                                    label: "Number",
                                    value: phoneInfo.value,
                                    onChange: (text) => {
                                      setFields((state) => ({
                                        ...state,
                                        sharedWithYou: {
                                          ...state.sharedWithYou,
                                          phones: state.sharedWithYou.phones?.map((emInfo, idx) =>
                                            phoneIndex === idx
                                              ? { ...emInfo, value: text }
                                              : emInfo,
                                          ),
                                        },
                                      }))
                                    },
                                    errorText:
                                      validationErrors.sharedWithYou.emails?.[phoneIndex]?.value,
                                  },
                                ]}
                                style={styles.infoInput}
                                RightIconActive={InputCustomRightIconActive}
                              />
                            </View>
                          ))}
                          {Array.isArray(contact.sharedInfo.phones) &&
                            (contact.sharedInfo.phones?.length ?? 0) > 0 && (
                              <AppButton
                                IconLeft={PlusSmallIcon}
                                text={"Add another phone"}
                                onPress={() => {
                                  setFields({
                                    ...fields,
                                    sharedWithYou: {
                                      ...fields.sharedWithYou,
                                      phones: [
                                        ...(fields.sharedWithYou.phones ?? []),
                                        mapValues(fields.sharedWithYou.phones?.[0], "") as {
                                          key: string
                                          value: string
                                        },
                                      ],
                                    },
                                  })
                                }}
                                variant="link"
                                textStyles={styles.addNewListItemText}
                                style={styles.addNewListItem}
                              />
                            )}
                        </View>
                      )}
                      {fieldsVisibility.sharedWithYou?.addresses && (
                        <View style={StyleSheet.compose(styles.infoInputCol, styles.infoBorder)}>
                          <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>
                            Addresses
                          </Typography>
                          {fields.sharedWithYou.addresses?.map((addressInfo, addressIndex) => (
                            <View key={addressIndex}>
                              <MultipleFieldsBlock
                                valuesConfig={Object.entries(addressInfo).map(([key, value]) => ({
                                  label: key,
                                  value: value,
                                  onChange: (text) => {
                                    setFields((state) => ({
                                      ...state,
                                      sharedWithYou: {
                                        ...state.sharedWithYou,
                                        addresses: state.sharedWithYou.addresses?.map(
                                          (adInfo, idx) =>
                                            addressIndex === idx
                                              ? { ...adInfo, [key]: text }
                                              : adInfo,
                                        ),
                                      },
                                    }))
                                  },
                                  errorText:
                                    validationErrors.sharedWithYou.addresses?.[addressIndex]?.[key],
                                }))}
                                style={styles.infoInput}
                                RightIconActive={InputCustomRightIconActive}
                              />
                            </View>
                          ))}
                          {Array.isArray(contact.sharedInfo.addresses) &&
                            (contact.sharedInfo.addresses?.length ?? 0) > 0 && (
                              <AppButton
                                IconLeft={PlusSmallIcon}
                                text={"Add another address"}
                                onPress={() => {
                                  setFields({
                                    ...fields,
                                    sharedWithYou: {
                                      ...fields.sharedWithYou,
                                      addresses: [
                                        ...(fields.sharedWithYou.addresses ?? []),
                                        mapValues(fields.sharedWithYou.addresses?.[0], ""),
                                      ],
                                    },
                                  })
                                }}
                                variant="link"
                                textStyles={styles.addNewListItemText}
                                style={styles.addNewListItem}
                              />
                            )}
                        </View>
                      )}
                    </View>
                    <View style={styles.newFieldsSelectContainer}>
                      <AddConnectionAttribute
                        data={Fields_Keys.filter((key) => !fieldsVisibility.sharedWithYou[key])}
                        onSelect={(data) => {
                          if (Array.isArray(fields.sharedWithYou[data])) {
                            if (data === "addresses") {
                              setFields({
                                ...fields,
                                sharedWithYou: {
                                  ...fields.sharedWithYou,
                                  [data]: [
                                    {
                                      label: "",
                                      street: "",
                                      city: "",
                                      region: "",
                                      state: "",
                                      postCode: "",
                                      country: "",
                                    },
                                  ],
                                },
                              })
                            } else {
                              setFields({
                                ...fields,
                                sharedWithYou: {
                                  ...fields.sharedWithYou,
                                  [data]: [{ value: "", key: "" }],
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
                        label="Add field"
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.infoPaddingContainer}>
                    {fieldsVisibility.sharedWithYou?.emails && (
                      <View style={styles.infoRow}>
                        <Typography style={styles.infoLabel}>Emails</Typography>
                        {contact.sharedInfo.emails?.map((emailInfo, emailIndex) => (
                          <View style={styles.arrayItemBlock} key={emailIndex}>
                            <Typography style={styles.infoArrayText}>{emailInfo.value}</Typography>
                            <Typography style={styles.infoArrayLabel}>{emailInfo.key}</Typography>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                      <Typography style={styles.infoLabel}>First Name</Typography>
                      <Typography style={styles.infoText}>
                        {contact.sharedInfo.firstName}
                      </Typography>
                    </View>
                    <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                      <Typography style={styles.infoLabel}>Last Name</Typography>
                      <Typography style={styles.infoText}>{contact.sharedInfo.lastName}</Typography>
                    </View>
                    {fieldsVisibility.sharedWithYou?.phones && (
                      <View style={[styles.infoRow, styles.infoBorder]}>
                        <Typography style={styles.infoLabel}>Phone numbers</Typography>
                        {contact.sharedInfo.phones?.map((phoneInfo, phoneIndex) => (
                          <View style={styles.arrayItemBlock} key={phoneIndex}>
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
                            style={[
                              styles.complexDataContainer,
                              styles.infoRow,
                              addressIndex !== 0 && styles.infoBorder,
                            ]}
                            key={addressIndex}
                          >
                            {Object.entries(addressInfo).map(([key, value], innerIndex) => (
                              <View key={innerIndex}>
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
  page: {
    flex: 1,
    padding: 8,
  },
  card: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "rgba(255, 255, 255, 0.90)",
  },
  infoRow: { paddingVertical: 8 },
  complexDataContainer: { gap: 4 },
  infoBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  infoLabel: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    marginBottom: -2,
  },
  infoText: { color: colors.secondary, lineHeight: 24 },
  infoArrayText: { color: colors["blue-700"], lineHeight: 24 },
  infoArrayLabel: {
    color: colors["gray-600"],
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 400,
  },
  arrayItemBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
  },
  infoInputRow: { paddingVertical: 12, flexDirection: "row", gap: 8 },
  infoInputCol: { paddingVertical: 12, gap: 8 },
  infoInput: { flexGrow: 1 },
  trashIconContainer: {
    marginTop: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.10)",
    backgroundColor: "rgba(255, 255, 255, 0.60)",
    borderRadius: 8,
  },
  newFieldsSelectContainer: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  infoContainer: {
    borderRadius: 8,
    borderColor: "rgba(255, 255, 255, 0.80)",
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.60)",
  },
  infoPaddingContainer: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  accordionHead: {
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  accordionsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 8,
  },
  container: {
    borderRadius: 12,
    borderColor: colors.white,
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0)",
    gap: 8,
  },

  addNewListItemText: { color: colors["blue-700"] },
  addNewListItem: { marginTop: 10, marginBottom: 4 },
})
