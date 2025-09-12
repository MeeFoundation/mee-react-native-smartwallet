import { IconSources } from "@/assets"
import { Avatar } from "@/components/Avatar"
import { BottomSheetBackDrop } from "@/components/BottomSheet"
import { IconSymbol } from "@/components/IconSymbol"
import { Typography } from "@/components/Typography"
import { colors } from "@/constants/colors"
import { fonts } from "@/constants/fonts"
import { useThemeColor } from "@/hooks/useThemeColor"
import { isAuthenticatedAtom } from "@/store/auth"
import { setAndroidContactsAtom, setIosContactsAtom } from "@/store/contacts"
import BottomSheet from "@gorhom/bottom-sheet"
import { Tabs } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import React, { useRef } from "react"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
  tabs: {
    paddingTop: 11, // NOTE: expo icon holder has 5ps padding itself
    height: 85,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    borderColor: "#FFF",
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },

  tabBarLabel: {
    fontFamily: "PublicSans-Medium",
    fontWeight: "400",
    fontSize: 10,
  },

  // TODO Refactor

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

export default function TabLayout() {
  const activeTabColor = useThemeColor("primary")
  const inactiveTabColor = useThemeColor("gray-800")
  const bottomSheetRef = useRef<BottomSheet>(null)
  const setIosContacts = useSetAtom(setIosContactsAtom)
  const setAndroidContacts = useSetAtom(setAndroidContactsAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  // FIXME fixme
  const isPeoplePage = true
  const onAddPress = () => {
    bottomSheetRef.current?.expand()
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeTabColor,
          tabBarInactiveTintColor: inactiveTabColor,
          headerShown: false,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.tabs,
        }}
      >
        <Tabs.Protected guard={isAuthenticated}>
          <Tabs.Screen
            name="index"
            options={{
              title: "Groups",
              tabBarIcon: ({ focused, color }) => (
                <IconSymbol
                  width={24}
                  height={24}
                  color={color}
                  name={focused ? "groups.filled" : "groups.outlined"}
                />
              ),
            }}
          />
        </Tabs.Protected>

        <Tabs.Screen
          name="people"
          options={{
            title: "People",
            tabBarIcon: ({ focused, color }) => (
              <IconSymbol
                width={24}
                height={24}
                name={focused ? "users.filled" : "users.outlined"}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="share-placeholder"
          options={{
            title: "Share",
            tabBarIcon: ({ color }) => (
              <IconSymbol width={24} height={24} name="share.outlined" color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              onAddPress()
            },
          }}
        />

        <Tabs.Screen
          name="wallet-placeholder"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color }) => (
              <IconSymbol width={24} height={24} name="wallet.outlined" color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              onAddPress()
            },
          }}
        />
      </Tabs>

      {/* FIXME Move this somewhere */}

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
                  <Typography style={styles.name} fontFamily={fonts.publicSans.bold} weight="500">
                    Apple contacts
                  </Typography>

                  <Pressable
                    onPress={() => {
                      const fn = async () => {
                        const res = await setIosContacts()
                        if (res) {
                          bottomSheetRef.current?.close()
                        }
                      }
                      // TODO add error handling
                      fn().catch((err) => {
                        console.error("error setting ios contacts", err)
                      })
                    }}
                  >
                    <Typography style={styles.connectText}>Connect</Typography>
                  </Pressable>
                </View>
              )}
              {Platform.OS === "android" && (
                <View style={styles.container}>
                  <Avatar src={IconSources.android} text={"Android contacts"} size={48} />
                  <Typography style={styles.name} fontFamily={fonts.publicSans.bold} weight="500">
                    Android contacts
                  </Typography>

                  <Pressable
                    // some bug on the android, last block stretching beyond the parent and even screen
                    style={{ maxWidth: 50 }}
                    // TODO move to handler
                    onPress={() => {
                      const fn = async () => {
                        const res = await setAndroidContacts()
                        if (res) {
                          bottomSheetRef.current?.close()
                        }
                      }

                      fn().catch((err) => {
                        console.error("error setting android contacts", err)
                      })
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
