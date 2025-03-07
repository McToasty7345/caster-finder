import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PartsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // For this demo, we'll use some sample data (you would fetch this from Supabase)
  useEffect(() => {
    // Simulating a database fetch
    setTimeout(() => {
      const sampleData = {
        totalParts: 2617,
        categorizedParts: 2200,
        uncategorizedParts: 417,
        categoryCounts: [
          { name: 'Wheels', count: 750, fill: '#8884d8' },
          { name: 'Rigs', count: 620, fill: '#83a6ed' },
          { name: 'Axles', count: 480, fill: '#8dd1e1' },
          { name: 'Top Hats', count: 180, fill: '#82ca9d' },
          { name: 'Brakes', count: 90, fill: '#a4de6c' },
          { name: 'Swivel Locks', count: 40, fill: '#d0ed57' },
          { name: 'Thread Guards', count: 20, fill: '#ffc658' },
          { name: 'Toe Guards', count: 15, fill: '#ff8042' },
          { name: 'Brush Guards', count: 5, fill: '#ff6b6b' }
        ],
        topVendors: [
          { name: 'MIDSTATE', count: 890 },
          { name: 'MEGA', count: 560 },
          { name: 'MUVTONS', count: 380 },
          { name: 'ACOR', count: 290 },
          { name: 'NINGBO', count: 210 }
        ],
        materialCounts: [
          { name: 'Steel', count: 680 },
          { name: 'Stainless Steel', count: 420 },
          { name: 'Polyurethane', count: 380 },
          { name: 'Rubber', count: 310 },
          { name: 'Nylon', count: 240 },
          { name: 'Other', count: 170 }
        ],
        monthlyUsageStats: {
          min: 0,
          max: 61323,
          avg: 4218,
          median: 850
        }
      };
      
      setSummary(sampleData);
      setLoading(false);
    }, 1000);
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Caster Parts Database Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total Parts</h2>
          <p className="text-3xl font-bold text-blue-600">{summary.totalParts.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Categorized</h2>
          <p className="text-3xl font-bold text-green-600">{summary.categorizedParts.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{Math.round((summary.categorizedParts / summary.totalParts) * 100)}% of total</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Uncategorized</h2>
          <p className="text-3xl font-bold text-orange-600">{summary.uncategorizedParts.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{Math.round((summary.uncategorizedParts / summary.totalParts) * 100)}% of total</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Avg Monthly Usage</h2>
          <p className="text-3xl font-bold text-purple-600">{summary.monthlyUsageStats.avg.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Per part</p>
        </div>
      </div>
      
      {/* Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Parts by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.categoryCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" name="Number of Parts">
                {summary.categoryCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Parts by Vendor</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.topVendors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" name="Number of Parts" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Material Distribution & More */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Material Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary.materialCounts}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {summary.materialCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Usage Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-blue-700">Maximum</p>
              <p className="text-2xl font-bold">{summary.monthlyUsageStats.max.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-green-700">Median</p>
              <p className="text-2xl font-bold">{summary.monthlyUsageStats.median.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded">
              <p className="text-sm text-yellow-700">Average</p>
              <p className="text-2xl font-bold">{summary.monthlyUsageStats.avg.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <p className="text-sm text-purple-700">Minimum</p>
              <p className="text-2xl font-bold">{summary.monthlyUsageStats.min.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>This dashboard provides an overview of your parts database. Connect to your Supabase database to see real-time data.</p>
      </div>
    </div>
  );
};

export default PartsDashboard;