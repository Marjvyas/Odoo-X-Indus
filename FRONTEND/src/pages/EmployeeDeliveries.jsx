import { useState, useEffect } from 'react'
import { getDeliveries, updateDeliveryStatus } from '../services/api'

function StatusBadge({ status }) {
  const styles = {
    Created: 'bg-amber-100 text-amber-700',
    Dispatched: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default function EmployeeDeliveries() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const loadDeliveries = () => {
    getDeliveries().then((data) => {
      setDeliveries(data)
      setLoading(false)
    })
  }

  useEffect(() => { loadDeliveries() }, [])

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(id)
    await updateDeliveryStatus(id, newStatus)
    const fresh = await getDeliveries()
    setDeliveries(fresh)
    setUpdating(null)
  }

  const pendingCount = deliveries.filter((d) => d.status !== 'Delivered').length

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3 text-sm text-amber-800">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span><strong>{pendingCount}</strong> delivery order{pendingCount > 1 ? 's' : ''} need your attention.</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">
            Assigned Deliveries
            <span className="ml-2 text-sm font-normal text-slate-400">({deliveries.length})</span>
          </h2>
          <button
            onClick={loadDeliveries}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
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
                  {['Order ID', 'Customer', 'Product', 'Quantity', 'Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">#{d.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{d.customer}</td>
                    <td className="px-6 py-4 text-slate-600">{d.product}</td>
                    <td className="px-6 py-4 text-slate-600">{d.quantity}</td>
                    <td className="px-6 py-4 text-slate-500">{d.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4">
                      {updating === d.id ? (
                        <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : d.status === 'Created' || d.status === 'Pending' ? (
                        <button
                          onClick={() => handleStatusUpdate(d.id, 'Dispatched')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                          </svg>
                          Mark Dispatched
                        </button>
                      ) : d.status === 'Dispatched' ? (
                        <button
                          onClick={() => handleStatusUpdate(d.id, 'Delivered')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Completed</span>
                      )}
                    </td>
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
