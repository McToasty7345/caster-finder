import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Determine if we're using mock data or real Supabase
const usingMockData = !supabaseUrl || !supabaseAnonKey;

// Log the connection status
if (usingMockData) {
  console.warn('Supabase credentials missing. Using mock data mode.');
} else {
  console.log('Supabase credentials detected. Connecting to Supabase instance:', supabaseUrl);
}

// Create a placeholder client or real client based on available credentials
export const supabase = usingMockData
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey);

// Mock implementation that simulates Supabase functionality
function createMockSupabaseClient() {
  console.log('Initializing mock Supabase client with sample data');
  
  // Sample category data
  const mockCategories = [
    { id: 1, name: 'Wheels', description: 'All types of caster wheels' },
    { id: 2, name: 'Rigs', description: 'Swivel and rigid rigs' },
    { id: 3, name: 'Axles', description: 'All types of axles' },
    { id: 4, name: 'Top Hats', description: 'Top hat components' },
    { id: 5, name: 'Brakes', description: 'Braking systems' },
    { id: 6, name: 'Swivel Locks', description: 'Locking mechanisms' },
    { id: 7, name: 'Thread Guards', description: 'Thread protection' },
    { id: 8, name: 'Toe Guards', description: 'Toe protection' },
    { id: 9, name: 'Brush Guards', description: 'Brush guards and protectors' },
  ];

  // Sample compatibility rules
  const mockRules = [
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
  ];

  // Sample parts by category
  const mockParts = {
    1: [ // Wheels
      {
        id: 'WHL-PUR-STA40-1234',
        name: 'Standard 4" Polyurethane Wheel',
        category_id: 1,
        material: 'Polyurethane',
        size: '4-inch',
        type: 'Standard',
        load_capacity: '500 lbs',
        bearing_type: 'Plain Bore',
        internal_part_number: 'WHL-PUR-STA40-1234',
        competitor_parts: ['ABC-123', 'XYZ-456']
      },
      {
        id: 'WHL-RBR-STA50-5678',
        name: 'Soft Tread 5" Rubber Wheel',
        category_id: 1,
        material: 'Rubber',
        size: '5-inch',
        type: 'Soft Tread',
        load_capacity: '400 lbs',
        bearing_type: 'Roller',
        requires_zerk_axle: true,
        internal_part_number: 'WHL-RBR-STA50-5678',
        competitor_parts: ['DEF-789']
      }
    ],
    2: [ // Rigs
      {
        id: 'RIG-STL-SWI30-9012',
        name: 'Standard Steel Swivel Rig',
        category_id: 2,
        material: 'Steel',
        size: '3-inch',
        type: 'Swivel',
        load_capacity: '800 lbs',
        internal_part_number: 'RIG-STL-SWI30-9012',
        competitor_parts: ['GHI-012']
      },
      {
        id: 'RIG-SST-RIG40-3456',
        name: 'Stainless Steel Rigid Rig',
        category_id: 2,
        material: 'Stainless Steel',
        size: '4-inch',
        type: 'Rigid',
        load_capacity: '1000 lbs',
        requires_stainless_components: true,
        internal_part_number: 'RIG-SST-RIG40-3456',
        competitor_parts: ['JKL-345', 'MNO-678']
      }
    ],
    3: [ // Axles
      {
        id: 'AXL-STL-THR30-7890',
        name: 'Steel Threaded Axle',
        category_id: 3,
        material: 'Steel',
        size: '3/8-inch',
        type: 'Threaded',
        internal_part_number: 'AXL-STL-THR30-7890',
        competitor_parts: ['PQR-901']
      },
      {
        id: 'AXL-SST-ZER40-2345',
        name: 'Stainless Steel Zerk Axle',
        category_id: 3,
        material: 'Stainless Steel',
        size: '1/2-inch',
        type: 'Zerk',
        internal_part_number: 'AXL-SST-ZER40-2345',
        competitor_parts: ['STU-234', 'VWX-567']
      }
    ]
  };

  // Create a mock client that mimics Supabase's API
  return {
    from: (table) => ({
      select: (columns) => ({
        eq: (column, value) => {
          console.log(`Mock query: SELECT ${columns || '*'} FROM ${table} WHERE ${column} = ${value}`);
          
          // Return appropriate mock data based on the query
          let mockResponse = {
            data: null,
            error: null
          };
          
          if (table === 'categories') {
            mockResponse.data = mockCategories;
          } else if (table === 'compatibility_rules') {
            mockResponse.data = mockRules;
          } else if (table === 'parts' && column === 'category_id') {
            mockResponse.data = mockParts[value] || [];
          }
          
          return Promise.resolve(mockResponse);
        },
        order: () => ({
          data: table === 'categories' ? mockCategories : [],
          error: null
        })
      }),
      insert: (newData) => ({
        select: () => {
          console.log(`Mock insert into ${table}:`, newData);
          
          // For mock inserts, create a new ID and return the data
          const mockInsertedData = newData.map(item => ({
            ...item,
            id: item.id || `MOCK-ID-${Date.now()}`
          }));
          
          return Promise.resolve({
            data: mockInsertedData,
            error: null
          });
        }
      })
    })
  };
}