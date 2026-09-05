import { useState } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await client.post('/auth.php?action=change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess('เปลี่ยนรหัสผ่านสำเร็จ');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      setError(err?.response?.data?.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="admin-page-head"><h2>โปรไฟล์ของฉัน</h2></div>
      <div className="card" style={{ padding: 24, maxWidth: 480, marginBottom: 20 }}>
        <p><b>ชื่อผู้ใช้:</b> {user?.username}</p>
        <p><b>ชื่อเต็ม:</b> {user?.full_name || '—'}</p>
        <p><b>สิทธิ์:</b> <span className={`role-badge ${user?.role}`}>{user?.role}</span></p>
      </div>

      <div className="card" style={{ padding: 24, maxWidth: 480 }}>
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>เปลี่ยนรหัสผ่าน</h3>
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>รหัสผ่านปัจจุบัน</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="field">
            <label>รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'กำลังบันทึก…' : 'เปลี่ยนรหัสผ่าน'}
          </button>
        </form>
      </div>
    </div>
  );
}
