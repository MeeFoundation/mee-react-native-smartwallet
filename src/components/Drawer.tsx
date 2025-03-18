import { useNavigation } from "@react-navigation/native"
import { isAuthenticatedState, isFirstTimeAuthState, isWelcomeViewedAtom } from "@store/index"
import { colors } from "@utils/theme"
import { useSetAtom } from "jotai"
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Drawer as ReactNativeDrawer } from "react-native-drawer-layout"
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
  const [open, setOpen] = useState(false)
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
  }

  const onItemPress = (cb: () => void) => {
    return () => {
      cb()
      setOpen(false)
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
        openDrawer: () => setOpen(true),
        closeDrawer: () => setOpen(false),
      }}
    >
      <ReactNativeDrawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={() => {
          return (
            <View style={styles.container}>
              {items.map((item, index) => (
                <Item key={index} onPress={item.onPress} label={item.label} icon={item.icon} />
              ))}
            </View>
          )
        }}
      >
        {children}
      </ReactNativeDrawer>
    </DrawerCtx.Provider>
  )
}

const useDrawer = () => {
  const ctx = useContext(DrawerCtx)

  const open = useCallback(() => ctx?.openDrawer(), [ctx])
  const close = useCallback(() => ctx?.closeDrawer(), [ctx])

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
