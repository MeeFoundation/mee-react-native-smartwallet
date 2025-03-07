import { useNavigation } from "@react-navigation/native"
import { isAuthenticatedState, isFirstTimeAuthState, isWelcomeViewedAtom } from "@store/index"
import { colors } from "@utils/theme"
import { useSetAtom } from "jotai"
import { PropsWithChildren, ReactNode, createContext, useCallback, useContext, useRef } from "react"
import { Dimensions, Pressable, StyleSheet, View } from "react-native"
import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout"
import {
  BellIcon,
  Cog8ToothIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "react-native-heroicons/outline"
import { Typography } from "./Typography"

type ItemProps = {
  label: string
  icon: ReactNode
  onPress: () => void
}

const Item = (props: ItemProps) => {
  const { label, icon, onPress } = props

  return (
    <Pressable onPress={onPress} style={styles.item}>
      {icon}
      <Typography>{label}</Typography>
    </Pressable>
  )
}

const DrawerCtx = createContext({
  openDrawer: () => {},
  closeDrawer: () => {},
})

const Drawer = ({ children }: PropsWithChildren) => {
  const ref = useRef<DrawerLayoutMethods | null>(null)
  const windowWidth = Dimensions.get("window").width
  const navigation = useNavigation()
  const setIsWelcomeViewed = useSetAtom(isWelcomeViewedAtom)
  const setFirstTimeAuth = useSetAtom(isFirstTimeAuthState)
  const setAuthenticated = useSetAtom(isAuthenticatedState)

  const navigateLogin = () => {
    setAuthenticated(false)
  }

  const onFirstTimeAuth = () => {
    setFirstTimeAuth(true)
    setAuthenticated(false)
    // todo remove
    navigation.navigate("Login")
  }

  const onItemPress = (cb: () => void) => {
    return () => {
      cb()
      ref.current?.closeDrawer()
    }
  }

  const showWelcomeScreenHandler = () => {
    setIsWelcomeViewed(false)
    navigation.navigate("Welcome")
  }

  const items: ItemProps[] = [
    {
      label: "Settings",
      icon: <Cog8ToothIcon color="black" />,
      onPress: onItemPress(() => navigation.navigate("Settings")),
    },

    {
      label: "Login",
      icon: <UserIcon />,
      onPress: onItemPress(navigateLogin),
    },
    {
      label: "Send Feedback",
      icon: <PaperAirplaneIcon transform={[{ rotate: "270deg" }]} />,
      onPress: onItemPress(() => false),
    },
    {
      label: "Show Welcome again",
      icon: <BellIcon color={colors.secondary} />,
      onPress: onItemPress(showWelcomeScreenHandler),
    },
    {
      label: "Set First Time Auth",
      icon: <BellIcon color={colors.secondary} />,
      onPress: onItemPress(onFirstTimeAuth),
    },
  ]

  return (
    <DrawerCtx.Provider
      value={{
        openDrawer: () => ref.current?.openDrawer(),
        closeDrawer: () => ref.current?.closeDrawer(),
      }}
    >
      <ReanimatedDrawerLayout
        ref={ref}
        drawerWidth={windowWidth * 0.8}
        drawerPosition={DrawerPosition.LEFT}
        drawerType={DrawerType.FRONT}
        renderNavigationView={() => (
          <View style={styles.container}>
            {items.map((item, index) => (
              <Item key={index} onPress={item.onPress} label={item.label} icon={item.icon} />
            ))}
          </View>
        )}
      >
        {children}
      </ReanimatedDrawerLayout>
    </DrawerCtx.Provider>
  )
}

const useDrawer = () => {
  const ctx = useContext(DrawerCtx)

  const open = useCallback(() => ctx?.openDrawer(), [])
  const close = useCallback(() => ctx?.closeDrawer(), [])

  return { open, close }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 64,
  },
  item: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
})

export { Drawer, useDrawer }
