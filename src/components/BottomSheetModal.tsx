import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet"
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types"
import { ReactNode, forwardRef, useRef } from "react"
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

type Props = BottomSheetModalProps & {
  title?: string
  backDropProps?: Partial<BottomSheetDefaultBackdropProps>
  rightButtonAction?: () => void
  rightButtonVariant?: ButtonVariant
  rightButtonText?: string
  propsStyles?: { contentContainer?: ViewStyle; sheetHandler?: ViewStyle }
  children?: ReactNode
}

export const BottomSheetBackModal = forwardRef<BottomSheetModal, Props>((props: Props, ref) => {
  const {
    snapPoints = ["75%"],
    index,
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

  const methodsRef = useRef<BottomSheetModal | null>(null)

  const handleClose = () => {
    methodsRef.current?.close()
  }
  const handleDone = () => {
    methodsRef.current?.close()
    rightButtonAction && rightButtonAction()
  }

  const createRef = (instanse: BottomSheetModal | null) => {
    if (ref && "current" in ref) {
      ref.current = instanse
      methodsRef.current = instanse
    }
  }

  return (
    <BottomSheetModal
      ref={createRef}
      // when it -1 it leads to incorrect work, modal sheet is closed by default without it
      index={index === -1 ? 0 : index}
      snapPoints={snapPoints}
      backdropComponent={(props) => backdropComponent?.({ ...props, ...backDropProps })}
      enableDynamicSizing={enableDynamicSizing}
      containerStyle={{ zIndex: 102 }}
      handleStyle={propsStyles?.sheetHandler}
      {...rest}
    >
      <BottomSheetScrollView style={[styles.contentContainer, propsStyles?.contentContainer]}>
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
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})

const styles = StyleSheet.create({
  contentContainer: {},
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
