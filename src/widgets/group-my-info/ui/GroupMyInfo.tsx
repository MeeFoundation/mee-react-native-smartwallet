import type { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import type { Group } from '@/entities/group/model/types'

import { Avatar } from '@/shared/ui/Avatar'
import * as ExpandableSection from '@/shared/ui/ExpandableSection'
import { IconButton } from '@/shared/ui/IconButton'
import * as TextInput from '@/shared/ui/TextInput'
import { Typography } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 16,
  },
  sections: {
    gap: 8,
  },
})

/* -------------------------------------------------------------------------------------------------
 * PersonalDetailsSection
 * -----------------------------------------------------------------------------------------------*/
type PersonalDetailsSectionProps = Omit<ExpandableSection.ExpandableSectionProps, 'children'>

const PersonalDetailsSection: FC<PersonalDetailsSectionProps> = (props) => {
  return (
    <>
      <TextInput.TextInput invalid placeholder="Invalid" />

      <TextInput.Root invalid>
        <TextInput.Input invalid placeholder="Invalid" />
        <TextInput.Actions>
          <Typography style={{ fontSize: 12 }}>Required</Typography>
          <TextInput.Action>
            <IconButton icon="pencil.outlined" size="sm" />
          </TextInput.Action>
          <TextInput.Action>
            <IconButton icon="pencil.outlined" size="full" />
          </TextInput.Action>
        </TextInput.Actions>
        <TextInput.Label>Label</TextInput.Label>
      </TextInput.Root>

      <ExpandableSection.Root {...props}>
        <ExpandableSection.Head>
          <ExpandableSection.Title>
            <ExpandableSection.TitleText>Personal details</ExpandableSection.TitleText>
          </ExpandableSection.Title>
          <ExpandableSection.Actions>
            <ExpandableSection.ToggleAction />
          </ExpandableSection.Actions>
        </ExpandableSection.Head>

        <ExpandableSection.Content>
          <TextInput.TextInput invalid placeholder="Invalid" />

          <TextInput.Root invalid>
            <TextInput.Input invalid placeholder="Invalid" />
            <TextInput.Actions>
              <Typography style={{ fontSize: 12 }}>Required</Typography>
              <TextInput.Action>
                <IconButton icon="pencil.outlined" size="sm" />
              </TextInput.Action>
              <TextInput.Action>
                <IconButton icon="pencil.outlined" size="full" />
              </TextInput.Action>
            </TextInput.Actions>
            <TextInput.Label>Label</TextInput.Label>
          </TextInput.Root>

          <Typography>content</Typography>
          <Typography>content</Typography>
          <Typography>content</Typography>
          <Typography>content</Typography>
        </ExpandableSection.Content>
      </ExpandableSection.Root>
    </>
  )
}

/* -------------------------------------------------------------------------------------------------
 * HealthSection
 * -----------------------------------------------------------------------------------------------*/
type HealthSectionProps = Omit<ExpandableSection.ExpandableSectionProps, 'children'>

const HealthSection: FC<HealthSectionProps> = (props) => {
  return (
    <ExpandableSection.Root {...props}>
      <ExpandableSection.Head>
        <ExpandableSection.Title>
          <ExpandableSection.TitleText>Health</ExpandableSection.TitleText>
        </ExpandableSection.Title>
        <ExpandableSection.Actions>
          <ExpandableSection.ToggleAction />
        </ExpandableSection.Actions>
      </ExpandableSection.Head>

      <ExpandableSection.Content>
        <Typography>content</Typography>
        <Typography>content</Typography>
        <Typography>content</Typography>
        <Typography>content</Typography>
      </ExpandableSection.Content>
    </ExpandableSection.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AvailabilityCalendarSection
 * -----------------------------------------------------------------------------------------------*/
type AvailabilityCalendarSectionProps = Omit<ExpandableSection.ExpandableSectionProps, 'children'>

const AvailabilityCalendarSection: FC<AvailabilityCalendarSectionProps> = (props) => {
  return (
    <ExpandableSection.Root {...props}>
      <ExpandableSection.Head>
        <ExpandableSection.Title>
          <ExpandableSection.TitleText>Availability calendar</ExpandableSection.TitleText>
        </ExpandableSection.Title>
        <ExpandableSection.Actions>
          <ExpandableSection.ToggleAction />
        </ExpandableSection.Actions>
      </ExpandableSection.Head>
      <ExpandableSection.Content>
        <Typography>content</Typography>
        <Typography>content</Typography>
        <Typography>content</Typography>
        <Typography>content</Typography>
      </ExpandableSection.Content>
    </ExpandableSection.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DocumentsSection
 * -----------------------------------------------------------------------------------------------*/
type DocumentsSectionProps = Omit<ExpandableSection.ExpandableSectionProps, 'children'>

const DocumentsSection: FC<DocumentsSectionProps> = (props) => {
  return (
    <ExpandableSection.Root {...props}>
      <ExpandableSection.Head>
        <ExpandableSection.Title>
          <ExpandableSection.TitleText>Documents</ExpandableSection.TitleText>
        </ExpandableSection.Title>
        <ExpandableSection.Actions>
          <ExpandableSection.ToggleAction />
        </ExpandableSection.Actions>
      </ExpandableSection.Head>

      <ExpandableSection.Content>
        <Typography>content</Typography>
        <Typography>content</Typography>
        <Typography>content</Typography>
        <Typography>content</Typography>
      </ExpandableSection.Content>
    </ExpandableSection.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * IconSymbol
 * -----------------------------------------------------------------------------------------------*/
type GroupMyInfoProps = {
  group: Group
}

const GroupMyInfo = ({ group }: GroupMyInfoProps) => {
  const myConnection = group.connections.at(0)

  return !myConnection ? null : (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Avatar size={112} src={myConnection.iconSrc} style={{ marginBottom: 8 }} text={myConnection.name} />
        <Typography className="font-semibold text-2xl">{myConnection.name}</Typography>

        {/* TODO implement  */}
        <Typography>Admin • Open to work</Typography>
      </View>

      <View style={styles.sections}>
        <PersonalDetailsSection />
        <AvailabilityCalendarSection />
        <HealthSection />
        <DocumentsSection />
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupMyInfo }

export type { GroupMyInfoProps }
