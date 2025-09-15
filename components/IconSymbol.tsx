import type { FC } from "react"
import {
  ArchiveBoxIcon as ArchiveBoxOutlineIcon,
  Bars3Icon as Bars3OutlineIcon,
  BellIcon as BellOutlineIcon,
  ChevronLeftIcon as ChevronLeftOutlineIcon,
  Cog8ToothIcon as Cog8ToothOutlineIcon,
  EllipsisVerticalIcon as EllipsisVerticalOutlineIcon,
  MagnifyingGlassIcon as MagnifyingGlassOutlineIcon,
  PaperAirplaneIcon as PaperAirplaneOutlineIcon,
  PencilIcon as PencilOutlineIcon,
  ShareIcon as ShareOutlineIcon,
  TrashIcon as TrashOutlineIcon,
  UserGroupIcon as UserGroupOutlineIcon,
  UserIcon as UserOutlineIcon,
  UsersIcon as UsersOutlineIcon,
  WalletIcon as WalletOutlineIcon,
} from "react-native-heroicons/outline"
import {
  UserGroupIcon as UserGroupSolidIcon,
  UsersIcon as UsersSolidIcon,
} from "react-native-heroicons/solid"
import type { SvgProps } from "react-native-svg"

const MAPPING = {
  "groups.filled": UserGroupSolidIcon,
  "groups.outlined": UserGroupOutlineIcon,
  "users.filled": UsersSolidIcon,
  "users.outlined": UsersOutlineIcon,
  "share.outlined": ShareOutlineIcon,
  "wallet.outlined": WalletOutlineIcon,
  "chevron-left.outlined": ChevronLeftOutlineIcon,
  "magnifying-glass.outlined": MagnifyingGlassOutlineIcon,
  "bell.outlined": BellOutlineIcon,
  "bars-3.outlined": Bars3OutlineIcon,
  "ellipsis-vertical.outlined": EllipsisVerticalOutlineIcon,
  "cog-8-tooth.outlined": Cog8ToothOutlineIcon,
  "paper-airplane.outlined": PaperAirplaneOutlineIcon,
  "user.outlined": UserOutlineIcon,
  "pencil.outlined": PencilOutlineIcon,
  "archive-box.outlined": ArchiveBoxOutlineIcon,
  "trash.outlined": TrashOutlineIcon,
} as const

type IconSymbolName = keyof typeof MAPPING

/* -------------------------------------------------------------------------------------------------
 * IconSymbol
 * -----------------------------------------------------------------------------------------------*/
type IconSymbolProps = SvgProps & {
  name: IconSymbolName
}

const IconSymbol: FC<IconSymbolProps> = ({ name, ...props }) => {
  const Icon = MAPPING[name]
  return <Icon {...props} />
}

/* -----------------------------------------------------------------------------------------------*/

export { IconSymbol }
export type { IconSymbolProps }
