import { type FC } from "react"
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline"
import { TextField, type TextFieldProps } from "./TextField"

export const SearchTextField: FC<TextFieldProps> = (props) => {
  return <TextField {...props} RightIcon={MagnifyingGlassIcon} RightIconActive={XMarkIcon} />
}
