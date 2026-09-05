import { useEffect, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';
import ListField from '../../components/ListField';

const emptyForm = { tag: '', title: '', items: [''] };

export default function CareersAdmin() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await client.get('/careers.php');
    setGroups(res.data.groups);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setError(''); setModalOpen(true); }
  function openEdit(row) { setEditing(row); setForm({ tag: row.tag || '', title: row.title, items: row.items.map((i) => i.text) }); setError(''); setModalOpen(true); }

  async function handleSubmit() {
    setSubmitting(true); setError('');
    const payload = { ...form, items: form.items.filter((i) => i.trim() !== '') };
    try {
      if (editing) await client.put(`/careers.php?id=${editing.id}`, payload);
      else await client.post('/careers.php', payload);
      setModalOpen(false); load();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(row) {
    if (!window.confirm(`ลบกลุ่มอาชีพ "${row.title}"?`)) return;
    await client.delete(`/careers.php?id=${row.id}`);
    load();
  }

  return (
    <div>
      <div className="admin-page-head">
        <h2>เส้นทางอาชีพ</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่มกลุ่มอาชีพ</button>
      </div>

      <CrudTable
        loading={loading}
        data={groups}
        onEdit={openEdit}
        onDelete={handleDelete}
        columns={[
          { key: 'tag', label: 'หมวด', render: (r) => <span className="chip-sm">{r.tag}</span> },
          { key: 'title', label: 'ชื่อกลุ่มอาชีพ' },
          { key: 'items', label: 'จำนวนอาชีพ', render: (r) => `${r.items.length} รายการ` },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? `แก้ไข: ${editing.title}` : 'เพิ่มกลุ่มอาชีพใหม่'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field-row">
          <div className="field">
            <label>รหัสหมวด</label>
            <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="เช่น 7.1" />
          </div>
        </div>
        <div className="field">
          <label>ชื่อกลุ่มอาชีพ *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <ListField
          label="รายการอาชีพ"
          values={form.items}
          onChange={(items) => setForm({ ...form, items })}
          placeholder="เช่น นักวิทยาศาสตร์ข้อมูล (Data Scientist)"
        />
      </Modal>
    </div>
  );
}
