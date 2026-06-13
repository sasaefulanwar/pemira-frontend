import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential;

            // KIRIM 'credential' SESUAI YANG DIMINTA BACKEND
            const res = await api.post('/auth/google', {
                credential: idToken
            });

            const userData = res.data.data;
            if (!userData.role) {
                userData.role = 'voter';
            }

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Simpan ke State Global + LocalStorage
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            toast.success("Login Berhasil!");

            // Redirect berdasarkan role
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/voter');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Gagal Login");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Toaster />
            <div className="w-full max-w-md p-8 bg-white border-[4px] border-black shadow-[8px_8px_0px_black]">
                <h1 className="text-3xl font-black mb-6 text-center">LOGIN PEMIRA</h1>
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error("Login Gagal")}
                    />
                </div>
            </div>
        </div>
    );
}