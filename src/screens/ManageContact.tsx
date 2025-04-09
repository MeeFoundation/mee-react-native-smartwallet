import BackgroundDull from "@assets/images/background-dull.svg"
import { Accordion } from "@components/Accordion"
import { BackgroundLayout } from "@components/BackgroundLayout"
import { ConnectionCard } from "@components/ConnectionCard"
import { Typography } from "@components/Typography"
import { RootStackParamList } from "@navigation/rootNavigation"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ContactsDetails, deleteContactAtom, updateContactAtom } from "@store/contacts"
import { colors } from "@utils/theme"
import { useAtomValue, useSetAtom } from "jotai"
import { mapValues, pick, pickBy } from "lodash-es"
import React, { useMemo, useState } from "react"
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native"
import { TrashIcon } from "react-native-heroicons/outline"
import { object } from "superstruct"
import { AppButton } from "../components/AppButton"
import { SingleSelectField } from "../components/SingleSelectField"
import { TextField } from "../components/TextField"
import { customValidate, emailStruct, requiredStringMoreThanStruct } from "../utils/validation"

const Fields_Keys = ["email", "firstName", "lastName", "phone"] as const
export const ManageContact = () => {
  const { navigate } = useNavigation()
  const route = useRoute<RouteProp<RootStackParamList, "Manage Contact">>()
  const { contact, platform: contactPlatform } = useAtomValue(ContactsDetails(route.params.id))
  const deleteContact = useSetAtom(deleteContactAtom)
  const updateContact = useSetAtom(updateContactAtom)

  const [isEditing, setIsEditing] = useState({ sharedWithYou: false })
  const [fields, setFields] = useState({ sharedWithYou: contact?.sharedInfo })
  const [fieldsVisibility, setFieldsVisibility] = useState({
    sharedWithYou: mapValues(contact?.sharedInfo, (val) => !!val),
  })
  const [validationErrors, setValidationErrors] = useState<{
    sharedWithYou: Partial<typeof contact.sharedInfo>
  }>({ sharedWithYou: {} })

  const contactCardActions = useMemo(
    () => [
      {
        name: "Delete contact",
        key: "delete" as const,
        onPress: async () => {
          if (contact.contactInfo?.recordID) {
            const isDeleted = await deleteContact({ contact })
            isDeleted && navigate("Connections")
          }
        },
        icon: "trash" as const,
      },
    ],
    [contact, deleteContact, navigate],
  )

  const [selectedFieldToAdd, setSelectedFieldToAdd] = useState<string>()

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
                    <TouchableOpacity
                      onPress={() => {
                        if (isEditing.sharedWithYou) {
                          const visibleKeys = Object.keys(
                            pickBy(fieldsVisibility.sharedWithYou, (val) => val),
                          )
                          const ContactInfoValidationObject = object(
                            pick(
                              {
                                email: emailStruct,
                                firstName: requiredStringMoreThanStruct(1),
                                lastName: requiredStringMoreThanStruct(1),
                                phone: requiredStringMoreThanStruct(1),
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
                        }
                        setIsEditing((state) => ({ ...state, sharedWithYou: !state.sharedWithYou }))
                      }}
                    >
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
                      {fieldsVisibility.sharedWithYou?.email && (
                        <View style={styles.infoInputRow}>
                          <TextField
                            label="Email"
                            style={styles.infoInput}
                            disabled={contactPlatform !== Platform.OS}
                            value={fields.sharedWithYou.email}
                            errorText={validationErrors.sharedWithYou.email}
                            onChangeText={(text) => {
                              setFields((state) => ({
                                ...state,
                                sharedWithYou: {
                                  ...state.sharedWithYou,
                                  email: text,
                                },
                              }))
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              setFields({
                                ...fields,
                                sharedWithYou: {
                                  ...fields.sharedWithYou,
                                  email: undefined,
                                },
                              })
                              setFieldsVisibility({
                                ...fieldsVisibility,
                                sharedWithYou: {
                                  ...fieldsVisibility.sharedWithYou,
                                  email: false,
                                },
                              })
                            }}
                          >
                            <View style={styles.trashIconContainer}>
                              <TrashIcon color={colors.dangerLight} width={24} height={24} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                      <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                        <TextField
                          label="First Name"
                          style={styles.infoInput}
                          disabled={contactPlatform !== Platform.OS}
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
                        />
                      </View>
                      <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                        <TextField
                          label="Last Name"
                          style={styles.infoInput}
                          disabled={contactPlatform !== Platform.OS}
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
                        />
                      </View>
                      {fieldsVisibility.sharedWithYou?.phone && (
                        <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                          <TextField
                            label="Phone number"
                            style={styles.infoInput}
                            disabled={contactPlatform !== Platform.OS}
                            value={fields.sharedWithYou.phone}
                            errorText={validationErrors.sharedWithYou.phone}
                            onChangeText={(text) => {
                              setFields((state) => ({
                                ...state,
                                sharedWithYou: {
                                  ...state.sharedWithYou,
                                  phone: text,
                                },
                              }))
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              setFields({
                                ...fields,
                                sharedWithYou: {
                                  ...fields.sharedWithYou,
                                  phone: undefined,
                                },
                              })
                              setFieldsVisibility({
                                ...fieldsVisibility,
                                sharedWithYou: {
                                  ...fieldsVisibility.sharedWithYou,
                                  phone: false,
                                },
                              })
                            }}
                          >
                            <View style={styles.trashIconContainer}>
                              <TrashIcon color={colors.dangerLight} width={24} height={24} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <View style={styles.newFieldsSelectContainer}>
                      <View style={styles.newFieldsSelect}>
                        <SingleSelectField
                          data={Fields_Keys.filter((key) => !fieldsVisibility.sharedWithYou[key])}
                          selected={selectedFieldToAdd}
                          onSelect={(data) => {
                            setSelectedFieldToAdd(data)
                          }}
                          placeholder="New field title"
                        />
                      </View>
                      <AppButton
                        text="Add"
                        variant="secondary"
                        disabled={!selectedFieldToAdd}
                        onPress={() => {
                          if (selectedFieldToAdd) {
                            setFieldsVisibility((state) => ({
                              sharedWithYou: {
                                ...state.sharedWithYou,
                                [selectedFieldToAdd]: true,
                              },
                            }))
                          }
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.infoPaddingContainer}>
                    {fieldsVisibility.sharedWithYou?.email && (
                      <View style={styles.infoRow}>
                        <Typography style={styles.infoLabel}>Email</Typography>
                        <Typography style={styles.infoText}>{contact.sharedInfo.email}</Typography>
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
                    {fieldsVisibility.sharedWithYou?.phone && (
                      <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                        <Typography style={styles.infoLabel}>Phone number</Typography>
                        <Typography style={styles.infoText}>{contact.sharedInfo.phone}</Typography>
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
  infoBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  infoLabel: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    marginBottom: -2,
  },
  infoText: { color: colors.secondary, fontSize: 18, lineHeight: 28 },
  infoInputRow: { paddingVertical: 8, flexDirection: "row", gap: 8 },
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
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    borderRadius: 8,
  },
  newFieldsSelect: {
    flexGrow: 1,
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
    // boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.05)",
    gap: 8,
  },
})
