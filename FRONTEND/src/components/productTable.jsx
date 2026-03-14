const LOW_STOCK_THRESHOLD = 15

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
        Out of Stock
      </span>
    )
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
        Low: {stock}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      {stock}
    </span>
  )
}

export default function ProductTable({ products = [], onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-sm font-medium">No products found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
          <tr>
            {['Product Name', 'SKU', 'Category', 'Unit', 'Stock Level', 'Actions'].map((h) => (
              <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-800">{product.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-500 font-mono text-xs">{product.sku}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  {product.category}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600">{product.unit}</td>
              <td className="px-6 py-4">
                <StockBadge stock={product.stock} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
