import { useEffect, useMemo, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';

const emptyForm = {
  code: '', credit_text: '', th_name: '', en_name: '',
  th_desc: '', en_desc: '', group_code: '', year_no: '', sem_no: '',
};

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [cRes, gRes] = await Promise.all([
        client.get('/courses.php'),
        client.get('/courses.php?action=groups'),
      ]);
      setCourses(cRes.data.courses);
      setGroups(gRes.data.groups);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const s = search.trim().toLowerCase();
      const matchSearch = !s || c.code.toLowerCase().includes(s) || (c.th_name || '').toLowerCase().includes(s);
      const matchGroup = !groupFilter || c.group_code === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [courses, search, groupFilter]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setForm({
      code: row.code, credit_text: row.credit_text || '', th_name: row.th_name || '', en_name: row.en_name || '',
      th_desc: row.th_desc || '', en_desc: row.en_desc || '', group_code: row.group_code || '',
      year_no: row.year_no ?? '', sem_no: row.sem_no ?? '',
    });
    setError('');
    setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    const payload = {
      ...form,
      year_no: form.year_no === '' ? null : Number(form.year_no),
      sem_no: form.sem_no === '' ? null : Number(form.sem_no),
    };
    try {
      if (editing) {
        await client.put(`/courses.php?id=${editing.id}`, payload);
      } else {
        await client.post('/courses.php', payload);
      }
      setModalOpen(false);
      loadAll();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`ลบรายวิชา ${row.code} — ${row.th_name}?`)) return;
    await client.delete(`/courses.php?id=${row.id}`);
    loadAll();
  }

  const groupLabel = (code) => groups.find((g) => g.code === code)?.label || code || '—';

  return (
    <div>
      <div className="admin-page-head">
        <h2>รายวิชา</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่มรายวิชา</button>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="ค้นหารหัสวิชา หรือชื่อวิชา…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid var(--line)' }}>
          <option value="">ทุกหมวดวิชา</option>
          {groups.map((g) => <option key={g.code} value={g.code}>{g.label}</option>)}
        </select>
      </div>

      <CrudTable
        loading={loading}
        data={filtered}
        onEdit={openEdit}
        onDelete={handleDelete}
        columns={[
          { key: 'code', label: 'รหัสวิชา', render: (r) => <span className="chip-sm">{r.code}</span> },
          { key: 'th_name', label: 'ชื่อวิชา (ไทย)' },
          { key: 'en_name', label: 'ชื่อวิชา (English)' },
          { key: 'credit_text', label: 'หน่วยกิต' },
          { key: 'group_code', label: 'หมวดวิชา', render: (r) => groupLabel(r.group_code) },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? `แก้ไขรายวิชา: ${editing.code}` : 'เพิ่มรายวิชาใหม่'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field-row">
          <div className="field">
            <label>รหัสวิชา *</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required placeholder="เช่น SC-112-101" />
          </div>
          <div className="field">
            <label>หน่วยกิต</label>
            <input value={form.credit_text} onChange={(e) => setForm({ ...form, credit_text: e.target.value })} placeholder="เช่น 3(2-2-5)" />
          </div>
        </div>

        <div className="field">
          <label>ชื่อวิชา (ไทย) *</label>
          <input value={form.th_name} onChange={(e) => setForm({ ...form, th_name: e.target.value })} required />
        </div>
        <div className="field">
          <label>Course Name (English)</label>
          <input value={form.en_name} onChange={(e) => setForm({ ...form, en_name: e.target.value })} />
        </div>

        <div className="field">
          <label>คำอธิบายรายวิชา (ไทย)</label>
          <textarea value={form.th_desc} onChange={(e) => setForm({ ...form, th_desc: e.target.value })} />
        </div>
        <div className="field">
          <label>Course Description (English)</label>
          <textarea value={form.en_desc} onChange={(e) => setForm({ ...form, en_desc: e.target.value })} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>หมวดวิชา</label>
            <select value={form.group_code} onChange={(e) => setForm({ ...form, group_code: e.target.value })}>
              <option value="">— ไม่ระบุ —</option>
              {groups.map((g) => <option key={g.code} value={g.code}>{g.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>ปี / ภาคการศึกษา</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" min="1" max="4" placeholder="ปี" value={form.year_no} onChange={(e) => setForm({ ...form, year_no: e.target.value })} />
              <input type="number" min="1" max="2" placeholder="ภาค" value={form.sem_no} onChange={(e) => setForm({ ...form, sem_no: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
