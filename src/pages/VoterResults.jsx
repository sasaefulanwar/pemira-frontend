import { useEffect, useState } from "react";
import api from "../lib/axios";
import PageLayout from "../components/PageLayout";


export default function VoterResults() {
    const [results, setResults] = useState([]);
    const [isClosed, setIsClosed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Backend lu bakal lempar error kalau TPS belum 'closed'
        api.get('/elections/1/results')
            .then(res => {
                // Kalau sukses, berarti TPS udah ditutup. Urutkan berdasarkan suara!
                const sortedResults = res.data.data.sort((a, b) => b.total_suara - a.total_suara);
                setResults(sortedResults);
                setIsClosed(true);
                setLoading(false);
            })
            .catch(err => {
                toast.error("AKSES DITOLAK: Hasil pemilihan belum disahkan oleh KPU.");
                setIsClosed(false);
                setLoading(false);
            });
    }, []);

    // Hitung total semua suara buat nyari persentase
    const totalVotes = results.reduce((acc, item) => acc + item.total_suara, 0);

    // Palet warna Pop-Art brutalist untuk progress bar
    const barColors = ["#00E676", "#D500F9", "#2979FF", "#FF1744"];

    if (loading) return (
        <PageLayout>
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="bg-white border-[6px] border-black px-8 py-6 shadow-[12px_12px_0px_black] transform -rotate-2 animate-pulse">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-center">NGITUNG SUARA... ⏳</h1>
                </div>
            </div>
        </PageLayout>
    );

    return (
        <PageLayout>
            <div className="relative max-w-5xl mx-auto px-4 py-10 min-h-[80vh]">

                {/* Dekorasi Bintang di pojok */}
                <div className="absolute top-0 right-10 w-12 h-12 md:w-16 md:h-16 bg-[#FF1744] border-[4px] border-black shadow-[4px_4px_0px_black] rotate-12 hidden md:block"></div>

                <h1
                    className="text-center text-5xl md:text-7xl font-black text-white mb-12 uppercase tracking-wide transform -rotate-1 relative z-10"
                    style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0px black' }}
                >
                    PEROLEHAN <br /> SUARA
                </h1>

                {!isClosed ? (
                    /* TAMPILAN KALAU PEMILU BELUM DITUTUP OLEH PANITIA */
                    <div className="relative bg-white border-[6px] border-black rounded-[35px] p-10 max-w-2xl mx-auto text-center shadow-[12px_12px_0px_black] transform rotate-1 overflow-hidden">
                        {/* Efek Hazard Tape di Atas */}
                        <div className="absolute top-0 left-0 w-full h-8 bg-yellow-400 border-b-[6px] border-black"
                            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 15px, #000 15px, #000 30px)' }}>
                        </div>

                        <div className="text-8xl mt-6 mb-4 filter drop-shadow-[4px_4px_0px_black]">🔒</div>
                        <h2 className="text-4xl md:text-5xl font-black mt-4 uppercase">AKSES DIBATASI</h2>
                        <div className="inline-block mt-4 bg-[#FF8A00] border-[4px] border-black px-6 py-3 font-black text-lg md:text-2xl shadow-[6px_6px_0px_black] transform -rotate-2 text-black">
                            MENUNGGU OTORISASI PENUTUPAN TPS
                        </div>
                    </div>
                ) : (
                    /* TAMPILAN HASIL PEMILU (PROGRESS BAR) */
                    <div className="grid md:grid-cols-2 gap-8">
                        {results.map((item, index) => {
                            const percentage = totalVotes === 0 ? 0 : (item.total_suara / totalVotes) * 100;
                            const isWinner = index === 0 && item.total_suara > 0; // Peringkat 1
                            const color = barColors[index % barColors.length];

                            return (
                                <div
                                    key={item.id_paslon}
                                    className={`relative bg-white rounded-[35px] border-[6px] border-black p-6 md:p-8 shadow-[8px_8px_0px_black] hover:-translate-y-2 hover:shadow-[12px_12px_0px_black] transition-all ${isWinner ? 'md:transform md:-rotate-1 scale-[1.02] z-10 border-[#FF8A00]' : ''}`}
                                >

                                    {/* Badge Pemenang (Hanya untuk suara terbanyak) */}
                                    {isWinner && (
                                        <div className="absolute -top-6 -right-2 md:-right-6 bg-[#FFD500] text-black px-4 py-2 rounded-full border-[4px] border-black font-black text-sm md:text-lg shadow-[4px_4px_0px_black] transform rotate-12 z-20 animate-bounce">
                                            ⭐ LEADING!
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-6">
                                        {/* Badge Paslon */}
                                        <div className="inline-flex bg-black text-white px-5 py-2 rounded-[20px] border-[3px] border-black font-black shadow-[4px_4px_0px_#FFD500] text-lg uppercase">
                                            NO. 0{item.id_paslon}
                                        </div>
                                        {/* Nama Ketua Paslon */}
                                        <div className="text-right">
                                            <p className="font-black text-xl uppercase max-w-[150px] leading-tight truncate">{item.chairman_name}</p>
                                        </div>
                                    </div>

                                    {/* Suara */}
                                    <div className="flex items-end gap-2 mb-6">
                                        <h2 className="text-6xl md:text-7xl font-black leading-none">{item.total_suara}</h2>
                                        <p className="text-xl md:text-2xl font-bold uppercase mb-1">Suara</p>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="h-12 bg-gray-200 rounded-full border-[5px] border-black overflow-hidden shadow-inner relative">
                                        {/* Fill Bar */}
                                        <div
                                            className="h-full border-r-[4px] border-black transition-all duration-1000 ease-out flex items-center justify-end px-2"
                                            style={{ width: `${percentage}%`, backgroundColor: color }}
                                        >
                                            {/* Jika bar terlalu kecil, jangan tampilin teks di dalam bar */}
                                            {percentage > 15 && (
                                                <span className="font-black text-black drop-shadow-[1px_1px_0px_white]">
                                                    {percentage.toFixed(1)}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Persentase Teks di Luar Bar (kalau barnya terlalu kecil) */}
                                        {percentage <= 15 && (
                                            <div className="absolute inset-0 flex items-center justify-start pl-4 font-black text-black z-10" style={{ left: `${percentage}%` }}>
                                                <span className="ml-2">{percentage.toFixed(1)}%</span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}