import { createContext, PropsWithChildren, useCallback, useContext, useRef } from "react"
import { Dimensions, View } from "react-native"
import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout"

const DrawerCtx = createContext({
  openDrawer: () => {},
  closeDrawer: () => {},
})

const Drawer = ({ children }: PropsWithChildren) => {
  const ref = useRef<DrawerLayoutMethods | null>(null)
  const windowWidth = Dimensions.get("window").width

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
          <View style={{ flex: 1, backgroundColor: "white", padding: 16, paddingTop: 64 }}></View>
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

export { Drawer, useDrawer }
