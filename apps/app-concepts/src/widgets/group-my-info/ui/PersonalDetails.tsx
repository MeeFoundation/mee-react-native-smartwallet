import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { View } from 'react-native'

import { AttributeRenderer } from '@/entities/attribute'
import { type Group, getGroupRequestedAttributesSchemaAtom, getMyGroupPersonalDetailsAtom } from '@/entities/group'

type PersonalDetailsProps = {
  group: Group
}

/* -------------------------------------------------------------------------------------------------
 * PersonalDetails
 * -----------------------------------------------------------------------------------------------*/
const PersonalDetails: FC<PersonalDetailsProps> = ({ group }) => {
  const requestedAttributesSchema = useAtomValue(getGroupRequestedAttributesSchemaAtom(group.id))
  const myGroupPersonalDetails = useAtomValue(getMyGroupPersonalDetailsAtom(group.id))

  return (
    <View className="rounded-xl border border-black/7 bg-white/90 p-3">
      <AttributeRenderer schema={requestedAttributesSchema} value={myGroupPersonalDetails} />
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { PersonalDetails }

export type { PersonalDetailsProps }
