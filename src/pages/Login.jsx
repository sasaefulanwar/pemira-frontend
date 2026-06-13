import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/PageLayout'; // Pastikan lu punya komponen ini ya

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    // Logika fungsional lu tetep aman dan gak diubah
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post('/auth/google', { credential });
            localStorage.setItem('token', res.data.token);
            navigate('/bind-nim');

            if (res.data && res.data.data) {
                const userData = res.data.data;
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                toast.success("Login Berhasil!");
                navigate(userData.role === 'admin' ? '/admin' : '/voter');
            } else {
                toast.error("Format data dari server salah!");
            }
        } catch (error) {
            console.error("Error Login:", error);
            toast.error("Gagal Login: " + (error.response?.data?.error || "Cek console"));
        }
    };

    return (
        <PageLayout>
            <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 overflow-hidden">

                {/* Dekorasi Bintang Pop-Art (Floating) */}
                <div className="absolute top-10 left-10 md:top-20 md:left-32 w-12 h-12 md:w-20 md:h-20 bg-[#00E676] border-[4px] border-black rounded-full shadow-[4px_4px_0px_black] animate-bounce"></div>
                <div className="absolute bottom-20 right-10 md:bottom-32 md:right-32 w-10 h-10 md:w-16 md:h-16 bg-[#b517ce] border-[4px] border-black shadow-[4px_4px_0px_black] rotate-45"></div>

                {/* Hero Text Raksasa */}
                <h1
                    className="relative text-6xl md:text-8xl lg:text-[100px] font-black text-center text-white mb-8 uppercase leading-[1.1] transform -rotate-2 z-10"
                    style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0px black' }}
                >
                    WHO'S THE <br /> NEXT LEADER??
                </h1>

                {/* Subtitle dibungkus kotak stiker Brutalism */}
                <div className="bg-white border-[4px] border-black px-6 py-4 mb-12 shadow-[6px_6px_0px_black] transform rotate-1 z-10 max-w-2xl text-center">
                    <p className="text-sm md:text-xl font-bold text-black uppercase tracking-wider mb-2">
                        Mulai sekarang buat pilihan untuk hari esok yang lebih baik!
                    </p>
                </div>

                {/* Pembungkus Tombol Google Login biar Brutalist */}
                <div className="
                    relative z-10 flex flex-col items-center gap-4 bg-[#FF8A00] 
                    py-4 px-6 md:py-6 md:px-10 rounded-2xl border-[4px] border-black 
                    shadow-[8px_8px_0px_black] hover:-translate-y-1 hover:shadow-[10px_10px_0px_black] 
                    transition-all
                ">
                    <span className="font-black uppercase tracking-widest text-lg md:text-2xl text-black">
                        Masuk ke Bilik Suara
                    </span>

                    {/* Kotak putih pelindung buat tombol bawaan Google */}
                    <div className="bg-white p-1 border-[3px] border-black rounded shadow-[2px_2px_0px_black] hover:scale-105 transition-transform">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Login Gagal")}
                            size="large"
                            text="continue_with"
                            shape="pill"
                        />
                    </div>
                </div>

            </div>
        </PageLayout>
    );
}