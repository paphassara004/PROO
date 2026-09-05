export default function Modal({ open, title, onClose, onSubmit, submitLabel = 'บันทึก', error, children, submitting }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <h3>{title}</h3>
        {error && <div className="error-box">{error}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {children}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'กำลังบันทึก…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
