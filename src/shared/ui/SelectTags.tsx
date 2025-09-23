import type { FC } from 'react'

import { SelectList } from './SelectList'

type SelectTagsProps = {
  tags: string[]
  selectedTags: string[]
  onSelectTags: (tags: string[]) => void
}

export const SelectTags: FC<SelectTagsProps> = ({ tags, selectedTags, onSelectTags }) => {
  const selectTagHandler = (tag: string) => {
    if (selectedTags.indexOf(tag) < 0) {
      onSelectTags([...selectedTags, tag])
    } else {
      onSelectTags(selectedTags.filter((val) => val !== tag))
    }
  }

  const createTagHandler = (tag: string) => {
    onSelectTags([...selectedTags, tag])
  }

  return (
    <SelectList
      data={tags}
      label="Tags"
      onCreate={createTagHandler}
      onSelect={selectTagHandler}
      searchPlaceholder="enter tag name"
      selected={selectedTags}
    />
  )
}
