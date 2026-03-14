import { useState, useEffect } from 'react'
import { getTransfers, createTransfer } from '../services/api'

const LOCATIONS = ['Main WH', 'Store A', 'Store B', 'Cold Storage', 'Dispatch Bay']
const EMPTY_FORM = { from: '', to: '', product: '', quantity: '' }

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

export default function Transfers() {
  const [transfers, setTransfers] = useState([])
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [loading, setLoading]     = useState(true)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    getTransfers().then((data) => { setTransfers(data); setLoading(false) })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.from === form.to) {
      setError('Source and destination locations must be different.')
      return
    }
    setError('')
    setSaving(true)
    const transfer = await createTransfer(form)
    setTransfers((prev) => [transfer, ...prev])
    setForm(EMPTY_FORM)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-800">New Internal Transfer</h2>
        </div>

        {success && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Transfer created successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-4 py-3 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">From Location</label>
            <div className="relative">
              <select
                required value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className={inputClass}
              >
                <option value="">Select source...</option>
                {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Arrow icon between From/To — visible on xl */}
          <div className="hidden xl:flex items-end justify-center pb-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">To Location</label>
            <select
              required value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              className={inputClass}
            >
              <option value="">Select destination...</option>
              {LOCATIONS.filter((l) => l !== form.from).map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Spacer on xl (arrow takes one slot) */}
          <div className="hidden xl:block" />

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <input
              required value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className={inputClass}
              placeholder="e.g. USB-C Cable"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
            <input
              required type="number" min="1" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className={inputClass}
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2 xl:col-span-4 flex justify-end">
            <button
              type="submit" disabled={saving}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Create Transfer
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
            Transfer History
            <span className="ml-2 text-sm font-normal text-slate-400">({transfers.length})</span>
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
                  {['From', 'To', 'Product', 'Quantity', 'Date', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{t.from}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      {t.to}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{t.product}</td>
                    <td className="px-6 py-4 text-slate-600">{t.quantity}</td>
                    <td className="px-6 py-4 text-slate-500">{t.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
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
