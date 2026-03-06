import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { type FC, type ReactNode, type RefObject, useRef } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'

import { AppButton, type ButtonVariant } from './AppButton'
import { Separator } from './Separator'
import { Typography } from './Typography'

const BackDrop = (props: BottomSheetBackdropProps) => {
  const { style, ..._props } = props

  return <BottomSheetBackdrop {..._props} disappearsOnIndex={-1} style={StyleSheet.compose(style, { zIndex: 101 })} />
}

type Props = BottomSheetModalProps & {
  title?: string
  backDropProps?: Partial<BottomSheetDefaultBackdropProps>
  rightButtonAction?: () => void
  rightButtonVariant?: ButtonVariant
  rightButtonText?: string
  propsStyles?: { contentContainer?: ViewStyle; sheetHandler?: ViewStyle }
  children?: ReactNode
  ref?: RefObject<BottomSheetModal | null>
}

export const BottomSheetBackModal: FC<Props> = (props) => {
  const {
    snapPoints = ['75%'],
    index,
    backdropComponent = BackDrop,
    enableDynamicSizing = false,
    title,
    children,
    backDropProps,
    rightButtonAction,
    rightButtonVariant = 'link',
    rightButtonText = 'Done',
    propsStyles,
    ref,
    ...rest
  } = props

  const methodsRef = useRef<BottomSheetModal | null>(null)

  const handleClose = () => {
    methodsRef.current?.close()
  }
  const handleDone = () => {
    methodsRef.current?.close()
    rightButtonAction?.()
  }

  const createRef = (instanse: BottomSheetModal | null) => {
    if (ref && 'current' in ref) {
      ref.current = instanse
      methodsRef.current = instanse
    }
  }

  return (
    <BottomSheetModal
      backdropComponent={(p) => backdropComponent?.({ ...p, ...backDropProps }) ?? null}
      // when it -1 it leads to incorrect work, modal sheet is closed by default without it
      containerStyle={{ zIndex: 102 }}
      enableDynamicSizing={enableDynamicSizing}
      // FIXME extract component
      handleStyle={propsStyles?.sheetHandler}
      index={index === -1 ? 0 : index}
      ref={createRef}
      snapPoints={snapPoints}
      {...rest}
    >
      <BottomSheetScrollView style={[styles.contentContainer, propsStyles?.contentContainer]}>
        {title && (
          <View style={styles.headerContainer}>
            <View style={{ flex: 1, left: 16, position: 'absolute', zIndex: 10 }}>
              <AppButton onPress={handleClose} text="Cancel" variant="link" />
            </View>
            <Typography
              className="font-bold"
              style={{
                flex: 1,
                fontSize: 17,
                textAlign: 'center',
              }}
            >
              {title}
            </Typography>
            {rightButtonAction && (
              <View style={{ flex: 1, position: 'absolute', right: 16, zIndex: 10 }}>
                <AppButton
                  onPress={handleDone}
                  style={{ flex: 1 }}
                  text={rightButtonText}
                  variant={rightButtonVariant}
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
}

const styles = StyleSheet.create({
  contentContainer: {},
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
    padding: 16,
    width: '100%',
  },
  separator: {
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
    height: 1,
    marginVertical: 1,
    opacity: 0.3,
    width: '100%',
  },
})
