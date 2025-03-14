import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartContext } from '../context/PartContext';
import { supabase } from '../services/supabase';
import CategorySpecificFields from '../components/CategorySpecificFields';

const AddPartForm = () => {
  const navigate = useNavigate();
  const { categories, addPart, generatePartNumber } = usePartContext();
  
  const [formData, setFormData] = useState({
    part_number: '',
    category_id: '',
    name: '',
    description: '',
    material: '',
    size: '',
    type: '',
    load_capacity: '',
    bearing_type: '',
    requires_zerk_axle: false,
    requires_stainless_components: false,
    other_requirements: '',
    competitor_parts: [''],
    internal_part_number: '',
    // New array fields
    compatible_wheels: [''],
    compatible_rigs: ['']
  });
  
  const [dbConnectionStatus, setDbConnectionStatus] = useState({
    testing: false,
    status: 'unknown' // 'unknown', 'success', 'error'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  
  // Materials and types options
  const materialOptions = [
    'Steel', 'Stainless Steel', 'Polyurethane', 'Rubber', 
    'Nylon', 'Cast Iron', 'Aluminum', 'Zinc', 'Plastic'
  ];
  
  const typeOptions = {
    'Wheels': ['Standard', 'Soft Tread', 'High Temp', 'Heavy Duty'],
    'Rigs': ['Swivel', 'Rigid'],
    'Axles': ['Threaded', 'Smooth', 'Kingpin', 'Zerk'],
    'Brakes': ['Total Lock', 'Face Contact', 'Side Lock'],
    'Swivel Locks': ['Cam', 'Pin', 'Position Lock'],
    'Top Hats': ['Standard', 'Heavy Duty', 'Lightweight']
  };
  
  const bearingOptions = ['Plain Bore', 'Roller', 'Ball Bearing', 'Precision'];
  
  // Test database connection
  const testDatabaseConnection = async () => {
    setDbConnectionStatus({ testing: true, status: 'unknown' });
    
    try {
      // Try to fetch a single category as a simple test
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(1);
        
      if (error) throw error;
      
      setDbConnectionStatus({ 
        testing: false, 
        status: 'success',
        message: 'Successfully connected to Supabase!'
      });
      
      setTimeout(() => {
        setDbConnectionStatus(prev => ({ ...prev, status: 'unknown' }));
      }, 3000);
    } catch (err) {
      setDbConnectionStatus({ 
        testing: false, 
        status: 'error',
        message: `Connection error: ${err.message}`
      });
    }
  };
  
  // Generate part number when certain fields change
  useEffect(() => {
    if (formData.category_id && formData.material && formData.type) {
      const category = categories.find(c => c.id === parseInt(formData.category_id))?.name;
      if (category) {
        const partNumber = generatePartNumber(
          category,
          formData.material,
          formData.type,
          formData.size
        );
        setFormData(prev => ({ ...prev, internal_part_number: partNumber }));
      }
    }
  }, [formData.category_id, formData.material, formData.type, formData.size, categories, generatePartNumber]);
  
  // Update selected category name when category changes
  useEffect(() => {
    if (formData.category_id) {
      const category = categories.find(c => c.id === parseInt(formData.category_id));
      setSelectedCategoryName(category?.name || '');
    } else {
      setSelectedCategoryName('');
    }
  }, [formData.category_id, categories]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle competitor part number changes
  const handleCompetitorPartChange = (index, value) => {
    const updatedCompetitorParts = [...formData.competitor_parts];
    updatedCompetitorParts[index] = value;
    setFormData(prev => ({ ...prev, competitor_parts: updatedCompetitorParts }));
  };
  
  // Add another competitor part field
  const addCompetitorPartField = () => {
    setFormData(prev => ({
      ...prev,
      competitor_parts: [...prev.competitor_parts, '']
    }));
  };
  
  // Remove competitor part field
  const removeCompetitorPartField = (index) => {
    const updatedCompetitorParts = [...formData.competitor_parts];
    updatedCompetitorParts.splice(index, 1);
    setFormData(prev => ({ ...prev, competitor_parts: updatedCompetitorParts }));
  };
  
  // Handle array field changes (for compatible parts, etc.)
  const handleArrayChange = (field, index, value) => {
    if (value === null) {
      // Remove item
      const updatedArray = [...formData[field]];
      updatedArray.splice(index, 1);
      setFormData(prev => ({ ...prev, [field]: updatedArray }));
    } else if (index === -1) {
      // Add new item
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }));
    } else {
      // Update existing item
      const updatedArray = [...formData[field]];
      updatedArray[index] = value;
      setFormData(prev => ({ ...prev, [field]: updatedArray }));
    }
  };
  
// Form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    // Filter out empty values from array fields
    const filteredCompetitorParts = formData.competitor_parts.filter(part => part.trim() !== '');
    const filteredCompatibleWheels = formData.compatible_wheels.filter(wheel => wheel.trim() !== '');
    const filteredCompatibleRigs = formData.compatible_rigs.filter(rig => rig.trim() !== '');
    
    // Create submission data with explicit part_number as ID
    const submissionData = {
      ...formData,
      competitor_parts: filteredCompetitorParts,
      compatible_wheels: filteredCompatibleWheels,
      compatible_rigs: filteredCompatibleRigs
    };
    
    // Explicitly set the ID to be the manufacturer part number
    submissionData.id = formData.part_number;
    
    // Log to verify what's being sent
    console.log('Submitting part with ID:', submissionData.id);
    
    // Add part to database
    const result = await addPart(submissionData);
    
    if (result.success) {
      setSuccess(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          part_number: '',
          category_id: '',
          name: '',
          description: '',
          material: '',
          size: '',
          type: '',
          load_capacity: '',
          bearing_type: '',
          requires_zerk_axle: false,
          requires_stainless_components: false,
          other_requirements: '',
          competitor_parts: [''],
          internal_part_number: '',
          compatible_wheels: [''],
          compatible_rigs: ['']
        });
        setSuccess(false);
        navigate('/catalog');
      }, 2000);
    } else {
      setError(result.error.message || 'Failed to add part');
    }
  } catch (err) {
    setError('An unexpected error occurred');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Part</h1>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6">
          <button
            type="button"
            onClick={testDatabaseConnection}
            disabled={dbConnectionStatus.testing}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
          >
            {dbConnectionStatus.testing ? 'Testing Connection...' : 'Test Database Connection'}
          </button>
          
          {dbConnectionStatus.status === 'success' && (
            <div className="mt-2 p-2 bg-green-100 text-green-700 rounded">
              {dbConnectionStatus.message}
            </div>
          )}
          
          {dbConnectionStatus.status === 'error' && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
              {dbConnectionStatus.message}
            </div>
          )}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
          Part added successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
      <div>
  <label className="block text-sm font-medium mb-2">Manufacturer Part Number*</label>
  <input
    type="text"
    name="part_number"
    value={formData.part_number}
    onChange={handleChange}
    className="w-full p-2 border rounded"
    required
    placeholder="e.g. CCAPEX-325-3/8"
  />
  <p className="text-xs text-gray-500 mt-1">
    Enter the manufacturer's actual part number. This will be used as the primary identifier.
  </p>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category*</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Part Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Part Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          {/* Material */}
          <div>
            <label className="block text-sm font-medium mb-2">Material*</label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Material</option>
              {materialOptions.map(material => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>
          
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type*</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={!formData.category_id}
            >
              <option value="">Select Type</option>
              {formData.category_id && 
               categories.find(c => c.id === parseInt(formData.category_id)) &&
               typeOptions[categories.find(c => c.id === parseInt(formData.category_id)).name] ? 
                typeOptions[categories.find(c => c.id === parseInt(formData.category_id)).name].map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )) : 
                <option value="">Select Category First</option>
              }
            </select>
          </div>
          
          {/* Size */}
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 4-inch, 3/8-inch, etc."
            />
          </div>
          
          {/* Load Capacity */}
          <div>
            <label className="block text-sm font-medium mb-2">Load Capacity</label>
            <input
              type="text"
              name="load_capacity"
              value={formData.load_capacity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 500 lbs"
            />
          </div>
          // Add this to your AddPartForm component
<div className="col-span-2 mt-4">
  <label className="block text-sm font-medium mb-2">Image URL</label>
  <input
    type="text"
    name="image_url"
    value={formData.image_url || ''}
    onChange={handleChange}
    className="w-full p-2 border rounded"
    placeholder="https://example.com/images/part-image.jpg"
  />
  <p className="text-xs text-gray-500 mt-1">
    Enter a URL to an image of this part. Recommended image size: 500x500 pixels.
  </p>
</div>
          {/* Bearing Type (only for Wheels) */}
          {formData.category_id && 
           categories.find(c => c.id === parseInt(formData.category_id))?.name === 'Wheels' && (
            <div>
              <label className="block text-sm font-medium mb-2">Bearing Type</label>
              <select
                name="bearing_type"
                value={formData.bearing_type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Bearing Type</option>
                {bearingOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Internal Part Number (auto-generated but can be edited) */}
          <div>
            <label className="block text-sm font-medium mb-2">Internal Part Number</label>
            <input
              type="text"
              name="internal_part_number"
              value={formData.internal_part_number}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-generated based on category, material, and type
            </p>
          </div>
        </div>
        
        {/* Description */}
        <div className="col-span-2 mt-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24"
            placeholder="Enter part description"
          ></textarea>
        </div>
        
        {/* Category-specific fields */}
        {selectedCategoryName && (
          <div className="col-span-2 mt-6">
            <h3 className="text-lg font-semibold mb-4">{selectedCategoryName} Specific Details</h3>
            <CategorySpecificFields 
              categoryName={selectedCategoryName}
              formData={formData}
              handleChange={handleChange}
              handleArrayChange={handleArrayChange}
            />
          </div>
        )}
        
        {/* Special Requirements */}
        <div className="col-span-2 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Show Zerk Axle requirement checkbox for wheels with roller bearings */}
          {formData.category_id && 
           categories.find(c => c.id === parseInt(formData.category_id))?.name === 'Wheels' && 
           formData.bearing_type === 'Roller' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requires-zerk-axle"
                name="requires_zerk_axle"
                checked={formData.requires_zerk_axle}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="requires-zerk-axle" className="ml-2 text-sm">
                Requires Zerk Axle
              </label>
            </div>
          )}
          
          {/* Show Stainless Components checkbox for Rigs */}
          {formData.category_id && 
           categories.find(c => c.id === parseInt(formData.category_id))?.name === 'Rigs' && 
           formData.material === 'Stainless Steel' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requires-stainless-components"
                name="requires_stainless_components"
                checked={formData.requires_stainless_components}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="requires-stainless-components" className="ml-2 text-sm">
                Requires Stainless Components
              </label>
            </div>
          )}
        </div>
        
        {/* Other Requirements */}
        <div className="col-span-2 mt-4">
          <label className="block text-sm font-medium mb-2">Other Requirements</label>
          <textarea
            name="other_requirements"
            value={formData.other_requirements}
            onChange={handleChange}
            className="w-full p-2 border rounded h-16"
            placeholder="Enter any additional requirements"
          ></textarea>
        </div>
        
        {/* Competitor Part Numbers */}
        <div className="col-span-2 mt-4">
          <label className="block text-sm font-medium mb-2">Competitor Part Numbers</label>
          {formData.competitor_parts.map((part, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={part}
                onChange={(e) => handleCompetitorPartChange(index, e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Enter competitor part number"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeCompetitorPartField(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCompetitorPartField}
            className="mt-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Add Competitor Part
          </button>
        </div>
        
        {/* Submit Button */}
        <div className="col-span-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Adding Part...' : 'Add Part'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPartForm;