import { useMemo, useState } from 'react';

const KSEC_LABEL = { K: 'Knowledge', S: 'Skills', E: 'Ethics', C: 'Characteristics' };

export default function CloView({ data, onBack }) {
  const [selected, setSelected] = useState('');
  const courseLookup = useMemo(() => Object.fromEntries(data.courses.map((c) => [c.code, c])), [data.courses]);

  const cloByCourse = useMemo(() => {
    const map = {};
    (data.clos || []).forEach((c) => {
      if (!map[c.course_code]) map[c.course_code] = [];
      map[c.course_code].push({ ...c, plo: JSON.parse(c.plo_json || '[]') });
    });
    Object.values(map).forEach((list) => list.sort((a, b) => a.sort_order - b.sort_order));
    return map;
  }, [data.clos]);

  const courseCodesWithClo = Object.keys(cloByCourse).filter((code) => courseLookup[code]);

  const matrixRows = useMemo(() => {
    return courseCodesWithClo.map((code) => {
      const plosHit = new Set();
      cloByCourse[code].forEach((c) => c.plo.forEach((p) => plosHit.add(p)));
      return { code, name: courseLookup[code]?.th_name, plosHit };
    });
  }, [courseCodesWithClo, cloByCourse, courseLookup]);

  return (
    <section className="pub-section">
      <div className="container">
        <button className="view-back" onClick={() => onBack('hub')}>← กลับไปหน้าสำรวจหลักสูตร</button>
      </div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">ผลลัพธ์การเรียนรู้</div>
          <h2>CLO รายวิชา</h2>
          <p>ผลลัพธ์การเรียนรู้ระดับรายวิชา (Course Learning Outcomes) พร้อมหมวด K-S-E-C และ Curriculum Mapping สู่ PLO (Program Learning Outcomes)</p> 
        </div>

        <div className="explorer-controls">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            style={{ maxWidth: 520, padding: '10px 14px', borderRadius: 100, border: '1px solid var(--line)', fontSize: 14, background: '#fff' }}
          >
            <option value="">— เลือกรายวิชาเพื่อดู CLO —</option>
            {courseCodesWithClo.map((code) => (
              <option key={code} value={code}>{code} — {courseLookup[code]?.th_name}</option>
            ))}
          </select>
        </div>

        {!selected && <div className="clo-empty">เลือกรายวิชาด้านบนเพื่อดูผลลัพธ์การเรียนรู้ระดับรายวิชา (CLO)</div>}
        {selected && (
          <>
            <div style={{ marginBottom: 10 }}>
              <span className="chip"><b>{selected}</b>&nbsp;{courseLookup[selected]?.th_name}</span>
            </div>
            {(cloByCourse[selected] || []).map((clo) => (
              <div className="clo-item" key={clo.id}>
                <div className={`clo-ksec ${clo.ksec}`} title={KSEC_LABEL[clo.ksec]}>{clo.ksec}</div>
                <div className="clo-body">
                  <div className="clo-text">{clo.text}</div>
                  <div className="clo-plo-chips">{clo.plo.map((p) => <span key={p} className="clo-plo-chip">PLO {p}</span>)}</div>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="section-head" style={{ marginTop: 44 }}>
          <h3 style={{ fontSize: 19, color: 'var(--teal-deep)', fontFamily: 'var(--font-display)' }}>ตารางสรุป Curriculum Mapping (CLO → PLO)</h3>
          <p>สรุปว่าแต่ละรายวิชาส่งเสริม PLO ข้อใดบ้าง จากการวิเคราะห์ CLO ข้างต้น</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 600, background: '#fff', borderRadius: 10 }}>
            <thead>
              <tr>
                <th>รายวิชา</th>
                {[1, 2, 3, 4, 5].map((p) => <th key={p} style={{ textAlign: 'center' }}>PLO {p}</th>)}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.code}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {row.code} <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-soft)' }}>· {row.name}</span>
                  </td>
                  {[1, 2, 3, 4, 5].map((p) => (
                    <td key={p} style={{ textAlign: 'center' }}>{row.plosHit.has(p) && <span className="clo-matrix-dot" />}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
