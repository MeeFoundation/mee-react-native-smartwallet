import { useSetAtom } from 'jotai'
import type { FC } from 'react'
import { useCallback, useContext } from 'react'
import type { GestureResponderEvent } from 'react-native'
import type { O } from 'ts-toolbelt'

import { drawerIsOpenedAtom } from '@/shared/model'
import type { IconSymbolName } from '@/shared/ui/IconSymbol'

import { HeaderIconButton, type HeaderIconButtonProps, HeaderProvider } from './Header'

/* -------------------------------------------------------------------------------------------------
 * ToggleDrawerButton
 * -----------------------------------------------------------------------------------------------*/
type ToggleDrawerButtonProps = O.Optional<HeaderIconButtonProps, 'icon'>

const ToggleDrawerButton: FC<ToggleDrawerButtonProps> = ({ icon, onPress, ...rest }) => {
  const ctx = useContext(HeaderProvider)
  const setDrawerIsOpened = useSetAtom(drawerIsOpenedAtom)

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      setDrawerIsOpened(true)
      onPress?.(event)
    },
    [setDrawerIsOpened, onPress],
  )

  const resolvedVariant: HeaderIconButtonProps['variant'] = rest.variant ?? ctx.variant ?? 'default'
  const resolvedIcon: IconSymbolName = resolvedVariant === 'primary' ? 'bars-3.outlined' : 'ellipsis-vertical.outlined'

  return <HeaderIconButton icon={icon ?? resolvedIcon} onPress={handlePress} {...rest} />
}

/* -----------------------------------------------------------------------------------------------*/

export { ToggleDrawerButton }
