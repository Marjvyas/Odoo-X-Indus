import { useState } from 'react'
import Sidebar from './components/sidebar'
import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Reciepts from './pages/Reciepts'
import Delivery from './pages/Delivery'
import Transfers from './pages/Transfers'
import Warehouses from './pages/Warehouses'

const pageTitles = {
  dashboard: 'Dashboard',
  products: 'Products',
  receipts: 'Receipts',
  delivery: 'Delivery Orders',
  transfers: 'Internal Transfers',
  adjustments: 'Inventory Adjustments',
  warehouses: 'Warehouse Management',
  settings: 'Warehouse Settings',
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  
  // Lifted state for warehouses shared between Warehouses and Transfers pages
  const [warehouses, setWarehouses] = useState([
    { 
      id: 1, 
      name: "Main Warehouse", 
      location: "Ahmedabad", 
      products: 4, 
      quantity: 4200, 
      lowStock: 1, 
      updated: "Today",
      inventory: [
        { id: 101, name: "Steel Rods", sku: "SR-001", quantity: 2000, category: "Raw Material", lastMoved: "Today" },
        { id: 102, name: "Copper Wire", sku: "CW-022", quantity: 1500, category: "Raw Material", lastMoved: "Yesterday" },
        { id: 103, name: "Plastic Case", sku: "PC-105", quantity: 650, category: "Parts", lastMoved: "3 days ago" },
        { id: 104, name: "Circuit Board", sku: "CB-550", quantity: 50, category: "Components", lastMoved: "Today" },
      ]
    },
    { 
      id: 2, 
      name: "Production Store", 
      location: "Factory Floor", 
      products: 3, 
      quantity: 2100, 
      lowStock: 0, 
      updated: "Yesterday",
      inventory: [
        { id: 201, name: "Steel Rods", sku: "SR-001", quantity: 1000, category: "Raw Material", lastMoved: "2 days ago" },
        { id: 202, name: "Copper Wire", sku: "CW-022", quantity: 800, category: "Raw Material", lastMoved: "Yesterday" },
        { id: 203, name: "Plastic Case", sku: "PC-105", quantity: 300, category: "Parts", lastMoved: "Yesterday" },
      ]
    },
    { 
      id: 3, 
      name: "Retail Warehouse", 
      location: "Mumbai", 
      products: 3, 
      quantity: 980, 
      lowStock: 1, 
      updated: "2 days ago",
      inventory: [
         { id: 301, name: "Circuit Board", sku: "CB-550", quantity: 400, category: "Components", lastMoved: "5 days ago" },
         { id: 302, name: "Wireless Mouse", sku: "WM-002", quantity: 500, category: "Electronics", lastMoved: "Today" },
         { id: 303, name: "USB-C Cable", sku: "USBC-001", quantity: 80, category: "Electronics", lastMoved: "Yesterday" },
      ]
    },
    { 
      id: 4, 
      name: "Spare Parts Store", 
      location: "Delhi", 
      products: 2, 
      quantity: 450, 
      lowStock: 0, 
      updated: "Just now",
      inventory: [
        { id: 401, name: "Monitor Cleaner", sku: "MC-008", quantity: 200, category: "Accessories", lastMoved: "Today" },
        { id: 402, name: "Laptop Stand", sku: "LS-004", quantity: 250, category: "Furniture", lastMoved: "Today" },
      ]
    }
  ]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':   return <Dashboard />
      case 'products':    return <Products />
      case 'receipts':    return <Reciepts />
      case 'delivery':    return <Delivery />
      case 'transfers':   return <Transfers warehouses={warehouses} setWarehouses={setWarehouses} />
      case 'adjustments': return <InventoryAdjustments />
      case 'warehouses':  return <Warehouses warehouses={warehouses} setWarehouses={setWarehouses} />
      default:            return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar title={pageTitles[currentPage] || 'Dashboard'} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

// Inline placeholder for Inventory Adjustments (page not yet created)
function InventoryAdjustments() {
  const [form, setForm] = useState({ product: '', counted: '', reason: '' })
  const [records, setRecords] = useState([
    { id: 1, product: 'USB-C Cable', system: 50, counted: 47, diff: -3, reason: 'Damage', date: '2026-03-10' },
    { id: 2, product: 'Wireless Mouse', system: 30, counted: 32, diff: +2, reason: 'Recount', date: '2026-03-11' },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    const system = Math.floor(Math.random() * 60) + 20
    const diff = parseInt(form.counted) - system
    setRecords([{ id: Date.now(), product: form.product, system, counted: parseInt(form.counted), diff, reason: form.reason, date: new Date().toISOString().slice(0, 10) }, ...records])
    setForm({ product: '', counted: '', reason: '' })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">New Inventory Adjustment</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <input required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Select product" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Counted Quantity</label>
            <input required type="number" min="0" value={form.counted} onChange={e => setForm({ ...form, counted: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
            <input required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Damage, Recount" />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Adjustment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
              <tr>
                {['Product', 'System Qty', 'Counted Qty', 'Difference', 'Reason', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{r.product}</td>
                  <td className="px-6 py-4 text-slate-600">{r.system}</td>
                  <td className="px-6 py-4 text-slate-600">{r.counted}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${r.diff > 0 ? 'text-emerald-600' : r.diff < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                      {r.diff > 0 ? `+${r.diff}` : r.diff}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{r.reason}</td>
                  <td className="px-6 py-4 text-slate-500">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
