import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { languageAtom } from "../model/store"
import { initializeLocalizations } from "./polyfills"

/**
 * Hook to use for display splash screen until the localizations are initialized
 */
export const useInitializeLocalizations = (): boolean => {
  const locale = useAtomValue(languageAtom)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const fn = async () => {
      setInitialized(false)
      await initializeLocalizations(locale)
      setInitialized(true)
    }

    fn()
  }, [locale])

  return initialized
}
