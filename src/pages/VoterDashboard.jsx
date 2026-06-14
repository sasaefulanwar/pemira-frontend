import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import CandidateCard from '../components/CandidateCard';
import ConfirmModal from '../components/ConfirmModal';
import toast, { Toaster } from 'react-hot-toast';

export default function VoterDashboard() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    // HANYA 1 USEEFFECT YANG DIBUTUHKAN (Optimalisasi Performa)
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));

        // 1. CEK NIM DULU!
        if (!userData || !userData.nim) {
            toast.error("Wajib Bind NIM dulu cuy!");
            navigate('/bind-nim');
            return;
        }

        // 2. FETCH KANDIDAT
        api.get('/elections/1/candidates')
            .then(res => setCandidates(res.data.data || []))
            .catch(() => toast.error("Gagal ambil data kandidat!"));

        // 3. CEK STATUS VOTE
        api.get(`/votes/check/${userData.nim}`)
            .then(res => setHasVoted(res.data.voted))
            .catch(() => console.log("Sistem: Pemilih belum memberikan suara."));
    }, [navigate]);

    // FUNGSI KONFIRMASI VOTE (Satu-satunya fungsi yang dipakai oleh Modal)
    const confirmVote = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.nim || !selectedCandidate || loading) return;

        setLoading(true);
        const toastId = toast.loading("Kotak suara lagi dibuka, sabar ya...");

        try {
            await api.post('/votes/cast', {
                nim: userData.nim,
                election_id: 1,
                id_paslon: selectedCandidate.id
            });

            toast.success("MANTAP! Suara lu sudah sah tercatat!", { id: toastId });
            setHasVoted(true);
            setIsModalOpen(false);

            setTimeout(() => navigate('/voter/results'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.error || "Gagal nyoblos, coba lagi ntar!", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="text-center mb-16 relative z-10 flex flex-col items-center">
                <h1
                    className="text-[3rem] md:text-7xl lg:text-[110px] font-black text-white uppercase leading-[1.1] transform -rotate-1 mb-8"
                    style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0px black' }}
                >
                    WHO'S THE <br /> NEXT LEADER??
                </h1>

                {/* Subtitle dalam Badge Orange ala Sticker */}
                <div className="bg-[#FF8A00] border-[4px] border-black px-6 py-3 rounded-3xl shadow-[6px_6px_0px_black] transform rotate-1 max-w-2xl mx-4 md:mx-0">
                    <p className="text-sm md:text-xl font-bold text-black uppercase tracking-widest leading-relaxed">
                        Mulai sekarang, buat pilihan untuk hari esok yang lebih baik!
                    </p>
                </div>
            </div>

            {hasVoted ? (
                <div className="bg-green-500 text-white p-12 text-center border-[6px] border-black shadow-[12px_12px_0px_black] transform rotate-1 max-w-4xl mx-auto rounded-2xl">
                    <h2 className="text-4xl md:text-6xl font-black uppercase">Mantap! Suara lu udah masuk!</h2>
                    <p className="mt-4 text-xl md:text-2xl font-bold uppercase">Tunggu hasil perhitungannya ya cuy!</p>
                </div>
            ) : (
                /* PERUBAHAN GRID: Dibuat max-w-6xl agar rata tengah dan gap lebih lebar */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-6xl mx-auto items-start">
                    {candidates.map(cand => (
                        <CandidateCard
                            key={cand.id}
                            candidate={cand}
                            onVote={() => {
                                setSelectedCandidate(cand);
                                setIsModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmVote}
                candidateName={selectedCandidate?.chairman_name}
                candidateNumber={selectedCandidate?.candidate_number}
            />
        </div>
    );
}