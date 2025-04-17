import { BottomSheetBackDrop } from "@components/BottomSheet"
import BottomSheet from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { useSetAtom } from "jotai"
import { FC, useRef } from "react"
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinkIcon, PlusCircleIcon, ShareIcon, UserGroupIcon } from "react-native-heroicons/outline"
import { IconSources } from "../assets"
import { setAndroidContactsAtom, setIosContactsAtom } from "../store/contacts"
import { Avatar } from "./Avatar"
import { Typography } from "./Typography"

type FooterProps = {
  activePage?: string
}

export const Footer: FC<FooterProps> = ({ activePage }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const navigation = useNavigation()
  const isCompaniesPage = activePage === "companies"
  const isPeoplePage = activePage === "people"
  const setIosContacts = useSetAtom(setIosContactsAtom)
  const setAndroidContacts = useSetAtom(setAndroidContactsAtom)

  const onAddPress = () => {
    bottomSheetRef.current?.expand()
  }

  const CompaniesPress = () => {
    navigation.navigate("Companies")
  }
  const PeoplePress = () => {
    navigation.navigate("Companies", { customView: "People" })
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
                      const res = await setIosContacts()
                      if (res) {
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
                      const res = await setAndroidContacts()
                      if (res) {
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
