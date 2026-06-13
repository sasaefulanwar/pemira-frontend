import { useEffect, useState } from 'react';
import api from '../lib/axios';
import PageLayout from '../components/PageLayout'; // Jangan lupa import PageLayout!

export default function AdminDisputes() {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDisputes = async () => {
        try {
            const res = await api.get('/admin/disputes');
            setDisputes(res.data.data || []);
        } catch (err) {
            toast.error("Gagal memuat data sengketa");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, []);

    const handleResolveDispute = async (id, action) => {
        const textAction = action === 'approve' ? 'MENERIMA (Approve)' : 'MENOLAK (Reject)';
        const confirmResolve = window.confirm(`Yakin mau ${textAction} laporan sengketa ini cuy?`);
        if (!confirmResolve) return;

        const toastId = toast.loading(`Sedang ${textAction.toLowerCase()} sengketa...`);
        try {
            const payload = {
                aksi: action,
                action: action
            };

            await api.post(`/admin/disputes/${id}/resolve`, payload);

            toast.success(`Sengketa berhasil di-${action}!`, { id: toastId });

            if (typeof fetchDisputes === 'function') {
                fetchDisputes();
            } else {
                window.location.reload();
            }

        } catch (error) {
            const errorMsg = error.response?.data?.error || "Gagal menyelesaikan sengketa";
            toast.error(`Waduh: ${errorMsg}`, { id: toastId });
            console.error(error);
        }
    };

    if (loading) return (
        <PageLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_black] animate-pulse transform -rotate-2">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-center">MEMUAT DATA... ⏳</h2>
                </div>
            </div>
        </PageLayout>
    );

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-4 py-10 w-full">

                {/* Judul Halaman */}
                <div className="mb-10 inline-block">
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase"
                        style={{ WebkitTextStroke: '3px black', textShadow: '6px 6px 0px black' }}>
                        DAFTAR SENGKETA
                    </h1>
                </div>

                {/* Container Tabel Brutalist */}
                <div className="bg-white border-[6px] border-black shadow-[12px_12px_0px_black] rounded-xl overflow-hidden transform rotate-1 transition-transform hover:rotate-0">

                    {/* Header Jendela */}
                    <div className="bg-[#FFD500] border-b-[6px] border-black px-6 py-3 flex items-center justify-between">
                        <span className="font-black uppercase tracking-widest text-black">📁 DATABASE_SENGKETA.XLS</span>
                        <div className="flex gap-2">
                            <div className="w-4 h-4 bg-white border-2 border-black rounded-full"></div>
                            <div className="w-4 h-4 bg-white border-2 border-black rounded-full"></div>
                            <div className="w-4 h-4 bg-red-500 border-2 border-black rounded-full"></div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            {/* THEAD Ditambahkan biar HTML-nya valid */}
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="p-4 font-black uppercase tracking-wider border-b-[4px] border-black border-r-[4px]">Tanggal</th>
                                    <th className="p-4 font-black uppercase tracking-wider border-b-[4px] border-black border-r-[4px]">Pelapor</th>
                                    <th className="p-4 font-black uppercase tracking-wider border-b-[4px] border-black border-r-[4px] text-[#FF1744]">Tersangka (NIM)</th>
                                    <th className="p-4 font-black uppercase tracking-wider border-b-[4px] border-black border-r-[4px]">Bukti KTM</th>
                                    <th className="p-4 font-black uppercase tracking-wider border-b-[4px] border-black border-r-[4px]">Status</th>
                                    <th className="p-4 font-black uppercase tracking-wider border-b-[4px] border-black text-center">Aksi (Vonis)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!disputes || disputes.length === 0) ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center bg-gray-100">
                                            <span className="text-3xl font-black text-gray-400 uppercase">BELUM ADA KECURANGAN</span>
                                        </td>
                                    </tr>
                                ) : (
                                    disputes.map((dispute) => {
                                        const ktmUrl = `https://pemira-backend-production-8322.up.railway.app/api/v1/admin/files/ktm/${dispute.path_foto_ktm}`;

                                        return (
                                            <tr key={dispute.id} className="border-b-[4px] border-black hover:bg-yellow-50 transition-colors">

                                                <td className="p-4 font-bold border-r-[4px] border-black text-sm">
                                                    {dispute.created_at ? new Date(dispute.created_at).toLocaleString('id-ID') : '-'}
                                                </td>

                                                <td className="p-4 font-bold border-r-[4px] border-black">
                                                    {dispute.email_pelapor || '-'}
                                                </td>

                                                <td className="p-4 font-black text-[#FF1744] text-xl border-r-[4px] border-black bg-red-50">
                                                    {dispute.nim_sengketa || '-'}
                                                </td>

                                                <td className="p-4 font-bold border-r-[4px] border-black text-center">
                                                    {dispute.path_foto_ktm ? (
                                                        <a
                                                            href={ktmUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-block bg-[#2979FF] text-white px-3 py-1 border-[3px] border-black shadow-[3px_3px_0px_black] hover:-translate-y-1 hover:shadow-[4px_4px_0px_black] active:translate-y-0 active:shadow-[0px_0px_0px_black] transition-all uppercase text-xs"
                                                        >
                                                            📸 Lihat
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-500 bg-slate-200 px-2 py-1 border-2 border-slate-400 text-xs uppercase">Nihil</span>
                                                    )}
                                                </td>

                                                <td className="p-4 font-bold border-r-[4px] border-black text-center">
                                                    <span className={`px-3 py-1 text-xs font-black uppercase border-[3px] border-black shadow-[2px_2px_0px_black] inline-block transform -rotate-2 ${dispute.status_proses === 'pending' ? 'bg-[#FF8A00] text-black' :
                                                        dispute.status_proses === 'resolved' ? 'bg-[#00E676] text-black' :
                                                            'bg-gray-300 text-black'
                                                        }`}>
                                                        {dispute.status_proses || 'UNKNOWN'}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-center bg-gray-50">
                                                    {dispute.status_proses === 'pending' ? (
                                                        <div className="flex justify-center gap-3">
                                                            {/* TOMBOL TERIMA (APPROVE) */}
                                                            <button
                                                                onClick={() => handleResolveDispute(dispute.id, 'approve')}
                                                                className="bg-[#00E676] text-black px-4 py-2 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_black] hover:-translate-y-1 hover:shadow-[6px_6px_0px_black] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                                                            >
                                                                BANNED! 🔨
                                                            </button>

                                                            {/* TOMBOL TOLAK (REJECT) */}
                                                            <button
                                                                onClick={() => handleResolveDispute(dispute.id, 'reject')}
                                                                className="bg-white text-black px-4 py-2 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_black] hover:-translate-y-1 hover:shadow-[6px_6px_0px_black] hover:bg-gray-200 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                                                            >
                                                                TOLAK ✖️
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 font-black uppercase tracking-widest bg-gray-200 px-3 py-1 border-[3px] border-gray-400">Tergembok 🔒</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}