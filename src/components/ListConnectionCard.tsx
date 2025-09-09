import { Avatar, AvatarProps } from "@components/Avatar"
import { Typography } from "@components/Typography"
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
  <View style={style} {...rest}>
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
 * ConnectionListCardDescription
 * -----------------------------------------------------------------------------------------------*/
type ConnectionListCardDescriptionProps = Omit<ViewProps, "children"> & {
  name: ReactNode
  hint?: ReactNode
}

const ConnectionListCardDescription: FC<ConnectionListCardDescriptionProps> = ({
  style,
  name,
  hint,
  ...rest
}) => (
  <View style={[styles.description, style]} {...rest}>
    <Typography style={styles.contentName} fontFamily="publicSans.medium" weight="500">
      {name}
    </Typography>
    {hint && (
      <Typography style={styles.contentHint} fontFamily="publicSans.regular" weight="400">
        {hint}
      </Typography>
    )}
  </View>
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

export {
  Root,
  Thumbnail,
  Description,
  Actions,
  Count,
  Button,
  Content,
  //
  ConnectionListCard,
  ConnectionListCardThumbnail,
  ConnectionListCardDescription,
  ConnectionListCardActions,
  ConnectionListCardCount,
  ConnectionListCardButton,
  ConnectionListCardContent,
}
export type {
  ConnectionListCardProps,
  ConnectionListCardThumbnailProps,
  ConnectionListCardDescriptionProps,
  ConnectionListCardActionsProps,
  ConnectionListCardCountProps,
  ConnectionListCardButtonProps,
  ConnectionListCardContentProps,
}
