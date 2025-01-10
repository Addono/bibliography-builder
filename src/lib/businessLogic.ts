import { Cite, plugins } from "@citation-js/core"
import "@citation-js/plugin-csl"

import { GroupField } from "../components/GroupFieldSelector"

/**
 * Custom error class for unsupported CSL style errors
 */
export class UnsupportedCslError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UnsupportedCslError"
  }
}

/**
 * Groups citation data by archive location and returns sorted groups
 * @param cslData - Array of citation data objects
 * @param groupByField - The field to group by
 * @returns Object containing grouped citations and sorted group keys
 */
export function groupAndSortCitations(
  cslData: unknown[],
  groupByField: GroupField,
): { groups: Record<string, unknown[]>; sortedKeys: string[] } {
  const groupedData: Record<string, unknown[]> = {}
  cslData.forEach((entry: unknown) => {
    if (typeof entry === "object" && entry[groupByField]) {
      let groupValue = entry[groupByField]
      if (groupByField === "issued" && groupValue && Array.isArray(groupValue["date-parts"])) {
        groupValue = groupValue["date-parts"][0][0] // Extract the year
      } else if (groupValue instanceof Date) {
        groupValue = groupValue.toLocaleDateString()
      } else {
        groupValue = String(groupValue)
      }

      // Initialize the key in the groupedData object if it doesn't exist
      if (!groupedData[groupValue]) {
        groupedData[groupValue] = []
      }

      // Add the entry to the group
      groupedData[groupValue].push(entry)
    }
  })
  return {
    groups: groupedData,
    sortedKeys: Object.keys(groupedData).sort(),
  }
}

/**
 * Checks if a CSL style is dependent on another style
 * @param templateXml - The CSL template XML string
 * @returns Promise resolving to true if the style is dependent, false otherwise
 */
export async function isDependentCslStyle(templateXml: string): Promise<boolean> {
  const hasIndependentParent = templateXml.includes('rel="independent-parent"')
  const hasTemplateLink = templateXml.includes('rel="template"')
  return hasIndependentParent && !hasTemplateLink
}

/**
 * Registers a custom CSL template from XML string
 * @param templateXml - The CSL template XML string
 * @returns Promise resolving to the registered template name
 * @throws {UnsupportedCslError} When the template is a dependent style
 */
export async function registerCustomTemplateFromXml(templateXml: string): Promise<string> {
  if (await isDependentCslStyle(templateXml)) {
    throw new UnsupportedCslError(
      "The provided CSL file appears to be using a dependent style CSL definition. Please use an independent style, which does not include references to other files or URLs.",
    )
  }
  const templateName = `custom-${Math.random().toString(36).substring(2, 8)}`
  const config = plugins.config.get("@csl")
  config.templates.add(templateName, templateXml)
  return templateName
}

/**
 * Registers a custom CSL template from a File object
 * @param file - The File object containing the CSL template
 * @returns Promise resolving to the registered template name
 */
export async function registerCustomTemplateFromFile(file: File): Promise<string> {
  const templateXml = await file.text()
  return registerCustomTemplateFromXml(templateXml)
}

/**
 * Generates a complete HTML document containing the formatted bibliography
 * @param groups - Object containing grouped citations
 * @param sortedKeys - Array of sorted group keys
 * @param templateName - Name of the CSL template to use
 * @returns Promise resolving to the complete HTML string
 */
export async function generateHtml(
  groups: Record<string, unknown[]>,
  sortedKeys: string[],
  templateName: string,
): Promise<string> {
  const output: string[] = []
  output.push("<!DOCTYPE html>")
  output.push("<html lang='en'>")
  output.push("<head>")
  output.push("<meta charset='UTF-8'>")
  output.push("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
  output.push("<title>Bibliography</title>")
  output.push("</head>")
  output.push("<body>")

  for (const archiveLocation of sortedKeys) {
    const entries = groups[archiveLocation]
    output.push(`<h2>${archiveLocation}</h2>`)

    const citation = await Cite.async(entries)
    const renderedBibliography = citation.format("bibliography", {
      format: "html",
      template: templateName,
      lang: "en-US",
    })

    output.push(renderedBibliography)
    output.push("<br>")
  }

  output.push("</body>")
  output.push("</html>")

  return output.join("\n")
}

/**
 * Generates bibliography fragments in HTML and plain text formats
 * @param groups - Object containing grouped citations
 * @param sortedKeys - Array of sorted group keys
 * @param templateName - Name of the CSL template to use
 * @returns Promise resolving to object with HTML and text bibliography fragments
 */
export async function generateBibliography(
  groups: Record<string, unknown[]>,
  sortedKeys: string[],
  templateName: string,
): Promise<{ html: string; text: string }> {
  const htmlParts: string[] = []
  const textParts: string[] = []

  for (const archiveLocation of sortedKeys) {
    const entries = groups[archiveLocation]
    const citation = await Cite.async(entries)

    const htmlRendered = citation.format("bibliography", {
      format: "html",
      template: templateName,
      lang: "en-US",
    })
    const textRendered = citation.format("bibliography", {
      format: "text",
      template: templateName,
      lang: "en-US",
    })

    htmlParts.push(`<h2>${archiveLocation}</h2>`)
    htmlParts.push(htmlRendered)
    htmlParts.push("<br>")

    textParts.push(archiveLocation)
    textParts.push(textRendered)
    textParts.push("\n")
  }

  return {
    html: htmlParts.join("\n"),
    text: textParts.join("\n"),
  }
}
