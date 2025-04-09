import { BottomSheetBackDrop } from "@components/BottomSheet"
import BottomSheet from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
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
import { LinkIcon, PlusCircleIcon, ShareIcon } from "react-native-heroicons/outline"
import { IconSources } from "../assets"
import { ContactsStore } from "../store/contacts"
import { alertContactsNoPermissionAlert } from "../utils/alerts"
import { Avatar } from "./Avatar"
import { Typography } from "./Typography"

type FooterProps = {
  isConnectionsPage?: boolean
}

export const Footer: FC<FooterProps> = ({ isConnectionsPage = false }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const navigation = useNavigation()

  const setContacts = useSetAtom(ContactsStore)

  const getContacts = async () => {
    try {
      const nativeContacts = await Contacts.getAll()

      return {
        data: nativeContacts.map((nativeContact) => ({
          id: nativeContact.recordID,
          name:
            nativeContact.displayName || `${nativeContact.familyName} ${nativeContact.givenName}`,
          sharedInfo: {
            email: nativeContact.emailAddresses[0]?.email as string | undefined,
            firstName: nativeContact.givenName,
            lastName: nativeContact.familyName,
            phone: nativeContact.phoneNumbers[0]?.number as string | undefined,
          },
          tags: [],
          iconSrc: nativeContact.thumbnailPath,
          // profile?: string
          contactInfo: {
            recordID: nativeContact.recordID,
            platform: Platform.OS === "android" || Platform.OS === "ios" ? Platform.OS : undefined,
          },
        })),
      }
    } catch (err) {
      alertContactsNoPermissionAlert()
      console.error("Error fetching contacts: ", err)
      return { error: "Error fetching contacts: " + err }
    }
  }

  const getIosContacts = async () => {
    const contacts = await getContacts()
    return { error: contacts.error, data: { ios: contacts.data } }
  }

  const getAndroidContacts = async () => {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    )
    if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
      alertContactsNoPermissionAlert()
      console.error("Permission denied")
      return { error: "Permission denied" }
    }

    const contacts = await getContacts()
    return { error: contacts.error, data: { android: contacts.data } }
  }

  const onAddPress = () => {
    bottomSheetRef.current?.expand()
  }
  const ConnectionsPress = () => {
    navigation.navigate("Connections")
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
        <TouchableOpacity onPress={ConnectionsPress} style={styles.footerItem} hitSlop={8}>
          <LinkIcon
            size={20}
            color={isConnectionsPage ? colors.primary : "black"}
            strokeWidth={isConnectionsPage ? 2 : 1}
          />
          <Typography style={{ color: isConnectionsPage ? colors.primary : "black" }}>
            Connections
          </Typography>
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
        title="Connect to"
        propsStyles={{
          contentContainer: {
            backgroundColor: "rgba(242, 242, 242, 0.93)",
          },
        }}
      >
        <View style={styles.addConnectionContainer}>
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
                    setContacts(contacts)
                    bottomSheetRef.current?.close()
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
                    setContacts(contacts)
                    bottomSheetRef.current?.close()
                  }}
                >
                  <Typography style={styles.connectText}>Connect</Typography>
                </Pressable>
              </View>
            )}
          </View>
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
