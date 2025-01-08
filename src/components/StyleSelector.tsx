import React, { useState, useEffect } from 'react';
import { registerCustomTemplateFromFile } from '../lib/businessLogic';

type StyleType = 'built-in' | 'custom';
type BuiltInStyle = 'apa' | 'vancouver' | 'harvard1';
type CustomStyle = string;

interface StyleSelectorProps {
  onStyleChange: (newStyle: string | null) => void;
}

export default function StyleSelector({ onStyleChange }: StyleSelectorProps) {
  const [styleType, setStyleType] = useState<StyleType>('built-in');
  const [selectedStyle, setSelectedStyle] = useState<BuiltInStyle | CustomStyle | null>('apa');
  const [cslFile, setCslFile] = useState<File | null>(null);

  useEffect(() => {
    if (styleType === 'built-in') {
      onStyleChange(selectedStyle);
    } else if (cslFile) {
      // Infer the style from the file name
      registerCustomTemplateFromFile(cslFile)
        .then(onStyleChange);
    } else {
      onStyleChange(null);
    }
  }, [styleType, selectedStyle, cslFile, onStyleChange]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="style-type" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Citation Style Type:
      </label>
      <select
        id="style-type"
        value={styleType}
        onChange={(e) => setStyleType(e.target.value as StyleType)}
        style={{ marginBottom: '0.5rem' }}
      >
        <option value="built-in">Built-in Style</option>
        <option value="custom">Custom CSL File</option>
      </select>

      {styleType === 'built-in' ? (
        <div>
          <label htmlFor="built-in-style" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Select Style:
          </label>
          <select
            id="built-in-style"
            value={selectedStyle || ''}
            onChange={(e) => setSelectedStyle(e.target.value as BuiltInStyle)}
          >
            <option value="apa">APA</option>
            <option value="vancouver">Vancouver</option>
            <option value="harvard1">Harvard</option>
          </select>
        </div>
      ) : (
        <div>
          <label htmlFor="csl-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Custom CSL file:
          </label>
          <input
            id="csl-input"
            type="file"
            accept=".csl"
            onChange={(e) => setCslFile(e.target.files?.[0] || null)}
          />
        </div>
      )}
    </div>
  );
}
