import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';
import { extractPartAttributes } from '../utils/partAttributesExtraction';
import { categorizePartByNumber } from '../utils/partCategorization';
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

 // Import parts data from Excel
 const importPartsFromExcel = async (jsonData) => {
  // Stats to return
  const stats = {
    total: jsonData.length,
    created: 0,
    updated: 0,
    errors: 0
  };
  
  try {
    // Skip header row if exists
    const dataToProcess = jsonData[0] && 
                         jsonData[0]["Primary Vendor"] === "Primary Vendor" ? 
                         jsonData.slice(1) : jsonData;
    
    // Process each row
    for (const row of dataToProcess) {
      try {
        // Extract data
        const vendor = row["Primary Vendor"] || '';
        const partNumber = row["Part Number"] || '';
        
        // Skip if part number is missing
        if (!partNumber) {
          stats.errors++;
          continue;
        }
        
        // Parse usage numbers
        let totalUsage = row["Total Rolling\r\r\n 12 Months"] || '0';
        let monthlyUsage = row["Average Monthly\r\r\n Usage Rolling12"] || '0';
        
        // Clean numeric strings (remove commas, etc.)
        if (typeof totalUsage === 'string') {
          totalUsage = totalUsage.replace(/,/g, '');
        }
        if (typeof monthlyUsage === 'string') {
          monthlyUsage = monthlyUsage.replace(/,/g, '');
        }
        
        // Convert to numbers
        const rolling12MonthUsage = parseFloat(totalUsage);
        const avgMonthlyUsage = parseFloat(monthlyUsage);
        
        // Check if part already exists
        const { data: existingPart } = await supabase
          .from('parts')
          .select('id, category_id')
          .or(`id.eq.${partNumber},part_number.eq.${partNumber},internal_part_number.eq.${partNumber}`)
          .limit(1)
          .single();
        
        if (existingPart) {
          // Update existing part
          const { error: updateError } = await supabase
            .from('parts')
            .update({
              vendor,
              rolling_12_month_usage: rolling12MonthUsage,
              avg_monthly_usage: avgMonthlyUsage,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingPart.id);
          
          if (updateError) {
            console.error(`Error updating part ${partNumber}:`, updateError);
            stats.errors++;
          } else {
            stats.updated++;
          }
        } else {
          // Try to determine category
          const { categoryId } = categorizePartByNumber(partNumber);
          
          // Create new part with basic info
          const { error: insertError } = await supabase
            .from('parts')
            .insert({
              id: partNumber,  // Use the part number as ID
              name: `${partNumber}`, // Basic name
              part_number: partNumber,
              internal_part_number: partNumber,
              category_id: categoryId,
              vendor,
              rolling_12_month_usage: rolling12MonthUsage,
              avg_monthly_usage: avgMonthlyUsage,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error(`Error creating part ${partNumber}:`, insertError);
            stats.errors++;
          } else {
            stats.created++;
          }
        }
      } catch (rowError) {
        console.error('Error processing row:', rowError);
        stats.errors++;
      }
    }
    
    // Clear cache to ensure fresh data on next load
    setParts({});
    
    return stats;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};

// Extract and update attributes for parts
const extractPartAttributes = async () => {
  try {
    // Get parts without attributes
    const { data: parts, error } = await supabase
      .from('parts')
      .select('*')
      .is('material', null)
      .not('category_id', 'is', null)
      .limit(100);
      
    if (error) {
      throw error;
    }
    
    const stats = {
      total: parts.length,
      updated: 0,
      withMaterial: 0,
      withType: 0,
      withSize: 0
    };
    
    // Process each part
    for (const part of parts) {
      try {
        // Extract attributes using utility function
        const attributes = extractPartAttributes(part);
        
        if (attributes.material || attributes.type || attributes.size) {
          const updates = {};
          
          if (attributes.material) {
            updates.material = attributes.material;
            stats.withMaterial++;
          }
          
          if (attributes.type) {
            updates.type = attributes.type;
            stats.withType++;
          }
          
          if (attributes.size) {
            updates.size = attributes.size;
            stats.withSize++;
          }
          
          // Update bearing type for wheels
          if (part.category_id === 1 && attributes.bearingType) {
            updates.bearing_type = attributes.bearingType;
          }
          
          // Update the part
          const { error: updateError } = await supabase
            .from('parts')
            .update(updates)
            .eq('id', part.id);
            
          if (updateError) {
            console.error(`Error updating part ${part.id}:`, updateError);
          } else {
            stats.updated++;
          }
        }
      } catch (partError) {
        console.error(`Error processing part ${part.id}:`, partError);
      }
    }
    
    // Clear cache to ensure fresh data on next load
    setParts({});
    
    return stats;
  } catch (error) {
    console.error('Extraction failed:', error);
    throw error;
  }
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    // Get total parts count
    const { count: totalParts } = await supabase
      .from('parts')
      .select('*', { count: 'exact', head: true });
    
    // Get categorized parts count
    const { count: categorizedParts } = await supabase
      .from('parts')
      .select('*', { count: 'exact', head: true })
      .not('category_id', 'is', null);
    
    // Get parts with attributes count
    const { count: partsWithMaterial } = await supabase
      .from('parts')
      .select('*', { count: 'exact', head: true })
      .not('material', 'is', null);
    
    // Get category distribution
    const { data: categoryData, error: categoryError } = await supabase
      .from('parts')
      .select('category_id, categories(name)')
      .not('category_id', 'is', null);
    
    if (categoryError) throw categoryError;
    
    // Count parts by category
    const categoryCounts = {};
    categoryData.forEach(part => {
      if (part.category_id) {
        categoryCounts[part.category_id] = (categoryCounts[part.category_id] || 0) + 1;
      }
    });
    
    // Format category counts for display
    const categoryDistribution = Object.entries(categoryCounts).map(([categoryId, count]) => {
      const categoryName = categoryData.find(p => p.category_id === parseInt(categoryId))?.categories?.name || 'Unknown';
      return {
        id: parseInt(categoryId),
        name: categoryName,
        count
      };
    });
    
    // Get top vendors
    const { data: vendorData, error: vendorError } = await supabase
      .from('parts')
      .select('vendor')
      .not('vendor', 'is', null);
    
    if (vendorError) throw vendorError;
    
    // Count parts by vendor
    const vendorCounts = {};
    vendorData.forEach(part => {
      if (part.vendor) {
        vendorCounts[part.vendor] = (vendorCounts[part.vendor] || 0) + 1;
      }
    });
    
    // Format vendor counts and sort by count
    const topVendors = Object.entries(vendorCounts)
      .map(([vendor, count]) => ({ name: vendor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalParts,
      categorizedParts,
      uncategorizedParts: totalParts - categorizedParts,
      partsWithMaterial,
      categoryDistribution,
      topVendors
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
};

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
      // Make sure id is set to part_number if not already
      if (!partData.id && partData.part_number) {
        partData.id = partData.part_number;
      }
      
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
    generatePartNumber,
    importPartsFromExcel,
    extractPartAttributes,
    getDatabaseStats
  };
  return (
    <PartContext.Provider value={value}>
      {children}
    </PartContext.Provider>
  );
}