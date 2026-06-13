import { useEffect, useState } from 'react';
import api from '../lib/axios';
import CandidateCard from '../components/CandidateCard';
import ConfirmModal from '../components/ConfirmModal';
import toast, { Toaster } from 'react-hot-toast';

export default function VoterDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        api.get('/elections/1/candidates')
            .then(res => setCandidates(res.data.data))
            .catch(() => toast.error("Gagal ambil data kandidat!"));
    }, []);

    const handleVoteClick = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const confirmVote = async () => {
        // Ambil user dari localStorage
        const userData = JSON.parse(localStorage.getItem('user'));

        // Pastikan nim-nya diambil dari userData
        // Kalau di backend NIM itu string, pastikan ini string ya
        const payload = {
            nim: userData.nim || "DEFAULT_NIM_JIKA_KOSONG",
            election_id: 1,
            id_paslon: 4
        };

        console.log("MENGIRIM LENGKAP:", payload);

        try {
            await api.post('/votes/cast', payload);
            toast.success("Suara berhasil!");
        } catch (err) {
            console.error("ERROR DETAIL:", err.response?.data);
            toast.error("Gagal nyoblos!");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <Toaster />
            <h1 className="text-5xl font-black uppercase text-center mb-12 transform -rotate-1">PILIH PEMIMPINMU</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {candidates.map(cand => (
                    <CandidateCard key={cand.id} candidate={cand} onVote={() => handleVoteClick(cand)} />
                ))}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmVote}
                candidateName={selectedCandidate?.chairman_name}
            />
        </div>
    );
}