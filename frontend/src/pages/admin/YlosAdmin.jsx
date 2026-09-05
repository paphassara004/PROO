import { useEffect, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';

const emptyForm = { year_no: '', description: '' };

export default function YlosAdmin() {
  const [ylos, setYlos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await client.get('/ylos.php');
    setYlos(res.data.ylos);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setError(''); setModalOpen(true); }
  function openEdit(row) { setEditing(row); setForm({ year_no: row.year_no, description: row.description || '' }); setError(''); setModalOpen(true); }

  async function handleSubmit() {
    setSubmitting(true); setError('');
    const payload = { ...form, year_no: Number(form.year_no) };
    try {
      if (editing) await client.put(`/ylos.php?id=${editing.id}`, payload);
      else await client.post('/ylos.php', payload);
      setModalOpen(false); load();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(row) {
    if (!window.confirm(`ลบ YLO ปีที่ ${row.year_no}?`)) return;
    await client.delete(`/ylos.php?id=${row.id}`);
    load();
  }

  return (
    <div>
      <div className="admin-page-head">
        <h2>พัฒนาการของผู้เรียนรายปี (YLO)</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่ม YLO</button>
      </div>

      <CrudTable
        loading={loading}
        data={ylos}
        onEdit={openEdit}
        onDelete={handleDelete}
        columns={[
          { key: 'year_no', label: 'ปีการศึกษา', render: (r) => <span className="chip-sm">ปีที่ {r.year_no}</span> },
          { key: 'description', label: 'คำอธิบาย' },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? `แก้ไข YLO ปีที่ ${editing.year_no}` : 'เพิ่ม YLO ใหม่'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field">
          <label>ปีการศึกษา *</label>
          <input type="number" min="1" max="4" value={form.year_no} onChange={(e) => setForm({ ...form, year_no: e.target.value })} required />
        </div>
        <div className="field">
          <label>คำอธิบาย</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
