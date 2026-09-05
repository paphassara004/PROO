import { useEffect, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';

const emptyForm = { role: '', name: '', qualification: '', sort_order: 0 };

export default function FacultyAdmin() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await client.get('/faculty.php');
    setFaculty(res.data.faculty);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm({ ...emptyForm, sort_order: faculty.length }); setError(''); setModalOpen(true); }
  function openEdit(row) { setEditing(row); setForm({ role: row.role || '', name: row.name, qualification: row.qualification || '', sort_order: row.sort_order }); setError(''); setModalOpen(true); }

  async function handleSubmit() {
    setSubmitting(true); setError('');
    try {
      if (editing) await client.put(`/faculty.php?id=${editing.id}`, form);
      else await client.post('/faculty.php', form);
      setModalOpen(false); load();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(row) {
    if (!window.confirm(`ลบ ${row.name}?`)) return;
    await client.delete(`/faculty.php?id=${row.id}`);
    load();
  }

  return (
    <div>
      <div className="admin-page-head">
        <h2>อาจารย์ผู้รับผิดชอบหลักสูตร</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่มอาจารย์</button>
      </div>

      <CrudTable
        loading={loading}
        data={faculty}
        onEdit={openEdit}
        onDelete={handleDelete}
        columns={[
          { key: 'name', label: 'ชื่อ-สกุล' },
          { key: 'role', label: 'ตำแหน่ง' },
          { key: 'qualification', label: 'วุฒิการศึกษา' },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? `แก้ไข: ${editing.name}` : 'เพิ่มอาจารย์ใหม่'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field">
          <label>ชื่อ-สกุล *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>ตำแหน่งทางวิชาการ</label>
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="เช่น ผู้ช่วยศาสตราจารย์" />
        </div>
        <div className="field">
          <label>วุฒิการศึกษา</label>
          <textarea value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
