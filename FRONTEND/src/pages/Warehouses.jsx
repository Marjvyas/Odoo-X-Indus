import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Warehouse, Box, AlertTriangle, Layers, MapPin, 
  ChevronRight, Plus, X, Search 
} from 'lucide-react';

const Warehouses = ({ warehouses, setWarehouses }) => {
  // Local state for UI only
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', manager: '', capacity: '' });

  // Stats Data
  const totalWarehouses = warehouses.length;
  const totalQuantity = warehouses.reduce((acc, curr) => acc + curr.quantity, 0);
  const lowStockWarehouses = warehouses.filter(w => w.lowStock > 0).length;
  const totalProductTypes = warehouses.reduce((acc, curr) => acc + curr.products, 0);

  // Chart Data
  const barChartData = warehouses.map(w => ({
    name: w.name,
    quantity: w.quantity
  }));

  const pieChartData = warehouses.map(w => ({
    name: w.name,
    value: w.quantity
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

  const handleView = (warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  const closeDetails = () => {
    setSelectedWarehouse(null);
  };

  const handleAddWarehouse = () => {
    if (!newWarehouse.name || !newWarehouse.location) return;
    
    const warehouse = {
      id: Date.now(),
      name: newWarehouse.name,
      location: newWarehouse.location,
      manager: newWarehouse.manager,
      capacity: newWarehouse.capacity,
      products: 0,
      quantity: 0,
      lowStock: 0,
      updated: "Just now",
      inventory: []
    };
    
    setWarehouses([...warehouses, warehouse]);
    setNewWarehouse({ name: '', location: '', manager: '', capacity: '' });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Warehouse Management</h1>
          <p className="text-slate-500 text-sm">Monitor stock quantities across all warehouses.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Warehouse
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Warehouses" 
          value={totalWarehouses} 
          desc="Active locations" 
          icon={<Warehouse className="w-6 h-6 text-indigo-600" />}
          bg="bg-indigo-50"
        />
        <SummaryCard 
          title="Total Inventory" 
          value={totalQuantity.toLocaleString()} 
          desc="Items in stock" 
          icon={<Box className="w-6 h-6 text-purple-600" />}
          bg="bg-purple-50"
        />
        <SummaryCard 
          title="Low Stock" 
          value={lowStockWarehouses} 
          desc="Warehouses with alerts" 
          icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
          bg="bg-orange-50"
        />
        <SummaryCard 
          title="Product Types" 
          value={totalProductTypes} 
          desc="Distinct SKUs stored" 
          icon={<Layers className="w-6 h-6 text-pink-600" />}
          bg="bg-pink-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Inventory Quantity Per Warehouse</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="quantity" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Inventory Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Warehouse Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">All Warehouses</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search warehouses..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Warehouse Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-center">Total Products</th>
                <th className="px-6 py-4 text-center">Total Quantity</th>
                <th className="px-6 py-4 text-center">Low Stock Items</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{warehouse.name}</td>
                  <td className="px-6 py-4 text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {warehouse.location}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">{warehouse.products}</td>
                  <td className="px-6 py-4 text-center font-medium text-indigo-600">{warehouse.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    {warehouse.lowStock > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        {warehouse.lowStock}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{warehouse.updated}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleView(warehouse)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center gap-1"
                    >
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Details Modal */}
      {selectedWarehouse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedWarehouse.name}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedWarehouse.location}</span>
                  <span className="flex items-center gap-1"><Box className="w-3 h-3" /> {selectedWarehouse.quantity} Items</span>
                </div>
              </div>
              <button onClick={closeDetails} className="bg-white p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Stock Breakdown</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium">
                    <tr>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">Quantity</th>
                      <th className="px-4 py-3 text-right">Last Movement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedWarehouse.inventory && selectedWarehouse.inventory.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{product.sku}</td>
                        <td className="px-4 py-3 text-slate-600">{product.category}</td>
                        <td className="px-4 py-3 text-right font-semibold text-indigo-600">{product.quantity}</td>
                        <td className="px-4 py-3 text-right text-slate-500">{product.lastMoved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 text-sm">
                  Transfer Stock
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 text-sm">
                  Edit Warehouse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Add New Warehouse</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Warehouse Name</label>
                <input 
                  type="text" 
                  value={newWarehouse.name}
                  onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  placeholder="e.g. North Distribution Center" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={newWarehouse.location}
                  onChange={(e) => setNewWarehouse({...newWarehouse, location: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  placeholder="City, State or Address" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Manager Name</label>
                  <input 
                    type="text" 
                    value={newWarehouse.manager}
                    onChange={(e) => setNewWarehouse({...newWarehouse, manager: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                  <input 
                    type="number" 
                    value={newWarehouse.capacity}
                    onChange={(e) => setNewWarehouse({...newWarehouse, capacity: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    placeholder="Optional" 
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 text-sm"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 text-sm"
                onClick={handleAddWarehouse}
              >
                Create Warehouse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for summary cards
const SummaryCard = ({ title, value, desc, icon, bg }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{desc}</p>
    </div>
    <div className={`p-3 rounded-lg ${bg}`}>
      {icon}
    </div>
  </div>
);

export default Warehouses;
