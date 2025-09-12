import { useNavigation } from "@react-navigation/native"
import { type FC } from "react"
import { AppButton } from "./AppButton"
import { IconSymbol } from "./IconSymbol"

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

export { HeaderBackButton }
