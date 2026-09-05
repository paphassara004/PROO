import { useMemo, useState } from 'react';

export default function PlanView({ items, onBack }) {
  const [year, setYear] = useState(1);
  const [track, setTrack] = useState('a');

  const semItems = useMemo(() => {
    return (sem) => items
      .filter((i) => Number(i.year_no) === Number(year) && i.sem_no === sem && (year < 3 || (i.track || 'a') === track || !i.track))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [items, year, track]);

  function renderTable(sem) {
    const rows = semItems(sem);
    const total = rows.reduce((sum, r) => {
      const creditText = r.course_code ? r.course_credit_text : r.custom_credit;
      const m = /^(\d+)/.exec(creditText || '');
      return sum + (m ? Number(m[1]) : 0);
    }, 0);
    return (
      <div className="sem-block" key={sem} style={{ marginBottom: 26 }}>
        <h4 style={{
          fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--teal-deep)', textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          ภาคการศึกษาที่ {sem}
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </h4>
        <table className="data-table" style={{ background: '#fff', borderRadius: 10, width: '100%' }}>
          <thead><tr><th>รหัสวิชา</th><th>ชื่อวิชา</th><th>น(ท-ป-ศ)</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--teal)' }}>{r.course_code || '—'}</td>
                <td>{r.course_code ? r.course_th_name : r.custom_name}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, textAlign: 'right' }}>{r.course_code ? r.course_credit_text : r.custom_credit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 8 }}>
          รวม {total} หน่วยกิต
        </div>
      </div>
    );
  }

  return (
    <section className="pub-section alt">
      <div className="container">
        <button className="view-back" onClick={() => onBack('hub')}>← กลับไปหน้าสำรวจหลักสูตร</button>
      </div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">แผนการศึกษา</div>
          <h2>แผนการเรียน 4 ปี</h2>
          <p>ปีที่ 1–2 เรียนรายวิชาแกนร่วมกัน ก่อนเลือกแขนงวิชาเอกในปีที่ 3–4</p>
        </div>
        <div className="year-tabs-pub">
          {[1, 2, 3, 4].map((y) => (
            <button key={y} className={`year-tab-pub${year === y ? ' active' : ''}`} onClick={() => setYear(y)}>ปีที่ {y}</button>
          ))}
        </div>
        {year >= 3 && (
          <div style={{ marginBottom: 20 }}>
            <button className={`track-btn-pub${track === 'a' ? ' active' : ''}`} onClick={() => setTrack('a')}>แขนง A · วิทยาการข้อมูลและ AI ทางการแพทย์</button>
            <button className={`track-btn-pub${track === 'b' ? ' active' : ''}`} onClick={() => setTrack('b')}>แขนง B · เทคโนโลยีสารสนเทศทางการแพทย์</button>
          </div>
        )}
        {renderTable(1)}
        {renderTable(2)}
      </div>
    </section>
  );
}
