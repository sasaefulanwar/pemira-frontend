import { useEffect, useState } from 'react';
import api from '../lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import PageLayout from '../components/PageLayout';

export default function AdminRecalculate() {
    const [results, setResults] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await api.get('/elections/1/results');
            const data = res.data.data || [];

            // Urutkan berdasarkan suara terbanyak biar kayak leaderboard
            const sortedData = data.sort((a, b) => (b.total_suara || 0) - (a.total_suara || 0));
            setResults(sortedData);

            const total = data.reduce((acc, curr) => acc + (curr.total_suara || 0), 0);
            setTotalVotes(total);
        } catch (error) {
            toast.error("Gagal memuat rekap suara");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecalculate = async () => {
        const confirmRecalculate = window.confirm("YAKIN MAU HITUNG ULANG? Ini bakal maksa database ngecek ulang semua suara masuk lho cuy.");
        if (!confirmRecalculate) return;

        const toastId = toast.loading("Sistem sedang merekap ulang suara...");
        try {
            await api.post('/admin/elections/recalculate');
            toast.success("Rekapitulasi sinkronisasi selesai!", { id: toastId });
            fetchResults();
        } catch (error) {
            toast.error("Gagal menghitung ulang", { id: toastId });
            console.error(error);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    // Palet warna Pop-Art brutalist untuk progress bar
    const barColors = ["#00E676", "#D500F9", "#2979FF", "#FF1744"];

    if (loading) return (
        <PageLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-[#FFD500] border-[6px] border-black p-8 shadow-[12px_12px_0px_black] animate-pulse transform rotate-1">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-center text-black">MENGHITUNG SUARA... 📊</h2>
                </div>
            </div>
        </PageLayout>
    );

    return (
        <PageLayout>
            <div className="max-w-6xl mx-auto px-4 py-10 w-full">
                <Toaster />

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <div className="bg-[#FF1744] text-white px-4 py-1 border-[3px] border-black font-black uppercase tracking-widest text-sm inline-block transform -rotate-2 mb-2 shadow-[4px_4px_0px_black]">
                            LIVE QUICK COUNT
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase transform rotate-1 leading-none"
                            style={{ WebkitTextStroke: '3px black', textShadow: '6px 6px 0px black' }}>
                            REKAP SUARA
                        </h1>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={fetchResults}
                            className="flex-1 md:flex-none bg-[#2979FF] text-white font-black uppercase px-6 py-4 border-[4px] border-black shadow-[6px_6px_0px_black] hover:-translate-y-1 hover:shadow-[8px_8px_0px_black] active:translate-y-2 active:shadow-none transition-all"
                        >
                            🔄 REFRESH
                        </button>
                        <button
                            onClick={handleRecalculate}
                            className="flex-1 md:flex-none bg-[#FFD500] text-black font-black uppercase px-6 py-4 border-[4px] border-black shadow-[6px_6px_0px_black] hover:-translate-y-1 hover:shadow-[8px_8px_0px_black] active:translate-y-2 active:shadow-none transition-all"
                        >
                            ⚠️ HITUNG ULANG
                        </button>
                    </div>
                </div>

                {/* PAPAN SKOR TOTAL SUARA */}
                <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_black] rounded-3xl p-8 md:p-12 mb-16 text-center relative overflow-hidden transform -rotate-1">
                    {/* Aksen Bintik Retro */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-widest mb-4 inline-block bg-[#00E676] px-6 py-2 border-[4px] border-black shadow-[4px_4px_0px_black] transform rotate-1">
                            TOTAL SUARA SAH MASUK
                        </h2>
                        <p className="text-8xl md:text-[150px] font-black text-black leading-none drop-shadow-[8px_8px_0px_#FFD500]">
                            {totalVotes}
                        </p>
                    </div>
                </div>

                {/* KARTU KANDIDAT & PROGRESS BAR */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                    {results.map((candidate, index) => {
                        const percentage = totalVotes > 0 ? ((candidate.total_suara / totalVotes) * 100) : 0;
                        const isWinner = index === 0 && candidate.total_suara > 0;
                        const color = barColors[index % barColors.length];

                        return (
                            <div key={candidate.id_paslon} className={`bg-white border-[5px] border-black p-6 md:p-8 shadow-[12px_12px_0px_black] rounded-[30px] transition-transform hover:-translate-y-2 relative ${isWinner ? 'border-[#D500F9] transform rotate-1' : ''}`}>

                                {isWinner && (
                                    <div className="absolute -top-6 -right-4 bg-[#D500F9] text-white px-6 py-2 rounded-full border-[4px] border-black font-black uppercase text-lg shadow-[4px_4px_0px_black] transform rotate-12 z-20 animate-bounce">
                                        🏆 MEMIMPIN!
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-8 border-b-[4px] border-dashed border-gray-300 pb-6">
                                    <div className="bg-black text-white px-4 py-2 border-[3px] border-black font-black shadow-[4px_4px_0px_#FFD500] text-xl uppercase">
                                        PASLON {candidate.id_paslon} {/* Sesuai data DB lu */}
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-xl md:text-2xl font-black uppercase leading-tight">{candidate.chairman_name}</h3>
                                        <p className="font-bold text-gray-500 uppercase text-sm mt-1">& {candidate.vice_chairman_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-end gap-3 mb-6">
                                    <h2 className="text-6xl md:text-7xl font-black leading-none">{candidate.total_suara}</h2>
                                    <p className="text-xl font-black uppercase text-gray-400 mb-1">Suara</p>
                                </div>

                                {/* PROGRESS BAR BRUTALIST */}
                                <div className="h-12 bg-gray-200 border-[5px] border-black overflow-hidden shadow-inner relative rounded-full">
                                    <div
                                        className="h-full border-r-[4px] border-black transition-all duration-1000 ease-out flex items-center justify-end px-3"
                                        style={{ width: `${percentage}%`, backgroundColor: color }}
                                    >
                                        {percentage > 15 && (
                                            <span className="font-black text-black drop-shadow-[2px_2px_0px_white] text-lg">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        )}
                                    </div>
                                    {percentage <= 15 && (
                                        <div className="absolute inset-0 flex items-center justify-start pl-4 font-black text-black z-10" style={{ left: `${percentage}%` }}>
                                            <span className="ml-2 text-lg drop-shadow-[2px_2px_0px_white]">{percentage.toFixed(1)}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageLayout>
    );
}