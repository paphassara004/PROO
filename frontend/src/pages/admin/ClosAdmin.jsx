import { useEffect, useMemo, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';
import ListField from '../../components/ListField';

const emptyForm = { course_code: '', text: '', ksec: 'K', plo: [''] };

export default function ClosAdmin() {
  const [clos, setClos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const [cloRes, courseRes] = await Promise.all([
      client.get('/clos.php'),
      client.get('/courses.php'),
    ]);
    setClos(cloRes.data.clos);
    setCourses(courseRes.data.courses);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return courseFilter ? clos.filter((c) => c.course_code === courseFilter) : clos;
  }, [clos, courseFilter]);

  const courseLookup = useMemo(() => Object.fromEntries(courses.map((c) => [c.code, c])), [courses]);

  function openCreate() { setEditing(null); setForm(emptyForm); setError(''); setModalOpen(true); }
  function openEdit(row) {
    setEditing(row);
    let plo = [];
    try { plo = JSON.parse(row.plo_json || '[]').map(String); } catch { /* ignore */ }
    setForm({ course_code: row.course_code, text: row.text, ksec: row.ksec, plo: plo.length ? plo : [''] });
    setError(''); setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true); setError('');
    const payload = {
      ...form,
      plo: form.plo.filter((p) => p.trim() !== '').map(Number).filter((n) => !Number.isNaN(n)),
    };
    try {
      if (editing) await client.put(`/clos.php?id=${editing.id}`, payload);
      else await client.post('/clos.php', payload);
      setModalOpen(false); load();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(row) {
    if (!window.confirm('ลบ CLO ข้อนี้?')) return;
    await client.delete(`/clos.php?id=${row.id}`);
    load();
  }

  return (
    <div>
      <div className="admin-page-head">
        <h2>CLO รายวิชา</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่ม CLO</button>
      </div>

      <div className="toolbar">
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid var(--line)' }}>
          <option value="">ทุกรายวิชา</option>
          {courses.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.th_name}</option>)}
        </select>
      </div>

      <CrudTable
        loading={loading}
        data={filtered}
        onEdit={openEdit}
        onDelete={handleDelete}
        columns={[
          { key: 'course_code', label: 'รายวิชา', render: (r) => <span className="chip-sm">{r.course_code}</span> },
          { key: 'text', label: 'ผลลัพธ์การเรียนรู้ (CLO)' },
          { key: 'ksec', label: 'KSEC' },
          { key: 'plo_json', label: 'PLO', render: (r) => { try { return JSON.parse(r.plo_json).map((p) => `PLO ${p}`).join(', '); } catch { return '—'; } } },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'แก้ไข CLO' : 'เพิ่ม CLO ใหม่'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field">
          <label>รายวิชา *</label>
          <select value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })} required>
            <option value="">— เลือกรายวิชา —</option>
            {courses.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.th_name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>ผลลัพธ์การเรียนรู้ (CLO) *</label>
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
        </div>
        <div className="field">
          <label>หมวด KSEC</label>
          <select value={form.ksec} onChange={(e) => setForm({ ...form, ksec: e.target.value })}>
            <option value="K">K — Knowledge</option>
            <option value="S">S — Skills</option>
            <option value="E">E — Ethics</option>
            <option value="C">C — Characteristics</option>
          </select>
        </div>
        <ListField
          label="PLO ที่เกี่ยวข้อง (ระบุตัวเลข เช่น 1, 2)"
          values={form.plo}
          onChange={(plo) => setForm({ ...form, plo })}
          placeholder="เช่น 2"
        />
      </Modal>
    </div>
  );
}
