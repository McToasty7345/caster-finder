import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Category mappings based on part number prefixes
const categoryMappings = [
  { prefix: ['WHL', 'WHEEL'], categoryId: 1, categoryName: 'Wheels' },
  { prefix: ['RIG', 'SWIVEL', 'CCAPEX', 'CCALPHA', 'CCCREST', 'CCPEAK', 'CCSTOUTHD'], categoryId: 2, categoryName: 'Rigs' },
  { prefix: ['AXL', 'AXLE', 'HUB'], categoryId: 3, categoryName: 'Axles' },
  { prefix: ['TPH', 'TOP'], categoryId: 4, categoryName: 'Top Hats' },
  { prefix: ['BRK', 'BRAKE'], categoryId: 5, categoryName: 'Brakes' },
  { prefix: ['LOCK', 'SWL'], categoryId: 6, categoryName: 'Swivel Locks' },
  { prefix: ['THG', 'THREAD'], categoryId: 7, categoryName: 'Thread Guards' },
  { prefix: ['TOE', 'TOG'], categoryId: 8, categoryName: 'Toe Guards' },
  { prefix: ['BRG', 'BRUSH'], categoryId: 9, categoryName: 'Brush Guards' }
];

/**
 * Attempts to categorize a part based on part number patterns
 */
function categorizePartByNumber(partNumber) {
  const upperPartNumber = partNumber.toUpperCase();
  
  for (const mapping of categoryMappings) {
    for (const prefix of mapping.prefix) {
      if (upperPartNumber.startsWith(prefix)) {
        return {
          categoryId: mapping.categoryId,
          categoryName: mapping.categoryName
        };
      }
    }
  }
  
  // Default category if no match
  return { categoryId: null, categoryName: null };
}

/**
 * Imports parts usage data from Excel file into Supabase
 */
async function importPartsUsage(filePath) {
  try {
    console.log(`Importing parts usage data from ${filePath}...`);
    
    // Read the Excel file
    const excelData = fs.readFileSync(filePath);
    const workbook = XLSX.read(excelData, {
      cellDates: true,
      cellNF: true,
      cellText: true
    });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Get data as JSON
    let rows = XLSX.utils.sheet_to_json(sheet, { raw: false });
    console.log(`Found ${rows.length} rows in the Excel file`);
    
    // Remove header row if it exists
    if (rows.length > 0 && rows[0]["Primary Vendor"] === "Primary Vendor") {
      rows = rows.slice(1);
      console.log(`Removed duplicate header row. Now processing ${rows.length} rows`);
    }
    
    // Process rows in batches to avoid timeouts
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < rows.length; i += batchSize) {
      batches.push(rows.slice(i, i + batchSize));
    }
    
    console.log(`Processing data in ${batches.length} batches...`);
    
    // Stats for reporting
    let existingPartsUpdated = 0;
    let newPartsCreated = 0;
    let errors = 0;
    
    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i+1}/${batches.length}...`);
      
      // Process each row in the batch
      for (const row of batch) {
        try {
          // Extract and clean data
          const vendor = row["Primary Vendor"] || '';
          const partNumber = row["Part Number"] || '';
          
          // Skip if part number is missing
          if (!partNumber) {
            console.warn('Skipping row with missing part number');
            continue;
          }
          
          // Parse usage numbers
          let totalUsage = row["Total Rolling\r\r\n 12 Months"] || '0';
          let monthlyUsage = row["Average Monthly\r\r\n Usage Rolling12"] || '0';
          
          // Clean numeric strings (remove commas, etc.)
          totalUsage = totalUsage.toString().replace(/,/g, '');
          monthlyUsage = monthlyUsage.toString().replace(/,/g, '');
          
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
              errors++;
            } else {
              existingPartsUpdated++;
            }
          } else {
            // Create new part
            // Try to determine category
            const { categoryId, categoryName } = categorizePartByNumber(partNumber);
            
            // Generate internal part number if needed
            const internalPartNumber = partNumber;
            
            // Create new part with basic info
            const { error: insertError } = await supabase
              .from('parts')
              .insert({
                id: partNumber,  // Use the part number as ID
                name: `${partNumber}`, // Basic name
                part_number: partNumber,
                internal_part_number: internalPartNumber,
                category_id: categoryId,
                vendor,
                rolling_12_month_usage: rolling12MonthUsage,
                avg_monthly_usage: avgMonthlyUsage,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            
            if (insertError) {
              console.error(`Error creating part ${partNumber}:`, insertError);
              errors++;
            } else {
              newPartsCreated++;
              if (newPartsCreated % 10 === 0) {
                console.log(`Created ${newPartsCreated} new parts so far...`);
              }
            }
          }
        } catch (error) {
          console.error('Error processing row:', error);
          errors++;
        }
      }
      
      // Report progress after each batch
      console.log(`Batch ${i+1} complete. Running totals: ${existingPartsUpdated} updated, ${newPartsCreated} created, ${errors} errors`);
    }
    
    console.log('\nImport complete!');
    console.log(`Summary:
- Total parts processed: ${rows.length}
- Existing parts updated: ${existingPartsUpdated}
- New parts created: ${newPartsCreated}
- Errors: ${errors}
    `);
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Get file path from command line or use default
const filePath = process.argv[2] || 'Copy of All parts usage 03.07.25.xlsx';

// Run the import
importPartsUsage(filePath);