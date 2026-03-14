const employeeNavItems = [
  {
    id: 'emp-deliveries',
    label: 'Assigned Deliveries',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    id: 'emp-transfers',
    label: 'Pending Transfers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
]

export default function EmployeeSidebar({ currentPage, setCurrentPage, userName, onLogout }) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">InvenTrack</p>
          <p className="text-xs text-slate-400">Delivery Staff</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          My Tasks
        </p>
        {employeeNavItems.map((item) => {
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left
                ${isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold">
            {userName ? userName.charAt(0).toUpperCase() : 'E'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName || 'Employee'}</p>
            <p className="text-xs text-slate-400 truncate">Delivery Staff</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
