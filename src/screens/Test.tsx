import { Platform, StyleSheet, View } from "react-native"

import { AppButton } from "@components/AppButton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuTrigger,
} from "@components/DropdownMenu"
import { Typography } from "@components/Typography"
import { MenuComponentRef, MenuView } from "@react-native-menu/menu"
import { colors } from "@utils/theme"
import { useRef } from "react"
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from "react-native-heroicons/outline"

export function Test() {
  const menuRef = useRef<MenuComponentRef>(null)

  return (
    <View style={styles.container}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AppButton size="sm" variant="tertiary" onPress={() => false}>
            <Typography>zeego/dropdown-menu</Typography>
            <EllipsisVerticalIcon color="black" />
          </AppButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              key="manage-connection"
              textValue="Manage connection"
              style={{ height: 80, color: "red" }}
            >
              <DropdownMenuItemTitle style={{ height: 80, color: "red" }}>
                Manage connection
              </DropdownMenuItemTitle>
              <DropdownMenuIcon ios={{ hierarchicalColor: "black", name: "square.and.pencil" }}>
                <PencilSquareIcon color="black" />
              </DropdownMenuIcon>
            </DropdownMenuItem>
            <DropdownMenuItem key="link-connection" textValue="Link connection">
              <DropdownMenuItemTitle>Link connection</DropdownMenuItemTitle>
              <DropdownMenuIcon ios={{ hierarchicalColor: "black", name: "square.and.pencil" }}>
                <PencilSquareIcon color="black" />
              </DropdownMenuIcon>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuItem key="delete-connection" textValue="Delete connection">
            <DropdownMenuItemTitle color={colors.danger}>Delete connection</DropdownMenuItemTitle>
            <DropdownMenuIcon
              ios={{ hierarchicalColor: colors.danger, name: "trash" }}
              androidIconName="ic_menu_delete"
            >
              <TrashIcon color={colors.danger} />
            </DropdownMenuIcon>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <View>
        {/* <Button
          title="Show Menu with ref (Android only)"
          onPress={() => {
            if (menuRef.current) {
              console.log(Object.keys(menuRef.current))
              menuRef.current?.show()
            }
          }}
        /> */}

        <MenuView
          ref={menuRef}
          title="Menu Title"
          onPressAction={({ nativeEvent }) => {
            console.warn(JSON.stringify(nativeEvent))
          }}
          // onOpenMenu={() => {
          //   console.log("Menu was opened")
          // }}
          // onCloseMenu={() => {
          //   console.log("Menu was closed")
          // }}
          style={{ zIndex: 1000 }}
          actions={[
            {
              id: "add",
              title: "Add1",
              titleColor: "#2367A2",
              image: Platform.select({
                ios: "plus",
                android: "ic_menu_add",
              }),
              imageColor: "#2367A2",
              subactions: [
                {
                  id: "nested1",
                  title: "Nested action",
                  titleColor: "rgba(250,180,100,0.5)",
                  subtitle: "State is mixed",
                  image: Platform.select({
                    ios: "heart.fill",
                    android: "ic_menu_today",
                  }),
                  imageColor: "rgba(100,200,250,0.3)",
                  state: "mixed",
                },
                {
                  id: "nestedDestructive",
                  title: "Destructive Action",
                  attributes: {
                    destructive: true,
                  },
                  image: Platform.select({
                    ios: "trash",
                    android: "ic_menu_delete",
                  }),
                },
              ],
            },
            {
              id: "share",
              title: "Share Action",
              titleColor: "#46F289",
              subtitle: "Share action on SNS",
              image: Platform.select({
                ios: "square.and.arrow.up",
                android: "ic_menu_share",
              }),
              imageColor: "#46F289",
              state: "on",
            },
            {
              id: "destructive",
              title: "Destructive Action",
              attributes: {
                destructive: true,
              },
              image: Platform.select({
                ios: "trash",
                android: "ic_menu_delete",
              }),
            },
          ]}
          shouldOpenOnLongPress={false}
        >
          <View>
            <AppButton size="sm" variant="tertiary" onPress={() => false}>
              <Typography>@react-native-menu/menu</Typography>
              <EllipsisVerticalIcon color="black" />
            </AppButton>
          </View>
        </MenuView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    // justifyContent: "flex-start",
    // padding: 16,
    zIndex: 1000,
  },
})
