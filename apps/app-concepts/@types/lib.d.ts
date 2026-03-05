import * as React from "react"

export declare global {
  // https://github.com/morenoh149/react-native-contacts/issues/773
  declare const global: typeof globalThis & { __turboModuleProxy: unknown }

  module "*.svg" {
    import { SvgProps } from "react-native-svg"
    const content: React.ComponentType<SvgProps>
    export default content
  }

  module "*.png" {
    const content: number
    export default content
  }

  module "*.webp" {
    const content: number
    export default content
  }
}
