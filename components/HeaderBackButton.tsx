import { useNavigation } from "@react-navigation/native"
import { type FC } from "react"
import { AppButton } from "./AppButton"
import { IconSymbol } from "./IconSymbol"

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
      variant="link"
      onPress={handleBack}
      leftElement={<IconSymbol strokeWidth={2} color={color} name="chevron-left.outlined" />}
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
      variant="link"
      onPress={handleBack}
      text="Back"
      textStyles={{ fontSize: 17, marginRight: 16 }}
      leftElement={<IconSymbol name="chevron-left.outlined" />}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { HeaderBackButton, HeaderBackButtonMinimal }

export type { HeaderBackButtonMinimalProps }
