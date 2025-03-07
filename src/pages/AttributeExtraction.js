import React, { useState } from 'react';
import { usePartContext } from '../context/PartContext';

const AttributeExtraction = () => {
  const { extractPartAttributes } = usePartContext();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const handleExtraction = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const stats = await extractPartAttributes();
      setResults(stats);
    } catch (err) {
      console.error('Extraction error:', err);
      setError(err.message || 'An error occurred during attribute extraction');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Part Attributes Extraction</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          This tool automatically extracts attributes like material, type, and size from part numbers and names.
          It analyzes parts that have been categorized but don't have these attributes filled in.
        </p>
        
        <button
          onClick={handleExtraction}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Extract Attributes'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {results && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
          <h2 className="font-semibold mb-2">Extraction Complete!</h2>
          <ul className="list-disc pl-5">
            <li>Total parts processed: {results.total}</li>
            <li>Parts updated: {results.updated}</li>
            <li>Material detected: {results.withMaterial}</li>
            <li>Type detected: {results.withType}</li>
            <li>Size detected: {results.withSize}</li>
          </ul>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded border">
        <h2 className="font-semibold mb-2">How It Works</h2>
        <p className="text-sm text-gray-600 mb-2">
          The extraction tool uses pattern matching to identify attributes from your part numbers and descriptions:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li>
            <strong>Material Detection:</strong> Looks for patterns like "STL" (Steel), "PUR" (Polyurethane), etc.
          </li>
          <li>
            <strong>Type Detection:</strong> Identifies part types based on the category and patterns like "SWV" (Swivel), "RGD" (Rigid)
          </li>
          <li>
            <strong>Size Detection:</strong> Extracts dimensions like "4-inch", "5" or "1/2-inch"
          </li>
          <li>
            <strong>Bearing Type:</strong> For wheels, detects bearing types like "Roller", "Ball Bearing", etc.
          </li>
        </ul>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-semibold mb-1">Additional Notes</h3>
        <ul className="list-disc pl-5">
          <li>Parts must be categorized before attributes can be extracted</li>
          <li>The tool processes up to 100 parts each time you run it</li>
          <li>You can run the tool multiple times to process all parts</li>
          <li>If the automatic extraction doesn't identify all attributes, you can manually edit parts in the catalog</li>
        </ul>
      </div>
    </div>
  );
};

export default AttributeExtraction;