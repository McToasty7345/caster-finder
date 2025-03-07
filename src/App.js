import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PartCatalog from './pages/PartCatalog';
import BOMBuilder from './pages/BOMBuilder';
import AddPartForm from './pages/AddPartForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CompatibilityProvider } from './context/CompatibilityContext';
import { PartProvider } from './context/PartContext';
import { checkEnvironmentVariables } from './utils/envCheck';

// Import admin pages
import Admin from './pages/Admin';
import DataImport from './pages/DataImport';
import PartsCategorization from './pages/PartsCategorization';
import AttributeExtraction from './pages/AttributeExtraction';
import AdminDashboard from './pages/AdminDashboard';

// Determine the basename for GitHub Pages
const basename = process.env.NODE_ENV === 'production' ? '/caster-finder' : '';

function App() {
  const [dbConfig, setDbConfig] = useState({ checked: false, isConfigured: false });

  useEffect(() => {
    // Check if Supabase environment variables are configured
    const config = checkEnvironmentVariables();
    setDbConfig({ checked: true, isConfigured: config.isConfigured });
  }, []);

  return (
    <Router basename={basename}>
      <PartProvider>
        <CompatibilityProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            
            {/* Show database configuration status (development only) */}
            {process.env.NODE_ENV === 'development' && dbConfig.checked && (
              <div className={`text-center text-sm py-1 ${dbConfig.isConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {dbConfig.isConfigured 
                  ? 'Using Supabase database (environment variables detected)' 
                  : 'Using mock data (Supabase environment variables not detected)'}
              </div>
            )}
            
            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/catalog/:category?" element={<PartCatalog />} />
                <Route path="/bom-builder" element={<BOMBuilder />} />
                <Route path="/add-part" element={<AddPartForm />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/data-import" element={<DataImport />} />
                <Route path="/admin/parts-categorization" element={<PartsCategorization />} />
                <Route path="/admin/attribute-extraction" element={<AttributeExtraction />} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CompatibilityProvider>
      </PartProvider>
    </Router>
  );
}

export default App;