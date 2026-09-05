import { useEffect, useMemo, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';

const emptyForm = { year_no: 1, track: '', sem_no: 1, course_code: '', custom_name: '', custom_credit: '', sort_order: 0 };

export default function StudyPlanAdmin() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState(1);
  const [trackFilter, setTrackFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const [spRes, cRes] = await Promise.all([
      client.get('/studyplan.php'),
      client.get('/courses.php'),
    ]);
    setItems(spRes.data.items);
    setCourses(cRes.data.courses);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchYear = Number(i.year_no) === Number(yearFilter);
      const matchTrack = trackFilter === '' ? true : (i.track || '') === trackFilter;
      return matchYear && matchTrack;
    }).sort((a, b) => a.sem_no - b.sem_no || a.sort_order - b.sort_order);
  }, [items, yearFilter, trackFilter]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, year_no: yearFilter, track: trackFilter });
    setError(''); setModalOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setForm({
      year_no: row.year_no, track: row.track || '', sem_no: row.sem_no,
      course_code: row.course_code || '', custom_name: row.custom_name || '', custom_credit: row.custom_credit || '',
      sort_order: row.sort_order,
    });
    setError(''); setModalOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true); setError('');
    const payload = {
      ...form,
      year_no: Number(form.year_no),
      sem_no: Number(form.sem_no),
      track: form.track || null,
      course_code: form.course_code || null,
      custom_name: form.course_code ? null : (form.custom_name || null),
      custom_credit: form.course_code ? null : (form.custom_credit || null),
    };
    try {
      if (editing) await client.put(`/studyplan.php?id=${editing.id}`, payload);
      else await client.post('/studyplan.php', payload);
      setModalOpen(false); load();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(row) {
    if (!window.confirm('ลบรายการนี้ออกจากแผนการเรียน?')) return;
    await client.delete(`/studyplan.php?id=${row.id}`);
    load();
  }

  return (
    <div>
      <div className="admin-page-head">
        <h2>แผนการเรียน</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ เพิ่มรายวิชาในแผน</button>
      </div>

      <div className="toolbar">
        {[1, 2, 3, 4].map((y) => (
          <button key={y} className={`btn btn-sm ${Number(yearFilter) === y ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setYearFilter(y)}>
            ปีที่ {y}
          </button>
        ))}
        {Number(yearFilter) >= 3 && (
          <>
            <span style={{ color: 'var(--ink-faint)', fontSize: 13 }}>|</span>
            <button className={`btn btn-sm ${trackFilter === '' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTrackFilter('')}>ทั้งหมด</button>
            <button className={`btn btn-sm ${trackFilter === 'a' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTrackFilter('a')}>แขนง A</button>
            <button className={`btn btn-sm ${trackFilter === 'b' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTrackFilter('b')}>แขนง B</button>
          </>
        )}
      </div>

      <CrudTable
        loading={loading}
        data={filtered}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyText="ยังไม่มีรายวิชาในแผนการเรียนของปี/แขนงนี้"
        columns={[
          { key: 'sem_no', label: 'ภาค', render: (r) => `ภาค ${r.sem_no}` },
          { key: 'track', label: 'แขนง', render: (r) => r.track ? r.track.toUpperCase() : '—' },
          { key: 'code', label: 'รหัสวิชา', render: (r) => r.course_code || <em style={{ color: 'var(--ink-faint)' }}>กำหนดเอง</em> },
          { key: 'name', label: 'ชื่อวิชา', render: (r) => r.course_code ? r.course_th_name : r.custom_name },
          { key: 'credit', label: 'หน่วยกิต', render: (r) => r.course_code ? r.course_credit_text : r.custom_credit },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'แก้ไขรายการในแผนการเรียน' : 'เพิ่มรายวิชาในแผนการเรียน'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field-row">
          <div className="field">
            <label>ปีการศึกษา *</label>
            <select value={form.year_no} onChange={(e) => setForm({ ...form, year_no: e.target.value })}>
              {[1, 2, 3, 4].map((y) => <option key={y} value={y}>ปีที่ {y}</option>)}
            </select>
          </div>
          <div className="field">
            <label>ภาคการศึกษา *</label>
            <select value={form.sem_no} onChange={(e) => setForm({ ...form, sem_no: e.target.value })}>
              <option value={1}>ภาค 1</option>
              <option value={2}>ภาค 2</option>
            </select>
          </div>
        </div>
        {Number(form.year_no) >= 3 && (
          <div className="field">
            <label>แขนงวิชาเอก</label>
            <select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}>
              <option value="">— ไม่ระบุ (ร่วมทั้ง 2 แขนง) —</option>
              <option value="a">แขนง A — วิทยาการข้อมูลและ AI ทางการแพทย์</option>
              <option value="b">แขนง B — เทคโนโลยีสารสนเทศทางการแพทย์</option>
            </select>
          </div>
        )}

        <div className="field">
          <label>เลือกรายวิชาจากฐานข้อมูล (แนะนำ)</label>
          <select value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })}>
            <option value="">— ไม่เลือก / กำหนดชื่อวิชาเอง —</option>
            {courses.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.th_name}</option>)}
          </select>
        </div>

        {!form.course_code && (
          <div className="field-row">
            <div className="field">
              <label>ชื่อวิชา (กำหนดเอง)</label>
              <input value={form.custom_name} onChange={(e) => setForm({ ...form, custom_name: e.target.value })} placeholder="เช่น วิชาศึกษาทั่วไป (เลือก)" />
            </div>
            <div className="field">
              <label>หน่วยกิต (กำหนดเอง)</label>
              <input value={form.custom_credit} onChange={(e) => setForm({ ...form, custom_credit: e.target.value })} placeholder="เช่น 3(x-x-x)" />
            </div>
          </div>
        )}

        <div className="field">
          <label>ลำดับการแสดงผลในตาราง</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
