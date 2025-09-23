import { useRouter } from 'expo-router'
import { useAtom, useSetAtom } from 'jotai'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Pressable, type PressableProps, StyleSheet, View } from 'react-native'
import { Drawer as ReactNativeDrawer } from 'react-native-drawer-layout'

import { isWelcomeViewedAtom } from '@/widgets/welcome/@x/drawer'

import { isAuthenticatedAtom, isFirstTimeAuthAtom } from '@/features/auth'
import { languageAtom } from '@/features/localization'

import { colors } from '@/shared/config'
import { drawerIsOpenedAtom } from '@/shared/model'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { Typography } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: 64,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
})

/* -------------------------------------------------------------------------------------------------
 * DrawerItem
 * -----------------------------------------------------------------------------------------------*/
type DrawerItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string
  icon: ReactNode
}

const DrawerItem: FC<DrawerItemProps> = ({ label, icon, ...rest }) => (
  <Pressable style={styles.item} {...rest}>
    {icon}
    <Typography>{label}</Typography>
  </Pressable>
)

/* -------------------------------------------------------------------------------------------------
 * Drawer
 * -----------------------------------------------------------------------------------------------*/
type DrawerProps = PropsWithChildren

const Drawer: FC<DrawerProps> = ({ children }) => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useAtom(drawerIsOpenedAtom)

  // TODO Consider move it somewhere else
  const setIsWelcomeViewed = useSetAtom(isWelcomeViewedAtom)
  const setFirstTimeAuth = useSetAtom(isFirstTimeAuthAtom)
  const setAuthenticated = useSetAtom(isAuthenticatedAtom)
  const [locale, setLocale] = useAtom(languageAtom)

  const navigateLogin = () => setAuthenticated(false)

  const onFirstTimeAuth = () => {
    setFirstTimeAuth(true)
    setAuthenticated(false)
  }

  const onItemPress = (cb: () => void) => {
    return () => {
      cb()
      setIsOpen(false)
    }
  }

  const showWelcomeScreenHandler = () => {
    setIsWelcomeViewed(false)
    router.navigate('/welcome')
  }

  // TODO refactor. Maybe saparate drawer content
  const itemsProps: DrawerItemProps[] = [
    {
      icon: <IconSymbol name="cog-8-tooth.outlined" />,
      label: 'Settings',
      onPress: onItemPress(() => router.navigate('/settings')),
    },

    {
      icon: <IconSymbol name="user.outlined" />,
      label: 'Login',
      onPress: onItemPress(navigateLogin),
    },
    {
      icon: <IconSymbol name="paper-airplane.outlined" transform={[{ rotate: '270deg' }]} />,
      label: 'Send Feedback',
      onPress: onItemPress(() => false),
    },
    {
      icon: <IconSymbol color={colors.secondary} name="bell.outlined" />,
      label: 'Show Welcome again',
      onPress: onItemPress(showWelcomeScreenHandler),
    },
    {
      icon: <IconSymbol color={colors.secondary} name="bell.outlined" />,
      label: 'Set First Time Auth',
      onPress: onItemPress(onFirstTimeAuth),
    },
    {
      icon: <IconSymbol color={colors.secondary} name="language.outline" />,
      label: `Switch Language to [${locale === 'en' ? 'es' : 'en'}]`,
      onPress: onItemPress(() => setLocale((prev) => (prev === 'en' ? 'es' : 'en'))),
    },
  ]

  return (
    <ReactNativeDrawer
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      open={isOpen}
      renderDrawerContent={() => (
        <View style={styles.container}>
          {itemsProps.map((item, index) => (
            <DrawerItem icon={item.icon} key={item.id ?? index} label={item.label} onPress={item.onPress} />
          ))}
        </View>
      )}
    >
      {children}
    </ReactNativeDrawer>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { Drawer }
export type { DrawerProps }
