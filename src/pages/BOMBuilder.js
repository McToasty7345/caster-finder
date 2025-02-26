import React, { useState } from 'react';
import { usePartContext } from '../context/PartContext';
import { useCompatibilityContext } from '../context/CompatibilityContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const BOMBuilder = () => {
  const { bomItems, removeFromBom, updateBomItemQuantity, clearBom } = usePartContext();
  const { warnings, checkCompatibility } = useCompatibilityContext();
  const [bomName, setBomName] = useState('New BOM');
  
  // Calculate totals
  const totalItems = bomItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Generate PDF report
  const generatePDF = async () => {
    const input = document.getElementById('bom-report');
    
    if (!input) return;
    
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${bomName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };
  
  // Generate CSV
  const generateCSV = () => {
    if (bomItems.length === 0) return;
    
    // Create CSV header
    let csv = 'Part Number,Name,Category,Material,Type,Size,Quantity\n';
    
    // Add each BOM item
    bomItems.forEach(item => {
      const row = [
        item.internal_part_number || item.id,
        item.name,
        item.category_name || '',
        item.material || '',
        item.type || '',
        item.size || '',
        item.quantity
      ].map(value => `"${value}"`).join(',');
      
      csv += row + '\n';
    });
    
    // Create and download CSV file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${bomName.replace(/\s+/g, '-').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Bill of Materials Builder</h1>
        <p className="text-gray-600">Build and export your BOM report</p>
      </div>
      
      {warnings.length > 0 && (
        <div className="p-4 mx-6 mt-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-medium text-yellow-800">Compatibility Warnings:</h3>
          <ul className="ml-5 mt-2 list-disc text-yellow-700">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 mr-4">
            <label htmlFor="bom-name" className="block text-sm font-medium mb-1">BOM Name</label>
            <input
              type="text"
              id="bom-name"
              className="w-full p-2 border rounded"
              value={bomName}
              onChange={(e) => setBomName(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={generatePDF}
              disabled={bomItems.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Export PDF
            </button>
            <button
              onClick={generateCSV}
              disabled={bomItems.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              Export CSV
            </button>
            <button
              onClick={clearBom}
              disabled={bomItems.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div id="bom-report">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{bomName}</h2>
            <p className="text-sm text-gray-500">Created: {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Total Items: {totalItems}</p>
          </div>
          
          {bomItems.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Part Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bomItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.internal_part_number || item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.material || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.size || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateBomItemQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeFromBom(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded">
              <p className="text-gray-500">No items in BOM yet. Add items from the Part Catalog.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BOMBuilder;