import type { FC, ReactNode } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'

import { colors } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { Avatar, type AvatarProps } from '@/shared/ui/Avatar'
import * as Skeleton from '@/shared/ui/Skeleton'
import { Typography, type TypographyProps } from '@/shared/ui/Typography'

export type ConnectionListCardVariant = 'default' | 'expanded'

const connectionListCardStyles = StyleSheet.create({
  default: {
    backgroundColor: colors['white/60'],
    borderColor: colors['white/80'],
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 64,
    padding: 8,
  },
  expanded: {
    backgroundColor: colors['white/90'],
    borderColor: colors.transparent,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    boxShadow: `0px 2px 16px 0px ${colors['black/10']}`,
    elevation: 5,
    padding: 8,
  },
  skeleton: {
    backgroundColor: colors['gray-200'],
  },
})

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    textAlign: 'center',
    width: 44,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  contentHint: {
    fontSize: 12,
  },

  contentName: {
    fontSize: 16,
  },
  count: {
    color: colors['gray-600'],
  },
  danger: {
    color: colors['red-700'],
  },
  description: {
    flexGrow: 1,
    gap: 4,
  },
})

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardButton
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardButtonProps = ViewProps

const ConnectionListCardButton: FC<ConnectionListCardButtonProps> = ({ style, children, ...rest }) => (
  <View style={[styles.button, style]} {...rest}>
    {children}
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardCount
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardCountProps = ViewProps

const ConnectionListCardCount: FC<ConnectionListCardCountProps> = ({ style, children, ...rest }) => (
  <View style={style} {...rest}>
    <Typography className="font-medium" style={styles.count}>
      ({children})
    </Typography>
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardActions
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardActionsProps = Omit<ViewProps, 'children'> & {
  children: ReactNode
}

const ConnectionListCardActions: FC<ConnectionListCardActionsProps> = ({ style, ...rest }) => (
  <View style={[styles.actions, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardName
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardNameProps = TypographyProps

const ConnectionListCardName: FC<ConnectionListCardNameProps> = ({ style, ...rest }) => (
  <Typography className="font-medium" style={[styles.contentName, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardHint
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardHintProps = TypographyProps & {
  danger?: boolean
}

const ConnectionListCardHint: FC<ConnectionListCardHintProps> = ({ style, danger, ...rest }) => (
  <Typography style={[styles.contentHint, danger && styles.danger, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardDescription
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardDescriptionProps = ViewProps

const ConnectionListCardDescription: FC<ConnectionListCardDescriptionProps> = ({ style, ...rest }) => (
  <View style={[styles.description, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardThumbnail
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardThumbnailProps = AvatarProps

const ConnectionListCardThumbnail: FC<ConnectionListCardThumbnailProps> = ({ size, ...rest }) => (
  <Avatar size={size ?? 48} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardContent
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardContentProps = ViewProps

const ConnectionListCardContent: FC<ConnectionListCardContentProps> = ({ style, ...rest }) => (
  <View style={[styles.content, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCard
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardProps = ViewProps & {
  variant?: ConnectionListCardVariant
}

const ConnectionListCard: FC<ConnectionListCardProps> = ({ style, children, variant = 'default', ...rest }) => (
  <View style={[connectionListCardStyles[variant], style]} {...rest}>
    {children}
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardSkeleton
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardSkeletonProps = {
  style?: ViewProps['style']
  className?: string
}

const ConnectionListCardSkeleton: FC<ConnectionListCardSkeletonProps> = ({ style, className }) => (
  <Skeleton.Root className={cn('rounded-md p-2', className)} height={48} style={style} viewBox="0 0 400 48" width={400}>
    <Skeleton.Rect height="18" rx="6" ry="6" width="192" x="56" y="7.5" />
    <Skeleton.Rect height="12" rx="3" ry="3" width="96" x="56" y="28.5" />
    <Skeleton.Circle cx="24" cy="24" r="24" />
  </Skeleton.Root>
)

/* -----------------------------------------------------------------------------------------------*/

export {
  ConnectionListCard,
  ConnectionListCardActions,
  ConnectionListCardButton,
  ConnectionListCardContent,
  ConnectionListCardCount,
  ConnectionListCardDescription,
  ConnectionListCardHint,
  ConnectionListCardName,
  ConnectionListCardSkeleton,
  ConnectionListCardThumbnail,
}

export {
  ConnectionListCardActions as Actions,
  ConnectionListCardButton as Button,
  ConnectionListCardContent as Content,
  ConnectionListCardCount as Count,
  ConnectionListCardDescription as Description,
  ConnectionListCardHint as Hint,
  ConnectionListCardName as Name,
  ConnectionListCard as Root,
  ConnectionListCardSkeleton as Skeleton,
  ConnectionListCardThumbnail as Thumbnail,
}

export type {
  ConnectionListCardActionsProps,
  ConnectionListCardButtonProps,
  ConnectionListCardContentProps,
  ConnectionListCardCountProps,
  ConnectionListCardDescriptionProps,
  ConnectionListCardHintProps,
  ConnectionListCardNameProps,
  ConnectionListCardProps,
  ConnectionListCardSkeletonProps,
  ConnectionListCardThumbnailProps,
}
