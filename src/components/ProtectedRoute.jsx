import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
    const { user } = useAuth();

    // Ambil role, kalau undefined anggap 'voter' (default role)
    const userRole = user?.role || 'voter';

    console.log("DEBUG: User Role:", userRole);

    if (!user) return <Navigate to="/" replace />;

    if (allowedRole && userRole !== allowedRole) {
        // Kalau rolenya gak sesuai, arahkan ke dashboard masing-masing
        return <Navigate to={userRole === 'admin' ? '/admin' : '/voter'} replace />;
    }

    return children;
}