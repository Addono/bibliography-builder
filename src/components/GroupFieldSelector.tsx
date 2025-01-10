import React from "react"

export type GroupField =
  | "archive_location"
  | "issued"
  | "language"
  | "archive"
  | "type"
  | "publisher"
  | "publisher-place"

interface GroupFieldSelectorProps {
  value: GroupField
  onChange: (field: GroupField) => void
}

export function GroupFieldSelector({ value, onChange }: GroupFieldSelectorProps) {
  return (
    <div>
      <label htmlFor="group-by-field" style={{ display: "block", marginBottom: "0.5rem" }}>
        Group by:
      </label>
      <select
        id="group-by-field"
        value={value}
        onChange={(e) => onChange(e.target.value as GroupField)}
        style={{ marginBottom: "0.5rem" }}
      >
        <option value="archive_location">Archive Location</option>
        <option value="archive">Archive</option>
        <option value="type">Type</option>
        <option value="issued">Year of Issuing</option>
        <option value="language">Language</option>
        <option value="publisher">Publisher</option>
        <option value="publisher-place">Publisher Place</option>
      </select>
    </div>
  )
}
