import React from "react"
import { FileDropZone } from "./FileDropZone"

interface JsonFileSelectorProps {
  onFileChange: (file: File | null) => void
}

const isValidCslJson = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    if (!Array.isArray(data)) return false
    return data.every((item) => typeof item === "object" && item !== null && "type" in item && "id" in item)
  } catch {
    return false
  }
}

export function JsonFileSelector({ onFileChange }: JsonFileSelectorProps) {
  return (
    <FileDropZone
      onFileChange={onFileChange}
      accept="application/json"
      label="Drop your CSL-JSON file here, or click here to select one."
      validator={isValidCslJson}
    />
  )
}
