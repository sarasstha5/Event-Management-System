export default function Table({ columns, children }) {
  return (
    <div className="bg-white rounded-2xl border border-line overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-black/[0.015]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left font-mono text-xs uppercase tracking-wide text-ink-faint font-medium px-5 py-3 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function Td({ children, className = '' }) {
  return <td className={`px-5 py-3.5 align-middle text-ink ${className}`}>{children}</td>
}
