import React, { useState } from "react"

interface CopyButtonProps {
  content: { html: string; text: string }
}

export function CopyButton({ content }: CopyButtonProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = async () => {
    try {
      const htmlBlob = new Blob([content.html], { type: "text/html" })
      const textBlob = new Blob([content.text], { type: "text/plain" })
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": textBlob,
        }),
      ])
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: copySuccess ? "#4CAF50" : "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {copySuccess ? "Copied!" : "Copy Bibliography"}
    </button>
  )
}
