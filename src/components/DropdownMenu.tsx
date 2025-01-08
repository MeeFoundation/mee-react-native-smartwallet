import * as Dropdown from "zeego/dropdown-menu"

export const DropdownMenuIcon = Dropdown.create((props: MenuItemIconProps) => {
  return <Dropdown.ItemIcon {...props} />
}, "ItemIcon")

export const DropdownMenuItemTitle = Dropdown.create((props: MenuItemTitleProps) => {
  return <Dropdown.ItemTitle {...props} />
}, "ItemTitle")

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
