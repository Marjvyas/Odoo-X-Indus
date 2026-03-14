import { useState, useEffect } from 'react'
import { getTransfers, updateTransferStatus } from '../services/api'

function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-amber-100 text-amber-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Done: 'bg-emerald-100 text-emerald-700',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default function EmployeeTransfers() {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const loadTransfers = () => {
    getTransfers().then((data) => {
      setTransfers(data)
      setLoading(false)
    })
  }

  useEffect(() => { loadTransfers() }, [])

  const handleConfirm = async (id) => {
    setUpdating(id)
    await updateTransferStatus(id, 'Completed')
    const fresh = await getTransfers()
    setTransfers(fresh)
    setUpdating(null)
  }

  const pendingCount = transfers.filter((t) => t.status === 'Pending').length

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3 text-sm text-amber-800">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span><strong>{pendingCount}</strong> transfer{pendingCount > 1 ? 's' : ''} pending your confirmation.</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">
            Pending Transfers
            <span className="ml-2 text-sm font-normal text-slate-400">({transfers.length})</span>
          </h2>
          <button
            onClick={loadTransfers}
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
                  {['Transfer ID', 'Product', 'Quantity', 'From', 'To', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">#{t.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{t.product}</td>
                    <td className="px-6 py-4 text-slate-600">{t.quantity}</td>
                    <td className="px-6 py-4 text-slate-600">{t.from}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      {t.to}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                    <td className="px-6 py-4">
                      {updating === t.id ? (
                        <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : t.status === 'Pending' ? (
                        <button
                          onClick={() => handleConfirm(t.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Confirm Transfer
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
