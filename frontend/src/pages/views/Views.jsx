function BackBtn({ onBack }) {
  return <button className="view-back" onClick={() => onBack('hub')}>← กลับไปหน้าสำรวจหลักสูตร</button>;
}

export function PloView({ data, onBack }) {
  return (
    <section className="pub-section alt">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Program Learning Outcomes</div>
          <h2>ผลลัพธ์การเรียนรู้ระดับหลักสูตร</h2>
          <p>ข้อมูลนี้ดึงจากฐานข้อมูลโดยตรง แก้ไขได้ผ่านแผงควบคุมผู้ดูแลระบบ</p>
        </div>
        <div className="plo-grid-pub">
          {data.plos.map((p) => (
            <div className="plo-card-pub" key={p.id}>
              <div className="eyebrow" style={{ fontSize: 11 }}>PLO {p.no}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              {p.subs?.length > 0 && (
                <ul className="plo-sub-pub">{p.subs.map((s, i) => <li key={i}>{s}</li>)}</ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function YloView({ data, onBack }) {
  return (
    <section className="pub-section">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Year Learning Outcomes</div>
          <h2>พัฒนาการของผู้เรียนรายปี</h2>
        </div>
        <div className="ylo-track-pub">
          {data.ylos.map((y) => (
            <div className="ylo-step-pub" key={y.id}>
              <div className="ylo-dot-pub">{y.year_no}</div>
              <h4>ปีการศึกษาที่ {y.year_no}</h4>
              <p>{y.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StructureView({ data, onBack }) {
  const totalCredit = data.structure.filter((s) => s.level === 1).reduce((a, s) => a + Number(s.credit), 0);
  return (
    <section className="pub-section alt">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">โครงสร้างหลักสูตร</div>
          <h2>โครงสร้างหน่วยกิต {totalCredit} หน่วยกิต</h2>
        </div>
        <div className="credit-grid-pub">
          {data.structure.map((s) => (
            <div className="credit-card-pub" key={s.id} style={s.level === 2 ? { borderLeft: '3px solid var(--circuit)', marginLeft: 10 } : {}}>
              <div className="n">{s.credit} <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>นก.</span></div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CareersView({ data, onBack }) {
  return (
    <section className="pub-section">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">เส้นทางวิชาชีพ</div>
          <h2>อาชีพที่ประกอบได้หลังสำเร็จการศึกษา</h2>
        </div>
        <div className="career-grid-pub">
          {data.careers.map((g) => (
            <div className="career-card-pub" key={g.id}>
              <div className="eyebrow" style={{ fontSize: 11 }}>{g.tag}</div>
              <h3 style={{ fontSize: 17, marginTop: 8 }}>{g.title}</h3>
              <ul>{g.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FacultyView({ data, onBack }) {
  return (
    <section className="pub-section alt">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">อาจารย์ผู้รับผิดชอบหลักสูตร</div>
          <h2>คณาจารย์</h2>
        </div>
        <div className="faculty-grid-pub">
          {data.faculty.map((f) => (
            <div className="fac-card-pub" key={f.id}>
              <div className="eyebrow" style={{ fontSize: 10.5 }}>{f.role}</div>
              <h4>{f.name}</h4>
              <p>{f.qualification}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const OBE_STEPS = [
  { n: 1, title: 'กำหนด PLO', desc: 'กำหนดผลลัพธ์การเรียนรู้ระดับหลักสูตรที่บัณฑิตต้องบรรลุเมื่อจบการศึกษา' },
  { n: 2, title: 'ถ่ายทอดสู่ YLO และ CLO', desc: 'แตกผลลัพธ์ระดับหลักสูตรลงสู่ผลลัพธ์รายปี (YLO) และรายวิชา (CLO)' },
  { n: 3, title: 'ออกแบบการเรียนการสอน', desc: 'เลือกกลยุทธ์การสอนที่ส่งเสริมให้ผู้เรียนบรรลุผลลัพธ์ที่กำหนดไว้' },
  { n: 4, title: 'วัดและประเมินผล', desc: 'ออกแบบเครื่องมือวัดผลที่สอดคล้องกับผลลัพธ์การเรียนรู้แต่ละระดับ' },
  { n: 5, title: 'ทบทวนและปรับปรุง', desc: 'นำผลประเมินย้อนกลับมาปรับปรุงหลักสูตรอย่างต่อเนื่อง (CQI)' },
];

export function ObeView({ onBack }) {
  return (
    <section className="pub-section">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">ผลลัพธ์การเรียนรู้</div>
          <h2>ขั้นตอนการจัดการศึกษาแบบ OBE</h2>
        
        </div>
        <div className="plo-grid-pub">
          {OBE_STEPS.map((s) => (
            <div className="plo-card-pub" key={s.n}>
              <div className="eyebrow" style={{ fontSize: 10.5 }}>ขั้นที่ {s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- credit-hour analysis shared by Teaching Strategy + Assessment ----------
export function categorizeCourses(courses) {
  const cats = { lecture: [], lecture_lab: [], project: [], prep: [], work: [] };
  const pattern = /^(\d+)\((\d+)-(\d+)-(\d+)\)$/;
  courses.forEach((c) => {
    const m = pattern.exec((c.credit_text || '').trim());
    if (!m) return;
    const lec = Number(m[2]), lab = Number(m[3]);
    if (lab >= 20) cats.work.push(c);
    else if (lec === 0 && lab === 3) cats.prep.push(c);
    else if (lec === 0 && lab >= 9) cats.project.push(c);
    else if (lec > 0 && lab === 0) cats.lecture.push(c);
    else if (lec > 0 && lab > 0) cats.lecture_lab.push(c);
  });
  return cats;
}

const TEACHING_STRATEGIES = [
  { key: 'lecture', title: 'บรรยายเป็นหลัก', desc: 'บรรยายในชั้นเรียน อภิปรายกรณีศึกษา ยกตัวอย่างประกอบ เหมาะกับวิชาที่เน้นความเข้าใจแนวคิดและหลักการ' },
  { key: 'lecture_lab', title: 'บรรยาย + ปฏิบัติการ', desc: 'บรรยายเนื้อหาควบคู่การฝึกปฏิบัติในห้องคอมพิวเตอร์ เรียนรู้จากการลงมือทำจริง (Active Learning) เป็นรูปแบบหลักของหลักสูตร' },
  { key: 'project', title: 'โครงงานเป็นฐาน (PBL)', desc: 'นักศึกษาริเริ่มและดำเนินโครงงานเทคโนโลยีสารสนเทศทางการแพทย์ของตนเอง ภายใต้คำปรึกษาของอาจารย์ที่ปรึกษาโครงงาน' },
  { key: 'prep', title: 'เตรียมความพร้อมฝึกประสบการณ์', desc: 'กิจกรรมเชิงปฏิบัติเพื่อเตรียมความพร้อมด้านทักษะและเจตคติก่อนออกฝึกประสบการณ์วิชาชีพจริง' },
  { key: 'work', title: 'ฝึกประสบการณ์ภาคสนาม (WIL)', desc: 'ปฏิบัติงานจริงในสถานประกอบการ ภายใต้การดูแลของพนักงานพี่เลี้ยงและอาจารย์นิเทศ' },
];

export function TeachingStrategyView({ data, onBack }) {
  const cats = categorizeCourses(data.courses);
  return (
    <section className="pub-section alt">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">การเรียนการสอน</div>
          <h2>กลยุทธ์การสอน</h2>
      
        </div>
        <div className="plo-grid-pub">
          {TEACHING_STRATEGIES.map((s) => {
            const list = cats[s.key] || [];
            return (
              <div className="plo-card-pub" key={s.key}>
                <div className="eyebrow" style={{ fontSize: 10.5 }}>{list.length} วิชา</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul className="plo-sub-pub">
                  {list.slice(0, 6).map((c) => <li key={c.code}>{c.code} — {c.th_name}</li>)}
                  {list.length > 6 && <li>… และอีก {list.length - 6} วิชา</li>}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const ASSESSMENT_STRATEGIES = [
  { key: 'lecture', title: 'บรรยายเป็นหลัก', methods: ['ข้อสอบข้อเขียนกลางภาค/ปลายภาค', 'แบบทดสอบย่อย (Quiz) ท้ายบทเรียน', 'งานที่มอบหมาย/รายงานวิเคราะห์กรณีศึกษา'] },
  { key: 'lecture_lab', title: 'บรรยาย + ปฏิบัติการ', methods: ['ข้อสอบภาคทฤษฎี', 'ประเมินผลปฏิบัติการ/ใบงานรายสัปดาห์', 'โครงงานย่อยหรือแบบฝึกหัดท้ายบท'] },
  { key: 'project', title: 'โครงงานเป็นฐาน (PBL)', methods: ['ประเมินความก้าวหน้าโครงงานเป็นระยะ (Milestone)', 'การนำเสนอผลงานต่อคณะกรรมการ', 'คุณภาพระบบที่พัฒนาและรายงานฉบับสมบูรณ์'] },
  { key: 'prep', title: 'เตรียมความพร้อมฝึกประสบการณ์', methods: ['ประเมินการเข้าร่วมกิจกรรมเตรียมความพร้อม', 'แบบทดสอบความพร้อมด้านทักษะและเจตคติ'] },
  { key: 'work', title: 'ฝึกประสบการณ์ภาคสนาม (WIL)', methods: ['แบบประเมินจากพนักงานพี่เลี้ยงในสถานประกอบการ', 'แบบประเมินจากอาจารย์นิเทศ', 'รายงานสรุปผลการฝึกประสบการณ์วิชาชีพ'] },
];

export function AssessmentView({ data, onBack }) {
  const cats = categorizeCourses(data.courses);
  return (
    <section className="pub-section">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">การเรียนการสอน</div>
          <h2>การวัดและประเมินผล</h2>
          
        </div>
        <div className="plo-grid-pub">
          {ASSESSMENT_STRATEGIES.map((s) => (
            <div className="plo-card-pub" key={s.key}>
              <div className="eyebrow" style={{ fontSize: 10.5 }}>{(cats[s.key] || []).length} วิชา</div>
              <h3>{s.title}</h3>
              <ul className="plo-sub-pub">{s.methods.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const KSEC_ROWS = [
  { k: 'K', label: 'Knowledge (ความรู้)', teach: 'บรรยาย · อภิปรายกรณีศึกษา · มอบหมายอ่านเอกสารก่อนเรียน', assess: 'ข้อสอบข้อเขียน · แบบทดสอบย่อย · ถาม-ตอบในชั้นเรียน' },
  { k: 'S', label: 'Skills (ทักษะ)', teach: 'ปฏิบัติการในห้องคอมพิวเตอร์ · โครงงาน · ฝึกปฏิบัติจริง', assess: 'ประเมินชิ้นงาน/ผลปฏิบัติการ · การนำเสนอผลงาน · แฟ้มสะสมผลงาน (Portfolio)' },
  { k: 'E', label: 'Ethics (จริยธรรม)', teach: 'ยกกรณีศึกษาด้านจริยธรรม · อภิปรายประเด็นกฎหมายและจรรยาบรรณวิชาชีพ', assess: 'สังเกตพฤติกรรม · การเขียนวิเคราะห์กรณีศึกษาเชิงจริยธรรม' },
  { k: 'C', label: 'Characteristics (ลักษณะบุคคล)', teach: 'งานกลุ่ม · การนำเสนอ · ฝึกประสบการณ์วิชาชีพ', assess: 'ประเมินโดยอาจารย์/พี่เลี้ยง · ประเมินตนเอง · สังเกตพฤติกรรมการทำงาน' },
];

export function KsecView({ data, onBack }) {
  const counts = { K: 0, S: 0, E: 0, C: 0 };
  (data.clos || []).forEach((c) => { counts[c.ksec] = (counts[c.ksec] || 0) + 1; });
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return (
    <section className="pub-section alt">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">การเรียนการสอน</div>
          <h2>กลยุทธ์รายข้อ KSEC</h2>
          <p>K (Knowledge) · S (Skills) · E (Ethics) · C (Characteristics) — สรุปจากสัดส่วน CLO ที่วิเคราะห์ไว้ในหน้า "CLO รายวิชา" จำนวน {total} ข้อ</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 720, background: '#fff', borderRadius: 12 }}>
            <thead><tr><th>หมวด</th><th>สัดส่วนใน CLO</th><th>กลยุทธ์การสอนหลัก</th><th>วิธีการประเมินหลัก</th></tr></thead>
            <tbody>
              {KSEC_ROWS.map((r) => (
                <tr key={r.k}>
                  <td><span className={`clo-ksec ${r.k}`} style={{ display: 'inline-flex', marginRight: 8 }}>{r.k}</span>{r.label}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>{counts[r.k] || 0} ข้อ ({Math.round(((counts[r.k] || 0) / total) * 100)}%)</td>
                  <td>{r.teach}</td>
                  <td>{r.assess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const JOBSDB_SNAPSHOT_DATE = 'ต้นเดือนกันยายน 2569';
const JOBSDB_GROUPS = [
  {
    title: 'สายธุรกิจและไอที',
    items: [
      {
        role: 'Programmer', slug: 'programmer-developer',
        examples: [
          { title: 'Full-stack Developer (Flutter, .NET, SQL, Node.js, Mendix)', meta: 'งานเต็มเวลา · On-site · ลงประกาศ 1 ชั่วโมงที่ผ่านมา', snippet: 'ออกแบบ พัฒนา และดูแลแอปพลิเคชันเว็บ/มือถือแบบ full-stack' },
          { title: 'Software Developer (NextJS, React, Vue.js, Angular / Flutter, Swift, Kotlin)', meta: 'งานเต็มเวลา · Hybrid · ลงประกาศ 9 ชั่วโมงที่ผ่านมา', snippet: 'พัฒนาโปรแกรมคุณภาพสูง เขียนโค้ดสะอาด มีประสิทธิภาพ ตอบโจทย์ความต้องการทางธุรกิจ' },
        ],
      },
      {
        role: 'Data Scientist', slug: 'data-scientist',
        examples: [
          { title: 'Data Scientist (Retail Industry)', meta: 'ที่ CP Axtra (Makro) · Full time · Hybrid, สวนหลวง กรุงเทพฯ', snippet: 'มองหา Data Scientist ที่มีทักษะสูงเพื่อร่วมทีมในอุตสาหกรรมค้าปลีก' },
          { title: 'Data Scientist — MIS Report & Dashboard', meta: 'ที่ Kasikorn Leasing Co., Ltd. · Full time · Hybrid, กรุงเทพฯ', snippet: 'จัดเตรียมข้อมูลสนับสนุนการใช้งาน จัดทำ MIS Report และ Dashboard' },
        ],
      },
      { role: 'Web Developer', slug: 'web-developer' },
      { role: 'Application Developer', slug: 'application-developer' },
    ],
  },
  {
    title: 'สายการแพทย์และสาธารณสุข',
    items: [
      { role: 'Medical Data Analyst', slug: 'medical-data-analyst' },
      { role: 'Health Information System', slug: 'health-information-system' },
      { role: 'Database Administrator (Healthcare)', slug: 'database-administrator' },
      { role: 'Medical Imaging', slug: 'medical-imaging' },
    ],
  },
  {
    title: 'สายราชการและอื่น ๆ',
    items: [
      { role: 'นักวิชาการคอมพิวเตอร์', slug: 'นักวิชาการคอมพิวเตอร์' },
      { role: 'ครู/อาจารย์คอมพิวเตอร์', slug: 'ครู-คอมพิวเตอร์' },
    ],
  },
];
function jobsdbSearchUrl(slug) {
  return `https://th.jobsdb.com/th/${encodeURIComponent(slug)}-jobs`;
}

export function JobsSkillsView({ onBack }) {
  const JOBS_SKILLS = [
    { title: 'สายธุรกิจและไอที', skills: ['การเขียนโปรแกรม (Programming)', 'การพัฒนาเว็บ/แอปพลิเคชัน', 'การจัดการฐานข้อมูล', 'การจัดการโครงการ'] },
    { title: 'สายการแพทย์และสาธารณสุข', skills: ['ระบบสารสนเทศทางการแพทย์', 'การวิเคราะห์ข้อมูลสุขภาพ', 'เวชระเบียนศาสตร์', 'ความมั่นคงปลอดภัยของข้อมูลผู้ป่วย'] },
    { title: 'สายราชการและอื่น ๆ', skills: ['พื้นฐานเครือข่ายคอมพิวเตอร์', 'การสื่อสารและการนำเสนอ', 'จริยธรรมและกฎหมายไอที', 'การเรียนรู้เทคโนโลยีใหม่ด้วยตนเอง'] },
  ];
  return (
    <section className="pub-section">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">ตลาดแรงงาน</div>
          <h2>Jobs &amp; Skills</h2>
    
        </div>
        <div className="career-grid-pub">
          {JOBS_SKILLS.map((g) => (
            <div className="career-card-pub" key={g.title}>
              <h3>{g.title}</h3>
              <ul>{g.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          ))}
        </div>

        <div className="section-head" style={{ marginTop: 44 }}>
          <h3 style={{ fontSize: 19, color: 'var(--teal-deep)', fontFamily: 'var(--font-display)' }}>ค้นหาตำแหน่งงานจริงจาก JobsDB</h3>
          <p>ตัวอย่างประกาศงาน ณ วันที่ดึงข้อมูล พร้อมลิงก์ไปยังผลค้นหาล่าสุดบน JobsDB (ข้อมูลจะอัปเดตสดทุกครั้งที่คลิก เนื่องจากเว็บไซต์นี้ไม่สามารถต่อ API ดึงข้อมูลแบบเรียลไทม์ได้เอง)</p>
        </div>
        {JOBSDB_GROUPS.map((group) => (
          <div className="jobsdb-group" key={group.title}>
            <div className="jobsdb-group-title">{group.title}</div>
            {group.items.map((item) => (
              <div className="jobsdb-listing" key={item.role}>
                <div className="role">{item.role}</div>
                {(item.examples || []).map((ex, i) => (
                  <div key={i} style={{ margin: '8px 0 8px 2px', paddingLeft: 10, borderLeft: '2px solid var(--teal-pale)' }}>
                    <div className="meta">{ex.meta}</div>
                    <div className="snippet"><b>{ex.title}</b> — {ex.snippet}</div>
                  </div>
                ))}
                <a className="jobsdb-search-link" href={jobsdbSearchUrl(item.slug)} target="_blank" rel="noopener noreferrer">
                  ดูตำแหน่งงาน "{item.role}" ทั้งหมดบน JobsDB →
                </a>
              </div>
            ))}
          </div>
        ))}
        <p className="jobsdb-note">ตัวอย่างประกาศงานด้านบนดึงมา ณ {JOBSDB_SNAPSHOT_DATE} เพื่อประกอบภาพรวมตลาดแรงงานเท่านั้น กดปุ่ม "ดูตำแหน่งงานทั้งหมด" เพื่อดูผลค้นหาปัจจุบันจริงบน JobsDB</p>
      </div>
    </section>
  );
}

export function ReferencesView({ onBack }) {
  return (
    <section className="pub-section alt">
      <div className="container"><BackBtn onBack={onBack} /></div>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">ข้อมูลอ้างอิง</div>
          <h2>ที่มาของข้อมูล</h2>
        </div>
        <div className="plo-card-pub" style={{ maxWidth: 680 }}>
          <p style={{ marginBottom: 10 }}>
            <b>เอกสารหลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศทางการแพทย์</b><br />
            หลักสูตรปรับปรุง พ.ศ. 2566 · คณะวิทยาศาสตร์และเทคโนโลยีสุขภาพ มหาวิทยาลัยกาฬสินธุ์
          </p>
          <p style={{ marginBottom: 10 }}>ข้อมูล PLO, YLO, โครงสร้างหน่วยกิต, คำอธิบายรายวิชา, แผนการเรียน, เส้นทางอาชีพ และรายชื่ออาจารย์ผู้รับผิดชอบหลักสูตร นำมาจากเอกสารหลักสูตรฉบับดังกล่าวโดยตรง</p>
          <p style={{ color: 'var(--ink-faint)', fontSize: 12.5 }}>เว็บไซต์นี้จัดทำเพื่อการเผยแพร่ข้อมูลเบื้องต้น โปรดตรวจสอบรายละเอียดล่าสุดกับสาขาวิชาก่อนใช้อ้างอิงอย่างเป็นทางการหรือก่อนลงทะเบียนเรียน</p>
        </div>
      </div>
    </section>
  );
}
