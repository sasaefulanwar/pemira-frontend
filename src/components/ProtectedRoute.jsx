import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuspendedPage from './SuspendedPage';

export default function ProtectedRoute({ children, allowedRole }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. Kunci: Kalau masih loading, jangan nendang! 
    // Kasih tulisan biar lu tau dia emang lagi mikir
    if (loading) {
        return <div className="text-center mt-20 text-black font-black text-2xl">LOADING DULU CUY...</div>;
    }

    // 2. Kalau user gak ada, tendang ke login
    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 3. Pengecekan Role (Gunakan optional chaining yang aman)
    const userRole = user?.role || 'voter';

    if (user && user.is_suspended) {
        return <SuspendedPage />;
    }
    if (allowedRole && userRole !== allowedRole) {
        const destination = userRole === 'admin' ? '/admin' : '/voter';

        // PERBAIKAN: Izinkan kalau pathname nya diawali dengan destination
        // Jadi kalau lu di /voter/results, lu GAK AKAN ditendang ke /voter
        if (location.pathname.startsWith(destination)) {
            return children;
        }

        return <Navigate to={destination} replace />;
    }

    // 4. Lulus sensor!
    return children;
}