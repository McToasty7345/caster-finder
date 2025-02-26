import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';

const PartContext = createContext();

export function usePartContext() {
  return useContext(PartContext);
}

export function PartProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [parts, setParts] = useState({});
  const [loading, setLoading] = useState(true);
  const [bomItems, setBomItems] = useState([]);
  
  // Load categories on initial render
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Use placeholder data if Supabase connection fails
        setCategories([
          { id: 1, name: 'Wheels', description: 'All types of caster wheels' },
          { id: 2, name: 'Rigs', description: 'Swivel and rigid rigs' },
          { id: 3, name: 'Axles', description: 'All types of axles' },
          { id: 4, name: 'Top Hats', description: 'Top hat components' },
          { id: 5, name: 'Brakes', description: 'Braking systems' },
          { id: 6, name: 'Swivel Locks', description: 'Locking mechanisms' },
          { id: 7, name: 'Thread Guards', description: 'Thread protection' },
          { id: 8, name: 'Toe Guards', description: 'Toe protection' },
          { id: 9, name: 'Brush Guards', description: 'Brush guards and protectors' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    loadCategories();
  }, []);

  // Load parts for a category
  const loadPartsForCategory = async (categoryId) => {
    setLoading(true);
    try {
      // Check if we already have loaded this category
      if (parts[categoryId]) {
        setLoading(false);
        return parts[categoryId];
      }
      
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .eq('category_id', categoryId);
        
      if (error) throw error;
      
      // Store in state by category
      setParts(prev => ({
        ...prev,
        [categoryId]: data || []
      }));
      
      setLoading(false);
      return data || [];
    } catch (error) {
      console.error('Error loading parts:', error);
      setLoading(false);
      
      // Return empty array if error
      return [];
    }
  };

  // Add a new part
  const addPart = async (partData) => {
    try {
      const { data, error } = await supabase
        .from('parts')
        .insert([partData])
        .select();
        
      if (error) throw error;
      
      // Update the local cache
      if (data && data.length > 0) {
        setParts(prev => ({
          ...prev,
          [partData.category_id]: [
            ...(prev[partData.category_id] || []),
            data[0]
          ]
        }));
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error adding part:', error);
      return { success: false, error };
    }
  };

  // Add item to BOM
  const addToBom = (part) => {
    setBomItems(prev => {
      // Check if part already exists in BOM
      const exists = prev.some(item => item.id === part.id);
      if (exists) {
        return prev.map(item => 
          item.id === part.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { ...part, quantity: 1 }];
      }
    });
  };

  // Remove item from BOM
  const removeFromBom = (partId) => {
    setBomItems(prev => prev.filter(item => item.id !== partId));
  };

  // Update item quantity in BOM
  const updateBomItemQuantity = (partId, quantity) => {
    setBomItems(prev => 
      prev.map(item => 
        item.id === partId 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    );
  };

  // Clear BOM
  const clearBom = () => {
    setBomItems([]);
  };

  // Generate internal part number
  const generatePartNumber = (category, material, type, size) => {
    // Get category abbreviation
    const categoryMap = {
      'Wheels': 'WHL',
      'Rigs': 'RIG',
      'Axles': 'AXL',
      'Top Hats': 'TPH',
      'Brakes': 'BRK',
      'Swivel Locks': 'SLK',
      'Thread Guards': 'THG',
      'Toe Guards': 'TOG',
      'Brush Guards': 'BRG'
    };
    
    // Get material abbreviation
    const materialMap = {
      'Steel': 'STL',
      'Stainless Steel': 'SST',
      'Polyurethane': 'PUR',
      'Rubber': 'RBR',
      'Nylon': 'NYL',
      'Cast Iron': 'CIR',
      'Aluminum': 'ALM',
      'Zinc': 'ZNC',
      'Plastic': 'PLS'
    };
    
    // Get size without special characters
    const sizeCode = size ? size.replace(/[^0-9]/g, '') : '00';
    
    // Create a timestamp code (last 4 digits of timestamp)
    const timestamp = Date.now().toString().slice(-4);
    
    // Combine all parts
    const categoryCode = categoryMap[category] || 'XXX';
    const materialCode = materialMap[material] || 'XXX';
    const typeCode = type ? type.substring(0, 3).toUpperCase() : 'XXX';
    
    return `${categoryCode}-${materialCode}-${typeCode}${sizeCode}-${timestamp}`;
  };

  const value = {
    categories,
    parts,
    loading,
    loadPartsForCategory,
    addPart,
    bomItems,
    addToBom,
    removeFromBom,
    updateBomItemQuantity,
    clearBom,
    generatePartNumber
  };

  return (
    <PartContext.Provider value={value}>
      {children}
    </PartContext.Provider>
  );
}