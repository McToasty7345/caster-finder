import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Promisify readline question
 */
function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

/**
 * Gets all categories from the database
 */
async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data;
}

/**
 * Gets all parts with missing categories
 */
async function getUncategorizedParts() {
  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .is('category_id', null);
    
  if (error) {
    console.error('Error fetching uncategorized parts:', error);
    return [];
  }
  
  return data;
}

/**
 * Updates a part's category
 */
async function updatePartCategory(partId, categoryId) {
  const { error } = await supabase
    .from('parts')
    .update({ category_id: categoryId })
    .eq('id', partId);
    
  if (error) {
    console.error(`Error updating part ${partId}:`, error);
    return false;
  }
  
  return true;
}

/**
 * Main function to categorize parts
 */
async function categorizeParts() {
  try {
    console.log('=== Part Categorization Tool ===');
    
    // Fetch categories
    const categories = await getCategories();
    if (categories.length === 0) {
      console.error('No categories found. Please create categories first.');
      return;
    }
    
    // Display categories
    console.log('\nAvailable Categories:');
    categories.forEach(category => {
      console.log(`${category.id}. ${category.name} - ${category.description || ''}`);
    });
    
    // Fetch uncategorized parts
    const uncategorizedParts = await getUncategorizedParts();
    console.log(`\nFound ${uncategorizedParts.length} uncategorized parts.`);
    
    if (uncategorizedParts.length === 0) {
      console.log('All parts are already categorized!');
      return;
    }
    
    // Ask how many parts to process
    const limit = await question('\nHow many parts would you like to categorize in this session? ');
    const maxParts = parseInt(limit) || 20;
    
    // Process parts
    const partsToProcess = uncategorizedParts.slice(0, maxParts);
    
    console.log(`\nProcessing ${partsToProcess.length} parts...`);
    
    let categorized = 0;
    let skipped = 0;
    
    // Common category choices
    const commonChoices = {
      '1': 1,  // Wheels
      '2': 2,  // Rigs
      '3': 3,  // Axles
      '4': 4,  // Top Hats
      's': 'skip'
    };
    
    // Process each part
    for (let i = 0; i < partsToProcess.length; i++) {
      const part = partsToProcess[i];
      
      console.log(`\n[${i+1}/${partsToProcess.length}] Part: ${part.name || part.id}`);
      console.log(`ID: ${part.id}`);
      console.log(`Number: ${part.part_number || part.internal_part_number || 'N/A'}`);
      console.log(`Vendor: ${part.vendor || 'N/A'}`);
      console.log(`Description: ${part.description || 'N/A'}`);
      
      // Display a stats summary for vendor distribution
      if (i === 0) {
        // Group uncategorized parts by vendor
        const vendorCounts = {};
        uncategorizedParts.forEach(p => {
          const vendor = p.vendor || 'Unknown';
          vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
        });
        
        console.log('\nVendor Distribution:');
        Object.entries(vendorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .forEach(([vendor, count]) => {
            console.log(`${vendor}: ${count} parts`);
          });
        
        console.log('\nQuick choices: 1=Wheels, 2=Rigs, 3=Axles, 4=Top Hats, s=Skip');
      }
      
      // Ask for category
      const choice = await question('Enter category ID (or "s" to skip): ');
      
      // Process choice
      if (choice.toLowerCase() === 's' || choice.toLowerCase() === 'skip') {
        console.log('Skipped');
        skipped++;
        continue;
      }
      
      // Handle numeric category
      const categoryId = parseInt(choice);
      if (isNaN(categoryId) || !categories.some(c => c.id === categoryId)) {
        console.log('Invalid category ID. Skipped.');
        skipped++;
        continue;
      }
      
      // Update part
      const success = await updatePartCategory(part.id, categoryId);
      if (success) {
        console.log(`Part categorized as ${categories.find(c => c.id === categoryId).name}`);
        categorized++;
      } else {
        console.log('Failed to update part. Skipped.');
        skipped++;
      }
    }
    
    console.log(`\nSession complete: ${categorized} parts categorized, ${skipped} parts skipped.`);
    console.log(`${uncategorizedParts.length - partsToProcess.length} parts still need categorization.`);
    
    // Ask if user wants to continue
    if (uncategorizedParts.length > partsToProcess.length) {
      const continueChoice = await question('\nWould you like to continue categorizing more parts? (y/n) ');
      if (continueChoice.toLowerCase() === 'y' || continueChoice.toLowerCase() === 'yes') {
        console.log('\n---\n');
        await categorizeParts();
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

// Run the categorization tool
categorizeParts();