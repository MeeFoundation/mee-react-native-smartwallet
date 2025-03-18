import { View } from "react-native"
import * as Dropdown from "zeego/dropdown-menu"

export const DropdownMenu = Dropdown.Root
export const DropdownMenuTrigger = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.Trigger>) => (
    <Dropdown.Trigger {...props} asChild>
      <View aria-role="button">{props.children}</View>
    </Dropdown.Trigger>
  ),
  "Trigger",
)
export const DropdownMenuContent = Dropdown.Content

export const DropdownMenuItem = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.Item>) => <Dropdown.Item {...props} />,
  "Item",
)

export const DropdownMenuItemTitle = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.ItemTitle>) => <Dropdown.ItemTitle {...props} />,
  "ItemTitle",
)

export const DropdownMenuIcon = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.ItemIcon>) => (
    <Dropdown.ItemIcon {...props} style={{ height: 80 }} />
  ),
  "ItemIcon",
)

export const DropdownMenuItemImage = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.ItemImage>) => <Dropdown.ItemImage {...props} />,
  "ItemImage",
)

export const DropdownMenuLabel = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.Label>) => <Dropdown.Label {...props} />,
  "Label",
)

export const DropdownMenuSeparator = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.Separator>) => <Dropdown.Separator {...props} />,
  "Separator",
)

export const DropdownMenuGroup = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.Group>) => <Dropdown.Group {...props} />,
  "Group",
)

export const DropdownMenuCheckboxItem = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.CheckboxItem>) => (
    <Dropdown.CheckboxItem
      {...props}
      style={{ ...props.style, display: "flex", alignItems: "center", gap: 8 }}
    >
      <Dropdown.ItemIndicator />
    </Dropdown.CheckboxItem>
  ),
  "CheckboxItem",
)

export const DropdownMenuSubTrigger = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.SubTrigger>) => <Dropdown.SubTrigger {...props} />,
  "SubTrigger",
)

export const DropdownMenuSubContent = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.SubContent>) => <Dropdown.SubContent {...props} />,
  "SubContent",
)

export const DropdownMenuSub = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.Sub>) => <Dropdown.Sub {...props} />,
  "Sub",
)

export const DropdownMenuItemIndicator = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.ItemIndicator>) => (
    <Dropdown.ItemIndicator {...props} />
  ),
  "ItemIndicator",
)

export const DropdownMenuArrow = Dropdown.create(
  (props: React.ComponentProps<typeof Dropdown.Arrow>) => <Dropdown.Arrow {...props} />,
  "Arrow",
)
