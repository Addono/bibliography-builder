import React, { useState, useEffect } from 'react';

type StyleType = 'built-in' | 'custom';
type BuiltInStyle = 'apa' | 'vancouver' | 'harvard1';

interface StyleSelectorProps {
  onStyleChange: (newStyle: string) => void;
}

export default function StyleSelector({ onStyleChange }: StyleSelectorProps) {
  const [styleType, setStyleType] = useState<StyleType>('built-in');
  const [selectedStyle, setSelectedStyle] = useState<BuiltInStyle>('apa');
  const [cslFile, setCslFile] = useState<File | null>(null);

  useEffect(() => {
    if (styleType === 'built-in') {
      onStyleChange(selectedStyle);
    } else if (cslFile) {
      onStyleChange(cslFile.name);
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
            value={selectedStyle}
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
