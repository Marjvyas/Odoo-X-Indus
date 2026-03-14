// Mock data store — simulates a backend API with in-memory state

let products = [
  { id: 1, name: 'USB-C Cable',         sku: 'USBC-001',   category: 'Electronics',  unit: 'pcs',    stock: 80 },
  { id: 2, name: 'Wireless Mouse',       sku: 'WM-002',     category: 'Electronics',  unit: 'pcs',    stock: 12 },
  { id: 3, name: 'AA Batteries',         sku: 'BAT-AA-003', category: 'Accessories',  unit: 'pack',   stock: 5  },
  { id: 4, name: 'Laptop Stand',         sku: 'LS-004',     category: 'Furniture',    unit: 'pcs',    stock: 25 },
  { id: 5, name: 'HDMI Cable',           sku: 'HDMI-005',   category: 'Electronics',  unit: 'pcs',    stock: 0  },
  { id: 6, name: 'Desk Lamp',            sku: 'DL-006',     category: 'Furniture',    unit: 'pcs',    stock: 9  },
  { id: 7, name: 'Mechanical Keyboard',  sku: 'KB-007',     category: 'Electronics',  unit: 'pcs',    stock: 42 },
  { id: 8, name: 'Monitor Cleaner',      sku: 'MC-008',     category: 'Accessories',  unit: 'bottle', stock: 3  },
]

let receipts = [
  { id: 1, supplier: 'Tech Supplies Co.', product: 'USB-C Cable',    quantity: 100, warehouse: 'Main WH', date: '2026-03-10', status: 'Done'    },
  { id: 2, supplier: 'Global Parts Ltd',  product: 'Wireless Mouse', quantity: 50,  warehouse: 'Store A', date: '2026-03-11', status: 'Pending' },
  { id: 3, supplier: 'BatteryWorld',      product: 'AA Batteries',   quantity: 200, warehouse: 'Main WH', date: '2026-03-12', status: 'Done'    },
]

let deliveries = [
  { id: 1, customer: 'Acme Corp',      product: 'Laptop Stand', quantity: 5,  date: '2026-03-09', status: 'Delivered' },
  { id: 2, customer: 'Beta Solutions', product: 'HDMI Cable',   quantity: 20, date: '2026-03-11', status: 'Pending'   },
  { id: 3, customer: 'Gamma Retail',   product: 'Desk Lamp',    quantity: 8,  date: '2026-03-13', status: 'Pending'   },
]

let transfers = [
  { id: 1, from: 'Main WH', to: 'Store A', product: 'USB-C Cable',   quantity: 30, date: '2026-03-08', status: 'Done'    },
  { id: 2, from: 'Store A', to: 'Store B', product: 'Wireless Mouse', quantity: 10, date: '2026-03-12', status: 'Pending' },
]

let nextId = 100

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts = async () => { await delay(); return [...products] }

export const createProduct = async (data) => {
  await delay()
  const product = { ...data, id: nextId++, stock: Number(data.stock) || 0 }
  products.push(product)
  return product
}

export const updateProduct = async (id, data) => {
  await delay()
  products = products.map((p) => p.id === id ? { ...p, ...data, stock: Number(data.stock) } : p)
  return products.find((p) => p.id === id)
}

export const deleteProduct = async (id) => {
  await delay()
  products = products.filter((p) => p.id !== id)
}

// ── Receipts ──────────────────────────────────────────────────────────────────
export const getReceipts = async () => { await delay(); return [...receipts] }

export const createReceipt = async (data) => {
  await delay()
  const receipt = {
    ...data,
    id: nextId++,
    quantity: Number(data.quantity),
    date: new Date().toISOString().slice(0, 10),
    status: 'Pending',
  }
  receipts.unshift(receipt)
  return receipt
}

// ── Deliveries ────────────────────────────────────────────────────────────────
export const getDeliveries = async () => { await delay(); return [...deliveries] }

export const createDelivery = async (data) => {
  await delay()
  const delivery = {
    ...data,
    id: nextId++,
    quantity: Number(data.quantity),
    date: new Date().toISOString().slice(0, 10),
    status: 'Pending',
  }
  deliveries.unshift(delivery)
  return delivery
}

// ── Transfers ─────────────────────────────────────────────────────────────────
export const getTransfers = async () => { await delay(); return [...transfers] }

export const createTransfer = async (data) => {
  await delay()
  const transfer = {
    ...data,
    id: nextId++,
    quantity: Number(data.quantity),
    date: new Date().toISOString().slice(0, 10),
    status: 'Pending',
  }
  transfers.unshift(transfer)
  return transfer
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  await delay()

  const categoryMap = {}
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + p.stock
  })

  const recentActivity = [
    ...receipts.slice(0, 2).map((r)  => ({ type: 'receipt',  text: `Received ${r.quantity} × ${r.product}`,  date: r.date })),
    ...deliveries.slice(0, 2).map((d) => ({ type: 'delivery', text: `Shipped ${d.quantity} × ${d.product}`,   date: d.date })),
    ...transfers.slice(0, 2).map((t)  => ({ type: 'transfer', text: `Moved ${t.quantity} × ${t.product}`,     date: t.date })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)

  return {
    totalProducts:     products.length,
    lowStockItems:     products.filter((p) => p.stock <= 15).length,
    pendingReceipts:   receipts.filter((r) => r.status === 'Pending').length,
    pendingDeliveries: deliveries.filter((d) => d.status === 'Pending').length,
    stockByCategory:   Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
    topProducts:       [...products].sort((a, b) => b.stock - a.stock).slice(0, 5),
    recentActivity,
  }
}
