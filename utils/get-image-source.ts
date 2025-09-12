import type { ImageRequireSource, ImageSourcePropType } from "react-native"

export const getImageSource = (image: string | ImageRequireSource | ImageSourcePropType) => {
  return typeof image === "string" ? { uri: image } : image
}
