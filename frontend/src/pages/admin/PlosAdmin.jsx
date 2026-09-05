import { useEffect, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';
import ListField from '../../components/ListField';

const emptyForm = { no: '', title: '', description: '', subs: [''] };

export default function PlosAdmin() {
  const [plos, setPlos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await client.get('/plos.php');
    setPlos(res.data.plos);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, no: plos.length + 1 });
    setError('');
    setModalOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setForm({ no: row.no, title: row.title, description: row.description || '', subs: row.subs.map((s) => s.text) });
    setError('');
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    const payload = { ...form, no: Number(form.no), subs: form.subs.filter((s) => s.trim() !== '') };
    try {
      if (editing) await client.put(`/plos.php?id=${editing.id}`, payload);
      else await client.post('/plos.php', payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`ลบ PLO ${row.no} — ${row.title}?`)) return;
    await client.delete(`/plos.php?id=${row.id}`);
    load();
  }

  return (
    <div>
      <div className="admin-page-head">
        <h2>ผลลัพธ์การเรียนรู้ระดับหลักสูตร (PLO)</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่ม PLO</button>
      </div>

      <CrudTable
        loading={loading}
        data={plos}
        onEdit={openEdit}
        onDelete={handleDelete}
        columns={[
          { key: 'no', label: 'ลำดับ', render: (r) => <span className="chip-sm">PLO {r.no}</span> },
          { key: 'title', label: 'หัวข้อ' },
          { key: 'subs', label: 'จำนวนตัวชี้วัดย่อย', render: (r) => `${r.subs.length} ข้อ` },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? `แก้ไข PLO ${editing.no}` : 'เพิ่ม PLO ใหม่'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field-row">
          <div className="field">
            <label>ลำดับที่</label>
            <input type="number" value={form.no} onChange={(e) => setForm({ ...form, no: e.target.value })} required />
          </div>
        </div>
        <div className="field">
          <label>หัวข้อ *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="field">
          <label>คำอธิบาย</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <ListField
          label="ตัวชี้วัดย่อย (Sub-PLO)"
          values={form.subs}
          onChange={(subs) => setForm({ ...form, subs })}
          placeholder="ระบุตัวชี้วัดย่อย…"
        />
      </Modal>
    </div>
  );
}
