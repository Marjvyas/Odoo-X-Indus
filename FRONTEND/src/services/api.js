const API_URL = 'http://localhost:5000/api';

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// ── Products ─────────────────────────────────────────────────────────────────
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, { headers: getAuthHeaders() });
  const data = await response.json();
  return data.map(p => ({ ...p, id: p._id }));
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error creating product');
  }
  const p = await response.json();
  return { ...p, id: p._id };
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error updating product');
  }
  const p = await response.json();
  return { ...p, id: p._id };
};

// ── Deliveries ────────────────────────────────────────────────────────────────
export const getDeliveries = async () => {
  const response = await fetch(`${API_URL}/deliveries`, { headers: getAuthHeaders() });
  const data = await response.json();
  
  return data.map(delivery => ({
    id: delivery._id,
    customer: delivery.customerName,
    product: delivery.products[0]?.productId?.name || 'Unknown',
    quantity: delivery.products[0]?.quantity || 0,
    date: new Date(delivery.createdAt).toISOString().slice(0, 10),
    status: delivery.status === 'created' ? 'Created' : delivery.status === 'dispatched' ? 'Dispatched' : 'Delivered',
  }));
};

export const createDelivery = async (data) => {
  const products = await getProducts();
  const product = products.find(p => p.name.toLowerCase() === data.product.toLowerCase());
  
  if (!product) throw new Error('Product not found in database');

  const response = await fetch(`${API_URL}/deliveries`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      customerName: data.customer,
      products: [{ productId: product._id, quantity: Number(data.quantity) }]
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error creating delivery');
  }

  const delivery = await response.json();
  return {
    id: delivery._id,
    customer: delivery.customerName,
    product: data.product,
    quantity: data.quantity,
    date: new Date(delivery.createdAt).toISOString().slice(0, 10),
    status: 'Created'
  };
};

export const updateDeliveryStatus = async (id, newStatus) => {
  const endpoint = newStatus === 'Dispatched' ? 'dispatch' : 'deliver';
  const response = await fetch(`${API_URL}/deliveries/${id}/${endpoint}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error updating status');
  }
  return await response.json();
};

// ── Transfers ─────────────────────────────────────────────────────────────────
export const getTransfers = async () => {
  const response = await fetch(`${API_URL}/transfers`, { headers: getAuthHeaders() });
  const data = await response.json();
  
  return data.map(t => ({
    id: t._id,
    product: t.productId?.name || 'Unknown',
    quantity: t.quantity,
    from: t.fromLocation,
    to: t.toLocation,
    date: new Date(t.createdAt).toISOString().slice(0, 10),
    status: t.status === 'pending' ? 'Pending' : 'Completed',
  }));
};

export const createTransfer = async (data) => {
  const products = await getProducts();
  const product = products.find(p => p.name.toLowerCase() === data.product.toLowerCase());
  
  if (!product) throw new Error('Product not found in database');

  const response = await fetch(`${API_URL}/transfers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      productId: product._id,
      quantity: Number(data.quantity),
      fromLocation: data.from,
      toLocation: data.to,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error creating transfer');
  }
  const transfer = await response.json();

  return {
    id: transfer._id,
    product: data.product,
    quantity: data.quantity,
    from: data.from,
    to: data.to,
    date: new Date().toISOString().slice(0, 10),
    status: 'Pending'
  };
};

export const updateTransferStatus = async (id, newStatus) => {
  const response = await fetch(`${API_URL}/transfers/${id}/complete`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error completing transfer');
  }
  return await response.json();
};

// ── Dashboard Stats (Dummy implementation to prevent crashing) ───────────────
export const getDashboardStats = async () => {
    // Return dummy stats for now to keep frontend dashboard working
    return {
      totalProducts: 8,
      lowStockItems: 5,
      pendingReceipts: 1,
      pendingDeliveries: 2,
      stockByCategory: [
        { name: 'Raw Material', value: 450 },
        { name: 'Electronics', value: 134 },
      ],
      topProducts: [],
      recentActivity: []
    }
};

// ── Dummy implementations to prevent other pages from crashing ───────────────
export const getReceipts = async () => {
  return [];
};

export const createReceipt = async (data) => {
  return { id: 'dummy-1', ...data, status: 'Completed' };
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error deleting product');
  }
  return await response.json();
};

