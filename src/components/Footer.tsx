import { BottomSheetBackDrop } from "@components/BottomSheet"
import BottomSheet from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { customHeader, isConnectionPeopleView } from "@store/index"
import { colors } from "@utils/theme"
import { useSetAtom } from "jotai"
import { FC, useRef } from "react"
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Contacts from "react-native-contacts"
import { LinkIcon, PlusCircleIcon, ShareIcon, UserGroupIcon } from "react-native-heroicons/outline"
import { IconSources } from "../assets"
import { contactService } from "../services/contact.service"
import { ContactsStore } from "../store/contacts"
import { alertContactsNoPermissionAlert } from "../utils/alerts"
import { Avatar } from "./Avatar"
import { Typography } from "./Typography"

type FooterProps = {
  activePage?: string
}

export const Footer: FC<FooterProps> = ({ activePage = false }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const navigation = useNavigation()
  const isCompaniesPage = activePage === "companies"
  const isPeoplePage = activePage === "people"
  const setContacts = useSetAtom(ContactsStore)
  const setConnectionPeopleView = useSetAtom(isConnectionPeopleView)
  const setCustomHeader = useSetAtom(customHeader)

  const getIosContacts = async () => {
    let contacts
    try {
      contacts = await Contacts.getAll()
    } catch (err) {
      alertContactsNoPermissionAlert()
      console.error("Error fetching contacts: ", err)
      return undefined
    }

    const result = await contactService.rewriteContactsByPlatform(contacts, "ios")
    return result
  }

  const getAndroidContacts = async () => {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    )
    if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
      alertContactsNoPermissionAlert()
      console.error("Permission denied")
      return undefined
    }
    const contacts = await Contacts.getAll()

    const result = await contactService.rewriteContactsByPlatform(contacts, "android")
    return result
  }

  const onAddPress = () => {
    bottomSheetRef.current?.expand()
  }
  const CompaniesPress = () => {
    setCustomHeader("Companies")
    setConnectionPeopleView(false)
    navigation.navigate("Companies")
  }
  const PeoplePress = () => {
    setCustomHeader("People")
    setConnectionPeopleView(true)
    navigation.navigate("Companies")
  }

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          padding: 16,
          paddingBottom: 28,
          zIndex: 1,
        }}
      >
        <TouchableOpacity onPress={CompaniesPress} style={styles.footerItem} hitSlop={8}>
          <LinkIcon
            size={20}
            color={isCompaniesPage ? colors.primary : "black"}
            strokeWidth={isCompaniesPage ? 2 : 1}
          />
          <Typography style={{ color: isCompaniesPage ? colors.primary : "black" }}>
            Companies
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={PeoplePress} style={styles.footerItem} hitSlop={8}>
          <UserGroupIcon
            size={20}
            color={isPeoplePage ? colors.primary : "black"}
            strokeWidth={isPeoplePage ? 2 : 1}
          />
          <Typography style={{ color: isPeoplePage ? colors.primary : "black" }}>People</Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddPress} style={styles.footerItem} hitSlop={8}>
          <PlusCircleIcon size={20} color={"black"} />
          <Typography>Connect</Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddPress} style={styles.footerItem} hitSlop={8}>
          <ShareIcon size={20} color={"black"} />
          <Typography>Share</Typography>
        </TouchableOpacity>
      </View>

      <BottomSheetBackDrop
        ref={bottomSheetRef}
        title="Add"
        propsStyles={{
          contentContainer: {
            backgroundColor: "rgba(242, 242, 242, 0.93)",
          },
        }}
      >
        <View style={styles.addConnectionContainer}>
          {isPeoplePage && (
            <View style={styles.addConnectionItem}>
              <Text style={styles.title}>Your contacts</Text>
              {Platform.OS === "ios" && (
                <View style={styles.container}>
                  <Avatar src={IconSources.apple} text={"Apple contacts"} size={48} />
                  <Typography style={styles.name} fontFamily="publicSans.bold" weight="500">
                    Apple contacts
                  </Typography>

                  <Pressable
                    onPress={async () => {
                      const contacts = await getIosContacts()
                      if (contacts) {
                        setContacts(contacts)
                        bottomSheetRef.current?.close()
                      }
                    }}
                  >
                    <Typography style={styles.connectText}>Connect</Typography>
                  </Pressable>
                </View>
              )}
              {Platform.OS === "android" && (
                <View style={styles.container}>
                  <Avatar src={IconSources.android} text={"Android contacts"} size={48} />
                  <Typography style={styles.name} fontFamily="publicSans.bold" weight="500">
                    Android contacts
                  </Typography>

                  <Pressable
                    // some bug on the android, last block stretching beyond the parent and even screen
                    style={{ maxWidth: 50 }}
                    onPress={async () => {
                      const contacts = await getAndroidContacts()
                      if (contacts) {
                        setContacts(contacts)
                        bottomSheetRef.current?.close()
                      }
                    }}
                  >
                    <Typography style={styles.connectText}>Connect</Typography>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
      </BottomSheetBackDrop>
    </>
  )
}

const styles = StyleSheet.create({
  addConnectionContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    padding: 16,
  },
  addConnectionItem: {
    alignItems: "flex-start",
    width: "100%",
    gap: 8,
  },
  footerItem: {
    flex: 1,
    gap: 4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  container: {
    padding: 8,
    paddingRight: 24,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.80)",
  },
  image: { width: 48, height: 48, borderRadius: 9999 },
  name: { flexGrow: 1 },
  border: { borderColor: colors.primary, borderWidth: 2 },
  connectText: { color: colors.link, fontSize: 12, lineHeight: 16 },
})
