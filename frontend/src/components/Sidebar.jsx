import logo from '../assets/logo.png';

export const SIDEBAR_GROUPS = [
  { label: 'หลักสูตร', items: [
    { id: 'structure', label: 'โครงสร้างหลักสูตร' },
    { id: 'courses', label: 'รายวิชา' },
    { id: 'plan', label: 'แผนการเรียน' },
    { id: 'coursegraph', label: 'กราฟรายวิชา' },
    { id: 'faculty', label: 'อาจารย์ประจำหลักสูตร' },
  ]},
  { label: 'ผลลัพธ์การเรียนรู้', items: [
    { id: 'obe', label: 'ขั้นตอน OBE' },
    { id: 'plo', label: 'PLO' },
    { id: 'ylo', label: 'YLO' },
    { id: 'clo', label: 'CLO รายวิชา' },
  ]},
  { label: 'การเรียนการสอน', items: [
    { id: 'teaching-strategy', label: 'กลยุทธ์การสอน' },
    { id: 'assessment', label: 'การวัดและประเมินผล' },
    { id: 'ksec', label: 'กลยุทธ์รายข้อ KSEC' },
  ]},
  { label: 'ตลาดแรงงาน', items: [
    { id: 'careers', label: 'เส้นทางอาชีพ' },
    { id: 'jobs-skills', label: 'Jobs & Skills' },
  ]},
];

export default function Sidebar({ view, onNavigate, collapsed, onCollapse, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && <div className="sidebar-scrim show" onClick={onCloseMobile} />}
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
        <button className="sidebar-collapse-btn" onClick={onCollapse}>&laquo; ย่อแถบข้าง</button>
        <button className={`sb-home${view === 'hub' ? ' active' : ''}`} onClick={() => onNavigate('hub')}>หน้าแรก</button>
        {SIDEBAR_GROUPS.map((group) => (
          <div className="sb-group" key={group.label}>
            <div className="sb-group-head"><span>{group.label}</span><span className="n">{group.items.length}</span></div>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`sb-item${view === item.id ? ' active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
        <button className={`sb-refs${view === 'references' ? ' active' : ''}`} onClick={() => onNavigate('references')}>
          ข้อมูลอ้างอิง
        </button>
      </aside>
    </>
  );
}
