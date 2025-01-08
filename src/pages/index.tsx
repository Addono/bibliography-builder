import React, { useState } from 'react';
import {
  UnsupportedCslError,
  groupAndSortCitations,
  registerCustomTemplateFromFile,
  generateBibliography
} from '../lib/businessLogic';

function HomePage() {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [cslFile, setCslFile] = useState<File | null>(null);
  const [output, setOutput] = useState('');

  async function handleGenerate() {
    try {
      if (!jsonFile) return;
      const jsonData = await jsonFile.text();
      const cslData = JSON.parse(jsonData);
      const { groups, sortedKeys } = groupAndSortCitations(cslData);

      let templateName = 'harvard1';
      if (cslFile) {
        templateName = await registerCustomTemplateFromFile(cslFile);
      }

      const result = await generateBibliography(groups, sortedKeys, templateName);
      setOutput(result);
    } catch (e) {
      if (e instanceof UnsupportedCslError) {
        console.error('CSL Error:', e.message);
      } else {
        console.error('Error:', e);
      }
    }
  }

  return (
    <div>
      <h1>Bibliography Builder</h1>
      <input
        type="file"
        accept=".json"
        onChange={(e) => setJsonFile(e.target.files?.[0] || null)}
      />
      <input
        type="file"
        accept=".csl"
        onChange={(e) => setCslFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleGenerate}>Generate</button>
      {output && (
        <div
          style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}
          dangerouslySetInnerHTML={{ __html: output }}
        />
      )}
    </div>
  );
}

export default HomePage;