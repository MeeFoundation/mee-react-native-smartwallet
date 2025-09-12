import type { FC } from "react"
import { SelectList } from "./SelectList"

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
      searchPlaceholder="enter tag name"
      data={tags}
      selected={selectedTags}
      onSelect={selectTagHandler}
      label="Tags"
      onCreate={createTagHandler}
    />
  )
}
