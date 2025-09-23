import type { FC } from 'react'

import { SelectList } from './SelectList'

type FilterTagsProps = {
  tags: string[]
  selectedTags: string[]
  onSelectTags: (tags: string[]) => void
}

export const FilterTags: FC<FilterTagsProps> = ({ tags, selectedTags, onSelectTags }) => {
  const selectTagHandler = (tag: string) => {
    if (selectedTags.indexOf(tag) < 0) {
      onSelectTags([...selectedTags, tag])
    } else {
      onSelectTags(selectedTags.filter((val) => val !== tag))
    }
  }

  return (
    <SelectList
      data={tags}
      label="Filter"
      onSelect={selectTagHandler}
      searchPlaceholder="Tags"
      selected={selectedTags}
      showCounter
    />
  )
}
