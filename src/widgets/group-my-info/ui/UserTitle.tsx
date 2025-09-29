import { View, type ViewProps } from 'react-native'

import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/Avatar'
import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 * IconSymbol
 * -----------------------------------------------------------------------------------------------*/
type UserTitleProps = Omit<ViewProps, 'children'> & {
  displayName: string
  thumbnail: string | undefined
  subtitle: string | undefined
}

const UserTitle = ({ displayName, thumbnail, subtitle, className, ...rest }: UserTitleProps) => (
  <View className={cn('items-center p-4', className)} {...rest}>
    <Avatar className="mb-2" size={112} src={thumbnail} text={displayName} />
    <Typography className="font-semibold text-2xl">{displayName}</Typography>

    {/* TODO implement  */}
    {!subtitle ? null : <Typography>{subtitle}</Typography>}
  </View>
)

/* -----------------------------------------------------------------------------------------------*/
export { UserTitle }

export type { UserTitleProps }
