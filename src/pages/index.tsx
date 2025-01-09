import React, { useState, useEffect } from "react"
import styles from "./index.module.css"

import { UnsupportedCslError, groupAndSortCitations, generateBibliography } from "../lib/businessLogic"

import { Spinner } from "../components/Spinner"
import StyleSelector from "../components/StyleSelector"
import { JsonFileSelector } from "../components/JsonFileSelector"
import { CopyButton } from "../components/CopyButton"

function HomePage() {
  const [jsonFile, setJsonFile] = useState<File | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>("apa")
  const [output, setOutput] = useState<{ text: string; html: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function generateOutput() {
      try {
        if (!jsonFile || !selectedStyle) return
        setIsLoading(true)
        const jsonData = await jsonFile.text()
        const cslData = JSON.parse(jsonData)
        const { groups, sortedKeys } = groupAndSortCitations(cslData)
        const result = await generateBibliography(groups, sortedKeys, selectedStyle)
        setOutput(result)
      } catch (e) {
        if (e instanceof UnsupportedCslError) {
          console.error("CSL Error:", e.message)
        } else {
          console.error("Error:", e)
        }
      } finally {
        setIsLoading(false)
      }
    }

    generateOutput()
  }, [jsonFile, selectedStyle])

  return (
    <div className={styles.container}>
      <h1>Bibliography Builder</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.grid}>
          <div>
            <h3>Step 1: Select your CSL-JSON file</h3>
            <div>
              <p>
                Upload a CSL-JSON file containing your citations. You can export this format from reference managers
                like Zotero:
              </p>
              <ol>
                <li>Select your references in Zotero</li>
                <li>{'Right-click and choose "Export Items..."'}</li>
                <li>{'Select "CSL JSON" as format'}</li>
                <li>Save and upload the file here</li>
              </ol>
            </div>
          </div>
          <div>
            <JsonFileSelector onFileChange={setJsonFile} />
          </div>

          <div>
            <h3>Step 2: Choose citation style</h3>
            <p>
              Select a bibliography style. You can either use one of the built-in styles (APA, Vancouver, Harvard) or
              upload your own CSL style file.
            </p>
          </div>
          <div>
            <StyleSelector onStyleChange={setSelectedStyle} />
          </div>
        </div>
      </form>

      {isLoading && (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      )}

      {!isLoading && output && (
        <div className={styles.outputContainer}>
          <div className={styles.copyButtonContainer}>
            <CopyButton content={output} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: output.html }} />
        </div>
      )}
    </div>
  )
}

export default HomePage
