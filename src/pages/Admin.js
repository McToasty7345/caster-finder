import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatabaseStatusIndicator from '../utils/DatabaseStatusIndicator';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage database and parts data</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <DatabaseStatusIndicator />
        </div>
        
        <div className="mb-6">
          <nav className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'import' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('import')}
            >
              Data Import
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'manage' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('manage')}
            >
              Manage Parts
            </button>
          </nav>
        </div>
        
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">Parts Management</h3>
                <p className="text-gray-600 mb-4">Import, categorize, and manage parts in the database.</p>
                <Link
                  to="/admin/data-import"
                  className="block w-full py-2 px-4 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                >
                  Import Data
                </Link>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">Categorization</h3>
                <p className="text-gray-600 mb-4">Assign categories to parts for compatibility checking.</p>
                <Link
                  to="/admin/parts-categorization"
                  className="block w-full py-2 px-4 bg-green-600 text-white rounded text-center hover:bg-green-700"
                >
                  Categorize Parts
                </Link>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">Database Analysis</h3>
                <p className="text-gray-600 mb-4">View dashboard and statistics about the database.</p>
                <Link
                  to="/admin/dashboard"
                  className="block w-full py-2 px-4 bg-purple-600 text-white rounded text-center hover:bg-purple-700"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Database Setup</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-2">SQL Script</h3>
                <p className="text-gray-600 mb-4">
                  Use this SQL script to set up or update your database schema in Supabase.
                  Copy the script and run it in the Supabase SQL Editor.
                </p>
                
                <div className="flex justify-between mb-4">
                  <a
                    href="/utils/database-setup.sql"
                    download="caster-finder-schema.sql"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download SQL Script
                  </a>
                  
                  <a
                    href="https://app.supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Open Supabase
                  </a>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>The SQL script will:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Create all necessary tables if they don't exist</li>
                    <li>Add any missing columns to existing tables</li>
                    <li>Create default categories and compatibility rules</li>
                    <li>Set up proper indexes for performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'import' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Data Import Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">Import Parts from Excel</h3>
                <p className="text-gray-600 mb-4">
                  Upload an Excel file with your parts data to import into the database.
                </p>
                <Link
                  to="/admin/data-import"
                  className="block w-full py-2 px-4 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                >
                  Go to Import Page
                </Link>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">Extract Part Attributes</h3>
                <p className="text-gray-600 mb-4">
                  Automatically extract material, size, and type information from part numbers.
                </p>
                <Link
                  to="/admin/attribute-extraction"
                  className="block w-full py-2 px-4 bg-green-600 text-white rounded text-center hover:bg-green-700"
                >
                  Extract Attributes
                </Link>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="font-medium text-yellow-800 mb-2">Import Guide</h3>
              <ol className="list-decimal list-inside text-yellow-700 space-y-1">
                <li>Prepare your Excel file with columns for Primary Vendor, Part Number, and usage data</li>
                <li>Upload the file on the Import Page</li>
                <li>Review the data preview before importing</li>
                <li>After import, use the Categorization tool to assign categories</li>
                <li>Use the Attribute Extraction tool to detect material, type, and size</li>
              </ol>
            </div>
          </div>
        )}
        
        {activeTab === 'manage' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Parts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">Categorize Parts</h3>
                <p className="text-gray-600 mb-4">
                  Assign categories to parts that don't have them yet.
                </p>
                <Link
                  to="/admin/parts-categorization"
                  className="block w-full py-2 px-4 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                >
                  Categorize Parts
                </Link>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">Add New Part</h3>
                <p className="text-gray-600 mb-4">
                  Add a new part manually to the database.
                </p>
                <Link
                  to="/add-part"
                  className="block w-full py-2 px-4 bg-green-600 text-white rounded text-center hover:bg-green-700"
                >
                  Add Part
                </Link>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Parts Catalog</h2>
              <p className="text-gray-600 mb-4">
                View and manage all parts in the catalog.
              </p>
              <Link
                to="/catalog"
                className="block w-full py-2 px-4 bg-gray-600 text-white rounded text-center hover:bg-gray-700"
              >
                Go to Catalog
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;