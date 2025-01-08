import { Cite, plugins } from '@citation-js/core';
import "@citation-js/plugin-csl";

export class UnsupportedCslError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedCslError';
  }
}

export function groupAndSortCitations(cslData: any[]): { groups: Record<string, any[]>, sortedKeys: string[] } {
  const groupedData: Record<string, any[]> = {};
  cslData.forEach((entry: any) => {
    if (entry.archive_location) {
      if (!groupedData[entry.archive_location]) {
        groupedData[entry.archive_location] = [];
      }
      groupedData[entry.archive_location].push(entry);
    }
  });
  return {
    groups: groupedData,
    sortedKeys: Object.keys(groupedData).sort()
  };
}

export async function isDependentCslStyle(templateXml: string): Promise<boolean> {
  const hasIndependentParent = templateXml.includes('rel="independent-parent"');
  const hasTemplateLink = templateXml.includes('rel="template"');
  return hasIndependentParent && !hasTemplateLink;
}

export async function registerCustomTemplateFromXml(templateXml: string): Promise<string> {
  if (await isDependentCslStyle(templateXml)) {
    throw new UnsupportedCslError(
      'The provided CSL file appears to be an dependent style. Please use an independent style.'
    );
  }
  const templateName = 'custom';
  const config = plugins.config.get('@csl');
  config.templates.add(templateName, templateXml);
  return templateName;
}

export async function registerCustomTemplateFromFile(file: File): Promise<string> {
  const templateXml = await file.text();
  return registerCustomTemplateFromXml(templateXml);
}

export async function generateHtml(
  groups: Record<string, any[]>, 
  sortedKeys: string[], 
  templateName: string,
): Promise<string> {
  const output: string[] = [];
  output.push("<!DOCTYPE html>");
  output.push("<html lang='en'>");
  output.push("<head>");
  output.push("<meta charset='UTF-8'>");
  output.push("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
  output.push("<title>Bibliography</title>");
  output.push("</head>");
  output.push("<body>");
  
  for (const archiveLocation of sortedKeys) {
    const entries = groups[archiveLocation];
    output.push(`<h2>${archiveLocation}</h2>`);
    
    const citation = await Cite.async(entries);
    const renderedBibliography = citation.format("bibliography", {
      format: "html",
      template: templateName,
      lang: "en-US",
    });
    
    output.push(renderedBibliography);
    output.push("<br>");
  }

  output.push("</body>");
  output.push("</html>");
  
  return output.join("\n");
}

export async function generateBibliography(
  groups: Record<string, any[]>,
  sortedKeys: string[],
  templateName: string
): Promise<string> {
  const outputParts: string[] = [];
  for (const archiveLocation of sortedKeys) {
    const entries = groups[archiveLocation];
    const citation = await Cite.async(entries);
    const rendered = citation.format('bibliography', {
      format: 'html',
      template: templateName,
      lang: 'en-US',
    });
    outputParts.push(`<h2>${archiveLocation}</h2>`);
    outputParts.push(rendered);
    outputParts.push('<br>');
  }
  return outputParts.join('\n');
}