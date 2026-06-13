import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import PageLayout from '../components/PageLayout'; // Jangan lupa import ini!

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChangeStatus = async (newStatus) => {
        const textStatus = newStatus === 'open' ? 'DIBUKA' : newStatus === 'closed' ? 'DITUTUP' : 'PERSIAPAN (DRAFT)';

        const confirmMsg = `PERINGATAN OTORITAS KPU:\n\nAnda akan mengubah status TPS menjadi: ${textStatus}.\nTindakan ini akan langsung berdampak pada akses masuk seluruh pemilih.\n\nApakah Anda yakin ingin melanjutkan?`;

        if (!window.confirm(confirmMsg)) return;

        setLoading(true);
        const toastId = toast.loading(`Sistem sedang memproses perubahan status TPS...`);

        try {
            const payload = { election_id: 1, status: newStatus };
            await api.put('/admin/elections/status', payload);

            toast.success(`BERHASIL: Status TPS resmi ${textStatus}.`, { id: toastId });
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Gagal menghubungi server";
            toast.error(`KESALAHAN SISTEM: ${errorMsg}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // Menu Navigasi Admin (Gue tambahin warna dan ikon biar brutalist abis)
    const menu = [
        { name: "Sengketa", path: "/admin/disputes", icon: "⚖️", color: "bg-[#2979FF]" },
        { name: "Kandidat", path: "/admin/candidates", icon: "👥", color: "bg-[#D500F9]" },
        { name: "Audit Log", path: "/admin/audit", icon: "📜", color: "bg-[#FF8A00]" },
        { name: "Rekap Suara", path: "/admin/recalculate", icon: "📊", color: "bg-[#00E676]" }
    ];

    return (
        <PageLayout>
            <div className="max-w-5xl mx-auto px-4 py-10 w-full">
                <Toaster />

                {/* HEADER RAKSASA */}
                <div className="relative mb-16 text-center mt-4">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white font-black px-4 py-1 border-[3px] border-black shadow-[4px_4px_0px_white] rotate-2 z-20 uppercase tracking-widest text-sm">
                        🔒 RESTRICTED AREA
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase transform -rotate-1 z-10 relative leading-tight"
                        style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0px black' }}>
                        MASTER CONTROL
                    </h1>
                </div>

                {/* PANEL KENDALI (MASTER SWITCH) */}
                <div className="bg-white border-[6px] border-black shadow-[12px_12px_0px_black] rounded-3xl p-6 md:p-10 mb-20 transform rotate-1 transition-transform hover:rotate-0 relative overflow-hidden">
                    {/* Pita Hazard Kuning-Hitam di atas panel */}
                    <div className="absolute top-0 left-0 w-full h-6 bg-yellow-400 border-b-[4px] border-black"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 15px, #000 15px, #000 30px)' }}>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black uppercase mt-6 mb-2">STATUS PEMILU</h2>
                    <p className="font-bold text-gray-600 mb-8 border-l-[5px] border-black pl-4 text-sm md:text-base">
                        ⚠️ ATENSI: Gunakan tombol di bawah untuk membuka atau menutup TPS secara real-time. Perubahan langsung berdampak ke sistem mahasiswa.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Tombol BUKA TPS */}
                        <button
                            onClick={() => handleChangeStatus('open')}
                            disabled={loading}
                            className="flex flex-col items-center justify-center gap-3 bg-[#00E676] text-black font-black uppercase py-6 px-4 border-[5px] border-black shadow-[8px_8px_0px_black] hover:-translate-y-2 hover:shadow-[12px_12px_0px_black] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all rounded-2xl"
                        >
                            <span className="text-5xl drop-shadow-[2px_2px_0px_white]">🟢</span>
                            <span className="text-xl tracking-widest">BUKA TPS</span>
                        </button>

                        {/* Tombol TUTUP TPS */}
                        <button
                            onClick={() => handleChangeStatus('closed')}
                            disabled={loading}
                            className="flex flex-col items-center justify-center gap-3 bg-[#FF1744] text-white font-black uppercase py-6 px-4 border-[5px] border-black shadow-[8px_8px_0px_black] hover:-translate-y-2 hover:shadow-[12px_12px_0px_black] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all rounded-2xl"
                        >
                            <span className="text-5xl drop-shadow-[2px_2px_0px_black]">🔴</span>
                            <span className="text-xl tracking-widest">TUTUP TPS</span>
                        </button>

                        {/* Tombol PERSIAPAN (DRAFT) */}
                        <button
                            onClick={() => handleChangeStatus('draft')}
                            disabled={loading}
                            className="flex flex-col items-center justify-center gap-3 bg-[#FFD500] text-black font-black uppercase py-6 px-4 border-[5px] border-black shadow-[8px_8px_0px_black] hover:-translate-y-2 hover:shadow-[12px_12px_0px_black] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all rounded-2xl"
                        >
                            <span className="text-5xl drop-shadow-[2px_2px_0px_white]">🟡</span>
                            <span className="text-xl tracking-widest">PERSIAPAN</span>
                        </button>
                    </div>
                </div>

                {/* MENU ADMIN LAINNYA */}
                <h2 className="text-3xl md:text-4xl font-black mb-10 uppercase text-white inline-block bg-black px-8 py-3 border-[4px] border-black transform -rotate-2 shadow-[6px_6px_0px_white]">
                    🗂️ NAVIGASI PANITIA
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-10">
                    {menu.map((item, index) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`${item.color} text-black border-[5px] border-black shadow-[8px_8px_0px_black] hover:-translate-y-2 hover:shadow-[12px_12px_0px_black] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all rounded-[30px] p-6 text-left flex flex-col justify-between min-h-[180px] transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-2'}`}
                        >
                            <span className="text-4xl bg-white w-14 h-14 flex items-center justify-center rounded-full border-[3px] border-black shadow-[3px_3px_0px_black] mb-6">
                                {item.icon}
                            </span>
                            <span className="font-black uppercase text-2xl leading-tight">
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}