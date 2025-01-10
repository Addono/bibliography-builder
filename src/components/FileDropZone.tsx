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
      console.log(file)
      // Match by file type or extension if accept is provided
      if (accept && !file.type.includes(accept) && !file.name.endsWith(accept)) {
        setError(`Please drop a ${accept} file`)
        onFileChange(null)
      } else {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files
          validateAndProcessFile(file)
        }
      }
    },
    [validateAndProcessFile, accept, onFileChange],
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
        {fileInputRef.current?.files && fileInputRef.current.files.length > 0 ? (
          <div>{fileInputRef.current.files[0].name}</div>
        ) : (
          <div className={styles.placeholder}>
            <i>No file selected</i>
          </div>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
