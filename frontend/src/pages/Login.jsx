import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 34 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Skill Mapping System</div>
        <img src={logo} alt="CSIT Kalasin University" style={{ height: 40, width: 'auto', marginBottom: 14 }} />
        <h2 style={{ fontSize: 26, marginBottom: 6 }}>เข้าสู่ระบบ</h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 24 }}>
          หลักสูตรเทคโนโลยีสารสนเทศทางการแพทย์ · มหาวิทยาลัยกาฬสินธุ์
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="field">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 20, textAlign: 'center' }}>
          บัญชีทดสอบ: admin / admin123 (ผู้ดูแลระบบ) 
        </p>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600 }}>← กลับหน้าหลัก</Link>
        </div>
      </div>
    </div>
  );
}
