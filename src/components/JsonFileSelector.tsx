import React, { useState, useCallback, useRef } from "react"
import clsx from "clsx"
import styles from "./JsonFileSelector.module.css"

/**
 * Props for the JsonFileSelector component
 * @interface JsonFileSelectorProps
 */
interface JsonFileSelectorProps {
  /**
   * Callback function that is called when a valid CSL-JSON file is selected
   */
  onFileChange: (file: File | null) => void
}

/**
 * Validates if the provided JSON data follows CSL-JSON format
 * @param data - The parsed JSON data to validate
 * @returns boolean indicating if the data is valid CSL-JSON
 */
const isValidCslJson = (data: unknown): boolean => {
  if (!Array.isArray(data)) return false
  return data.every((item) => typeof item === "object" && item !== null && "type" in item && "id" in item)
}

/**
 * A component that renders a file input specifically for CSL-JSON files
 * with validation and drag-and-drop support
 */
export function JsonFileSelector({ onFileChange }: JsonFileSelectorProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndProcessFile = useCallback(
    async (file: File | null) => {
      setError(null)
      if (!file) {
        onFileChange(null)
        return
      }

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (!isValidCslJson(data)) {
          setError("Invalid CSL-JSON format. File must contain an array of citation objects.")
          onFileChange(null)
          return
        }

        onFileChange(file)
      } catch (e) {
        console.error(e)
        setError("Invalid JSON file. Please ensure the file contains valid JSON data.")
        onFileChange(null)
      }
    },
    [onFileChange],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file?.type === "application/json") {
        validateAndProcessFile(file)
      } else {
        setError("Please drop a JSON file")
      }
    },
    [validateAndProcessFile],
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.container}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={clsx(styles.dropZone, {
          [styles.dropZoneDragging]: isDragging,
        })}
      >
        <label htmlFor="json-input" className={styles.label}>
          Drop your CSL-JSON file here, or click anywhere in this area to select one.
        </label>
        <input
          ref={fileInputRef}
          id="json-input"
          type="file"
          accept=".json"
          onChange={(e) => validateAndProcessFile(e.target.files?.[0] || null)}
          className={styles.fileInput}
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
