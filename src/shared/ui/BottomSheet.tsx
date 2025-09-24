// TODO Refactor

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  default as BottomSheetOrigin,
  type BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { type FC, type RefObject, useRef } from 'react'
import { Keyboard, StyleSheet, View, type ViewStyle } from 'react-native'

import { Typography } from '@/shared/ui/Typography'

import { AppButton, type ButtonVariant } from './AppButton'
import { Separator } from './Separator'

const BackDrop = (props: BottomSheetBackdropProps) => {
  const { style, ..._props } = props

  return <BottomSheetBackdrop {..._props} disappearsOnIndex={-1} style={StyleSheet.compose(style, { zIndex: 101 })} />
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
    snapPoints = ['25%', '50%'],
    index = -1,
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

  const methodsRef = useRef({} as BottomSheetMethods)

  const handleClose = () => {
    methodsRef.current?.close()
  }
  const handleDone = () => {
    methodsRef.current?.close()
    rightButtonAction?.()
  }

  const createRef = (instance: BottomSheetMethods) => {
    if (ref && 'current' in ref) {
      ref.current = instance
      methodsRef.current = instance
    }
  }
  const onClose = () => {
    Keyboard.dismiss()
  }

  return (
    <BottomSheetOrigin
      backdropComponent={(bottomSheetBackdropProps) =>
        backdropComponent?.({ ...bottomSheetBackdropProps, ...backDropProps }) ?? null
      }
      containerStyle={{ zIndex: 102 }}
      enableDynamicSizing={enableDynamicSizing}
      // FIXME extract component
      index={index}
      onClose={onClose}
      ref={createRef}
      snapPoints={snapPoints}
      {...rest}
    >
      <BottomSheetView style={[styles.contentContainer, propsStyles?.contentContainer]}>
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
      </BottomSheetView>
    </BottomSheetOrigin>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    flex: 1,
  },
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
