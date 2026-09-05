import { useEffect, useMemo, useState } from 'react';
import client from '../../api/client';
import CrudTable from '../../components/CrudTable';
import Modal from '../../components/Modal';

const emptySkillForm = { name: '', category: '', description: '' };

export default function SkillsAdmin() {
  const [tab, setTab] = useState('skills'); // 'skills' | 'mapping'
  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySkillForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mapping tab state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseSkills, setCourseSkills] = useState([]);
  const [mapSkillId, setMapSkillId] = useState('');
  const [mapWeight, setMapWeight] = useState(3);
  const [mapError, setMapError] = useState('');

  async function loadBase() {
    setLoading(true);
    const [sRes, cRes] = await Promise.all([
      client.get('/skills.php'),
      client.get('/courses.php'),
    ]);
    setSkills(sRes.data.skills);
    setCourses(cRes.data.courses);
    setLoading(false);
  }
  useEffect(() => { loadBase(); }, []);

  async function loadCourseSkills(code) {
    if (!code) { setCourseSkills([]); return; }
    const res = await client.get(`/skills.php?action=map&course=${encodeURIComponent(code)}`);
    setCourseSkills(res.data.skills);
  }
  useEffect(() => { loadCourseSkills(selectedCourse); }, [selectedCourse]);

  // --- Skills CRUD ---
  function openCreate() { setEditing(null); setForm(emptySkillForm); setError(''); setModalOpen(true); }
  function openEdit(row) { setEditing(row); setForm({ name: row.name, category: row.category || '', description: row.description || '' }); setError(''); setModalOpen(true); }

  async function handleSubmit() {
    setSubmitting(true); setError('');
    try {
      if (editing) await client.put(`/skills.php?id=${editing.id}`, form);
      else await client.post('/skills.php', form);
      setModalOpen(false); loadBase();
    } catch (err) {
      setError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(row) {
    if (!window.confirm(`ลบทักษะ "${row.name}"? การแมปกับรายวิชาทั้งหมดจะถูกลบไปด้วย`)) return;
    await client.delete(`/skills.php?id=${row.id}`);
    loadBase();
  }

  // --- Mapping ---
  async function addMapping() {
    setMapError('');
    if (!selectedCourse || !mapSkillId) { setMapError('กรุณาเลือกรายวิชาและทักษะ'); return; }
    try {
      await client.post('/skills.php?action=map', { course_code: selectedCourse, skill_id: Number(mapSkillId), weight: Number(mapWeight) });
      setMapSkillId(''); setMapWeight(3);
      loadCourseSkills(selectedCourse);
    } catch (err) {
      setMapError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ');
    }
  }
  async function removeMapping(mappingId) {
    if (!window.confirm('ลบการแมปนี้?')) return;
    await client.delete(`/skills.php?action=map&id=${mappingId}`);
    loadCourseSkills(selectedCourse);
  }

  const courseOptions = useMemo(() => courses.map((c) => ({ code: c.code, label: `${c.code} — ${c.th_name}` })), [courses]);

  return (
    <div>
      <div className="admin-page-head">
        <h2>ทักษะ &amp; การแมป (Skill Mapping)</h2>
      </div>

      <div className="toolbar">
        <button className={`btn btn-sm ${tab === 'skills' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('skills')}>จัดการทักษะ</button>
        <button className={`btn btn-sm ${tab === 'mapping' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('mapping')}>แมปรายวิชา ↔ ทักษะ</button>
      </div>

      {tab === 'skills' && (
        <>
          <div className="toolbar">
            <button className="btn btn-primary" onClick={openCreate}>+ เพิ่มทักษะ</button>
          </div>
          <CrudTable
            loading={loading}
            data={skills}
            onEdit={openEdit}
            onDelete={handleDelete}
            columns={[
              { key: 'name', label: 'ชื่อทักษะ' },
              { key: 'category', label: 'หมวดหมู่', render: (r) => r.category ? <span className="chip-sm">{r.category}</span> : '—' },
              { key: 'description', label: 'คำอธิบาย' },
            ]}
          />
        </>
      )}

      {tab === 'mapping' && (
        <div className="card" style={{ padding: 22 }}>
          <div className="field">
            <label>เลือกรายวิชา</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">— เลือกรายวิชา —</option>
              {courseOptions.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </div>

          {selectedCourse && (
            <>
              {mapError && <div className="error-box">{mapError}</div>}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap' }}>
                <div className="field" style={{ marginBottom: 0, flex: '1 1 220px' }}>
                  <label>เพิ่มทักษะให้วิชานี้</label>
                  <select value={mapSkillId} onChange={(e) => setMapSkillId(e.target.value)}>
                    <option value="">— เลือกทักษะ —</option>
                    {skills.map((s) => <option key={s.id} value={s.id}>{s.name}{s.category ? ` (${s.category})` : ''}</option>)}
                  </select>
                </div>
                <div className="field" style={{ marginBottom: 0, width: 140 }}>
                  <label>ระดับความเข้มข้น (1–5)</label>
                  <input type="number" min={1} max={5} value={mapWeight} onChange={(e) => setMapWeight(e.target.value)} />
                </div>
                <button className="btn btn-accent" onClick={addMapping}>+ เพิ่มการแมป</button>
              </div>

              <h4 style={{ fontSize: 14, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 10 }}>
                ทักษะที่แมปกับวิชานี้ ({courseSkills.length})
              </h4>
              {courseSkills.length === 0 ? (
                <div className="empty-state">ยังไม่มีทักษะที่แมปกับวิชานี้</div>
              ) : (
                <div className="card" style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead><tr><th>ทักษะ</th><th>หมวดหมู่</th><th>ระดับความเข้มข้น</th><th style={{ width: 90 }}>จัดการ</th></tr></thead>
                    <tbody>
                      {courseSkills.map((s) => (
                        <tr key={s.mapping_id}>
                          <td>{s.name}</td>
                          <td>{s.category ? <span className="chip-sm">{s.category}</span> : '—'}</td>
                          <td>{'●'.repeat(s.weight)}{'○'.repeat(5 - s.weight)}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => removeMapping(s.mapping_id)}>
                              ลบ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? `แก้ไขทักษะ: ${editing.name}` : 'เพิ่มทักษะใหม่'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      >
        <div className="field">
          <label>ชื่อทักษะ *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>หมวดหมู่</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="เช่น Programming, AI/ML, Soft Skill" />
        </div>
        <div className="field">
          <label>คำอธิบาย</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
