// TODO Refactor
import { AppButton, type ButtonVariant } from "@/components/AppButton"
import { Separator } from "@/components/Separator"
import { Typography } from "@/components/Typography"
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  default as BottomSheetOrigin,
  type BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types"
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { type FC, type RefObject, useRef } from "react"
import { Keyboard, StyleSheet, View, type ViewStyle } from "react-native"

const BackDrop = (props: BottomSheetBackdropProps) => {
  const { style, ..._props } = props

  return (
    <BottomSheetBackdrop
      {..._props}
      disappearsOnIndex={-1}
      style={StyleSheet.compose(style, { zIndex: 101 })}
    />
  )
}

type Props = BottomSheetProps & {
  title?: string
  backDropProps?: Partial<BottomSheetDefaultBackdropProps>
  rightButtonAction?: () => void
  rightButtonVariant?: ButtonVariant
  rightButtonText?: string
  propsStyles?: { contentContainer?: ViewStyle }
  ref?: RefObject<BottomSheetMethods | null>
}

export const BottomSheetBackDrop: FC<Props> = (props) => {
  const {
    snapPoints = ["25%", "50%"],
    index = -1,
    backdropComponent = BackDrop,
    enableDynamicSizing = false,
    title,
    children,
    backDropProps,
    rightButtonAction,
    rightButtonVariant = "link",
    rightButtonText = "Done",
    propsStyles,
    ref,
    ...rest
  } = props

  const methodsRef = useRef({} as BottomSheetMethods)

  const handleClose = () => {
    methodsRef.current?.close()
  }
  const handleDone = () => {
    methodsRef.current?.close()
    rightButtonAction && rightButtonAction()
  }

  const createRef = (instance: BottomSheetMethods) => {
    if (ref && "current" in ref) {
      ref.current = instance
      methodsRef.current = instance
    }
  }
  const onClose = () => {
    Keyboard.dismiss()
  }

  return (
    <BottomSheetOrigin
      ref={createRef}
      index={index}
      snapPoints={snapPoints}
      // FIXME extract component
      backdropComponent={(bottomSheetBackdropProps) =>
        backdropComponent?.({ ...bottomSheetBackdropProps, ...backDropProps }) ?? null
      }
      enableDynamicSizing={enableDynamicSizing}
      containerStyle={{ zIndex: 102 }}
      onClose={onClose}
      {...rest}
    >
      <BottomSheetView style={[styles.contentContainer, propsStyles?.contentContainer]}>
        {title && (
          <View style={styles.headerContainer}>
            <View style={{ flex: 1, position: "absolute", left: 16, zIndex: 10 }}>
              <AppButton onPress={handleClose} text="Cancel" variant="link" />
            </View>
            <Typography
              style={{
                fontSize: 17,
                flex: 1,
                textAlign: "center",
              }}
              weight="700"
            >
              {title}
            </Typography>
            {rightButtonAction && (
              <View style={{ flex: 1, position: "absolute", right: 16, zIndex: 10 }}>
                <AppButton
                  onPress={handleDone}
                  text={rightButtonText}
                  variant={rightButtonVariant}
                  style={{ flex: 1 }}
                />
              </View>
            )}
          </View>
        )}
        {title && <Separator style={styles.separator} />}
        {children}
      </BottomSheetView>
    </BottomSheetOrigin>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 20,
  },
  separator: {
    height: 1,
    width: "100%",
    marginVertical: 1,
    backgroundColor: "rgba(60, 60, 67, 0.36)",
    opacity: 0.3,
  },
})
