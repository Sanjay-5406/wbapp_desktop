'use client';
import { useState } from 'react';

export default function DesktopPage() {
  const [output, setOutput] = useState('');

  // Run terminal command
  const handleRunCommand = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.runCommand('dir'); // Use 'ls' on Mac/Linux
      setOutput(result.success ? result.output : result.error);
    } else {
      setOutput('Not running inside Electron environment.');
    }
  };

  // Download file online
  const handleDownload = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.downloadFile(
        'https://via.placeholder.com/150',
        './downloaded-image.png'
      );
      alert(result.message || result.error);
    }
  };
  console.log("Working...")
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Next.js Desktop App</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <button onClick={handleRunCommand}>Run Terminal Command</button>
        <button onClick={handleDownload}>Download File</button>
      </div>

      <pre style={{ background: '#1e1e1e', color: '#fff', padding: '1rem', borderRadius: '8px' }}>
        {output || 'Output will show here...'}
      </pre>
    </div>
  );
}