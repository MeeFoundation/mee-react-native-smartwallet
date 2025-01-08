import * as Dropdown from "zeego/dropdown-menu"

//  const DropdownMenuRoot = DropdownMenu.create((props: MenuRootProps) => {
//   return <DropdownMenu.Root {...props} />
// },"Root")
//  const DropdownMenuContent = DropdownMenu.Content

export const DropdownMenuIcon = Dropdown.create((props: MenuItemIconProps) => {
  return <Dropdown.ItemIcon {...props} />
}, "ItemIcon")

export const DropdownMenuItemTitle = Dropdown.create((props: MenuItemTitleProps) => {
  return <Dropdown.ItemTitle {...props} />
}, "ItemTitle")

type DropdownMenuItemProps = {
  icon?: ReactNode
} & MenuItemProps

export const DropdownMenuItem = Dropdown.create(({ ...props }: MenuItemProps) => {
  return <Dropdown.Item {...props} />
}, "Item")

import { FC, ReactNode } from "react"
import { MenuItemIconProps, MenuItemProps, MenuItemTitleProps } from "zeego/lib/typescript/menu"

type DropdownMenuProps = {
  trigger: ReactNode
  children: ReactNode
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ trigger, children }) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>{trigger}</Dropdown.Trigger>
      <Dropdown.Content>{children}</Dropdown.Content>
    </Dropdown.Root>
  )
}
