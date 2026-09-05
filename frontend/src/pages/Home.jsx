import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import infographic from '../assets/infographic.jpg';
import Sidebar from '../components/Sidebar';
import {
  PloView, YloView, StructureView, CareersView, FacultyView, ObeView,
  TeachingStrategyView, AssessmentView, KsecView, JobsSkillsView, ReferencesView,
} from './views/Views';
import CoursesView from './views/CoursesView';
import PlanView from './views/PlanView';
import CourseGraphView from './views/CourseGraphView';
import CloView from './views/CloView';

const HUB_ITEMS = [
  { id: 'structure', icon: '🗂️', title: 'โครงสร้างหลักสูตร', desc: '124 หน่วยกิต แยกตามหมวดและกลุ่มวิชา' },
  { id: 'plo', icon: '🎯', title: 'PLO 5 ข้อ', desc: 'ผลลัพธ์การเรียนรู้ระดับหลักสูตร พร้อมตัวชี้วัดย่อยแต่ละข้อ' },
  { id: 'ylo', icon: '📈', title: 'YLO 4 ชั้นปี', desc: 'ผลลัพธ์การเรียนรู้รายปี ตั้งแต่ปี 1 ถึงปี 4' },
  { id: 'courses', icon: '📄', title: 'คำอธิบายรายวิชา', desc: '88 รายวิชา พร้อมคำอธิบายไทย–อังกฤษ ค้นหาและกรองได้' },
  { id: 'plan', icon: '📅', title: 'แผนการเรียน', desc: '8 ภาคการศึกษา แยกตามแขนงวิชาเอกในปีที่ 3–4' },
  { id: 'coursegraph', icon: '🔗', title: 'กราฟรายวิชา', desc: 'ลำดับก่อน-หลังของรายวิชาแบบ Hard / Weak / Co-requisite' },
  { id: 'careers', icon: '💼', title: 'เส้นทางอาชีพ', desc: 'อาชีพที่ประกอบได้หลังสำเร็จการศึกษา 3 กลุ่มสายงาน' },
  { id: 'faculty', icon: '👤', title: 'อาจารย์ผู้รับผิดชอบหลักสูตร', desc: 'คณาจารย์ 5 ท่านประจำหลักสูตร' },
];

export default function Home() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [planItems, setPlanItems] = useState([]);
  const [error, setError] = useState('');
  const [view, setView] = useState('hub');
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 900);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Promise.all([client.get('/site.php'), client.get('/studyplan.php')])
      .then(([siteRes, planRes]) => {
        setData(siteRes.data);
        setPlanItems(planRes.data.items);
      })
      .catch(() => setError('ไม่สามารถโหลดข้อมูลจากเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า backend และฐานข้อมูลทำงานอยู่'));
  }, []);

  function navigate(id) {
    setView(id);
    if (window.innerWidth <= 900) { setCollapsed(true); setMobileOpen(false); }
    window.scrollTo(0, 0);
  }

  if (error) {
    return <div style={{ padding: 60, textAlign: 'center' }}><p className="error-box" style={{ display: 'inline-block' }}>{error}</p></div>;
  }
  if (!data) {
    return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-faint)' }}>กำลังโหลดข้อมูลหลักสูตร…</div>;
  }

  const totalCredit = data.structure.filter((s) => s.level === 1).reduce((sum, s) => sum + Number(s.credit), 0);

  const viewProps = { data, onBack: navigate };
  const viewMap = {
    plo: <PloView {...viewProps} />,
    ylo: <YloView {...viewProps} />,
    structure: <StructureView {...viewProps} />,
    courses: <CoursesView {...viewProps} />,
    plan: <PlanView items={planItems} onBack={navigate} />,
    coursegraph: <CourseGraphView {...viewProps} />,
    careers: <CareersView {...viewProps} />,
    faculty: <FacultyView {...viewProps} />,
    obe: <ObeView onBack={navigate} />,
    clo: <CloView {...viewProps} />,
    'teaching-strategy': <TeachingStrategyView {...viewProps} />,
    assessment: <AssessmentView {...viewProps} />,
    ksec: <KsecView {...viewProps} />,
    'jobs-skills': <JobsSkillsView onBack={navigate} />,
    references: <ReferencesView onBack={navigate} />,
  };

  return (
    <div className="app-shell-pub">
      <Sidebar
        view={view}
        onNavigate={navigate}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(true)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => { setCollapsed(true); setMobileOpen(false); }}
      />
      <div className="main-col-pub">
        <nav className="topnav">
          <div className="topnav-inner">
            <button
              className={`sidebar-open-btn${collapsed ? ' show' : ''}`}
              onClick={() => { setCollapsed(false); if (window.innerWidth <= 900) setMobileOpen(true); }}
              title="เปิดเมนูด้านข้าง"
            >☰</button>
            <div className="brand-mini">
              <img src={logo} alt="CSIT Kalasin University" style={{ height: 28, width: 'auto' }} />
              <div>Skill Mapping · เทคโนโลยีสารสนเทศทางการแพทย์</div>
            </div>
            <div className="navlinks">
              {user ? (
                <Link to="/admin" className="btn btn-primary btn-sm">แผงควบคุม</Link>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm">เข้าสู่ระบบ</Link>
              )}
            </div>
          </div>
        </nav>

        {view === 'hub' && (
          <>
            <header className="hero">
              <div className="container">
                <div className="eyebrow">Skill Mapping System · มหาวิทยาลัยกาฬสินธุ์</div>
                <h1>เทคโนโลยีสารสนเทศ<br />ทางการแพทย์</h1>
                <div className="en-name">Bachelor of Science Program in Medical Information Technology</div>
                <p className="hero-lede">
                  ระบบแมปรายวิชากับทักษะและผลลัพธ์การเรียนรู้ของหลักสูตร ข้อมูลทั้งหมดบริหารจัดการผ่านระบบหลังบ้าน
                  และแสดงผลแบบเรียลไทม์จากฐานข้อมูล
                </p>
                <div className="chips">
                  <div className="chip"><b>{totalCredit}</b> หน่วยกิตตลอดหลักสูตร</div>
                  <div className="chip"><b>{data.courses.length}</b> รายวิชาทั้งหมด</div>
                  <div className="chip"><b>{data.plos.length}</b> PLO</div>
                  <div className="chip"><b>2</b> แขนงวิชาเอกเลือก</div>
                </div>
              </div>
              <div className="container" style={{ marginTop: 40 }}>
                <img
                  src={infographic}
                  alt="แนะนำหลักสูตรเทคโนโลยีสารสนเทศทางการแพทย์"
                  style={{
                    width: '100%', borderRadius: 18, display: 'block',
                    boxShadow: '0 20px 50px -18px rgba(10,42,67,0.35), 0 2px 8px rgba(10,42,67,0.08)',
                    border: '1px solid var(--line)',
                  }}
                />
              </div>
            </header>

            <section className="pub-section">
              <div className="container">
                <div className="section-head">
                  <div className="eyebrow">เริ่มต้นที่นี่</div>
                  <h2>สำรวจหลักสูตร</h2>
                  <p>เลือกหัวข้อที่สนใจ — แต่ละการ์ดเปิดดูรายละเอียดแยกส่วน ไม่ต้องเลื่อนอ่านยาว</p>
                </div>
                <div className="hub-grid">
                  {HUB_ITEMS.map((item) => (
                    <button className="hub-card" key={item.id} onClick={() => navigate(item.id)}>
                      <div className="hub-icon">{item.icon}</div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                      <div className="hub-link">เปิดดู →</div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {view !== 'hub' && viewMap[view]}

        <footer className="pub-footer">
          <div className="container">
            <img src={logo} alt="CSIT Kalasin University" style={{ height: 40, width: 'auto', marginBottom: 18, filter: 'brightness(0) invert(1)', opacity: 0.92 }} />
            <h3 style={{ color: '#fff', fontSize: 19, maxWidth: '30ch' }}>
              หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศทางการแพทย์
            </h3>
            <p style={{ marginTop: 10, maxWidth: '50ch' }}>
              คณะวิทยาศาสตร์และเทคโนโลยีสุขภาพ มหาวิทยาลัยกาฬสินธุ์ · ระบบ Skill Mapping ขับเคลื่อนด้วยฐานข้อมูล MySQL และ React
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
