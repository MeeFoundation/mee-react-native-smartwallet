import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  default as BottomSheetOrigin,
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { forwardRef, useRef } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { AppButton, ButtonVariant } from "./AppButton"
import { Separator } from "./Separator"
import { Typography } from "./Typography"

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
  ref?: React.Ref<BottomSheetMethods>
  backDropProps?: Partial<BottomSheetDefaultBackdropProps>
  rightButtonAction?: () => void
  rightButtonVariant?: ButtonVariant
  rightButtonText?: string
  propsStyles?: { contentContainer?: ViewStyle }
}

export const BottomSheetBackDrop = forwardRef<BottomSheetMethods, Props>((props: Props, ref) => {
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

  const createRef = (instanse: BottomSheetMethods) => {
    if (ref && "current" in ref) {
      ref.current = instanse
      methodsRef.current = instanse
    }
  }

  return (
    <BottomSheetOrigin
      ref={createRef}
      index={index}
      snapPoints={snapPoints}
      backdropComponent={(props) => backdropComponent?.({ ...props, ...backDropProps })}
      enableDynamicSizing={enableDynamicSizing}
      containerStyle={{ zIndex: 102 }}
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
})

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
