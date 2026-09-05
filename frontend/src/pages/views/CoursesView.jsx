import { useMemo, useState } from 'react';

export default function CoursesView({ data, onBack }) {
  const [activeGroup, setActiveGroup] = useState('all');
  const [search, setSearch] = useState('');
  const [openCourse, setOpenCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return data.courses.filter((c) => {
      const matchGroup = activeGroup === 'all' || c.group_code === activeGroup;
      const s = search.trim().toLowerCase();
      const matchSearch = !s || c.code.toLowerCase().includes(s) || (c.th_name || '').toLowerCase().includes(s) || (c.en_name || '').toLowerCase().includes(s);
      return matchGroup && matchSearch;
    });
  }, [data.courses, activeGroup, search]);

  return (
    <section className="pub-section">
      <div className="container">
        <button className="view-back" onClick={() => onBack('hub')}>← กลับไปหน้าสำรวจหลักสูตร</button>
      </div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">คำอธิบายรายวิชา</div>
          <h2>สำรวจรายวิชา</h2>
          <p>พบ {filteredCourses.length} รายวิชา จากทั้งหมด {data.courses.length} รายวิชา</p>
        </div>
        <div className="explorer-controls">
          <input
            className="search-input"
            placeholder="ค้นหาด้วยรหัสวิชา หรือชื่อวิชา…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="explorer-controls">
          <button className={`filter-chip-pub${activeGroup === 'all' ? ' active' : ''}`} onClick={() => setActiveGroup('all')}>ทั้งหมด</button>
          {data.groups.map((g) => (
            <button
              key={g.code}
              className={`filter-chip-pub${activeGroup === g.code ? ' active' : ''}`}
              onClick={() => setActiveGroup(g.code)}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="course-list-pub">
          {filteredCourses.map((c) => (
            <div className="course-card-pub" key={c.id}>
              <div className="course-head-pub" onClick={() => setOpenCourse(openCourse === c.id ? null : c.id)}>
                <div className="course-head-left-pub">
                  <span className="course-code-pub">{c.code}</span>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{c.th_name}</span>
                  <span style={{ fontStyle: 'italic', color: 'var(--ink-soft)', fontSize: 13 }}>{c.en_name}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-faint)' }}>{c.credit_text}</span>
              </div>
              {openCourse === c.id && (
                <div className="course-body-pub">
                  <div>
                    <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>คำอธิบายรายวิชา (ไทย)</div>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{c.th_desc}</p>
                  </div>
                  <div>
                    <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>Course Description (English)</div>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{c.en_desc}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
