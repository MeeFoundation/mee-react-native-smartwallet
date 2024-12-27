import { FC } from "react"
import { SelectList } from "./SelectList"

type SelectTagsProps = {
  tags: string[]
  selectedTags: string[]
  onSelectTags: (tags: string[]) => void
  label?: string
}

export const SelectTags: FC<SelectTagsProps> = ({ tags, selectedTags, onSelectTags, label }) => {
  const selectTagHandler = (tag: string) => {
    if (selectedTags.indexOf(tag) == -1) {
      onSelectTags([...selectedTags, tag])
    } else {
      onSelectTags(selectedTags.filter((val) => val !== tag))
    }
  }

  return (
    <SelectList
      searchPlaceholder="Tags"
      data={tags}
      selected={selectedTags}
      onSelect={selectTagHandler}
      label={label}
      showCounter
    />
  )
}
