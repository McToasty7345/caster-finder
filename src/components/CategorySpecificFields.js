// src/components/CategorySpecificFields.js
import React from 'react';

const CategorySpecificFields = ({ categoryName, formData, handleChange, handleArrayChange }) => {
  // No category selected yet
  if (!categoryName) return null;

  // Helper for array field update
  const updateArrayField = (field, index, value) => {
    handleArrayChange(field, index, value);
  };

  // Helper for adding array item
  const addArrayItem = (field) => {
    handleArrayChange(field, -1, ''); // -1 index signals to add a new item
  };

  // Helper for removing array item
  const removeArrayItem = (field, index) => {
    handleArrayChange(field, index, null); // null value signals to remove the item
  };

  // Render appropriate fields based on category
  switch (categoryName) {
    case 'Top Hats':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Inner Diameter</label>
            <input
              type="text"
              name="inner_diameter"
              value={formData.inner_diameter || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Outer Diameter</label>
            <input
              type="text"
              name="outer_diameter"
              value={formData.outer_diameter || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Wheel Type</label>
            <input
              type="text"
              name="wheel_type"
              value={formData.wheel_type || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Axle Size</label>
            <input
              type="text"
              name="axle_size"
              value={formData.axle_size || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <input
              type="text"
              name="length"
              value={formData.length || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      );

    case 'Axles':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <input
              type="text"
              name="length"
              value={formData.length || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Thread Type</label>
            <input
              type="text"
              name="thread_type"
              value={formData.thread_type || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CIN</label>
            <input
              type="text"
              name="cin"
              value={formData.cin || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      );

    case 'Rigs':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vendor</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Top Plate</label>
            <input
              type="text"
              name="top_plate"
              value={formData.top_plate || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Threaded Stem</label>
            <input
              type="text"
              name="threaded_stem"
              value={formData.threaded_stem || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Expanded Adapter</label>
            <input
              type="text"
              name="expanded_adapter"
              value={formData.expanded_adapter || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bolt Pattern</label>
            <input
              type="text"
              name="bolt_pattern"
              value={formData.bolt_pattern || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Axle</label>
            <input
              type="text"
              name="axle_size"
              value={formData.axle_size || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Overall Height (OAH)</label>
            <input
              type="text"
              name="oah"
              value={formData.oah || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      );

    case 'Wheels':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tread Material</label>
            <input
              type="text"
              name="tread_material"
              value={formData.tread_material || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Core Material</label>
            <input
              type="text"
              name="core_material"
              value={formData.core_material || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CIN</label>
            <input
              type="text"
              name="cin"
              value={formData.cin || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Durometer</label>
            <input
              type="text"
              name="durometer"
              value={formData.durometer || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Temperature Range</label>
            <input
              type="text"
              name="temperature_range"
              value={formData.temperature_range || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      );

    case 'Brakes':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vendor</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Compatible Rigs Array */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Compatible Rigs</label>
            {formData.compatible_rigs && formData.compatible_rigs.map((rig, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={rig}
                  onChange={(e) => updateArrayField('compatible_rigs', index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter compatible rig part number"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('compatible_rigs', index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('compatible_rigs')}
              className="mt-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Add Compatible Rig
            </button>
          </div>
        </div>
      );

    case 'Swivel Locks':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Compatible Rigs Array */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Compatible Rigs</label>
            {formData.compatible_rigs && formData.compatible_rigs.map((rig, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={rig}
                  onChange={(e) => updateArrayField('compatible_rigs', index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter compatible rig part number"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('compatible_rigs', index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('compatible_rigs')}
              className="mt-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Add Compatible Rig
            </button>
          </div>
        </div>
      );

    case 'Thread Guards':
    case 'Toe Guards':
    case 'Brush Guards':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Compatible Wheels Array */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Compatible Wheels</label>
            {formData.compatible_wheels && formData.compatible_wheels.map((wheel, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={wheel}
                  onChange={(e) => updateArrayField('compatible_wheels', index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter compatible wheel part number or size"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('compatible_wheels', index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('compatible_wheels')}
              className="mt-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Add Compatible Wheel
            </button>
          </div>
        </div>
      );

    case 'Raceway Seals':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Compatible Rigs Array */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Compatible Rigs</label>
            {formData.compatible_rigs && formData.compatible_rigs.map((rig, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={rig}
                  onChange={(e) => updateArrayField('compatible_rigs', index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter compatible rig part number"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('compatible_rigs', index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('compatible_rigs')}
              className="mt-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Add Compatible Rig
            </button>
          </div>
        </div>
      );

    case 'Shim Plate':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <input
              type="text"
              name="length"
              value={formData.length || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Width</label>
            <input
              type="text"
              name="width"
              value={formData.width || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Height</label>
            <input
              type="text"
              name="height"
              value={formData.height || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bolt Hole Size</label>
            <input
              type="text"
              name="bolt_hole_size"
              value={formData.bolt_hole_size || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bolt Hole Pattern</label>
            <input
              type="text"
              name="bolt_hole_pattern"
              value={formData.bolt_hole_pattern || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Compatible Rigs Array */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Compatible Rigs</label>
            {formData.compatible_rigs && formData.compatible_rigs.map((rig, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={rig}
                  onChange={(e) => updateArrayField('compatible_rigs', index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter compatible rig part number"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('compatible_rigs', index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('compatible_rigs')}
              className="mt-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Add Compatible Rig
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default CategorySpecificFields;