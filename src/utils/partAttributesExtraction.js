import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Material patterns for detection
const materialPatterns = [
  { name: 'Steel', patterns: ['STL', 'STEEL', '-S-', 'CARBON'] },
  { name: 'Stainless Steel', patterns: ['SST', 'SS', 'S/S', 'STAINLESS'] },
  { name: 'Polyurethane', patterns: ['PU', 'POLY', 'URETHANE'] },
  { name: 'Rubber', patterns: ['RBR', 'RUBBER', 'EPDM'] },
  { name: 'Nylon', patterns: ['NYL', 'NYLON'] },
  { name: 'Cast Iron', patterns: ['CI', 'CAST', 'IRON'] },
  { name: 'Aluminum', patterns: ['ALM', 'ALUM', 'AL'] },
  { name: 'Zinc', patterns: ['ZNC', 'ZINC'] },
  { name: 'Plastic', patterns: ['PLS', 'PLASTIC', 'PVC'] }
];

// Type patterns (will be expanded based on category)
const typePatterns = {
  // Wheels
  1: [
    { name: 'Standard', patterns: ['STD', 'STANDARD'] },
    { name: 'Soft Tread', patterns: ['SOFT', 'SOFTTREAD'] },
    { name: 'High Temp', patterns: ['HT', 'HIGHTEMP', 'TEMP'] },
    { name: 'Heavy Duty', patterns: ['HD', 'HEAVY'] }
  ],
  // Rigs
  2: [
    { name: 'Swivel', patterns: ['SWV', 'SWIVEL', 'SWIV'] },
    { name: 'Rigid', patterns: ['RGD', 'RIGID'] }
  ],
  // Axles
  3: [
    { name: 'Threaded', patterns: ['THR', 'THREAD'] },
    { name: 'Smooth', patterns: ['SMT', 'SMOOTH'] },
    { name: 'Kingpin', patterns: ['KP', 'KING'] },
    { name: 'Zerk', patterns: ['ZRK', 'ZERK'] }
  ],
  // Brakes (category 5)
  5: [
    { name: 'Total Lock', patterns: ['TL', 'TOTAL'] },
    { name: 'Face Contact', patterns: ['FC', 'FACE'] },
    { name: 'Side Lock', patterns: ['SL', 'SIDE'] }
  ],
  // Default types if category not matched
  'default': [
    { name: 'Standard', patterns: ['STD', 'STANDARD'] },
    { name: 'Heavy Duty', patterns: ['HD', 'HEAVY'] },
    { name: 'Lightweight', patterns: ['LW', 'LIGHT'] }
  ]
};

// Size pattern detection
function detectSize(partNumber, partName) {
  // Common size patterns
  const sizePatterns = [
    // Inch patterns with fractions
    /(\d+(?:-\d+\/\d+)?(?:\s*x\s*\d+(?:-\d+\/\d+)?)?)[\s-]INCH/i,
    /(\d+(?:\/\d+)?(?:\s*X\s*\d+(?:\/\d+)?)?)[\s-]IN/i,
    
    // Diameter patterns
    /(\d+(?:\.\d+)?(?:\/\d+)?)[\s-]?DIA/i,
    
    // Common number patterns that indicate size
    /(\d+(?:\.\d+)?(?:\/\d+)?)[\s-]?MM/i,
    
    // Isolated numbers like "4X2" or "5"
    /\b(\d+(?:\.\d+)?(?:\/\d+)?(?:\s*[Xx]\s*\d+(?:\.\d+)?(?:\/\d+)?)?)\b/
  ];
  
  // Check part number and name for size patterns
  const textToCheck = `${partNumber} ${partName || ''}`.toUpperCase();
  
  for (const pattern of sizePatterns) {
    const match = textToCheck.match(pattern);
    if (match && match[1]) {
      // Format nicely with suffix if available
      if (match[0].includes('MM')) {
        return `${match[1]}-mm`;
      } else if (match[0].includes('INCH') || match[0].includes('-IN')) {
        return `${match[1]}-inch`;
      } else if (match[0].includes('DIA')) {
        return `${match[1]}-inch diameter`;
      } else {
        return `${match[1]}-inch`;
      }
    }
  }
  
  return null;
}

// Function to detect material from part number and name
function detectMaterial(partNumber, partName) {
  const textToCheck = `${partNumber} ${partName || ''}`.toUpperCase();
  
  for (const material of materialPatterns) {
    for (const pattern of material.patterns) {
      if (textToCheck.includes(pattern)) {
        return material.name;
      }
    }
  }
  
  return null;
}

// Function to detect type based on category and part information
function detectType(categoryId, partNumber, partName) {
  const textToCheck = `${partNumber} ${partName || ''}`.toUpperCase();
  
  // Get patterns for this category or use default
  const patterns = typePatterns[categoryId] || typePatterns.default;
  
  for (const type of patterns) {
    for (const pattern of type.patterns) {
      if (textToCheck.includes(pattern)) {
        return type.name;
      }
    }
  }
  
  return null;
}

// Function to detect bearing type (for wheels)
function detectBearingType(partNumber, partName) {
  const textToCheck = `${partNumber} ${partName || ''}`.toUpperCase();
  
  const bearingPatterns = [
    { type: 'Plain Bore', patterns: ['PLAIN', 'BORE'] },
    { type: 'Roller', patterns: ['ROLLER', 'ROLL'] },
    { type: 'Ball Bearing', patterns: ['BALL', 'BB'] },
    { type: 'Precision', patterns: ['PRECISION', 'PREC'] }
  ];
  
  for (const bearing of bearingPatterns) {
    for (const pattern of bearing.patterns) {
      if (textToCheck.includes(pattern)) {
        return bearing.type;
      }
    }
  }
  
  return null;
}

// Main function to extract and update part attributes
async function extractAndUpdateAttributes() {
  try {
    console.log('=== Part Attributes Extraction Tool ===');
    
    // Get parts without attributes
    console.log('Fetching parts that need attribute extraction...');
    const { data: parts, error } = await supabase
      .from('parts')
      .select('*')
      .is('material', null)
      .not('category_id', 'is', null)
      .order('id');
      
    if (error) {
      throw error;
    }
    
    console.log(`Found ${parts.length} parts that need attribute extraction`);
    
    // Process parts in batches
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < parts.length; i += batchSize) {
      batches.push(parts.slice(i, i + batchSize));
    }
    
    console.log(`Processing in ${batches.length} batches`);
    
    let totalUpdated = 0;
    let totalWithMaterial = 0;
    let totalWithType = 0;
    let totalWithSize = 0;
    
    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i+1}/${batches.length} (${batch.length} parts)...`);
      
      for (const part of batch) {
        try {
          // Extract attributes
          const material = detectMaterial(part.part_number || part.id, part.name);
          const type = detectType(part.category_id, part.part_number || part.id, part.name);
          const size = detectSize(part.part_number || part.id, part.name);
          
          // Extract bearing type for wheels
          let bearingType = null;
          if (part.category_id === 1) { // Wheels category
            bearingType = detectBearingType(part.part_number || part.id, part.name);
          }
          
          // Only update if we found at least one attribute
          if (material || type || size || bearingType) {
            const updates = {};
            
            if (material) {
              updates.material = material;
              totalWithMaterial++;
            }
            
            if (type) {
              updates.type = type;
              totalWithType++;
            }
            
            if (size) {
              updates.size = size;
              totalWithSize++;
            }
            
            if (bearingType) {
              updates.bearing_type = bearingType;
            }
            
            // Update the part
            const { error: updateError } = await supabase
              .from('parts')
              .update(updates)
              .eq('id', part.id);
              
            if (updateError) {
              console.error(`Error updating part ${part.id}:`, updateError);
            } else {
              totalUpdated++;
              if (totalUpdated % 10 === 0) {
                console.log(`Updated ${totalUpdated} parts so far...`);
              }
            }
          }
        } catch (partError) {
          console.error(`Error processing part ${part.id}:`, partError);
        }
      }
    }
    
    console.log('\nAttribute extraction complete!');
    console.log(`Summary:
- Total parts processed: ${parts.length}
- Parts updated: ${totalUpdated}
- Parts with material detected: ${totalWithMaterial}
- Parts with type detected: ${totalWithType}
- Parts with size detected: ${totalWithSize}
    `);
    
  } catch (error) {
    console.error('Error extracting attributes:', error);
  }
}

// Run the extraction
extractAndUpdateAttributes();