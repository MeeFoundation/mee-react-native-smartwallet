import type { ComponentProps } from 'react'
import { View } from 'react-native'
import * as Dropdown from 'zeego/dropdown-menu'

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuProps = ComponentProps<typeof Dropdown.Root>
const DropdownMenu = Dropdown.Root

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTrigger
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuTriggerProps = ComponentProps<typeof Dropdown.Trigger>

const DropdownMenuTrigger = Dropdown.create(
  (props: DropdownMenuTriggerProps) => (
    <Dropdown.Trigger {...props} asChild>
      <View aria-role="button">{props.children}</View>
    </Dropdown.Trigger>
  ),
  'Trigger',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuContentProps = ComponentProps<typeof Dropdown.Content>

const DropdownMenuContent = Dropdown.Content

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItem
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuItemProps = ComponentProps<typeof Dropdown.Item>

const DropdownMenuItem = Dropdown.create((props: DropdownMenuItemProps) => <Dropdown.Item {...props} />, 'Item')

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTiitle
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuItemTitleProps = ComponentProps<typeof Dropdown.ItemTitle>

const DropdownMenuItemTitle = Dropdown.create(
  (props: DropdownMenuItemTitleProps) => <Dropdown.ItemTitle {...props} />,
  'ItemTitle',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuIcon
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuIconProps = ComponentProps<typeof Dropdown.ItemIcon>

const DropdownMenuIcon = Dropdown.create(
  (props: DropdownMenuIconProps) => <Dropdown.ItemIcon {...props} style={{ height: 80 }} />,
  'ItemIcon',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItemImage
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuItemImageProps = ComponentProps<typeof Dropdown.ItemImage>

const DropdownMenuItemImage = Dropdown.create(
  (props: DropdownMenuItemImageProps) => <Dropdown.ItemImage {...props} />,
  'ItemImage',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItemImage
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuLabelProps = ComponentProps<typeof Dropdown.Label>

const DropdownMenuLabel = Dropdown.create((props: DropdownMenuLabelProps) => <Dropdown.Label {...props} />, 'Label')

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSeparator
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuSeparatorProps = ComponentProps<typeof Dropdown.Separator>

const DropdownMenuSeparator = Dropdown.create(
  (props: DropdownMenuSeparatorProps) => <Dropdown.Separator {...props} />,
  'Separator',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuGroup
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuGroupProps = ComponentProps<typeof Dropdown.Group>

const DropdownMenuGroup = Dropdown.create((props: DropdownMenuGroupProps) => <Dropdown.Group {...props} />, 'Group')

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuCheckboxItemProps = ComponentProps<typeof Dropdown.CheckboxItem>

const DropdownMenuCheckboxItem = Dropdown.create(
  (props: DropdownMenuCheckboxItemProps) => (
    <Dropdown.CheckboxItem {...props} style={{ ...props.style, alignItems: 'center', display: 'flex', gap: 8 }}>
      <Dropdown.ItemIndicator />
    </Dropdown.CheckboxItem>
  ),
  'CheckboxItem',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuSubTriggerProps = ComponentProps<typeof Dropdown.SubTrigger>

const DropdownMenuSubTrigger = Dropdown.create(
  (props: DropdownMenuSubTriggerProps) => <Dropdown.SubTrigger {...props} />,
  'SubTrigger',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSubContent
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuSubContentProps = ComponentProps<typeof Dropdown.SubContent>

const DropdownMenuSubContent = Dropdown.create(
  (props: DropdownMenuSubContentProps) => <Dropdown.SubContent {...props} />,
  'SubContent',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSub
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuSubProps = ComponentProps<typeof Dropdown.Sub>

const DropdownMenuSub = Dropdown.create((props: DropdownMenuSubProps) => <Dropdown.Sub {...props} />, 'Sub')

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuItemIndicatorProps = ComponentProps<typeof Dropdown.ItemIndicator>

const DropdownMenuItemIndicator = Dropdown.create(
  (props: DropdownMenuItemIndicatorProps) => <Dropdown.ItemIndicator {...props} />,
  'ItemIndicator',
)

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuArrow
 * -----------------------------------------------------------------------------------------------*/
type DropdownMenuArrowProps = ComponentProps<typeof Dropdown.Arrow>

const DropdownMenuArrow = Dropdown.create((props: DropdownMenuArrowProps) => <Dropdown.Arrow {...props} />, 'Arrow')

/* -----------------------------------------------------------------------------------------------*/

export {
  DropdownMenuArrow as MenuArrow,
  DropdownMenuCheckboxItem as MenuCheckboxItem,
  DropdownMenuContent as MenuContent,
  DropdownMenuGroup as MenuGroup,
  DropdownMenuIcon as MenuIcon,
  DropdownMenuItem as MenuItem,
  DropdownMenuItemImage as MenuItemImage,
  DropdownMenuItemIndicator as MenuItemIndicator,
  DropdownMenuItemTitle as MenuItemTitle,
  DropdownMenuLabel as MenuLabel,
  DropdownMenuSeparator as MenuSeparator,
  DropdownMenuSub as MenuSub,
  DropdownMenuSubContent as MenuSubContent,
  DropdownMenuSubTrigger as MenuSubTrigger,
  DropdownMenuTrigger as MenuTrigger,
  DropdownMenu as Root,
}

export {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemImage,
  DropdownMenuItemIndicator,
  DropdownMenuItemTitle,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}

export type {
  DropdownMenuArrowProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuIconProps,
  DropdownMenuItemImageProps,
  DropdownMenuItemIndicatorProps,
  DropdownMenuItemProps,
  DropdownMenuItemTitleProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
}
