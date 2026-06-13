import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // <--- INI YG KETINGGALAN CUY!
import api from '../lib/axios';
import PageLayout from '../components/PageLayout';

export default function BindNIM() {
    const [nim, setNim] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBind = async (e) => {
        e.preventDefault();

        // Proteksi: hapus spasi di depan/belakang
        const cleanNim = nim.trim();
        if (cleanNim.length < 5) {
            toast.error("NIM Terlalu pendek!");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Memverifikasi NIM pada database DPT KPU...");

        try {
            await api.post('/pemilih/bind', { nim: cleanNim });

            toast.success("OTENTIKASI BERHASIL: Identitas Anda telah tersinkronisasi.", { id: toastId });

            // Ambil data user lama, update dengan NIM baru
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...user, nim: cleanNim }));

            // Kasih delay biar user sempet baca notif sukses
            setTimeout(() => navigate('/voter'), 1500);
        } catch (err) {
            toast.error(`DITOLAK: ${err.response?.data?.error || "NIM tidak terdaftar atau sudah digunakan."}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">

                <h1
                    className="text-5xl md:text-7xl font-black text-center text-white mb-10 uppercase transform -rotate-1 z-10"
                    style={{ WebkitTextStroke: '3px black', textShadow: '6px 6px 0px black' }}
                >
                    REGISTRASI <br /> PEMILIH
                </h1>

                <form
                    onSubmit={handleBind}
                    className="w-full max-w-sm bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_black] transform rotate-1 z-10 transition-transform hover:rotate-0"
                >
                    <div className="mb-6 bg-[#FFD500] border-[4px] border-black p-3 transform -rotate-2">
                        <p className="font-black text-xs uppercase text-black text-center">
                            ⚠️ PERINGATAN: Pastikan NIM terdaftar di DPT KPU.
                        </p>
                    </div>

                    <input
                        className="w-full border-[5px] border-black p-4 mb-6 font-black text-2xl uppercase placeholder-gray-400 focus:outline-none focus:bg-blue-50 transition-colors shadow-inner"
                        value={nim}
                        onChange={(e) => setNim(e.target.value.toUpperCase())} // Biar NIM selalu huruf besar
                        placeholder="MASUKKAN NIM..."
                        required
                        disabled={loading}
                        maxLength={15}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#2979FF]'} text-white py-4 font-black text-xl uppercase border-[5px] border-black shadow-[6px_6px_0px_black] hover:-translate-y-1 hover:shadow-[8px_8px_0px_black] active:translate-y-2 active:shadow-none transition-all`}
                    >
                        {loading ? "MEMVERIFIKASI..." : "AKTIVASI HAK PILIH 🗳️"}
                    </button>
                </form>
            </div>
        </PageLayout>
    );
}