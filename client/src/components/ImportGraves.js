import React, { useState } from 'react';
import { importGraves } from '../utils/importGraves';
import './ImportGraves.css';

const ImportGraves = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    setLoading(true);
    setMessage('Importing graves...');
    try {
      await importGraves();
      setMessage('Graves imported successfully!');
    } catch (error) {
      setMessage('Error importing graves: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-graves">
      <button 
        onClick={handleImport} 
        disabled={loading}
        className="import-button"
      >
        {loading ? 'Importing...' : 'Import Graves'}
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ImportGraves; 