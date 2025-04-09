import BackgroundDull from "@assets/images/background-dull.svg"
import { Accordion } from "@components/Accordion"
import { BackgroundLayout } from "@components/BackgroundLayout"
import { ConnectionCard } from "@components/ConnectionCard"
import { Typography } from "@components/Typography"
import { RootStackParamList } from "@navigation/rootNavigation"
import { RouteProp, useRoute } from "@react-navigation/native"
import { ContactsDetails } from "@store/index"
import { colors } from "@utils/theme"
import { useAtom } from "jotai"
import React, { useMemo, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { TrashIcon } from "react-native-heroicons/outline"
import { TextField } from "../components/TextField"

export const ManageContact = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Manage Contact">>()
  const [contact, setContact] = useAtom(ContactsDetails(route.params.id))
  const [isEditing, setIsEditing] = useState({ sharedWithYou: false })
  const [fields, setFields] = useState({ sharedWithYou: contact.sharedInfo })

  const contactCardActions = useMemo(
    () => [
      {
        name: "Delete contact",
        key: "delete" as const,
        onPress: () => {},
        icon: "trash" as const,
      },
    ],
    [],
  )

  return (
    <>
      <BackgroundLayout Svg={BackgroundDull} />
      <View style={styles.page}>
        {contact && (
          <View style={styles.container}>
            <ConnectionCard
              name={contact.name}
              logo={contact.iconSrc}
              menuActions={contactCardActions}
              style={styles.card}
            />
            <View style={styles.accordionsContainer}>
              <Accordion
                head={<Typography weight="500">Shared with you</Typography>}
                collapsed={false}
                rightHeadLabel={
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditing((state) => ({ ...state, sharedWithYou: !state.sharedWithYou }))
                      setContact({ ...contact, sharedInfo: fields.sharedWithYou })
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
                }
                propsStyles={{
                  container: styles.infoContainer,
                }}
              >
                {isEditing.sharedWithYou ? (
                  <View>
                    <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                      <TextField
                        label="Email"
                        style={styles.infoInput}
                        value={fields.sharedWithYou.email}
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
                      <TouchableOpacity>
                        <View style={styles.trashIconContainer}>
                          <TrashIcon color={colors.dangerLight} width={24} height={24} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                      <TextField
                        label="First Name"
                        style={styles.infoInput}
                        value={fields.sharedWithYou.firstName}
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
                      <TouchableOpacity>
                        <View style={styles.trashIconContainer}>
                          <TrashIcon color={colors.dangerLight} width={24} height={24} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={StyleSheet.compose(styles.infoInputRow, styles.infoBorder)}>
                      <TextField
                        label="Last Name"
                        style={styles.infoInput}
                        value={fields.sharedWithYou.lastName}
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
                      <TouchableOpacity>
                        <View style={styles.trashIconContainer}>
                          <TrashIcon color={colors.dangerLight} width={24} height={24} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.infoInputRow}>
                      <TextField
                        label="Phone number"
                        style={styles.infoInput}
                        value={fields.sharedWithYou.phone}
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
                      <TouchableOpacity>
                        <View style={styles.trashIconContainer}>
                          <TrashIcon color={colors.dangerLight} width={24} height={24} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                      <Typography style={styles.infoLabel}>Email</Typography>
                      <Typography style={styles.infoText}>{contact.sharedInfo.email}</Typography>
                    </View>
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
                    <View style={styles.infoRow}>
                      <Typography style={styles.infoLabel}>Phone number</Typography>
                      <Typography style={styles.infoText}>{contact.sharedInfo.phone}</Typography>
                    </View>
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
  infoBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    marginBottom: -2,
  },
  infoText: { color: colors.secondary, fontSize: 18, lineHeight: 28 },

  infoInputRow: { paddingVertical: 8, flexDirection: "row", gap: 8, alignItems: "flex-end" },
  infoInput: { flexGrow: 1 },
  trashIconContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.10)",
    backgroundColor: "rgba(255, 255, 255, 0.60)",
    borderRadius: 8,
  },

  infoContainer: {
    borderRadius: 8,
    borderColor: "rgba(255, 255, 255, 0.80)",
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.60)",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  accordionsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 8,
    // backgroundColor: "rgba(255, 255, 255, 0)",
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
