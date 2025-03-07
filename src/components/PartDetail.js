import React from 'react';
import { usePartContext } from '../context/PartContext';
import { useCompatibilityContext } from '../context/CompatibilityContext';

const PartDetail = ({ part, onClose, category }) => {
  const { addToBom } = usePartContext();
  const { selectPart } = useCompatibilityContext();
  
  if (!part) return null;
  
  const handleAddToBom = () => {
    // Add category name to part for better display in BOM
    const partWithCategory = {
      ...part,
      category_name: category
    };
    addToBom(partWithCategory);
  };
  
  const handleSelectPart = () => {
    selectPart(category, part);
    onClose();
  };

  // Generate category-specific detail fields
  const renderCategorySpecificDetails = () => {
    switch (category) {
      case 'Top Hats':
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">Top Hat Details</h3>
            <table className="w-full border-collapse">
              <tbody>
                {part.inner_diameter && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Inner Diameter:</td>
                    <td className="py-2">{part.inner_diameter}</td>
                  </tr>
                )}
                {part.outer_diameter && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Outer Diameter:</td>
                    <td className="py-2">{part.outer_diameter}</td>
                  </tr>
                )}
                {part.wheel_type && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Wheel Type:</td>
                    <td className="py-2">{part.wheel_type}</td>
                  </tr>
                )}
                {part.axle_size && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Axle Size:</td>
                    <td className="py-2">{part.axle_size}</td>
                  </tr>
                )}
                {part.length && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Length:</td>
                    <td className="py-2">{part.length}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );
      
      case 'Axles':
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">Axle Details</h3>
            <table className="w-full border-collapse">
              <tbody>
                {part.length && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Length:</td>
                    <td className="py-2">{part.length}</td>
                  </tr>
                )}
                {part.thread_type && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Thread Type:</td>
                    <td className="py-2">{part.thread_type}</td>
                  </tr>
                )}
                {part.cin && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">CIN:</td>
                    <td className="py-2">{part.cin}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );
      
      case 'Rigs':
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">Rig Details</h3>
            <table className="w-full border-collapse">
              <tbody>
                {part.vendor && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Vendor:</td>
                    <td className="py-2">{part.vendor}</td>
                  </tr>
                )}
                {part.top_plate && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Top Plate:</td>
                    <td className="py-2">{part.top_plate}</td>
                  </tr>
                )}
                {part.threaded_stem && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Threaded Stem:</td>
                    <td className="py-2">{part.threaded_stem}</td>
                  </tr>
                )}
                {part.expanded_adapter && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Expanded Adapter:</td>
                    <td className="py-2">{part.expanded_adapter}</td>
                  </tr>
                )}
                {part.bolt_pattern && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Bolt Pattern:</td>
                    <td className="py-2">{part.bolt_pattern}</td>
                  </tr>
                )}
                {part.axle_size && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Axle:</td>
                    <td className="py-2">{part.axle_size}</td>
                  </tr>
                )}
                {part.oah && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Overall Height (OAH):</td>
                    <td className="py-2">{part.oah}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );
      
      case 'Wheels':
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">Wheel Details</h3>
            <table className="w-full border-collapse">
              <tbody>
                {part.tread_material && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Tread Material:</td>
                    <td className="py-2">{part.tread_material}</td>
                  </tr>
                )}
                {part.core_material && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Core Material:</td>
                    <td className="py-2">{part.core_material}</td>
                  </tr>
                )}
                {part.cin && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">CIN:</td>
                    <td className="py-2">{part.cin}</td>
                  </tr>
                )}
                {part.durometer && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Durometer:</td>
                    <td className="py-2">{part.durometer}</td>
                  </tr>
                )}
                {part.temperature_range && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Temperature Range:</td>
                    <td className="py-2">{part.temperature_range}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );

      case 'Brakes':
      case 'Swivel Locks':
      case 'Raceway Seals':
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">{category} Details</h3>
            <table className="w-full border-collapse">
              <tbody>
                {part.vendor && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Vendor:</td>
                    <td className="py-2">{part.vendor}</td>
                  </tr>
                )}
                {part.compatible_rigs && part.compatible_rigs.length > 0 && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Compatible Rigs:</td>
                    <td className="py-2">
                      <ul className="list-disc pl-5">
                        {part.compatible_rigs.map((rig, index) => (
                          <li key={index}>{rig}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );

      case 'Thread Guards':
      case 'Toe Guards':
      case 'Brush Guards':
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">{category} Details</h3>
            <table className="w-full border-collapse">
              <tbody>
                {part.compatible_wheels && part.compatible_wheels.length > 0 && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Compatible Wheels:</td>
                    <td className="py-2">
                      <ul className="list-disc pl-5">
                        {part.compatible_wheels.map((wheel, index) => (
                          <li key={index}>{wheel}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );

      case 'Shim Plate':
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">Shim Plate Details</h3>
            <table className="w-full border-collapse">
              <tbody>
                {part.length && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Length:</td>
                    <td className="py-2">{part.length}</td>
                  </tr>
                )}
                {part.width && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Width:</td>
                    <td className="py-2">{part.width}</td>
                  </tr>
                )}
                {part.height && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Height:</td>
                    <td className="py-2">{part.height}</td>
                  </tr>
                )}
                {part.bolt_hole_size && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Bolt Hole Size:</td>
                    <td className="py-2">{part.bolt_hole_size}</td>
                  </tr>
                )}
                {part.bolt_hole_pattern && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Bolt Hole Pattern:</td>
                    <td className="py-2">{part.bolt_hole_pattern}</td>
                  </tr>
                )}
                {part.compatible_rigs && part.compatible_rigs.length > 0 && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Compatible Rigs:</td>
                    <td className="py-2">
                      <ul className="list-disc pl-5">
                        {part.compatible_rigs.map((rig, index) => (
                          <li key={index}>{rig}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{part.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Part Number:</td>
                      <td className="py-2">{part.internal_part_number || part.id}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Category:</td>
                      <td className="py-2">{category}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Material:</td>
                      <td className="py-2">{part.material || 'N/A'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Type:</td>
                      <td className="py-2">{part.type || 'N/A'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Size:</td>
                      <td className="py-2">{part.size || 'N/A'}</td>
                    </tr>
                    {part.load_capacity && (
                      <tr className="border-b">
                        <td className="py-2 font-medium">Load Capacity:</td>
                        <td className="py-2">{part.load_capacity}</td>
                      </tr>
                    )}
                    {part.bearing_type && (
                      <tr className="border-b">
                        <td className="py-2 font-medium">Bearing Type:</td>
                        <td className="py-2">{part.bearing_type}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Competitor Part Numbers</h3>
                {part.competitor_parts && part.competitor_parts.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {part.competitor_parts.map((cp, index) => (
                      <li key={index}>{cp}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No competitor part numbers available</p>
                )}
              </div>
              
              {/* Category-specific details */}
              {renderCategorySpecificDetails()}
            </div>
            
            {/* Right Column - Description, Requirements & Image */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{part.description || 'No description available.'}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc pl-5">
                  {part.requires_zerk_axle && (
                    <li className="text-red-700">Requires Zerk axle</li>
                  )}
                  {part.requires_stainless_components && (
                    <li className="text-red-700">Requires stainless steel components</li>
                  )}
                  {part.other_requirements && (
                    <li>{part.other_requirements}</li>
                  )}
                  {!part.requires_zerk_axle && !part.requires_stainless_components && !part.other_requirements && (
                    <li className="text-gray-500">No special requirements</li>
                  )}
                </ul>
              </div>
              
              {/* Image display */}
              {part.image_url && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Image</h3>
                  <div className="border p-2 rounded">
                    <img 
                      src={part.image_url} 
                      alt={part.name} 
                      className="max-w-full h-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex space-x-4">
                <button 
                  onClick={handleSelectPart}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Select Part
                </button>
                <button 
                  onClick={handleAddToBom}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add to BOM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetail;