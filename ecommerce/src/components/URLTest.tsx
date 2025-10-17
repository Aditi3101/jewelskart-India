import React from 'react';
import { createSlug, slugToName } from '../utils/urlUtils';

const URLTest: React.FC = () => {
  const testCases = [
    "925 Sterling Silver",
    "Necklace & Pendants",
    "Eternity Necklace",
    "Special Characters!@#$%",
    "Multiple   Spaces",
    "Bags"
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h3>URL Utility Test</h3>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Original</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Slug</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Back to Name</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((name, i) => {
            const slug = createSlug(name);
            const backToName = slugToName(slug);
            return (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{name}</td>
                <td style={{ padding: '10px', color: 'blue' }}>{slug}</td>
                <td style={{ padding: '10px', color: 'green' }}>{backToName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default URLTest;