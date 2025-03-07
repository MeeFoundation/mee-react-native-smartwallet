import { FC } from "react"
import { TextField, TextFieldProps } from "./TextField"
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline"

export const SearchTextField: FC<TextFieldProps> = (props) => {
  return <TextField {...props} RightIcon={MagnifyingGlassIcon} RightIconActive={XMarkIcon}/>
}
