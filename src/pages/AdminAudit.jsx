import { useEffect, useState } from 'react';
import api from '../lib/axios';
import PageLayout from '../components/PageLayout'; // Pastikan ini di-import!

export default function AdminAudit() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ total_pemilih: 0, total_suara: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/admin/audit');
                const fetchedData = res.data.data;

                // Ambil data array-nya dari property 'recent_logs'
                if (fetchedData && Array.isArray(fetchedData.recent_logs)) {
                    setLogs(fetchedData.recent_logs);

                    // Simpan juga data statistiknya
                    setStats({
                        total_pemilih: fetchedData.total_pemilih || 0,
                        total_suara: fetchedData.total_suara || 0
                    });
                } else {
                    setLogs([]);
                }
            } catch (error) {
                toast.error("Gagal memuat audit log");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return (
        <PageLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_black] animate-pulse transform -rotate-2">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-center">MENARIK LOGS... 🕵️‍♂️</h2>
                </div>
            </div>
        </PageLayout>
    );

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-4 py-10 w-full">
                {/* Header Title */}
                <div className="mb-12">
                    <div className="bg-black text-[#00E676] px-4 py-1 border-[3px] border-black font-black uppercase tracking-widest text-sm inline-block transform -rotate-1 mb-2 shadow-[4px_4px_0px_#00E676]">
                        SERVER_MONITORING // TERMINAL
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase transform rotate-1"
                        style={{ WebkitTextStroke: '3px black', textShadow: '6px 6px 0px black' }}>
                        AUDIT LOGS
                    </h1>
                </div>

                {/* TAMPILAN STATISTIK RAKSASA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                    {/* Card DPT */}
                    <div className="bg-[#2979FF] border-[6px] border-black shadow-[10px_10px_0px_black] p-6 md:p-8 transform -rotate-1 hover:rotate-0 transition-transform">
                        <h2 className="text-black bg-white inline-block px-3 py-1 font-black uppercase border-[3px] border-black shadow-[3px_3px_0px_black] mb-4 transform -rotate-2">
                            👥 TOTAL PEMILIH (DPT)
                        </h2>
                        <div className="flex items-baseline gap-4">
                            <p className="text-7xl md:text-8xl font-black text-white" style={{ WebkitTextStroke: '2px black', textShadow: '6px 6px 0px black' }}>
                                {stats.total_pemilih}
                            </p>
                            <span className="text-xl font-black uppercase text-white">Orang</span>
                        </div>
                    </div>

                    {/* Card Suara Masuk */}
                    <div className="bg-[#00E676] border-[6px] border-black shadow-[10px_10px_0px_black] p-6 md:p-8 transform rotate-1 hover:rotate-0 transition-transform">
                        <h2 className="text-black bg-white inline-block px-3 py-1 font-black uppercase border-[3px] border-black shadow-[3px_3px_0px_black] mb-4 transform rotate-2">
                            🗳️ SUARA MASUK
                        </h2>
                        <div className="flex items-baseline gap-4">
                            <p className="text-7xl md:text-8xl font-black text-black" style={{ textShadow: '6px 6px 0px white' }}>
                                {stats.total_suara}
                            </p>
                            <span className="text-xl font-black uppercase text-black">Suara Sah</span>
                        </div>
                    </div>
                </div>

                {/* TABEL LOG AKTIVITAS (Terminal Style) */}
                <div className="bg-white border-[6px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
                    {/* Header Jendela Terminal */}
                    <div className="bg-[#D500F9] border-b-[6px] border-black px-6 py-3 flex items-center justify-between">
                        <span className="font-black uppercase tracking-widest text-white">💻 SYSTEM_LOGS.EXE</span>
                        <div className="flex gap-2">
                            <div className="w-4 h-4 bg-white border-2 border-black rounded-full"></div>
                            <div className="w-4 h-4 bg-yellow-400 border-2 border-black rounded-full"></div>
                            <div className="w-4 h-4 bg-red-500 border-2 border-black rounded-full"></div>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-[#F8F9FA]">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="p-4 font-black uppercase tracking-widest border-b-[4px] border-black border-r-[4px] border-slate-700 w-1/5">Waktu</th>
                                    <th className="p-4 font-black uppercase tracking-widest border-b-[4px] border-black border-r-[4px] border-slate-700 w-1/4">User / Email</th>
                                    <th className="p-4 font-black uppercase tracking-widest border-b-[4px] border-black border-r-[4px] border-slate-700 text-[#00E676] w-1/3">Aksi Sistem</th>
                                    <th className="p-4 font-black uppercase tracking-widest border-b-[4px] border-black">IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!logs || logs.length === 0) ? (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center bg-white border-b-[4px] border-black">
                                            <span className="text-2xl font-black text-slate-400 uppercase">📭 BELUM ADA AKTIVITAS TERCATAT.</span>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => {
                                        const parts = log.aksi ? log.aksi.split(' | IP: ') : [];
                                        const actionText = parts[0] || '-';
                                        const ipAddress = parts[1] || '-';

                                        return (
                                            <tr key={log.id} className="border-b-[4px] border-black hover:bg-yellow-100 transition-colors bg-white">

                                                <td className="p-4 font-bold text-sm border-r-[4px] border-black">
                                                    {log.timestamp ? new Date(log.timestamp).toLocaleString('id-ID') : '-'}
                                                </td>

                                                <td className="p-4 font-black uppercase border-r-[4px] border-black">
                                                    {log.admin_username || '-'}
                                                </td>

                                                {/* Kolom Aksi di-highlight biar gampang dibaca */}
                                                <td className="p-4 font-black text-[#FF1744] border-r-[4px] border-black uppercase text-sm leading-snug">
                                                    {actionText}
                                                </td>

                                                {/* Kolom IP dibikin ala-ala kode terminal */}
                                                <td className="p-4">
                                                    <span className="bg-slate-200 text-slate-800 font-mono font-bold px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_black]">
                                                        {ipAddress}
                                                    </span>
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