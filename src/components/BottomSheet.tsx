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
import { StyleSheet, View } from "react-native"
import { AppButton } from "./AppButton"
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
    ...rest
  } = props

  const methodsRef = useRef({} as BottomSheetMethods)

  const handleClose = () => {
    methodsRef.current?.close()
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
      <BottomSheetView style={styles.contentContainer}>
        {title && (
          <View style={styles.headerContainer}>
            <AppButton onPress={handleClose} text="Cancel" variant="link" />
            <Typography style={{ fontSize: 17 }} weight="700">
              {title}
            </Typography>
          </View>
        )}

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
    width: "100%",
    gap: 20,
  },
})
