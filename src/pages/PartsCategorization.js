import React, { useState, useEffect } from 'react';
import { usePartContext } from '../context/PartContext';
import { supabase } from '../services/supabase';

const PartsCategorization = () => {
  const { categories } = usePartContext();
  const [uncategorizedParts, setUncategorizedParts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({ categorized: 0, remaining: 0 });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  const partsPerPage = 10;
  
  useEffect(() => {
    loadUncategorizedParts();
  }, [currentPage]);
  
  const loadUncategorizedParts = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Load parts without categories
      const { data: parts, error: partsError, count } = await supabase
        .from('parts')
        .select('*', { count: 'exact' })
        .is('category_id', null)
        .order('id')
        .range((currentPage - 1) * partsPerPage, currentPage * partsPerPage - 1);
      
      if (partsError) throw partsError;
      
      // Get the total count of uncategorized parts
      const { count: totalCount } = await supabase
        .from('parts')
        .select('*', { count: 'exact', head: true })
        .is('category_id', null);
      
      setUncategorizedParts(parts || []);
      setStats({
        categorized: 0,
        remaining: totalCount
      });
    } catch (err) {
      console.error('Error loading uncategorized parts:', err);
      setError('Failed to load uncategorized parts');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategorySelect = (partId, categoryId) => {
    setSelectedCategory(prev => ({
      ...prev,
      [partId]: categoryId
    }));
  };
  
  const updatePartCategory = async (partId, categoryId) => {
    setProcessing(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const { error: updateError } = await supabase
        .from('parts')
        .update({ category_id: categoryId })
        .eq('id', partId);
      
      if (updateError) throw updateError;
      
      // Success - remove from list
      setUncategorizedParts(prev => prev.filter(part => part.id !== partId));
      
      // Update stats
      setStats(prev => ({
        categorized: prev.categorized + 1,
        remaining: prev.remaining - 1
      }));
      
      setSuccessMessage(`Part ${partId} categorized successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Error updating part category:', err);
      setError(`Failed to update part ${partId}`);
    } finally {
      setProcessing(false);
    }
  };
  
  const bulkUpdateCategories = async () => {
    if (!selectedCategory || Object.keys(selectedCategory).length === 0) {
      setError('No categories selected');
      return;
    }
    
    setProcessing(true);
    setError('');
    setSuccessMessage('');
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      // Process each selected part
      for (const [partId, categoryId] of Object.entries(selectedCategory)) {
        const { error: updateError } = await supabase
          .from('parts')
          .update({ category_id: categoryId })
          .eq('id', partId);
        
        if (updateError) {
          errorCount++;
        } else {
          successCount++;
        }
      }
      
      // Reload parts list
      await loadUncategorizedParts();
      
      // Clear selections
      setSelectedCategory({});
      
      // Show success message
      setSuccessMessage(`Successfully categorized ${successCount} parts${errorCount > 0 ? `, ${errorCount} errors` : ''}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Error in bulk update:', err);
      setError('Failed to process bulk update');
    } finally {
      setProcessing(false);
    }
  };
  
  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
  };
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Parts Categorization</h1>
        <p className="text-gray-600">Assign categories to uncategorized parts</p>
      </div>
      
      {error && (
        <div className="p-4 mx-6 mt-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="p-4 mx-6 mt-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Uncategorized Parts</h2>
            <p className="text-sm text-gray-500">
              {stats.remaining} parts need categorization
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={bulkUpdateCategories}
              disabled={!selectedCategory || Object.keys(selectedCategory).length === 0 || processing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {processing ? 'Processing...' : 'Apply Selected Categories'}
            </button>
            
            <button
              onClick={() => loadUncategorizedParts()}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading parts...</p>
          </div>
        ) : (
          <>
            {uncategorizedParts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Part ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uncategorizedParts.map((part) => (
                      <tr key={part.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {part.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part.name || part.part_number || part.internal_part_number || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part.vendor || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part.avg_monthly_usage ? Number(part.avg_monthly_usage).toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={selectedCategory?.[part.id] || ''}
                            onChange={(e) => handleCategorySelect(part.id, e.target.value)}
                            className="w-full p-2 border rounded"
                          >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => updatePartCategory(part.id, selectedCategory?.[part.id])}
                            disabled={!selectedCategory?.[part.id] || processing}
                            className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded">
                <p className="text-gray-500">No uncategorized parts found.</p>
              </div>
            )}
            
            {/* Pagination */}
            {uncategorizedParts.length > 0 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-500">
                  Page {currentPage}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={uncategorizedParts.length < partsPerPage || loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PartsCategorization;