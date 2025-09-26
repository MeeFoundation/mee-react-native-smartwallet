import { View, type ViewProps } from 'react-native'

import type { Connection } from '@/entities/connection'

import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/Avatar'
import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 * IconSymbol
 * -----------------------------------------------------------------------------------------------*/
type UserTitleProps = Omit<ViewProps, 'children'> & {
  connection: Connection
}

const UserTitle = ({ connection, className, ...rest }: UserTitleProps) => (
  <View className={cn('items-center p-4', className)} {...rest}>
    <Avatar className="mb-2" size={112} src={connection.iconSrc} text={connection.name} />
    <Typography className="font-semibold text-2xl">{connection.name}</Typography>

    {/* TODO implement  */}
    <Typography>Admin • Open to work</Typography>
  </View>
)

/* -----------------------------------------------------------------------------------------------*/
export { UserTitle }

export type { UserTitleProps }
