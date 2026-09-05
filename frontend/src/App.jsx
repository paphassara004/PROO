import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import CoursesAdmin from './pages/admin/CoursesAdmin.jsx';
import PlosAdmin from './pages/admin/PlosAdmin.jsx';
import YlosAdmin from './pages/admin/YlosAdmin.jsx';
import StructureAdmin from './pages/admin/StructureAdmin.jsx';
import FacultyAdmin from './pages/admin/FacultyAdmin.jsx';
import CareersAdmin from './pages/admin/CareersAdmin.jsx';
import StudyPlanAdmin from './pages/admin/StudyPlanAdmin.jsx';
import SkillsAdmin from './pages/admin/SkillsAdmin.jsx';
import ClosAdmin from './pages/admin/ClosAdmin.jsx';
import UsersAdmin from './pages/admin/UsersAdmin.jsx';
import ProfilePage from './pages/admin/ProfilePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="courses" element={<ProtectedRoute adminOnly><CoursesAdmin /></ProtectedRoute>} />
        <Route path="plos" element={<ProtectedRoute adminOnly><PlosAdmin /></ProtectedRoute>} />
        <Route path="ylos" element={<ProtectedRoute adminOnly><YlosAdmin /></ProtectedRoute>} />
        <Route path="structure" element={<ProtectedRoute adminOnly><StructureAdmin /></ProtectedRoute>} />
        <Route path="faculty" element={<ProtectedRoute adminOnly><FacultyAdmin /></ProtectedRoute>} />
        <Route path="careers" element={<ProtectedRoute adminOnly><CareersAdmin /></ProtectedRoute>} />
        <Route path="study-plan" element={<ProtectedRoute adminOnly><StudyPlanAdmin /></ProtectedRoute>} />
        <Route path="skills" element={<ProtectedRoute adminOnly><SkillsAdmin /></ProtectedRoute>} />
        <Route path="clos" element={<ProtectedRoute adminOnly><ClosAdmin /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute adminOnly><UsersAdmin /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
