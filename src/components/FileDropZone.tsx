import React, { useCallback, useRef, useState, useId } from "react"
import clsx from "clsx"

import styles from "./FileDropZone.module.css"

interface FileDropZoneProps {
  onFileChange: (file: File | null) => void
  accept?: string
  label: string
  validator?: (file: File) => Promise<boolean>
}

export function FileDropZone({ onFileChange, accept, label, validator }: FileDropZoneProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // The ID to use for this input element
  const inputId = useId()

  const validateAndProcessFile = useCallback(
    async (file: File | null) => {
      setError(null)
      if (!file) {
        onFileChange(null)
        return
      }

      try {
        if (validator) {
          const isValid = await validator(file)
          if (!isValid) {
            setError("Invalid file format")
            onFileChange(null)
            return
          }
        }

        onFileChange(file)
      } catch (e) {
        console.error(e)
        setError("Error processing file")
        onFileChange(null)
      }
    },
    [onFileChange, validator],
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
      if (accept && !file.type.match(accept)) {
        setError(`Please drop a ${accept} file`)
        return
      }
      validateAndProcessFile(file)
    },
    [validateAndProcessFile, accept],
  )

  return (
    <div className={styles.container}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(styles.dropZone, {
          [styles.dropZoneDragging]: isDragging,
        })}
      >
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={accept}
          onChange={(e) => validateAndProcessFile(e.target.files?.[0] || null)}
          className={styles.fileInput}
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
