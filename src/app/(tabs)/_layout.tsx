import type BottomSheet from '@gorhom/bottom-sheet'
import { Tabs } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { IconSources } from '@/assets/images'

import { isAuthenticatedAtom } from '@/features/auth'

import { setAndroidContactsAtom, setIosContactsAtom } from '@/entities/contact'

import { colors, fonts } from '@/shared/config'
import { useThemeColor } from '@/shared/lib/useThemeColor'
import { Avatar } from '@/shared/ui/Avatar'
import { BottomSheetBackDrop } from '@/shared/ui/BottomSheet'
import { HeaderLeft, HeaderRight } from '@/shared/ui/Header'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { Typography } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  // TODO Refactor

  addConnectionContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
    width: '100%',
  },
  addConnectionItem: {
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  border: { borderColor: colors.primary, borderWidth: 2 },
  connectText: { color: colors.link, fontSize: 12, lineHeight: 16 },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.80)',
    borderRadius: 8,

    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    paddingRight: 24,
    width: '100%',
  },
  footerItem: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: 4,
    justifyContent: 'center',
  },
  image: { borderRadius: 9999, height: 48, width: 48 },
  name: { flexGrow: 1 },

  tabBarLabel: {
    fontFamily: 'PublicSans-Medium',
    fontSize: 10,
    fontWeight: '400',
  },
  tabs: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#FFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    height: 85,
    paddingTop: 11, // NOTE: expo icon holder has 5ps padding itself
  },

  title: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 24,
  },
})

export default function TabLayout() {
  const { t } = useTranslation()
  const activeTabColor = useThemeColor('primary')
  const inactiveTabColor = useThemeColor('gray-800')
  const bottomSheetRef = useRef<BottomSheet>(null)
  const setIosContacts = useSetAtom(setIosContactsAtom)
  const setAndroidContacts = useSetAtom(setAndroidContactsAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const headerBgColor = useThemeColor('primary')

  // FIXME fixme
  const isPeoplePage = true
  const onAddPress = () => {
    bottomSheetRef.current?.expand()
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerRight: HeaderRight,
          headerShown: true,
          headerStyle: {
            backgroundColor: headerBgColor,
          },
          headerTitle: '',

          tabBarActiveTintColor: activeTabColor,
          tabBarInactiveTintColor: inactiveTabColor,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.tabs,
        }}
      >
        <Tabs.Protected guard={isAuthenticated}>
          <Tabs.Screen
            name="index"
            options={{
              headerLeft: () => <HeaderLeft>Groups</HeaderLeft>,
              tabBarIcon: ({ focused, color }) => (
                <IconSymbol color={color} height={24} name={focused ? 'groups.filled' : 'groups.outlined'} width={24} />
              ),
              title: t('tabs.groups.title'),
            }}
          />
        </Tabs.Protected>

        <Tabs.Screen
          name="people"
          options={{
            headerLeft: () => <HeaderLeft>People</HeaderLeft>,
            tabBarIcon: ({ focused, color }) => (
              <IconSymbol color={color} height={24} name={focused ? 'users.filled' : 'users.outlined'} width={24} />
            ),
            title: t('tabs.people.title'),
          }}
        />

        <Tabs.Screen
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              onAddPress()
            },
          }}
          name="share-placeholder"
          options={{
            tabBarIcon: ({ color }) => <IconSymbol color={color} height={24} name="share.outlined" width={24} />,
            title: t('tabs.share.title'),
          }}
        />

        <Tabs.Screen
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              onAddPress()
            },
          }}
          name="wallet-placeholder"
          options={{
            tabBarIcon: ({ color }) => <IconSymbol color={color} height={24} name="wallet.outlined" width={24} />,
            title: t('tabs.wallet.title'),
          }}
        />
      </Tabs>

      {/* FIXME Move this somewhere */}
      <BottomSheetBackDrop
        propsStyles={{
          contentContainer: {
            backgroundColor: 'rgba(242, 242, 242, 0.93)',
          },
        }}
        ref={bottomSheetRef}
        title="Add"
      >
        <View style={styles.addConnectionContainer}>
          {isPeoplePage && (
            <View style={styles.addConnectionItem}>
              <Text style={styles.title}>Your contacts</Text>
              {Platform.OS === 'ios' && (
                <View style={styles.container}>
                  <Avatar size={48} src={IconSources.apple} text={'Apple contacts'} />
                  <Typography fontFamily={fonts.publicSans.bold} style={styles.name} weight="500">
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
                        console.error('error setting ios contacts', err)
                      })
                    }}
                  >
                    <Typography style={styles.connectText}>Connect</Typography>
                  </Pressable>
                </View>
              )}
              {Platform.OS === 'android' && (
                <View style={styles.container}>
                  <Avatar size={48} src={IconSources.android} text={'Android contacts'} />
                  <Typography fontFamily={fonts.publicSans.bold} style={styles.name} weight="500">
                    Android contacts
                  </Typography>

                  <Pressable
                    // some bug on the android, last block stretching beyond the parent and even screen
                    onPress={() => {
                      const fn = async () => {
                        const res = await setAndroidContacts()
                        if (res) {
                          bottomSheetRef.current?.close()
                        }
                      }

                      fn().catch((err) => {
                        console.error('error setting android contacts', err)
                      })
                    }}
                    // TODO move to handler
                    style={{ maxWidth: 50 }}
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
