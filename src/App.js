import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PartCatalog from './pages/PartCatalog';
import BOMBuilder from './pages/BOMBuilder';
import AddPartForm from './pages/AddPartForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CompatibilityProvider } from './context/CompatibilityContext';
import { PartProvider } from './context/PartContext';

// Determine the basename for GitHub Pages
// For local development, this will be empty
// For production on GitHub Pages, this will be your repository name
const basename = process.env.NODE_ENV === 'production' ? '/caster-finder' : '';

function App() {
  return (
    <Router basename={basename}>
      <PartProvider>
        <CompatibilityProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/catalog/:category?" element={<PartCatalog />} />
                <Route path="/bom-builder" element={<BOMBuilder />} />
                <Route path="/add-part" element={<AddPartForm />} />
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