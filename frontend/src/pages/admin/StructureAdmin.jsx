import { useEffect, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';

const emptyForm = { label: '', credit: '', level: 1, sort_order: 0 };

export default function StructureAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await client.get('/structure.php');
    setItems(res.data.items);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm({ ...emptyForm, sort_order: items.length }); setError(''); setModalOpen(true); }
  function openEdit(row) { setEditing(row); setForm({ label: row.label, credit: row.credit, level: row.level, sort_order: row.sort_order }); setError(''); setModalOpen(true); }

  async function handleSubmit() {
    setSubmitting(true); setError('');
    const payload = { ...form, credit: Number(form.credit), level: Number(form.level), sort_order: Number(form.sort_order) };
    try {
      if (editing) await client.put(`/structure.php?id=${editing.id}`, payload);
      else await client.post('/structure.php', payload);
      setModalOpen(false); load();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(row) {
    if (!window.confirm(`ลบ "${row.label}"?`)) return;
    await client.delete(`/structure.php?id=${row.id}`);
    load();
  }

  const totalMain = items.filter((i) => i.level === 1).reduce((a, i) => a + Number(i.credit), 0);

  return (
    <div>
      <div className="admin-page-head">
        <h2>โครงสร้างหน่วยกิต <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--ink-faint)' }}>(รวม {totalMain} นก.)</span></h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่มรายการ</button>
      </div>

      <CrudTable
        loading={loading}
        data={items}
        onEdit={openEdit}
        onDelete={handleDelete}
        columns={[
          { key: 'label', label: 'ชื่อหมวดวิชา', render: (r) => <span style={{ paddingLeft: r.level === 2 ? 16 : 0 }}>{r.label}</span> },
          { key: 'credit', label: 'หน่วยกิต' },
          { key: 'level', label: 'ระดับ', render: (r) => (r.level === 1 ? 'หมวดหลัก' : 'หมวดย่อย') },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field">
          <label>ชื่อหมวดวิชา *</label>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
        </div>
        <div className="field-row">
          <div className="field">
            <label>หน่วยกิต *</label>
            <input type="number" value={form.credit} onChange={(e) => setForm({ ...form, credit: e.target.value })} required />
          </div>
          <div className="field">
            <label>ระดับ</label>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option value={1}>หมวดหลัก</option>
              <option value={2}>หมวดย่อย</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>ลำดับการแสดงผล</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
