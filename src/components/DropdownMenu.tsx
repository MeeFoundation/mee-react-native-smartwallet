import * as DropdownMenu from "zeego/dropdown-menu"
import { MenuItemProps, MenuItemTitleProps, MenuTriggerProps } from "zeego/lib/typescript/menu"

export const DropdownMenuRoot = DropdownMenu.Root
export const DropdownMenuTrigger = DropdownMenu.create((props: MenuTriggerProps) => {
  return <DropdownMenu.Trigger {...props} />
}, "Trigger")
export const DropdownMenuContent = DropdownMenu.Content

export const DropdownMenuItem = DropdownMenu.create((props: MenuItemProps) => {
  return <DropdownMenu.Item {...props} />
}, "Item")

export const DropdownMenuItemTitle = DropdownMenu.create((props: MenuItemTitleProps) => {
  return <DropdownMenu.ItemTitle {...props} />
}, "ItemTitle")
