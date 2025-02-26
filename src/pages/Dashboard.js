import React from 'react';
import { Link } from 'react-router-dom';
import { usePartContext } from '../context/PartContext';

const Dashboard = () => {
  const { categories, bomItems } = usePartContext();
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h1 className="text-2xl font-bold mb-2">Caster Parts Reference Tool</h1>
        <p className="text-gray-600">
          Quickly find and select compatible parts for your caster assemblies and generate BOMs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded p-4">
              <p className="text-sm text-blue-700">Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="bg-green-50 rounded p-4">
              <p className="text-sm text-green-700">BOM Items</p>
              <p className="text-2xl font-bold">{bomItems.length}</p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/catalog"
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-center"
            >
              Browse Parts Catalog
            </Link>
            <Link
              to="/bom-builder"
              className="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded text-center"
            >
              {bomItems.length > 0 ? 'Continue BOM' : 'Create New BOM'}
            </Link>
            <Link
              to="/add-part"
              className="block w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded text-center"
            >
              Add New Part
            </Link>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalog/${category.id}`}
              className="p-4 bg-gray-50 hover:bg-blue-50 rounded transition duration-150 border hover:border-blue-200"
            >
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;