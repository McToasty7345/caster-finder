// src/utils/envCheck.js
export function checkEnvironmentVariables() {
    console.log('Environment variable check:');
    console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? '✅ Available' : '❌ Missing');
    console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Available' : '❌ Missing');
    
    return {
      hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
      hasSupabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
      isConfigured: !!process.env.REACT_APP_SUPABASE_URL && !!process.env.REACT_APP_SUPABASE_ANON_KEY
    };
  }