/** A field for editing an array of plain-text strings (e.g. sub-PLOs, career items). */
export default function ListField({ label, values, onChange, placeholder }) {
  const items = values && values.length ? values : [''];

  function updateAt(i, val) {
    const next = [...items];
    next[i] = val;
    onChange(next);
  }
  function removeAt(i) {
    const next = items.filter((_, idx) => idx !== i);
    onChange(next.length ? next : ['']);
  }
  function add() {
    onChange([...items, '']);
  }

  return (
    <div className="field">
      <label>{label}</label>
      {items.map((v, i) => (
        <div className="list-field-row" key={i}>
          <input
            type="text"
            value={v}
            placeholder={placeholder}
            onChange={(e) => updateAt(i, e.target.value)}
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeAt(i)}>ลบ</button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost btn-sm" onClick={add} style={{ alignSelf: 'flex-start' }}>+ เพิ่มรายการ</button>
    </div>
  );
}
