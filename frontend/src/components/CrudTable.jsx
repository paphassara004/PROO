export default function CrudTable({ columns, data, idKey = 'id', onEdit, onDelete, loading, emptyText = 'ยังไม่มีข้อมูล' }) {
  if (loading) return <div className="empty-state">กำลังโหลดข้อมูล…</div>;
  if (!data || data.length === 0) return <div className="empty-state">{emptyText}</div>;

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            <th style={{ width: 140 }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[idKey]}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>
              ))}
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(row)}>แก้ไข</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(row)}>ลบ</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
