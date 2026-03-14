import { useState, useEffect } from 'react'
import { getDeliveries, createDelivery } from '../services/api'

const EMPTY_FORM = { customer: '', product: '', quantity: '' }

function StatusBadge({ status }) {
  const styles = {
    Created: 'bg-slate-100 text-slate-700',
    Pending: 'bg-amber-100 text-amber-700',
    Dispatched: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-rose-100 text-rose-700',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default function Delivery() {
  const [deliveries, setDeliveries] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const refreshData = () => {
    getDeliveries().then((data) => { setDeliveries(data); setLoading(false) })
  }

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 2000) // Auto-sync every 2s
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const delivery = await createDelivery(form)
    setDeliveries((prev) => [delivery, ...prev])
    setForm(EMPTY_FORM)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  const pendingCount = deliveries.filter((d) => d.status === 'Pending' || d.status === 'Created').length

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3 text-sm text-amber-800">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span><strong>{pendingCount}</strong> delivery order{pendingCount > 1 ? 's' : ''} awaiting dispatch.</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-800">New Delivery Order</h2>
        </div>

        {success && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Delivery order created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
            <input
              required value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              className={inputClass}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <input
              required value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className={inputClass}
              placeholder="e.g. Laptop Stand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
            <input
              required type="number" min="1" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className={inputClass}
              placeholder="0"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit" disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Delivery Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">
            Delivery Orders
            <span className="ml-2 text-sm font-normal text-slate-400">({deliveries.length})</span>
          </h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                <tr>
                  {['Customer', 'Product', 'Quantity', 'Date', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{d.customer}</td>
                    <td className="px-6 py-4 text-slate-600">{d.product}</td>
                    <td className="px-6 py-4 text-slate-600">{d.quantity}</td>
                    <td className="px-6 py-4 text-slate-500">{d.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
