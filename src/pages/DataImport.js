import React, { useState, useRef } from 'react';
import { usePartContext } from '../context/PartContext';
import * as XLSX from 'xlsx';

const DataImport = () => {
  const { importPartsFromExcel } = usePartContext();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [importStats, setImportStats] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(null);
    setImportStats(null);
    setError(null);

    if (selectedFile) {
      // Preview the file data
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Show preview of first 5 rows
          setPreview({
            total: jsonData.length,
            sample: jsonData.slice(0, 5)
          });
        } catch (err) {
          setError("Error reading Excel file. Please make sure it's a valid .xlsx file.");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Use the context function to import data
          const stats = await importPartsFromExcel(jsonData);
          setImportStats(stats);
          
          // Clear file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setFile(null);
        } catch (err) {
          console.error("Import error:", err);
          setError("Error processing Excel file: " + err.message);
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError("Error reading file");
        setLoading(false);
      };
      
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("Error importing data: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Import Parts Data</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Upload an Excel file containing parts data to import into the system. 
          The file should include columns for part number, vendor, and usage information.
        </p>
        
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
          
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Importing...' : 'Import Data'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {preview && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">File Preview</h2>
          <p className="text-sm text-gray-600 mb-2">
            Found {preview.total} rows in the Excel file. Here's a sample:
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview.sample[0] || {}).map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.sample.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {value?.toString() || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {importStats && (
        <div className="p-4 bg-green-100 text-green-700 rounded">
          <h2 className="font-semibold mb-2">Import Complete!</h2>
          <ul>
            <li>Total rows processed: {importStats.total}</li>
            <li>Parts created: {importStats.created}</li>
            <li>Parts updated: {importStats.updated}</li>
            {importStats.errors > 0 && (
              <li>Errors: {importStats.errors}</li>
            )}
          </ul>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-semibold mb-1">Expected Format</h3>
        <p>Your Excel file should have columns for:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Primary Vendor</li>
          <li>Part Number</li>
          <li>Total Rolling 12 Months</li>
          <li>Average Monthly Usage Rolling12</li>
        </ul>
      </div>
    </div>
  );
};

export default DataImport;