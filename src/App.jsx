import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import VoterDashboard from './pages/VoterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BindNIM from './pages/BindNIM';
import AdminDisputes from './pages/AdminDisputes';
import AdminCandidates from './pages/AdminCandidates';
import AdminAudit from './pages/AdminAudit';
import AdminRecalculate from './pages/AdminRecalculate';
import VoterSengketa from './pages/VoterSengketa';
import VoterResults from './pages/VoterResults';
import Navbar from './components/Navbar';
import PageLayout from './components/PageLayout';
// import GlobalLoading from './components/GlobalLoading';

function App() {
  return (
    <Router>
      <Navbar />
      {/* <GlobalLoading /> */}
      <PageLayout>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<Login />} />

          {/* <Route path="/voter" element={<VoterDashboard />} /> */}

          {/* Rute Terproteksi */}
          <Route path="/voter" element={
            <ProtectedRoute allowedRole="voter">
              <VoterDashboard />
            </ProtectedRoute>
          } />

          <Route path="/voter/sengketa" element={<ProtectedRoute allowedRole="voter"><VoterSengketa /></ProtectedRoute>} />
          <Route path="/voter/results" element={<ProtectedRoute allowedRole="voter"><VoterResults /></ProtectedRoute>} />

          <Route path="/bind-nim" element={
            <ProtectedRoute allowedRole="voter">
              <BindNIM />
            </ProtectedRoute>
          } />

          <Route path="/admin/disputes" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDisputes />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/candidates" element={<ProtectedRoute allowedRole="admin"><AdminCandidates /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute allowedRole="admin"><AdminAudit /></ProtectedRoute>} />
          <Route path="/admin/recalculate" element={<ProtectedRoute allowedRole="admin"><AdminRecalculate /></ProtectedRoute>} />

        </Routes>
      </PageLayout>
    </Router >
  );
}

export default App;