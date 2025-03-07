// Mock data for Caster Finder application
const mockData = {
    categories: [
      { id: 1, name: 'Wheels', description: 'All types of caster wheels' },
      { id: 2, name: 'Rigs', description: 'Swivel and rigid rigs' },
      { id: 3, name: 'Axles', description: 'All types of axles' },
      { id: 4, name: 'Top Hats', description: 'Top hat components' },
      { id: 5, name: 'Brakes', description: 'Braking systems' },
      { id: 6, name: 'Swivel Locks', description: 'Locking mechanisms' },
      { id: 7, name: 'Thread Guards', description: 'Thread protection' },
      { id: 8, name: 'Toe Guards', description: 'Toe protection' },
      { id: 9, name: 'Brush Guards', description: 'Brush guards and protectors' },
    ],
    parts: {
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
    },
    compatibility_rules: [
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
    ]
  };
  
  // Create a completely fake Supabase client that doesn't try to connect to the real Supabase
  export const supabase = {
    from(table) {
      return {
        select(columns) {
          if (table === 'categories') {
            return Promise.resolve({ data: mockData.categories, error: null });
          } else if (table === 'compatibility_rules') {
            return Promise.resolve({ data: mockData.compatibility_rules, error: null });
          }
          
          return {
            eq(column, value) {
              if (table === 'parts' && column === 'category_id') {
                return Promise.resolve({ data: mockData.parts[value] || [], error: null });
              }
              return Promise.resolve({ data: [], error: null });
            },
            order() {
              if (table === 'categories') {
                return Promise.resolve({ data: mockData.categories, error: null });
              }
              return Promise.resolve({ data: [], error: null });
            }
          };
        },
        insert(data) {
          return {
            select() {
              const newItem = Array.isArray(data) ? data[0] : data;
              // If this is a part and has a category_id, add it to our mock database
              if (table === 'parts' && newItem.category_id) {
                if (!mockData.parts[newItem.category_id]) {
                  mockData.parts[newItem.category_id] = [];
                }
                const itemWithId = { 
                  ...newItem, 
                  id: newItem.id || newItem.internal_part_number || `MOCK-${Date.now()}` 
                };
                mockData.parts[newItem.category_id].push(itemWithId);
                return Promise.resolve({ data: [itemWithId], error: null });
              }
              
              return Promise.resolve({ 
                data: [{ ...newItem, id: newItem.id || `MOCK-${Date.now()}` }], 
                error: null 
              });
            }
          };
        }
      };
    }
  };
  
  // Log that we're using the mock version
  console.log('Using mock Supabase client for GitHub Pages deployment');