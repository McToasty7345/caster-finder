import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';

const CompatibilityContext = createContext();

export function useCompatibilityContext() {
  return useContext(CompatibilityContext);
}

export function CompatibilityProvider({ children }) {
  const [rules, setRules] = useState([]);
  const [selectedParts, setSelectedParts] = useState({});
  const [warnings, setWarnings] = useState([]);
  
  // Load compatibility rules
  useEffect(() => {
    async function loadRules() {
      try {
        const { data, error } = await supabase
          .from('compatibility_rules')
          .select(`
            *,
            condition_category:condition_category_id(name),
            target_category:target_category_id(name)
          `);
          
        if (error) throw error;
        setRules(data || []);
      } catch (error) {
        console.error('Error loading compatibility rules:', error);
        // Set default rules if Supabase fails
        setRules([
          {
            id: 1,
            name: 'Stainless Steel Rule',
            description: 'Stainless Steel rigs require Stainless Steel axles',
            condition_category: { name: 'Rigs' },
            condition_attribute: 'material',
            condition_value: 'Stainless Steel',
            target_category: { name: 'Axles' },
            target_attribute: 'material',
            target_value: 'Stainless Steel',
            error_message: 'Stainless Steel rigs require Stainless Steel axles.'
          },
          {
            id: 2,
            name: 'Roller Bearing Rule',
            description: 'Wheels with roller bearings require Zerk axles',
            condition_category: { name: 'Wheels' },
            condition_attribute: 'bearing_type',
            condition_value: 'Roller',
            target_category: { name: 'Axles' },
            target_attribute: 'type',
            target_value: 'Zerk',
            error_message: 'Wheels with roller bearings require Zerk axles.'
          }
        ]);
      }
    }
    
    loadRules();
  }, []);

  // Update selected part and check compatibility
  const selectPart = (category, part) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: part
    }));
    
    // Check compatibility after updating
    setTimeout(checkCompatibility, 0);
  };

  // Check compatibility between selected parts
  const checkCompatibility = () => {
    const newWarnings = [];
    
    // Go through each rule
    for (const rule of rules) {
      const conditionCategory = rule.condition_category.name;
      const targetCategory = rule.target_category.name;
      
      // Check if we have a part for the condition category
      const conditionPart = selectedParts[conditionCategory];
      if (!conditionPart) continue;
      
      // Check if the condition part matches the rule condition
      if (conditionPart[rule.condition_attribute] === rule.condition_value) {
        // Check if we have a target part
        const targetPart = selectedParts[targetCategory];
        if (!targetPart) continue;
        
        // Check if the target part violates the rule
        if (targetPart[rule.target_attribute] !== rule.target_value) {
          newWarnings.push(rule.error_message);
        }
      }
    }
    
    setWarnings(newWarnings);
    return newWarnings.length === 0;
  };

  // Clear selected parts
  const clearSelection = () => {
    setSelectedParts({});
    setWarnings([]);
  };

  // Get selected parts as array
  const getSelectedPartsArray = () => {
    return Object.entries(selectedParts).map(([category, part]) => ({
      category,
      ...part
    }));
  };

  const value = {
    selectedParts,
    warnings,
    selectPart,
    checkCompatibility,
    clearSelection,
    getSelectedPartsArray,
    hasSelection: Object.keys(selectedParts).length > 0
  };

  return (
    <CompatibilityContext.Provider value={value}>
      {children}
    </CompatibilityContext.Provider>
  );
}