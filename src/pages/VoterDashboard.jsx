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

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));

        // 1. CEK NIM DULU! (Ini yang hilang)
        if (!userData || !userData.nim) {
            toast.error("Wajib Bind NIM dulu cuy!");
            navigate('/bind-nim'); // Lempar kalau NIM gak ada
            return;
        }

        // 2. FETCH KANDIDAT
        api.get('/elections/1/candidates')
            .then(res => setCandidates(res.data.data || []))
            .catch(() => toast.error("Gagal ambil data kandidat!"));

        // 3. CEK STATUS VOTE
        api.get(`/votes/check/${userData.nim}`)
            .then(res => setHasVoted(res.data.voted))
            .catch(() => console.log("Belum pernah vote"));
    }, [navigate]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.nim) return;

        // 1. Fetch data kandidat
        api.get('/elections/1/candidates')
            .then(res => setCandidates(res.data.data || []))
            .catch(() => toast.error("Gagal ambil data kandidat!"));

        // 2. CEK STATUS VOTE
        api.get(`/votes/check/${userData.nim}`)
            .then(res => setHasVoted(res.data.voted))
            .catch(() => console.log("Belum pernah vote"));
    }, []);

    // SATU FUNGSI SAJA (Gak boleh duplikat!)
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

    const handleVote = async (paslonId, candidateNumber) => {
        const confirmVote = window.confirm(`KONFIRMASI HAK PILIH KPU:\n\nAnda akan memberikan suara sah untuk Pasangan Calon Nomor Urut ${candidateNumber}.\n\nPERHATIAN: Pilihan yang sudah dikirimkan bersifat final dan tidak dapat diubah kembali.\n\nApakah Anda yakin dengan pilihan ini?`);

        if (!confirmVote) return;

        const toastId = toast.loading("Sistem sedang mengenkripsi dan mengirimkan suara Anda...");
        try {
            await api.post('/pemilih/vote', { paslon_id: paslonId });
            toast.success("BERHASIL: Hak suara Anda telah sah tercatat dalam sistem.", { id: toastId });
        } catch (error) {
            toast.error(`DITOLAK: ${error.response?.data?.error || "Gagal merekam suara."}`, { id: toastId });
        }
    };

    return (
        <div className="p-8">
            <Toaster />
            <div className="text-center mb-16 relative z-10 flex flex-col items-center">
                <h1
                    className="text-[3rem] md:text-7xl lg:text-[110px] font-black text-white uppercase leading-[1.1] transform -rotate-1 mb-8"
                    style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0px black' }}
                >
                    WHO'S THE <br /> NEXT LEADER??
                </h1>

                {/* Subtitle dalam Badge Orange ala Sticker */}
                <div className="bg-[#FF8A00] border-[4px] border-black px-6 py-3 rounded-3xl shadow-[6px_6px_0px_black] transform rotate-1 max-w-2xl">
                    <p className="text-sm md:text-xl font-bold text-black uppercase tracking-widest leading-relaxed">
                        Mulai sekarang, buat pilihan untuk hari esok yang lebih baik!
                    </p>
                </div>
            </div>

            {hasVoted ? (
                <div className="bg-green-500 text-white p-12 text-center border-4 border-black shadow-[8px_8px_0px_black] transform rotate-1">
                    <h2 className="text-4xl font-black uppercase">Mantap! Suara lu udah masuk!</h2>
                    <p className="mt-4 text-xl">Tunggu hasil perhitungannya ya cuy!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2p gap-8">
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