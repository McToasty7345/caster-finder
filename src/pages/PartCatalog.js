import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePartContext } from '../context/PartContext';
import { useCompatibilityContext } from '../context/CompatibilityContext';
import PartDetail from '../components/PartDetail';

const PartCatalog = () => {
  const { category: categoryId } = useParams();
  const navigate = useNavigate();
  const { categories, parts, loadPartsForCategory, loading, addToBom } = usePartContext();
  const { selectPart, warnings } = useCompatibilityContext();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredParts, setFilteredParts] = useState([]);
  const [filters, setFilters] = useState({
    material: '',
    size: '',
    type: '',
    competitorPart: ''
  });
  
  const [availableFilters, setAvailableFilters] = useState({
    materials: [],
    sizes: [],
    types: []
  });

  // Part detail modal state
  const [selectedPartForDetail, setSelectedPartForDetail] = useState(null);

  // Advanced search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFields, setSearchFields] = useState({
    name: true,
    description: true,
    material: true,
    partNumber: true,
    competitorParts: true
  });
  
  // Load category and parts on initial render or when categoryId changes
  useEffect(() => {
    if (categories.length > 0) {
      // If categoryId is provided, use it, otherwise use the first category
      const categoryToSelect = categoryId 
        ? categories.find(c => c.id === parseInt(categoryId)) 
        : categories[0];
      
      if (categoryToSelect) {
        setSelectedCategory(categoryToSelect);
        loadPartsForSelectedCategory(categoryToSelect.id);
      }
    }
  }, [categories, categoryId]);
  
  // Load parts for the selected category
  const loadPartsForSelectedCategory = async (catId) => {
    const categoryParts = await loadPartsForCategory(catId);
    setFilteredParts(categoryParts);
    
    // Extract filter options
    if (categoryParts.length > 0) {
      const materials = [...new Set(categoryParts.map(part => part.material).filter(Boolean))];
      const sizes = [...new Set(categoryParts.map(part => part.size).filter(Boolean))];
      const types = [...new Set(categoryParts.map(part => part.type).filter(Boolean))];
      
      setAvailableFilters({
        materials,
        sizes,
        types
      });
    }
    
    // Reset filters
    setFilters({
      material: '',
      size: '',
      type: '',
      competitorPart: ''
    });
    
    // Reset search
    setSearchQuery('');
  };
  
  // Handle category change
  const handleCategoryChange = (categoryId) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    if (category) {
      setSelectedCategory(category);
      loadPartsForSelectedCategory(category.id);
      navigate(`/catalog/${category.id}`);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle search field toggles
  const handleSearchFieldToggle = (field) => {
    setSearchFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Apply filters and search
  useEffect(() => {
    if (selectedCategory && parts[selectedCategory.id]) {
      let results = [...parts[selectedCategory.id]];
      
      // First apply regular filters
      if (filters.material) {
        results = results.filter(part => part.material === filters.material);
      }
      
      if (filters.size) {
        results = results.filter(part => part.size === filters.size);
      }
      
      if (filters.type) {
        results = results.filter(part => part.type === filters.type);
      }
      
      if (filters.competitorPart) {
        results = results.filter(part => 
          part.competitor_parts && 
          part.competitor_parts.some(cp => 
            cp.toLowerCase().includes(filters.competitorPart.toLowerCase())
          )
        );
      }
      
      // Then apply search query if it exists
      if (searchQuery.trim() !== '') {
        results = results.filter(part => {
          const searchTerms = searchQuery.toLowerCase().split(' ');
          
          return searchTerms.every(term => {
            return (
              (searchFields.name && part.name && part.name.toLowerCase().includes(term)) ||
              (searchFields.description && part.description && part.description.toLowerCase().includes(term)) ||
              (searchFields.material && part.material && part.material.toLowerCase().includes(term)) ||
              (searchFields.partNumber && part.internal_part_number && part.internal_part_number.toLowerCase().includes(term)) ||
              (searchFields.competitorParts && 
               part.competitor_parts && 
               part.competitor_parts.some(cp => cp.toLowerCase().includes(term)))
            );
          });
        });
      }
      
      setFilteredParts(results);
    }
  }, [searchQuery, searchFields, filters, selectedCategory, parts]);
  
  // Handle part selection
  const handlePartSelection = (part) => {
    if (selectedCategory) {
      selectPart(selectedCategory.name, part);
    }
  };
  
  // Add to BOM
  const handleAddToBom = (part) => {
    // Add category name to part for better display in BOM
    const partWithCategory = {
      ...part,
      category_name: selectedCategory?.name
    };
    addToBom(partWithCategory);
  };

  // Open part detail view
  const openPartDetail = (part) => {
    setSelectedPartForDetail(part);
  };

  // Close part detail view
  const closePartDetail = () => {
    setSelectedPartForDetail(null);
  };

  // Define dynamic columns based on category
  const getCategorySpecificColumns = () => {
    if (!selectedCategory) return [];
    
    const categoryName = selectedCategory.name;
    let specificColumns = [];
    
    switch (categoryName) {
      case 'Top Hats':
        specificColumns = [
          { header: 'Inner Diameter', key: 'inner_diameter' },
          { header: 'Outer Diameter', key: 'outer_diameter' },
          { header: 'Wheel Type', key: 'wheel_type' },
          { header: 'Axle Size', key: 'axle_size' }
        ];
        break;
      case 'Axles':
        specificColumns = [
          { header: 'Length', key: 'length' },
          { header: 'Thread', key: 'thread_type' },
          { header: 'CIN', key: 'cin' }
        ];
        break;
      case 'Rigs':
        specificColumns = [
          { header: 'Vendor', key: 'vendor' },
          { header: 'Bolt Pattern', key: 'bolt_pattern' },
          { header: 'OAH', key: 'oah' }
        ];
        break;
      case 'Wheels':
        specificColumns = [
          { header: 'Tread', key: 'tread_material' },
          { header: 'Core', key: 'core_material' },
          { header: 'Durometer', key: 'durometer' }
        ];
        break;
      case 'Brakes':
      case 'Swivel Locks':
        specificColumns = [
          { header: 'Vendor', key: 'vendor' }
        ];
        break;
      default:
        break;
    }
    
    return specificColumns;
  };
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Parts Catalog</h1>
        <p className="text-gray-600">Browse and filter parts by category</p>
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
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Category:</label>
          <select
            value={selectedCategory?.id || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Material Filter */}
          {availableFilters.materials.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Material:</label>
              <select 
                className="w-full p-2 border rounded"
                value={filters.material}
                onChange={(e) => handleFilterChange('material', e.target.value)}
              >
                <option value="">All Materials</option>
                {availableFilters.materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Size Filter */}
          {availableFilters.sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Size:</label>
              <select 
                className="w-full p-2 border rounded"
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <option value="">All Sizes</option>
                {availableFilters.sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Type Filter */}
          {availableFilters.types.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Type:</label>
              <select 
                className="w-full p-2 border rounded"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
                {availableFilters.types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Competitor Part Number Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Competitor Part #:</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={filters.competitorPart}
              onChange={(e) => handleFilterChange('competitorPart', e.target.value)}
              placeholder="Search competitor parts..."
            />
          </div>
        </div>
        
        {/* Advanced Search */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Advanced Search</h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={searchFields.name}
                  onChange={() => handleSearchFieldToggle('name')}
                />
                <span className="ml-2 text-sm">Name</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={searchFields.description}
                  onChange={() => handleSearchFieldToggle('description')}
                />
                <span className="ml-2 text-sm">Description</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={searchFields.material}
                  onChange={() => handleSearchFieldToggle('material')}
                />
                <span className="ml-2 text-sm">Material</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={searchFields.partNumber}
                  onChange={() => handleSearchFieldToggle('partNumber')}
                />
                <span className="ml-2 text-sm">Part #</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={searchFields.competitorParts}
                  onChange={() => handleSearchFieldToggle('competitorParts')}
                />
                <span className="ml-2 text-sm">Competitor Parts</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading parts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredParts.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Part Number
</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
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
                    
                    {/* Dynamic category-specific columns */}
                    {getCategorySpecificColumns().map(column => (
                      <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column.header}
                      </th>
                    ))}
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comp. Part #
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParts.map((part) => (
                    <tr key={part.id}>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
  {part.part_number || part.internal_part_number || part.id}
</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.material || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.type || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.size || '-'}
                      </td>
                      
                      {/* Dynamic category-specific columns */}
                      {getCategorySpecificColumns().map(column => (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part[column.key] || '-'}
                        </td>
                      ))}
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.competitor_parts && part.competitor_parts.length > 0
                          ? part.competitor_parts.join(', ')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handlePartSelection(part)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Select
                          </button>
                          <button
                            onClick={() => handleAddToBom(part)}
                            className="text-green-600 hover:text-green-900"
                          >
                            + BOM
                          </button>
                          <button
                            onClick={() => openPartDetail(part)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded">
                <p className="text-gray-500">No parts found. Try adjusting your filters or add new parts.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredParts.length} {filteredParts.length === 1 ? 'part' : 'parts'}
        </div>
      </div>
      
      {/* Part Detail Modal */}
      {selectedPartForDetail && (
        <PartDetail 
          part={selectedPartForDetail}
          category={selectedCategory?.name}
          onClose={closePartDetail}
        />
      )}
    </div>
  );
};

export default PartCatalog;