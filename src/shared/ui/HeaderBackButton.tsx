import { useNavigation } from '@react-navigation/native'
import type { FC } from 'react'

import { AppButton } from './AppButton'
import { IconSymbol } from './IconSymbol'

/* -------------------------------------------------------------------------------------------------
 * HeaderBackButtonMinimal
 * -----------------------------------------------------------------------------------------------*/
type HeaderBackButtonMinimalProps = {
  color?: string
}

const HeaderBackButtonMinimal: FC<HeaderBackButtonMinimalProps> = ({ color }) => {
  const navigation = useNavigation()

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <AppButton
      leftElement={<IconSymbol color={color} name="chevron-left.outlined" strokeWidth={2} />}
      onPress={handleBack}
      variant="link"
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * HeaderBackButton
 * -----------------------------------------------------------------------------------------------*/
const HeaderBackButton: FC = () => {
  const navigation = useNavigation()

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <AppButton
      leftElement={<IconSymbol name="chevron-left.outlined" />}
      onPress={handleBack}
      text="Back"
      textStyles={{ fontSize: 17, marginRight: 16 }}
      variant="link"
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { HeaderBackButton, HeaderBackButtonMinimal }

export type { HeaderBackButtonMinimalProps }
