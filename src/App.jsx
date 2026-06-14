import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
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
    <>
      {/* Taruh Toaster di sini, SEKALI AJA buat seluruh aplikasi! */}
      <Toaster
        position="bottom-right" // KITA PINDAH KE POJOK BAWAH KANAN CUY!
        reverseOrder={false}
        toastOptions={{
          duration: 800,
          style: {
            // Styling Brutalism
            border: '5px solid black',
            borderRadius: '0px',
            boxShadow: '6px 6px 0px black',
            fontWeight: '900',
            textTransform: 'uppercase',
            color: 'black',
            backgroundColor: 'white',
            // Kasih jarak biar nggak nempel banget sama pojokan layar
            marginBottom: '20px',
            marginRight: '20px',
          },
          error: {
            duration: 4000,
            style: {
              backgroundColor: '#FF1744', // Merah ngejreng kalau error
              color: 'white',
            }
          },
          success: {
            style: {
              backgroundColor: '#00E676', // Hijau neon kalau sukses
            }
          },
          loading: {
            style: {
              backgroundColor: '#FFD500', // Kuning kalau lagi loading
            }
          }
        }}
      />
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
    </>
  );
}

export default App;