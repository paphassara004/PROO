import { useEffect, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

const emptyCreateForm = { username: '', password: '', full_name: '', role: 'user' };
const emptyEditForm = { full_name: '', role: 'user' };

export default function UsersAdmin() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await client.get('/users.php');
    setUsers(res.data.users);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setCreateForm(emptyCreateForm); setError(''); setCreateOpen(true); }
  async function handleCreate() {
    setSubmitting(true); setError('');
    try {
      await client.post('/auth.php?action=register', createForm);
      setCreateOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.error || 'สร้างผู้ใช้ไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  function openEdit(row) {
    setEditing(row);
    setEditForm({ full_name: row.full_name || '', role: row.role });
    setError(''); setEditOpen(true);
  }
  async function handleEdit() {
    setSubmitting(true); setError('');
    try {
      await client.put(`/users.php?id=${editing.id}`, editForm);
      setEditOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.error || 'แก้ไขไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(row) {
    if (row.id === me.id) { alert('ไม่สามารถลบบัญชีของตนเองได้'); return; }
    if (!window.confirm(`ลบผู้ใช้ "${row.username}"?`)) return;
    await client.delete(`/users.php?id=${row.id}`);
    load();
  }

  return (
    <div>
      <div className="admin-page-head">
        <h2>ผู้ใช้งานระบบ</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่มผู้ใช้งาน</button>
      </div>

      <CrudTable
        loading={loading}
        data={users}
        onEdit={openEdit}
        onDelete={handleDelete}
        columns={[
          { key: 'username', label: 'ชื่อผู้ใช้' },
          { key: 'full_name', label: 'ชื่อเต็ม' },
          { key: 'role', label: 'สิทธิ์', render: (r) => <span className={`role-badge ${r.role}`}>{r.role}</span> },
          { key: 'created_at', label: 'สร้างเมื่อ' },
        ]}
      />

      <Modal open={createOpen} title="เพิ่มผู้ใช้งานใหม่" onClose={() => setCreateOpen(false)} onSubmit={handleCreate} error={error} submitting={submitting}>
        <div className="field">
          <label>ชื่อผู้ใช้ *</label>
          <input value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} required />
        </div>
        <div className="field">
          <label>รหัสผ่าน * (อย่างน้อย 6 ตัวอักษร)</label>
          <input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} minLength={6} required />
        </div>
        <div className="field">
          <label>ชื่อเต็ม</label>
          <input value={createForm.full_name} onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })} />
        </div>
        <div className="field">
          <label>สิทธิ์การใช้งาน</label>
          <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}>
            <option value="user">User (ดูข้อมูลอย่างเดียว)</option>
            <option value="admin">Admin (แก้ไขข้อมูลได้ทั้งหมด)</option>
          </select>
        </div>
      </Modal>

      <Modal open={editOpen} title={`แก้ไขผู้ใช้: ${editing?.username}`} onClose={() => setEditOpen(false)} onSubmit={handleEdit} error={error} submitting={submitting}>
        <div className="field">
          <label>ชื่อเต็ม</label>
          <input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
        </div>
        <div className="field">
          <label>สิทธิ์การใช้งาน</label>
          <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
            <option value="user">User (ดูข้อมูลอย่างเดียว)</option>
            <option value="admin">Admin (แก้ไขข้อมูลได้ทั้งหมด)</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
