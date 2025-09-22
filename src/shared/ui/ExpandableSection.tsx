import {
  type ComponentProps,
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  Easing,
  Keyboard,
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native'

import { colors, fonts } from '../config'
import { IconSymbol } from './IconSymbol'
import { Typography, type TypographyProps } from './Typography'

const DEFAULT_CONTENT_MAX_HEIGHT = 350
const DEFAULT_ANIMATION_DURATION = 200

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  collapsedContent: {
    height: 'auto',
    padding: 12,
    zIndex: 10,
  },
  collapsedWrapper: {
    overflow: 'hidden',
  },
  expandableSection: {
    borderColor: colors['black/07'],
    borderRadius: 12,
    borderWidth: 1,
  },
  head: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
})

type ExpandableSectionContext = {
  collapsed: boolean
  animatedValue: Animated.Value
  maxContentHeight: number

  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
}

const ExpandableSectionProvider = createContext<ExpandableSectionContext>({
  animatedValue: new Animated.Value(0),
  collapsed: false,
  maxContentHeight: 0,
  setCollapsed: () => {},
  toggleCollapsed: () => {},
})

/* -------------------------------------------------------------------------------------------------
 * ExpandableSectionContent
 * -----------------------------------------------------------------------------------------------*/
type ExpandableSectionContentProps = Omit<ComponentProps<typeof Animated.ScrollView>, 'children'> & PropsWithChildren

const ExpandableSectionContent: FC<ExpandableSectionContentProps> = ({ style, children, ...rest }) => {
  const { collapsed, maxContentHeight, animatedValue } = useContext(ExpandableSectionProvider)

  const contentHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxContentHeight],
  })

  return (
    <Animated.ScrollView
      nestedScrollEnabled={true}
      style={[style, { height: 'auto', maxHeight: contentHeight }, collapsed ? styles.collapsedWrapper : null]}
      {...rest}
    >
      <View style={styles.collapsedContent}>{children}</View>
    </Animated.ScrollView>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ExpandableSectionToggleAction
 * -----------------------------------------------------------------------------------------------*/
type ExpandableSectionToggleActionProps = ComponentProps<typeof Animated.View>

const ExpandableSectionToggleAction: FC<ExpandableSectionToggleActionProps> = ({ style, ...rest }) => {
  const { animatedValue } = useContext(ExpandableSectionProvider)

  const spin = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  })

  return (
    <Animated.View style={[style, { transform: [{ rotateZ: spin }] }]} {...rest}>
      <IconSymbol color={colors['gray-900']} height={24} name="chevron-right.outlined" strokeWidth={2} width={24} />
    </Animated.View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ExpandableSectionActions
 * -----------------------------------------------------------------------------------------------*/
type ExpandableSectionActionsProps = ViewProps

const ExpandableSectionActions: FC<ExpandableSectionActionsProps> = ({ style, ...rest }) => (
  <View style={[styles.actions, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ExpandableSectionTitleText
 * -----------------------------------------------------------------------------------------------*/
type ExpandableSectionTitleTextProps = Omit<TypographyProps, 'fontFamily' | 'weight'>

const ExpandableSectionTitleText: FC<ExpandableSectionTitleTextProps> = (props) => (
  // FIXME It's semibold font in design
  <Typography fontFamily={fonts.publicSans.bold} weight="600" {...props} />
)

/* -------------------------------------------------------------------------------------------------
 * ExpandableSectionTitle
 * -----------------------------------------------------------------------------------------------*/
type ExpandableSectionTitleProps = ViewProps

const ExpandableSectionTitle: FC<ExpandableSectionTitleProps> = ({ style, ...rest }) => (
  <View style={[styles.title, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ExpandableSectionHead
 * -----------------------------------------------------------------------------------------------*/
type ExpandableSectionHeadProps = PressableProps

const ExpandableSectionHead: FC<ExpandableSectionHeadProps> = ({ style, ...rest }) => {
  const { toggleCollapsed } = useContext(ExpandableSectionProvider)

  const mergedStyle = useMemo(
    () =>
      typeof style === 'function'
        ? (state: PressableStateCallbackType) => [styles.head, style(state)]
        : [styles.head, style],
    [style],
  )

  return <Pressable onPress={toggleCollapsed} style={mergedStyle} {...rest} />
}

/* -------------------------------------------------------------------------------------------------
 * ExpandableSection
 * -----------------------------------------------------------------------------------------------*/
type ExpandableSectionProps = ViewProps & {
  collapsed?: boolean
  contentMaxHeight?: number
  animationDuration?: number

  onToggle?: (collapsed: boolean) => void
}

const ExpandableSection = ({
  style,
  collapsed,
  contentMaxHeight = DEFAULT_CONTENT_MAX_HEIGHT,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  onToggle,
  ...rest
}: ExpandableSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(!!collapsed)
  const animatedValue = useRef(new Animated.Value(collapsed ? 1 : 0)).current

  useEffect(() => {
    setIsCollapsed(!!collapsed)
  }, [collapsed])

  const collapseContent = useCallback(() => {
    setIsCollapsed(true)
    onToggle?.(true)

    Keyboard.dismiss()

    Animated.timing(animatedValue, {
      duration: animationDuration,
      easing: Easing.linear,
      toValue: 1,
      useNativeDriver: false,
    }).start()
  }, [animationDuration, onToggle, animatedValue])

  const expandContent = useCallback(() => {
    onToggle?.(false)

    Animated.timing(animatedValue, {
      duration: animationDuration,
      easing: Easing.linear,
      toValue: 0,
      useNativeDriver: false,
    }).start(() => {
      setIsCollapsed(false)
    })
  }, [animationDuration, onToggle, animatedValue])

  const toggleContent = useCallback(() => {
    if (isCollapsed) expandContent()
    else collapseContent()
  }, [expandContent, collapseContent, isCollapsed])

  const contextValue = useMemo(
    (): ExpandableSectionContext => ({
      animatedValue,
      collapsed: isCollapsed,
      maxContentHeight: contentMaxHeight,
      setCollapsed: setIsCollapsed,
      toggleCollapsed: toggleContent,
    }),
    [isCollapsed, contentMaxHeight, animatedValue, toggleContent],
  )

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors['white/50'], colors['white/90']],
  })

  return (
    <ExpandableSectionProvider value={contextValue}>
      <Animated.View style={[{ backgroundColor: backgroundColor }, styles.expandableSection, style]} {...rest} />
    </ExpandableSectionProvider>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export {
  ExpandableSection as Root,
  ExpandableSectionHead as Head,
  ExpandableSectionTitle as Title,
  ExpandableSectionTitleText as TitleText,
  ExpandableSectionActions as Actions,
  ExpandableSectionToggleAction as ToggleAction,
  ExpandableSectionContent as Content,
}

export {
  ExpandableSection,
  ExpandableSectionHead,
  ExpandableSectionTitle,
  ExpandableSectionTitleText,
  ExpandableSectionActions,
  ExpandableSectionToggleAction,
  ExpandableSectionContent,
}

export type {
  ExpandableSectionProps,
  ExpandableSectionHeadProps,
  ExpandableSectionTitleProps,
  ExpandableSectionTitleTextProps,
  ExpandableSectionActionsProps,
  ExpandableSectionToggleActionProps,
  ExpandableSectionContentProps,
}
