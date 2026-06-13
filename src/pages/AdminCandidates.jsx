import { useEffect, useState } from 'react';
import api from '../lib/axios';
import PageLayout from '../components/PageLayout'; // PENTING: Import PageLayout

export default function AdminCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    // State Modal EDIT (JSON)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        id: null, candidate_number: '', chairman_name: '', vice_chairman_name: '', vision: '', mission: ''
    });

    // State Modal CREATE (FormData)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        candidate_number: '', chairman_name: '', vice_chairman_name: '', vision: '', mission: '', photo: null
    });

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const res = await api.get('/elections/1/candidates');
            const sortedData = (res.data.data || []).sort((a, b) => a.candidate_number - b.candidate_number);
            setCandidates(sortedData);
        } catch (error) {
            toast.error("Gagal narik data kandidat!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    // 1. EKSEKUSI: POST (FormData)
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Mendaftarkan paslon baru...");

        const formData = new FormData();
        formData.append('election_id', 1);
        formData.append('candidate_number', createForm.candidate_number);
        formData.append('chairman_name', createForm.chairman_name);
        formData.append('vice_chairman_name', createForm.vice_chairman_name);
        formData.append('vision', createForm.vision);
        formData.append('mission', createForm.mission);

        if (createForm.photo) {
            formData.append('photo', createForm.photo);
        }

        try {
            await api.post('/admin/candidates', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Paslon baru berhasil ditambahkan!", { id: toastId });
            setIsCreateModalOpen(false);
            setCreateForm({ candidate_number: '', chairman_name: '', vice_chairman_name: '', vision: '', mission: '', photo: null });
            fetchCandidates();
        } catch (error) {
            toast.error(error.response?.data?.error || "Gagal menambah kandidat", { id: toastId });
        }
    };

    // 2. EKSEKUSI: DELETE
    const handleDelete = async (id, namaKetua) => {
        const confirmMsg = `WARNING! Yakin mau ngehapus paslon ${namaKetua}?`;
        if (!window.confirm(confirmMsg)) return;

        const toastId = toast.loading("Mengeksekusi penghapusan...");
        try {
            await api.delete(`/admin/candidates/${id}`);
            toast.success("Kandidat berhasil dihapus!", { id: toastId });
            fetchCandidates();
        } catch (error) {
            toast.error(error.response?.data?.error || "Gagal menghapus kandidat", { id: toastId });
        }
    };

    // 3. EKSEKUSI: PUT (JSON)
    const openEditModal = (candidate) => {
        setEditForm({
            id: candidate.id || candidate.id_paslon,
            candidate_number: candidate.candidate_number || '',
            chairman_name: candidate.chairman_name || '',
            vice_chairman_name: candidate.vice_chairman_name || '',
            vision: candidate.vision || '',
            mission: candidate.mission || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Menyimpan perubahan...");

        try {
            const payload = {
                election_id: 1,
                candidate_number: parseInt(editForm.candidate_number) || 0,
                chairman_name: editForm.chairman_name,
                vice_chairman_name: editForm.vice_chairman_name,
                vision: editForm.vision,
                mission: editForm.mission
            };

            await api.put(`/admin/candidates/${editForm.id}`, payload);
            toast.success("Data paslon berhasil diupdate!", { id: toastId });
            setIsEditModalOpen(false);
            fetchCandidates();
        } catch (error) {
            toast.error(error.response?.data?.error || "Gagal mengupdate kandidat", { id: toastId });
        }
    };

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-4 py-10 w-full">

                {/* HEADER AREA */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <div className="bg-[#D500F9] text-white px-4 py-1 border-[3px] border-black font-black uppercase tracking-widest text-sm inline-block transform -rotate-2 mb-2 shadow-[4px_4px_0px_black]">
                            MANAJEMEN KANDIDAT
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase transform rotate-1 leading-none"
                            style={{ WebkitTextStroke: '3px black', textShadow: '6px 6px 0px black' }}>
                            DAFTAR PASLON
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#2979FF] hover:bg-blue-600 text-white font-black uppercase text-lg px-8 py-4 border-[5px] border-black shadow-[8px_8px_0px_black] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex items-center gap-2 transform -rotate-1 hover:rotate-0"
                    >
                        <span className="text-3xl leading-none">+</span> TAMBAH PASLON
                    </button>
                </div>

                {/* KONTEN UTAMA */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_black] animate-pulse transform -rotate-2">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-center">MEMUAT KANDIDAT... ⏳</h2>
                        </div>
                    </div>
                ) : candidates.length === 0 ? (
                    <div className="bg-white p-12 border-[6px] border-black shadow-[12px_12px_0px_black] text-center transform rotate-1">
                        <span className="text-6xl mb-4 block filter drop-shadow-[4px_4px_0px_black]">👻</span>
                        <h2 className="text-4xl font-black uppercase text-black mb-2">KOSONG MLOMPONG</h2>
                        <p className="text-xl font-bold uppercase text-gray-500">Belum ada kandidat yang daftar nih cuy!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {candidates.map((cand) => {
                            const photoUrl = cand.photo_url ? `https://pemira-backend-production-8322.up.railway.app/api/v1/admin${cand.photo_url}` : null;

                            return (
                                <div key={cand.id || cand.id_paslon} className="bg-white border-[5px] border-black shadow-[12px_12px_0px_black] flex flex-col justify-between hover:-translate-y-3 hover:shadow-[16px_16px_0px_black] transition-all rounded-[30px] overflow-hidden group">

                                    {/* HEADER KARTU (Nomor Urut) */}
                                    <div className="bg-[#FFD500] border-b-[5px] border-black p-4 text-center relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-black opacity-10"></div>
                                        <h2 className="text-3xl font-black uppercase tracking-widest text-black drop-shadow-[2px_2px_0px_white]">
                                            PASLON 0{cand.candidate_number}
                                        </h2>
                                    </div>

                                    {/* FOTO & NAMA */}
                                    <div className="p-0 border-b-[5px] border-black relative">
                                        {photoUrl ? (
                                            <img src={photoUrl} alt="Foto Paslon" className="w-full h-72 object-cover bg-slate-800 group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-72 bg-slate-200 flex flex-col items-center justify-center text-black font-black uppercase">
                                                <span className="text-5xl mb-2">📸</span>
                                                NO PHOTO
                                            </div>
                                        )}

                                        {/* Kapsul Nama Overlapping */}
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90%]">
                                            <div className="bg-black text-white border-[4px] border-[#00E676] px-4 py-2 text-center shadow-[4px_4px_0px_#00E676]">
                                                <h3 className="text-xl font-black uppercase leading-tight truncate">{cand.chairman_name}</h3>
                                                <p className="text-xs font-bold uppercase text-[#00E676] truncate">Wakil: {cand.vice_chairman_name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* VISI MISI */}
                                    <div className="px-6 pt-12 pb-6 flex-grow bg-slate-50">
                                        <div className="mb-4">
                                            <span className="bg-yellow-400 text-black border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_black] transform -rotate-2 inline-block mb-1">VISI</span>
                                            <p className="text-sm font-bold text-slate-700 line-clamp-2 leading-snug bg-white p-2 border-2 border-black">{cand.vision || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="bg-blue-400 text-white border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_black] transform rotate-1 inline-block mb-1">MISI</span>
                                            <p className="text-sm font-bold text-slate-700 line-clamp-2 leading-snug bg-white p-2 border-2 border-black">{cand.mission || '-'}</p>
                                        </div>
                                    </div>

                                    {/* TOMBOL AKSI */}
                                    <div className="flex border-t-[5px] border-black bg-white">
                                        <button onClick={() => openEditModal(cand)} className="flex-1 py-4 bg-white text-black font-black uppercase border-r-[5px] border-black hover:bg-yellow-400 transition-colors text-lg flex justify-center items-center gap-2">
                                            ✏️ EDIT
                                        </button>
                                        <button onClick={() => handleDelete(cand.id || cand.id_paslon, cand.chairman_name)} className="flex-1 py-4 bg-white text-red-600 font-black uppercase hover:bg-red-600 hover:text-white transition-colors text-lg flex justify-center items-center gap-2">
                                            🗑️ HAPUS
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* =======================================================
                MODAL CREATE (BRUTALIST)
            ======================================================= */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#E0E0E0] border-[6px] border-black shadow-[16px_16px_0px_black] max-w-3xl w-full max-h-[90vh] overflow-y-auto transform rotate-1">
                        {/* Header Modal Jendela OS */}
                        <div className="bg-black text-white border-b-[6px] border-black p-4 sticky top-0 z-10 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase tracking-widest">📝 FORM_TAMBAH_PASLON.EXE</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="bg-red-500 border-2 border-white w-8 h-8 flex items-center justify-center font-black text-xl hover:bg-red-600 transition-colors">X</button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black uppercase mb-2">Nomor Urut</label>
                                <input type="number" required min="1" value={createForm.candidate_number} onChange={(e) => setCreateForm({ ...createForm, candidate_number: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-yellow-100 font-black text-xl transition-colors shadow-inner" placeholder="Contoh: 1" />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase mb-2">Nama Ketua</label>
                                <input type="text" required value={createForm.chairman_name} onChange={(e) => setCreateForm({ ...createForm, chairman_name: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-yellow-100 font-black transition-colors shadow-inner" placeholder="Ketik nama ketua..." />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase mb-2">Nama Wakil</label>
                                <input type="text" required value={createForm.vice_chairman_name} onChange={(e) => setCreateForm({ ...createForm, vice_chairman_name: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-yellow-100 font-black transition-colors shadow-inner" placeholder="Ketik nama wakil..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black uppercase mb-2">Visi</label>
                                <textarea rows="2" required value={createForm.vision} onChange={(e) => setCreateForm({ ...createForm, vision: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-yellow-100 font-bold transition-colors shadow-inner" placeholder="Tulis visi paslon..."></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black uppercase mb-2">Misi</label>
                                <textarea rows="3" required value={createForm.mission} onChange={(e) => setCreateForm({ ...createForm, mission: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-yellow-100 font-bold transition-colors shadow-inner" placeholder="Tulis misi paslon..."></textarea>
                            </div>
                            <div className="md:col-span-2 bg-yellow-400 p-4 border-[4px] border-black">
                                <label className="block text-sm font-black uppercase mb-2">Upload Foto Paslon</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={(e) => setCreateForm({ ...createForm, photo: e.target.files[0] })}
                                    className="w-full font-bold cursor-pointer
                                    file:mr-4 file:py-3 file:px-6 
                                    file:border-[3px] file:border-black file:shadow-[4px_4px_0px_black]
                                    file:text-sm file:font-black file:uppercase file:bg-[#00E676] file:text-black
                                    hover:file:translate-y-1 hover:file:shadow-none hover:file:bg-green-400 transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 pt-6 flex flex-col md:flex-row gap-4 border-t-[4px] border-black border-dashed mt-4">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-4 bg-white text-black border-[4px] border-black font-black uppercase tracking-widest hover:bg-slate-200 shadow-[6px_6px_0px_black] active:translate-y-1 active:shadow-[2px_2px_0px_black] transition-all">BATAL</button>
                                <button type="submit" className="flex-1 py-4 bg-[#2979FF] text-white border-[4px] border-black font-black uppercase tracking-widest hover:bg-blue-600 shadow-[6px_6px_0px_black] active:translate-y-1 active:shadow-[2px_2px_0px_black] transition-all">SIMPAN DATA 💾</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =======================================================
                MODAL EDIT (BRUTALIST)
            ======================================================= */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#E0E0E0] border-[6px] border-black shadow-[16px_16px_0px_black] max-w-4xl w-full max-h-[70vh] overflow-y-auto transform -rotate-1">
                        <div className="bg-[#FFD500] text-black border-b-[6px] border-black p-4 sticky top-0 z-10 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase tracking-widest">⚙️ EDIT_DATA_PASLON.EXE</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="bg-red-500 border-2 border-black w-8 h-8 flex items-center justify-center font-black text-xl hover:bg-red-600 transition-colors text-white">X</button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black uppercase mb-2">Nomor Urut</label>
                                <input type="number" required min="1" value={editForm.candidate_number} onChange={(e) => setEditForm({ ...editForm, candidate_number: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-[#FFD500] focus:bg-opacity-20 font-black text-xl transition-colors shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase mb-2">Nama Ketua</label>
                                <input type="text" required value={editForm.chairman_name} onChange={(e) => setEditForm({ ...editForm, chairman_name: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-[#FFD500] focus:bg-opacity-20 font-black transition-colors shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase mb-2">Nama Wakil</label>
                                <input type="text" required value={editForm.vice_chairman_name} onChange={(e) => setEditForm({ ...editForm, vice_chairman_name: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-[#FFD500] focus:bg-opacity-20 font-black transition-colors shadow-inner" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black uppercase mb-2">Visi</label>
                                <textarea rows="2" value={editForm.vision} onChange={(e) => setEditForm({ ...editForm, vision: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-[#FFD500] focus:bg-opacity-20 font-bold transition-colors shadow-inner"></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black uppercase mb-2">Misi</label>
                                <textarea rows="3" value={editForm.mission} onChange={(e) => setEditForm({ ...editForm, mission: e.target.value })} className="w-full p-4 border-[4px] border-black focus:outline-none focus:bg-[#FFD500] focus:bg-opacity-20 font-bold transition-colors shadow-inner"></textarea>
                            </div>
                            <div className="md:col-span-2 pt-6 flex flex-col md:flex-row gap-4 border-t-[4px] border-black border-dashed mt-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-white text-black border-[4px] border-black font-black uppercase tracking-widest hover:bg-slate-200 shadow-[6px_6px_0px_black] active:translate-y-1 active:shadow-[2px_2px_0px_black] transition-all">BATAL</button>
                                <button type="submit" className="flex-1 py-4 bg-[#00E676] text-black border-[4px] border-black font-black uppercase tracking-widest hover:bg-green-500 shadow-[6px_6px_0px_black] active:translate-y-1 active:shadow-[2px_2px_0px_black] transition-all">UPDATE DATA 🔄</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}