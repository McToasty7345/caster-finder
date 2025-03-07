// codespacesEnv.js
// This script fixes GitHub Codespaces secrets access for React apps

const fs = require('fs');
const path = require('path');

// Function to check if running in GitHub Codespaces
function isCodespaces() {
  return !!process.env.CODESPACES;
}

// Main function to ensure environment variables are accessible to React
function setupReactEnv() {
  if (!isCodespaces()) {
    console.log('Not running in GitHub Codespaces, no action needed');
    return;
  }

  console.log('Setting up React environment variables in GitHub Codespaces...');

  // These are the environment variables we need for Supabase
  const requiredVars = [
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY'
  ];

  // Get existing environment variables
  const existingEnv = {};
  if (fs.existsSync('.env')) {
    const envFile = fs.readFileSync('.env', 'utf8');
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        existingEnv[key.trim()] = valueParts.join('=').trim();
      }
    });
  }

  // Create/update .env file with any existing environment variables
  let envContent = '';
  let varsAdded = 0;

  requiredVars.forEach(varName => {
    const varValue = process.env[varName];
    if (varValue && !existingEnv[varName]) {
      envContent += `${varName}=${varValue}\n`;
      varsAdded++;
    }
  });

  if (varsAdded > 0) {
    fs.appendFileSync('.env', envContent);
    console.log(`Added ${varsAdded} environment variables to .env`);
  } else if (Object.keys(existingEnv).length > 0) {
    console.log('All required environment variables already exist in .env');
  } else {
    console.log('No environment variables found or added');
    
    // If no vars found, print the current environment for debugging
    console.log('\nCurrent environment variables for debugging:');
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('REACT_APP_') || key.includes('SUPABASE')) {
        console.log(`${key}: ${process.env[key] ? 'exists (value hidden)' : 'not set'}`);
      }
    });
    
    // Create a minimal .env file with placeholder values as a fallback
    if (!fs.existsSync('.env')) {
      fs.writeFileSync('.env', 
        '# Placeholder values - replace with actual values or set in Codespaces secrets\n' +
        'REACT_APP_SUPABASE_URL=https://pleuruesdrjrzxngaafl.supabase.co\n' +
        'REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInJlZiI6InBsZXVydWVzZHJqcnp4bmdhYWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NjQwNzEsImV4cCI6MjAyNTM0MDA3MX0.Nz2jwgGHVA8QdxXEy5zY2DKWRWc4vL-jJpc3MlOlJzZXngaafi\n'
      );
      console.log('Created placeholder .env file');
    }
  }
}

// Run the setup
setupReactEnv();