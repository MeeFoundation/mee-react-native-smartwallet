import { Avatar, AvatarProps } from "@components/Avatar"
import { Typography, TypographyProps } from "@components/Typography"
import { colors } from "@utils/theme"
import { FC, ReactNode } from "react"
import { StyleSheet, View, ViewProps } from "react-native"

export type ConnectionListCardVariant = "default" | "expanded"

const connectionListCardStyles = StyleSheet.create({
  default: {
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: colors["white/80"],
    padding: 8,
  },
  expanded: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors["white/90"],
    borderWidth: 1,
    borderColor: colors.transparent,
    elevation: 5,
    boxShadow: "0px 2px 16px 0px rgba(0, 0, 0, 0.1)",
    padding: 8,
  },
})

const styles = StyleSheet.create({
  content: {
    gap: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  description: {
    flexGrow: 1,
    gap: 4,
  },
  count: {
    color: colors["gray-600"],
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  contentName: {
    fontSize: 16,
  },
  contentHint: {
    fontSize: 12,
  },
  danger: {
    color: colors["red-700"],
  },
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
})

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardButton
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardButtonProps = ViewProps

const ConnectionListCardButton: FC<ConnectionListCardButtonProps> = ({
  style,
  children,
  ...rest
}) => (
  <View style={[styles.button, style]} {...rest}>
    {children}
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardCount
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardCountProps = ViewProps

const ConnectionListCardCount: FC<ConnectionListCardCountProps> = ({
  style,
  children,
  ...rest
}) => (
  <View style={style} {...rest}>
    <Typography style={styles.count} fontFamily="publicSans.medium" weight="500">
      ({children})
    </Typography>
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardActions
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardActionsProps = Omit<ViewProps, "children"> & {
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
  <Typography
    style={[styles.contentName, style]}
    fontFamily="publicSans.medium"
    weight="500"
    {...rest}
  />
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardHint
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardHintProps = TypographyProps & {
  danger?: boolean
}

const ConnectionListCardHint: FC<ConnectionListCardHintProps> = ({ style, danger, ...rest }) => (
  <Typography
    style={[styles.contentHint, danger && styles.danger, style]}
    fontFamily="publicSans.regular"
    weight="400"
    {...rest}
  />
)

/* -------------------------------------------------------------------------------------------------
 * ConnectionListCardDescription
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardDescriptionProps = ViewProps

const ConnectionListCardDescription: FC<ConnectionListCardDescriptionProps> = ({
  style,
  ...rest
}) => <View style={[styles.description, style]} {...rest} />

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

const ConnectionListCard: FC<ConnectionListCardProps> = ({
  style,
  children,
  variant = "default",
  ...rest
}) => (
  <View style={[connectionListCardStyles[variant], style]} {...rest}>
    {children}
  </View>
)

/* -----------------------------------------------------------------------------------------------*/

const Root = ConnectionListCard
const Thumbnail = ConnectionListCardThumbnail
const Description = ConnectionListCardDescription
const Actions = ConnectionListCardActions
const Count = ConnectionListCardCount
const Button = ConnectionListCardButton
const Content = ConnectionListCardContent
const Name = ConnectionListCardName
const Hint = ConnectionListCardHint

export {
  Root,
  Thumbnail,
  Description,
  Actions,
  Count,
  Button,
  Content,
  Name,
  Hint,
  //
  ConnectionListCard,
  ConnectionListCardThumbnail,
  ConnectionListCardDescription,
  ConnectionListCardActions,
  ConnectionListCardCount,
  ConnectionListCardButton,
  ConnectionListCardContent,
  ConnectionListCardName,
  ConnectionListCardHint,
}
export type {
  ConnectionListCardProps,
  ConnectionListCardThumbnailProps,
  ConnectionListCardDescriptionProps,
  ConnectionListCardActionsProps,
  ConnectionListCardCountProps,
  ConnectionListCardButtonProps,
  ConnectionListCardContentProps,
  ConnectionListCardNameProps,
  ConnectionListCardHintProps,
}
