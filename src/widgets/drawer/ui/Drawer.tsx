import { isAuthenticatedAtom, isFirstTimeAuthAtom } from "@/features/auth"
import { languageAtom } from "@/features/localization"
import { colors } from "@/shared/config"
import { drawerIsOpenedAtom } from "@/shared/model"
import { IconSymbol } from "@/shared/ui/IconSymbol"
import { Typography } from "@/shared/ui/Typography"
import { isWelcomeViewedAtom } from "@/widgets/welcome/@x/drawer"
import { useRouter } from "expo-router"
import { useAtom, useSetAtom } from "jotai"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { Pressable, type PressableProps, StyleSheet, View } from "react-native"
import { Drawer as ReactNativeDrawer } from "react-native-drawer-layout"

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

/* -------------------------------------------------------------------------------------------------
 * DrawerItem
 * -----------------------------------------------------------------------------------------------*/
type DrawerItemProps = Omit<PressableProps, "children" | "style"> & {
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
    router.navigate("/welcome")
  }

  // TODO refactor. Maybe saparate drawer content
  const itemsProps: DrawerItemProps[] = [
    {
      label: "Settings",
      icon: <IconSymbol name="cog-8-tooth.outlined" />,
      onPress: onItemPress(() => router.navigate("/settings")),
    },

    {
      label: "Login",
      icon: <IconSymbol name="user.outlined" />,
      onPress: onItemPress(navigateLogin),
    },
    {
      label: "Send Feedback",
      icon: <IconSymbol name="paper-airplane.outlined" transform={[{ rotate: "270deg" }]} />,
      onPress: onItemPress(() => false),
    },
    {
      label: "Show Welcome again",
      icon: <IconSymbol name="bell.outlined" color={colors.secondary} />,
      onPress: onItemPress(showWelcomeScreenHandler),
    },
    {
      label: "Set First Time Auth",
      icon: <IconSymbol name="bell.outlined" color={colors.secondary} />,
      onPress: onItemPress(onFirstTimeAuth),
    },
    {
      label: `Switch Language to [${locale === "en" ? "es" : "en"}]`,
      icon: <IconSymbol name="language.outline" color={colors.secondary} />,
      onPress: onItemPress(() => setLocale((prev) => (prev === "en" ? "es" : "en"))),
    },
  ]

  return (
    <ReactNativeDrawer
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      renderDrawerContent={() => (
        <View style={styles.container}>
          {itemsProps.map((item, index) => (
            <DrawerItem key={index} onPress={item.onPress} label={item.label} icon={item.icon} />
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
