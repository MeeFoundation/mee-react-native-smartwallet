import type { FC } from 'react'
import {
  ArchiveBoxIcon as ArchiveBoxOutlineIcon,
  Bars3Icon as Bars3OutlineIcon,
  BellIcon as BellOutlineIcon,
  ChevronLeftIcon as ChevronLeftOutlineIcon,
  ChevronRightIcon as ChevronRightOutlineIcon,
  Cog8ToothIcon as Cog8ToothOutlineIcon,
  EllipsisVerticalIcon as EllipsisVerticalOutlineIcon,
  LanguageIcon as LanguageOutlineIcon,
  MagnifyingGlassIcon as MagnifyingGlassOutlineIcon,
  PaperAirplaneIcon as PaperAirplaneOutlineIcon,
  PencilIcon as PencilOutlineIcon,
  PlusIcon as PlusOutlineIcon,
  ShareIcon as ShareOutlineIcon,
  TrashIcon as TrashOutlineIcon,
  UserGroupIcon as UserGroupOutlineIcon,
  UserIcon as UserOutlineIcon,
  UsersIcon as UsersOutlineIcon,
  WalletIcon as WalletOutlineIcon,
} from 'react-native-heroicons/outline'
import {
  PaperAirplaneIcon as PaperAirplaneSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  UsersIcon as UsersSolidIcon,
} from 'react-native-heroicons/solid'
import type { SvgProps } from 'react-native-svg'

import { colors } from '../config'

const MAPPING = {
  'archive-box.outlined': ArchiveBoxOutlineIcon,
  'bars-3.outlined': Bars3OutlineIcon,
  'bell.outlined': BellOutlineIcon,
  'chevron-left.outlined': ChevronLeftOutlineIcon,
  'chevron-right.outlined': ChevronRightOutlineIcon,
  'cog-8-tooth.outlined': Cog8ToothOutlineIcon,
  'ellipsis-vertical.outlined': EllipsisVerticalOutlineIcon,
  'groups.filled': UserGroupSolidIcon,
  'groups.outlined': UserGroupOutlineIcon,
  'language.outline': LanguageOutlineIcon,
  'magnifying-glass.outlined': MagnifyingGlassOutlineIcon,
  'paper-airplane.filled': PaperAirplaneSolidIcon,
  'paper-airplane.outlined': PaperAirplaneOutlineIcon,
  'pencil.outlined': PencilOutlineIcon,
  'plus.outlined': PlusOutlineIcon,
  'share.outlined': ShareOutlineIcon,
  'trash.outlined': TrashOutlineIcon,
  'user.outlined': UserOutlineIcon,
  'users.filled': UsersSolidIcon,
  'users.outlined': UsersOutlineIcon,
  'wallet.outlined': WalletOutlineIcon,
} as const

type IconSymbolName = keyof typeof MAPPING

/* -------------------------------------------------------------------------------------------------
 * IconSymbol
 * -----------------------------------------------------------------------------------------------*/
type IconSymbolProps = SvgProps & {
  name: IconSymbolName
}

const IconSymbol: FC<IconSymbolProps> = ({ name, color, ...props }) => {
  const Icon = MAPPING[name]
  return <Icon {...props} color={color ?? colors['gray-900']} />
}

/* -----------------------------------------------------------------------------------------------*/

export { IconSymbol }
export type { IconSymbolName, IconSymbolProps }
