import type { FC } from 'react'
import { cssInterop } from 'react-native-css-interop'
import {
  ArchiveBoxIcon as ArchiveBoxOutlineIcon,
  ArrowDownTrayIcon as ArrowDownTrayOutlineIcon,
  Bars3Icon as Bars3OutlineIcon,
  BellIcon as BellOutlineIcon,
  ChevronLeftIcon as ChevronLeftOutlineIcon,
  ChevronRightIcon as ChevronRightOutlineIcon,
  Cog8ToothIcon as Cog8ToothOutlineIcon,
  DocumentIcon as DocumentOutlineIcon,
  EllipsisVerticalIcon as EllipsisVerticalOutlineIcon,
  LanguageIcon as LanguageOutlineIcon,
  MagnifyingGlassIcon as MagnifyingGlassOutlineIcon,
  PaperAirplaneIcon as PaperAirplaneOutlineIcon,
  PencilIcon as PencilOutlineIcon,
  PhotoIcon as PhotoOutlineIcon,
  PlayCircleIcon as PlayCircleOutlineIcon,
  PlusIcon as PlusOutlineIcon,
  ShareIcon as ShareOutlineIcon,
  TrashIcon as TrashOutlineIcon,
  UserGroupIcon as UserGroupOutlineIcon,
  UserIcon as UserOutlineIcon,
  UsersIcon as UsersOutlineIcon,
  WalletIcon as WalletOutlineIcon,
  XMarkIcon as XMarkOutlineIcon,
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
  'arrow-down-tray.outlined': ArrowDownTrayOutlineIcon,
  'bars-3.outlined': Bars3OutlineIcon,
  'bell.outlined': BellOutlineIcon,
  'chevron-left.outlined': ChevronLeftOutlineIcon,
  'chevron-right.outlined': ChevronRightOutlineIcon,
  'cog-8-tooth.outlined': Cog8ToothOutlineIcon,
  'document.outlined': DocumentOutlineIcon,
  'ellipsis-vertical.outlined': EllipsisVerticalOutlineIcon,
  'groups.filled': UserGroupSolidIcon,
  'groups.outlined': UserGroupOutlineIcon,
  'language.outlined': LanguageOutlineIcon,

  'magnifying-glass.outlined': MagnifyingGlassOutlineIcon,
  'paper-airplane.filled': PaperAirplaneSolidIcon,
  'paper-airplane.outlined': PaperAirplaneOutlineIcon,
  'pencil.outlined': PencilOutlineIcon,
  'photo.outlined': PhotoOutlineIcon,
  'play-circle.outlined': PlayCircleOutlineIcon,
  'plus.outlined': PlusOutlineIcon,
  'share.outlined': ShareOutlineIcon,
  'trash.outlined': TrashOutlineIcon,
  'user.outlined': UserOutlineIcon,
  'users.filled': UsersSolidIcon,
  'users.outlined': UsersOutlineIcon,
  'wallet.outlined': WalletOutlineIcon,
  'x-mark.outlined': XMarkOutlineIcon,
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

cssInterop(IconSymbol, {
  className: {
    nativeStyleToProp: {
      color: 'color',
    },
    target: false,
  },
})

/* -----------------------------------------------------------------------------------------------*/

export { IconSymbol }
export type { IconSymbolName, IconSymbolProps }
