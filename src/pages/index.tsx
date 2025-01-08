import React, { useState, useEffect } from 'react';
import { Spinner } from '../components/Spinner';
import {
  UnsupportedCslError,
  groupAndSortCitations,
  generateBibliography
} from '../lib/businessLogic';
import StyleSelector from '../components/StyleSelector';

function HomePage() {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>('apa');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function generateOutput() {
      try {
        if (!jsonFile || !selectedStyle) return;
        setIsLoading(true);
        const jsonData = await jsonFile.text();
        const cslData = JSON.parse(jsonData);
        const { groups, sortedKeys } = groupAndSortCitations(cslData);
        const result = await generateBibliography(groups, sortedKeys, selectedStyle);
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

    generateOutput();
  }, [jsonFile, selectedStyle]);

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