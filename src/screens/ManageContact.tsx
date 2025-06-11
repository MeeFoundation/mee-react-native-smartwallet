import BackgroundDull from "@assets/images/background-dull.svg"
import { Accordion } from "@components/Accordion"
import { AddConnectionAttribute } from "@components/AddConnectionAttribute"
import { BackgroundLayout } from "@components/BackgroundLayout"
import { ConnectionCard } from "@components/ConnectionCard"
import { MultipleFieldsBlock } from "@components/MultipleFieldsBlock"
import { TextField } from "@components/TextField"
import { Typography } from "@components/Typography"
import { RootStackParamList } from "@navigation/rootNavigation"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ContactsDetails, deleteContactAtom, updateContactAtom } from "@store/contacts"
import { colors } from "@utils/theme"
import { MakeArraysValuesToObjects } from "@utils/ts-utils"
import { useAtomValue, useSetAtom } from "jotai"
import { mapValues } from "lodash-es"
import React, { FC, Fragment, useMemo, useState } from "react"
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native"
import { PlusSmallIcon, XMarkIcon } from "react-native-heroicons/outline"
import { SvgProps } from "react-native-svg"
import { AppButton } from "../components/AppButton"
import {
  NestedData,
  NestedSchema,
  NoData,
  SharedInfo,
  isArrayPlainSchemaType,
  isPlainSchemaType,
} from "../services/core.service"

const InputCustomRightIconActive: FC<SvgProps> = ({ style, ...props }) => (
  // @ts-ignore for svg, colors property works correctly
  <XMarkIcon style={[style, { color: colors["gray-800"] }]} {...props} />
)

const mapValuesNested = (
  scheme: NestedSchema["schema"],
): { [key: string]: string | NestedData } => {
  return mapValues(Array.isArray(scheme) ? scheme[0] : scheme, (val) =>
    val.type === "nested" ? mapValuesNested(val.schema) : "",
  )
}

const NestedComponent = ({
  setFields,
  fieldSchema,
  fieldKey,
  isEditing,
}: {
  setFields?: (values: NestedData) => void
  fieldSchema: NestedSchema
  fieldKey: string
  isEditing?: boolean
}) => {
  const nestedSchema = fieldSchema.schema
  const nestedData = fieldSchema.data

  return isEditing ? (
    <View style={styles.infoInputCol}>
      <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>{fieldSchema?.title}</Typography>
      {Array.isArray(nestedSchema) &&
        Array.isArray(nestedData) &&
        nestedData?.map((arrayObjData, arrayObjIndex) => {
          return (
            <View key={arrayObjIndex}>
              <MultipleFieldsBlock
                valuesConfig={Object.entries(nestedSchema[0])
                  .filter(([, value]) => value.type !== "nested")
                  .map(([schemaKey, schemaValue]) => ({
                    label: schemaValue.title,
                    value: arrayObjData?.[schemaKey] as string,
                    onChange: (text) => {
                      setFields?.(
                        nestedData?.map((objData, objDataIndex) =>
                          objDataIndex === arrayObjIndex
                            ? {
                                ...objData,
                                [schemaKey]: text,
                              }
                            : objData,
                        ),
                      )
                    },
                    // errorText:
                    //   validationErrors.sharedWithYou.emails?.[emailIndex]
                    //     ?.key,
                  }))}
                style={styles.infoInput}
                RightIconActive={InputCustomRightIconActive}
              />
              <View
                style={{
                  marginLeft: 16,
                  maxWidth: 300,
                }}
              >
                {Object.entries(nestedSchema[0])
                  .filter(([, value]) => value.type === "nested")
                  .map(([schemaKey, schemaValue]) => {
                    return (
                      <NestedComponent
                        key={schemaKey}
                        setFields={(values) => {
                          setFields?.(
                            nestedData?.map((objData, objDataIndex) =>
                              objDataIndex === arrayObjIndex
                                ? {
                                    ...objData,
                                    [schemaKey]: values,
                                  }
                                : objData,
                            ),
                          )
                        }}
                        fieldSchema={{
                          ...(schemaValue as NoData<NestedSchema>),
                          data: arrayObjData?.[schemaKey] as NestedData,
                        }}
                        fieldKey={schemaKey}
                        isEditing
                      />
                    )
                  })}
              </View>
            </View>
          )
        })}
      {Array.isArray(nestedSchema) &&
        Array.isArray(nestedData) &&
        (nestedData?.length ?? 0) > 0 && (
          <AppButton
            IconLeft={PlusSmallIcon}
            text={`Add another ${fieldSchema.title}`}
            onPress={() => {
              setFields?.([...nestedData, mapValuesNested(nestedSchema)])
            }}
            variant="link"
            textStyles={styles.addNewListItemText}
            style={styles.addNewListItem}
          />
        )}
      {!Array.isArray(nestedSchema) && !Array.isArray(nestedData) && (
        <View>
          <MultipleFieldsBlock
            valuesConfig={Object.entries(nestedSchema)
              .filter(([, value]) => value.type !== "nested")
              .map(([schemaKey]) => ({
                label: nestedSchema[schemaKey].title,
                value: nestedData?.[schemaKey] as string,
                onChange: (text) => {
                  setFields?.({
                    ...nestedData,
                    [schemaKey]: text,
                  })
                },
                // errorText:
                //   validationErrors.sharedWithYou.emails?.[emailIndex]
                //     ?.key,
              }))}
            style={styles.infoInput}
            RightIconActive={InputCustomRightIconActive}
          />
          <View
            style={{
              marginLeft: 16,
              maxWidth: 300,
            }}
          >
            {Object.entries(nestedSchema)
              .filter(([, value]) => value.type === "nested")
              .map(([schemaKey, schemaValue]) => {
                return (
                  <NestedComponent
                    key={schemaKey}
                    setFields={(values) => {
                      setFields?.({
                        ...nestedData,
                        [schemaKey]: values,
                      })
                    }}
                    fieldSchema={{
                      ...(schemaValue as NoData<NestedSchema>),
                      data: nestedData?.[schemaKey] as NestedData,
                    }}
                    fieldKey={schemaKey}
                    isEditing
                  />
                )
              })}
          </View>
        </View>
      )}
    </View>
  ) : (
    <View style={[styles.infoRow, styles.infoBorder]}>
      <Typography style={styles.infoLabel}>{fieldSchema.title}</Typography>
      {Array.isArray(nestedSchema) &&
        Array.isArray(nestedData) &&
        nestedData?.map((arrayObjData, arrayObjIndex) => (
          <View
            style={[
              styles.complexDataContainer,
              styles.infoRow,
              arrayObjIndex !== 0 && styles.infoBorder,
            ]}
            key={arrayObjIndex}
          >
            {Object.entries(nestedSchema[0])
              .filter(([_, value]) => value.type !== "nested")
              .map(([key], innerIndex) => (
                <View key={innerIndex}>
                  <Typography style={styles.infoLabel}>{key}</Typography>
                  <Typography style={styles.infoText}>{arrayObjData[key] as string}</Typography>
                </View>
              ))}
            {Object.entries(nestedSchema[0])
              .filter(([_, value]) => value.type === "nested")
              .map(([schemaKey, schemaValue], innerIndex) => (
                <View key={innerIndex} style={{ marginLeft: 16, maxWidth: 300 }}>
                  <Typography style={styles.infoLabel}>{schemaKey}</Typography>
                  <NestedComponent
                    key={schemaKey}
                    fieldSchema={{
                      ...(schemaValue as NoData<NestedSchema>),
                      data: arrayObjData?.[schemaKey] as NestedData,
                    }}
                    fieldKey={schemaKey}
                    isEditing={false}
                  />
                </View>
              ))}
          </View>
        ))}
      {!Array.isArray(nestedSchema) && !Array.isArray(nestedData) && (
        <View style={[styles.complexDataContainer, styles.infoRow]}>
          {Object.entries(nestedSchema)
            .filter(([_, value]) => value.type !== "nested")
            .map(([key], innerIndex) => (
              <View key={innerIndex}>
                <Typography style={styles.infoLabel}>{key}</Typography>
                <Typography style={styles.infoText}>{nestedData[key] as string}</Typography>
              </View>
            ))}
          {Object.entries(nestedSchema)
            .filter(([_, value]) => value.type === "nested")
            .map(([schemaKey, schemaValue], innerIndex) => (
              <View key={innerIndex} style={{ marginLeft: 16, maxWidth: 300 }}>
                <Typography style={styles.infoLabel}>{schemaKey}</Typography>
                <NestedComponent
                  key={schemaKey}
                  fieldSchema={{
                    ...(schemaValue as NoData<NestedSchema>),
                    data: nestedData?.[schemaKey] as NestedData,
                  }}
                  fieldKey={schemaKey}
                  isEditing={false}
                />
              </View>
            ))}
        </View>
      )}
    </View>
  )
}

export const ManageContact = () => {
  const { navigate } = useNavigation()
  const route = useRoute<RouteProp<RootStackParamList, "Manage Contact">>()
  const { contact, platform: contactPlatform } = useAtomValue(ContactsDetails(route.params.id))
  const deleteContact = useSetAtom(deleteContactAtom)
  const updateContact = useSetAtom(updateContactAtom)

  const [isEditing, setIsEditing] = useState({ sharedWithYou: false })
  const [fields, setFields] = useState<{
    sharedWithYou: Record<string, SharedInfo[keyof SharedInfo]>
  }>({
    sharedWithYou: contact?.sharedInfo,
  })
  const [fieldsVisibility, setFieldsVisibility] = useState<{
    sharedWithYou: Record<string, boolean | undefined>
  }>({
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
            isDeleted && navigate("Companies", { customView: "People" })
          }
        },
        icon: "trash" as const,
      },
    ],
    [contact, deleteContact, navigate],
  )

  const onSaveOrEdit = () => {
    if (isEditing.sharedWithYou) {
      // const visibleKeys = Object.keys(pickBy(fieldsVisibility.sharedWithYou, (val) => val))
      // const ContactInfoValidationObject = object(
      //   pick(
      //     {
      //       emails: array(
      //         object({
      //           key: requiredStringMoreThanStruct(1),
      //           value: emailStruct,
      //         }),
      //       ),
      //       firstName: requiredStringMoreThanStruct(1),
      //       lastName: requiredStringMoreThanStruct(1),
      //       phones: array(
      //         object({
      //           key: requiredStringMoreThanStruct(1),
      //           value: requiredStringMoreThanStruct(1),
      //         }),
      //       ),
      //       addresses:
      //         (fields.sharedWithYou.addresses?.length ?? 0) > 0
      //           ? array(
      //               object(
      //                 mapValues(fields.sharedWithYou.addresses?.[0], () =>
      //                   requiredStringMoreThanStruct(1),
      //                 ),
      //               ),
      //             )
      //           : undefined,
      //     },
      //     visibleKeys,
      //   ),
      // )

      // const validationInfo = customValidate(
      //   pick(fields.sharedWithYou, visibleKeys),
      //   ContactInfoValidationObject,
      // )

      // if (!validationInfo.valid) {
      //   setValidationErrors((state) => ({
      //     ...state,
      //     sharedWithYou: validationInfo.errors,
      //   }))
      //   return
      // }

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
                      {Object.keys(fields.sharedWithYou).map((fieldKey) => {
                        if (!fieldsVisibility.sharedWithYou[fieldKey]) {
                          return null
                        }

                        const fieldSchema = fields.sharedWithYou[fieldKey]
                        return (
                          <>
                            {isPlainSchemaType(fieldSchema?.type) && (
                              <View
                                style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}
                              >
                                <TextField
                                  label={fieldSchema.title}
                                  propsStyles={{ container: styles.infoInput }}
                                  value={fieldSchema.data}
                                  // errorText={validationErrors.sharedWithYou[fieldKey]}
                                  onChangeText={(text) => {
                                    setFields({
                                      ...fields,
                                      sharedWithYou: {
                                        ...fields.sharedWithYou,
                                        [fieldKey]: {
                                          ...fieldSchema,
                                          data: text,
                                        },
                                      },
                                    })
                                  }}
                                  RightIconActive={InputCustomRightIconActive}
                                />
                              </View>
                            )}
                            {isArrayPlainSchemaType(fieldSchema?.type) && (
                              <View style={styles.infoInputCol}>
                                <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>
                                  {fieldSchema?.title}
                                </Typography>
                                {fieldSchema.data?.map((dataValue, dataIndex) => (
                                  <TextField
                                    propsStyles={{ container: styles.infoInput }}
                                    value={dataValue}
                                    // errorText={validationErrors.sharedWithYou[fieldKey]}
                                    onChangeText={(text) => {
                                      setFields({
                                        ...fields,
                                        sharedWithYou: {
                                          ...fields.sharedWithYou,
                                          [fieldKey]: {
                                            ...fieldSchema,
                                            data: fieldSchema.data?.map((data, index) =>
                                              index === dataIndex ? text : data,
                                            ),
                                          },
                                        },
                                      })
                                    }}
                                    RightIconActive={InputCustomRightIconActive}
                                  />
                                ))}
                              </View>
                            )}
                            {fieldSchema?.type === "nested" && (
                              <NestedComponent
                                fieldSchema={fieldSchema}
                                fieldKey={fieldKey}
                                setFields={(values) => {
                                  setFields((state) => ({
                                    ...state,
                                    sharedWithYou: {
                                      ...state.sharedWithYou,
                                      [fieldKey]: {
                                        ...fieldSchema,
                                        data: values,
                                      },
                                    },
                                  }))
                                }}
                                isEditing
                              />
                            )}
                          </>
                        )
                      })}
                    </View>
                    <View style={styles.newFieldsSelectContainer}>
                      <AddConnectionAttribute
                        data={Object.keys(fields.sharedWithYou).filter(
                          (key) => !fieldsVisibility.sharedWithYou[key],
                        )}
                        onSelect={(dataKey) => {
                          const type = fields.sharedWithYou[dataKey].type
                          if (type === "nested") {
                            if (Array.isArray(fields.sharedWithYou[dataKey].schema)) {
                              setFields({
                                ...fields,
                                sharedWithYou: {
                                  ...fields.sharedWithYou,
                                  [dataKey]: {
                                    ...fields.sharedWithYou[dataKey],
                                    data: [mapValuesNested(fields.sharedWithYou[dataKey].schema)],
                                  },
                                },
                              })
                            } else {
                              setFields({
                                ...fields,
                                sharedWithYou: {
                                  ...fields.sharedWithYou,
                                  [dataKey]: {
                                    ...fields.sharedWithYou[dataKey],
                                    data: mapValuesNested(fields.sharedWithYou[dataKey].schema),
                                  },
                                },
                              })
                            }
                          }

                          if (isArrayPlainSchemaType(type)) {
                            setFields({
                              ...fields,
                              sharedWithYou: {
                                ...fields.sharedWithYou,
                                [dataKey]: {
                                  ...fields.sharedWithYou[dataKey],
                                  type,
                                  data: [""],
                                },
                              },
                            })
                          }

                          setFieldsVisibility((state) => ({
                            sharedWithYou: {
                              ...state.sharedWithYou,
                              [dataKey]: true,
                            },
                          }))
                        }}
                        label="Add field"
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.infoPaddingContainer}>
                    {Object.keys(fields.sharedWithYou).map((fieldKey) => {
                      if (!fieldsVisibility.sharedWithYou[fieldKey]) {
                        return null
                      }

                      const fieldSchema = fields.sharedWithYou[fieldKey]
                      return (
                        <Fragment key={fieldKey}>
                          {isPlainSchemaType(fieldSchema?.type) && (
                            <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                              <Typography style={styles.infoLabel}>{fieldSchema.title}</Typography>
                              <Typography style={styles.infoText}>{fieldSchema.data}</Typography>
                            </View>
                          )}
                          {isArrayPlainSchemaType(fieldSchema?.type) && (
                            <View style={styles.infoInputCol}>
                              <Typography style={[styles.infoLabel, { marginBottom: -6 }]}>
                                {fieldSchema?.title}
                              </Typography>
                              {fieldSchema.data?.map((dataValue, dataIndex) => (
                                <View
                                  style={StyleSheet.compose({ paddingTop: 8 }, styles.infoBorder)}
                                  key={dataIndex}
                                >
                                  <Typography style={styles.infoText}>{dataValue}</Typography>
                                </View>
                              ))}
                            </View>
                          )}
                          {fieldSchema.type === "nested" && (
                            <NestedComponent
                              fieldKey={fieldKey}
                              fieldSchema={fieldSchema}
                              isEditing={false}
                            />
                          )}
                        </Fragment>
                      )
                    })}
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
