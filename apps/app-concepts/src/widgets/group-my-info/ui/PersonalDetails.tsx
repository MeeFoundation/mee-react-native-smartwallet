import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { useState } from 'react'
import { View } from 'react-native'

import { AttributeRenderer } from '@/entities/attribute'
import { type Group, getGroupRequestedAttributesSchemaAtom, getMyGroupPersonalDetailsAtom } from '@/entities/group'
import { AppButton } from '@/shared/ui/AppButton'

type PersonalDetailsProps = {
  group: Group
}

/* -------------------------------------------------------------------------------------------------
 * PersonalDetails
 * -----------------------------------------------------------------------------------------------*/
const PersonalDetails: FC<PersonalDetailsProps> = ({ group }) => {
  const requestedAttributesSchema = useAtomValue(getGroupRequestedAttributesSchemaAtom(group.id))
  const myGroupPersonalDetails = useAtomValue(getMyGroupPersonalDetailsAtom(group.id))
  const [hasErrors, setHasErrors] = useState(false)

  return (
    <View className="gap-4">
      <View className="rounded-xl border border-black/7 bg-white/90 p-3">
        <AttributeRenderer
          onErrors={(errors) => setHasErrors(Object.keys(errors).length > 0)}
          schema={requestedAttributesSchema}
          value={myGroupPersonalDetails}
        />
      </View>
      <AppButton disabled={hasErrors} fullWidth text="Save" variant="primary" />
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { PersonalDetails }

export type { PersonalDetailsProps }
