import { useState, useEffect } from 'react'
import { getReceipts, createReceipt } from '../services/api'

const WAREHOUSES = ['Main WH', 'Store A', 'Store B', 'Cold Storage']
const EMPTY_FORM = { supplier: '', product: '', quantity: '', warehouse: '' }

function StatusBadge({ status }) {
  const styles = {
    Done:    'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default function Reciepts() {
  const [receipts, setReceipts] = useState([])
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)
  const [success, setSuccess]   = useState(false)

  useEffect(() => {
    getReceipts().then((data) => { setReceipts(data); setLoading(false) })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const receipt = await createReceipt(form)
    setReceipts((prev) => [receipt, ...prev])
    setForm(EMPTY_FORM)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-800">New Receipt</h2>
        </div>

        {success && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Receipt created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
            <input
              required value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className={inputClass}
              placeholder="e.g. Tech Supplies Co."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <input
              required value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className={inputClass}
              placeholder="e.g. USB-C Cable"
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Warehouse</label>
            <select
              required value={form.warehouse}
              onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
              className={inputClass}
            >
              <option value="">Select warehouse...</option>
              {WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 xl:col-span-4 flex justify-end">
            <button
              type="submit" disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
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
                  Create Receipt
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">
            Receipt History
            <span className="ml-2 text-sm font-normal text-slate-400">({receipts.length})</span>
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
                  {['Supplier', 'Product', 'Quantity', 'Warehouse', 'Date', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{r.supplier}</td>
                    <td className="px-6 py-4 text-slate-600">{r.product}</td>
                    <td className="px-6 py-4 text-slate-600">{r.quantity}</td>
                    <td className="px-6 py-4 text-slate-600">{r.warehouse}</td>
                    <td className="px-6 py-4 text-slate-500">{r.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
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
