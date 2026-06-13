import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import PageLayout from '../components/PageLayout'; // Pastikan path ini bener

export default function BindNIM() {
    const [nim, setNim] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBind = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Memverifikasi NIM pada database DPT KPU...");

        try {
            await api.post('/pemilih/bind', { nim });
            toast.success("OTENTIKASI BERHASIL: Identitas Anda telah tersinkronisasi.", { id: toastId });

            const user = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...user, nim }));

            setTimeout(() => navigate('/voter'), 1000);
        } catch (err) {
            toast.error(`DITOLAK: ${err.response?.data?.error || "NIM tidak terdaftar atau sudah digunakan."}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };



    return (
        <PageLayout>
            <div className="flex flex-col items-center justify-center min-h-[30vh] px-4">

                {/* Judul Halaman */}
                <h1
                    className="text-5xl md:text-7xl font-black text-center text-white mb-8 uppercase transform -rotate-2 z-10"
                    style={{ WebkitTextStroke: '3px black', textShadow: '6px 6px 0px black' }}
                >
                    VERIFIKASI IDENTITAS
                </h1>

                {/* Form Brutalist */}
                <form
                    onSubmit={handleBind}
                    className="w-full max-w-md bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_black] transform rotate-1 z-10 transition-transform hover:rotate-0"
                >
                    {/* Kotak Peringatan / Instruksi */}
                    <div className="mb-6 bg-yellow-200 border-[3px] border-black p-3 transform -rotate-1">
                        <p className="font-black text-sm uppercase text-black text-center">
                            ⚠️ Pastikan NIM kamu bener dan terdaftar di Data Mahasiswa Aktif.
                        </p>
                    </div>

                    <input
                        className="w-full border-[4px] border-black p-4 mb-6 font-black text-xl uppercase placeholder-gray-500 focus:outline-none focus:bg-blue-50 transition-colors"
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        placeholder="MASUKKAN NIM"
                        required
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#D500F9]'} text-white py-4 font-black text-xl uppercase border-[4px] border-black shadow-[6px_6px_0px_black] hover:-translate-y-1 hover:shadow-[8px_8px_0px_black] active:translate-y-2 active:shadow-none transition-all`}
                    >
                        {loading ? "PROSES..." : "SIMPAN & LANJUT!"}
                    </button>
                </form>
            </div>
        </PageLayout>
    );
}