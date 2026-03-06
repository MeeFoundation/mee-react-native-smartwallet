import { useRouter } from 'expo-router'
import type { FC } from 'react'
import { useCallback } from 'react'
import type { GestureResponderEvent } from 'react-native'
import type { O } from 'ts-toolbelt'

import { HeaderIconButton, type HeaderIconButtonProps } from './Header'

/* -------------------------------------------------------------------------------------------------
 * BackButton
 * -----------------------------------------------------------------------------------------------*/
type BackButtonProps = O.Optional<HeaderIconButtonProps, 'icon'>

const BackButton: FC<BackButtonProps> = ({ icon, onPress, ...rest }) => {
  const router = useRouter()

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      router.back()
      onPress?.(event)
    },
    [router, onPress],
  )

  return <HeaderIconButton icon={icon ?? 'chevron-left.outlined'} onPress={handlePress} {...rest} />
}

/* -----------------------------------------------------------------------------------------------*/

export { BackButton }
