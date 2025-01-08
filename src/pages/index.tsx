import React, { useState } from 'react';
import { Spinner } from '../components/Spinner';
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
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    try {
      if (!jsonFile) return;
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Bibliography Builder</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="json-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Citations JSON file:
          </label>
          <input
            id="json-input"
            type="file"
            accept=".json"
            onChange={(e) => setJsonFile(e.target.files?.[0] || null)}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="csl-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Citation Style (CSL) file (optional):
          </label>
          <input
            id="csl-input"
            type="file"
            accept=".csl"
            onChange={(e) => setCslFile(e.target.files?.[0] || null)}
          />
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Bibliography'}
        </button>
      </form>

      {isLoading && <Spinner />}

      {!isLoading && output && (
        <div
          style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}
          dangerouslySetInnerHTML={{ __html: output }}
        />
      )}
    </div>
  );
}

export default HomePage;