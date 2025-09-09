import { AppButton } from "@components/AppButton"
import * as ConnectionListCard from "@components/ListConnectionCard"
import { Connection } from "@services/core.service"
import { FC } from "react"
import { ChevronDownIcon } from "react-native-heroicons/outline"

/* -------------------------------------------------------------------------------------------------
 * PersonListCard
 * -----------------------------------------------------------------------------------------------*/
type PersonListCardProps = { person: Connection }

const PersonListCard: FC<PersonListCardProps> = ({ person }) => (
  <ConnectionListCard.Root>
    <ConnectionListCard.Content>
      <ConnectionListCard.Thumbnail text={person.name} />
      <ConnectionListCard.Description name={person.name} />
      <ConnectionListCard.Actions>
        <ConnectionListCard.Button>
          <AppButton onPress={() => {}} size="sm" variant="tertiary">
            <ChevronDownIcon color="black" />
          </AppButton>
        </ConnectionListCard.Button>
      </ConnectionListCard.Actions>
    </ConnectionListCard.Content>
  </ConnectionListCard.Root>
)

/* -----------------------------------------------------------------------------------------------*/

export { PersonListCard }
export type { PersonListCardProps }
