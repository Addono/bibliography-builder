import React, { useState } from 'react';
import { Spinner } from '../components/Spinner';
import {
  UnsupportedCslError,
  groupAndSortCitations,
  generateBibliography
} from '../lib/businessLogic';
import StyleSelector from '../components/StyleSelector';

function HomePage() {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('apa');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    try {
      if (!jsonFile) return;
      setIsLoading(true);
      const jsonData = await jsonFile.text();
      const cslData = JSON.parse(jsonData);
      const { groups, sortedKeys } = groupAndSortCitations(cslData);

      const templateName: string = selectedStyle;

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
        
        <StyleSelector
          onStyleChange={setSelectedStyle}
        />

        <button 
          onClick={handleGenerate} 
          disabled={isLoading || !jsonFile}
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