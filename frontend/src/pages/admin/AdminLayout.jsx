import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <img src={logo} alt="CSIT Kalasin University" style={{ height: 24, width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: 8, display: 'block' }} />
          Skill Mapping
          <small>เทคโนโลยีสารสนเทศทางการแพทย์</small>
        </div>

        <NavLink to="/admin" end>ภาพรวม</NavLink>
        <NavLink to="/admin/profile">โปรไฟล์ของฉัน</NavLink>

        {isAdmin && (
          <>
            <div className="section-label">ข้อมูลหลักสูตร</div>
            <NavLink to="/admin/courses">รายวิชา</NavLink>
            <NavLink to="/admin/plos">PLO</NavLink>
            <NavLink to="/admin/ylos">YLO</NavLink>
            <NavLink to="/admin/structure">โครงสร้างหน่วยกิต</NavLink>
            <NavLink to="/admin/study-plan">แผนการเรียน</NavLink>
            <NavLink to="/admin/careers">เส้นทางอาชีพ</NavLink>
            <NavLink to="/admin/faculty">อาจารย์</NavLink>

            <div className="section-label">Skill Mapping</div>
            <NavLink to="/admin/skills">ทักษะ &amp; การแมป</NavLink>
            <NavLink to="/admin/clos">CLO รายวิชา</NavLink>

            <div className="section-label">ระบบ</div>
            <NavLink to="/admin/users">ผู้ใช้งาน</NavLink>
          </>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12.5 }}>← ดูหน้าเว็บสาธารณะ</Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)' }}>แผงควบคุมระบบ</div>
          <div className="user-pill">
            <div className="avatar">{(user?.full_name || user?.username || '?').slice(0, 1).toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{user?.full_name || user?.username}</div>
              <span className={`role-badge ${user?.role}`}>{user?.role === 'admin' ? 'admin' : 'user'}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={logout}>ออกจากระบบ</button>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
