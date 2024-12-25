import { FC, useState } from "react"
import { SelectList } from "./SelectList"

type SelectTagsProps = {}

const DATA = [
  { key: "News", value: "News" },
  { key: "Journalist", value: "Journalist" },
  { key: "Technology", value: "Technology" },
  { key: "Science", value: "Science" },
  { key: "Business", value: "Business" },
  { key: "Politics", value: "Politics" },
  { key: "Health", value: "Health" },
  { key: "Sports", value: "Sports" },
  { key: "Entertainment", value: "Entertainment" },
  { key: "Lifestyle", value: "Lifestyle" },
  { key: "Travel", value: "Travel" },
  { key: "Food", value: "Food" },
  { key: "Fashion", value: "Fashion" },
  { key: "Beauty", value: "Beauty" },
  { key: "Music", value: "Music" },
  { key: "Movies", value: "Movies" },
  { key: "TV", value: "TV" },
  { key: "Books", value: "Books" },
  { key: "Art", value: "Art" },
  { key: "Design", value: "Design" },
  { key: "Photography", value: "Photography" },
  { key: "Video", value: "Video" },
  { key: "Games", value: "Games" },
  { key: "Comics", value: "Comics" },
  { key: "Animals", value: "Animals" },
  { key: "Environment", value: "Environment" },
  { key: "Space", value: "Space" },
  { key: "Weather", value: "Weather" },
  { key: "History", value: "History" },
  { key: "Religion", value: "Religion" },
  { key: "Family", value: "Family" },
  { key: "Parenting", value: "Parenting" },
  { key: "Relationships", value: "Relationships" },
  { key: "Weddings", value: "Weddings" },
  { key: "Home", value: "Home" },
  { key: "Garden", value: "Garden" },
  { key: "DIY", value: "DIY" },
  { key: "Auto", value: "Auto" },
]

export const SelectTags: FC<SelectTagsProps> = ({}) => {
  const [tags, setTags] = useState<string[]>(["News", "Journalist"])

  const selectTagHandler = (tag: string) => {
    if (tags.indexOf(tag) == -1) {
      setTags((prev) => [...prev, tag])
    } else {
      setTags((prev) => prev.filter((val) => val !== tag))
    }
  }

  return (
    <SelectList
      searchPlaceholder="enter tag name"
      data={DATA}
      selected={tags}
      onSelect={selectTagHandler}
    />
  )
}
