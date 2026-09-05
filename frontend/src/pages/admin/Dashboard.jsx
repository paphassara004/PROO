import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    client.get('/site.php')
      .then((res) => {
        const d = res.data;
        setStats({
          courses: d.courses.length,
          plos: d.plos.length,
          faculty: d.faculty.length,
          totalCredit: d.structure.filter((s) => s.level === 1).reduce((a, s) => a + Number(s.credit), 0),
        });
      })
      .catch(() => setError('โหลดข้อมูลสรุปไม่สำเร็จ'));
  }, [isAdmin]);

  return (
    <div>
      <div className="admin-page-head">
        <h2>สวัสดี, {user?.full_name || user?.username} 👋</h2>
      </div>

      {!isAdmin && (
        <div className="card" style={{ padding: 24 }}>
          <p>บัญชีของคุณเป็นผู้ใช้งานทั่วไป (user) — สามารถดูข้อมูลหลักสูตรบนหน้าเว็บสาธารณะได้ตามปกติ
             แต่ไม่มีสิทธิ์แก้ไขข้อมูลในระบบนี้ หากต้องการสิทธิ์ผู้ดูแลระบบ กรุณาติดต่อผู้ดูแลระบบ</p>
        </div>
      )}

      {isAdmin && (
        <>
          {error && <div className="error-box">{error}</div>}
          {stats && (
            <div className="stat-grid">
              <div className="stat-card"><div className="n">{stats.courses}</div><div className="lbl">รายวิชาทั้งหมด</div></div>
              <div className="stat-card"><div className="n">{stats.plos}</div><div className="lbl">PLO</div></div>
              <div className="stat-card"><div className="n">{stats.faculty}</div><div className="lbl">อาจารย์ผู้รับผิดชอบหลักสูตร</div></div>
              <div className="stat-card"><div className="n">{stats.totalCredit}</div><div className="lbl">หน่วยกิตตลอดหลักสูตร</div></div>
            </div>
          )}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 12 }}>เริ่มต้นใช้งาน</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 16 }}>
              จัดการข้อมูลหลักสูตรทั้งหมดได้จากเมนูด้านซ้าย การแก้ไขจะแสดงผลบนหน้าเว็บสาธารณะทันที
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/admin/courses" className="btn btn-primary btn-sm">จัดการรายวิชา</Link>
              <Link to="/admin/skills" className="btn btn-accent btn-sm">จัดการ Skill Mapping</Link>
              <Link to="/admin/study-plan" className="btn btn-ghost btn-sm">จัดการแผนการเรียน</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
