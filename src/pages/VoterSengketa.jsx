import { useState } from 'react';
import api from '../lib/axios';
import PageLayout from '../components/PageLayout'; // Jangan lupa import PageLayout!

export default function VoterSengketa() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nim_sengketa: '',
        email_pelapor: '',
        ktm: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nim_sengketa || !formData.ktm) {
            return toast.error("DITOLAK: NIM Terlapor dan Bukti KTM wajib dilampirkan!");
        }

        const confirmReport = window.confirm("PERNYATAAN PELAPOR:\n\nDengan ini saya menyatakan bahwa laporan ini dibuat dengan data yang sebenar-benarnya. Saya bersedia menerima sanksi pencabutan hak pilih apabila terbukti memberikan laporan palsu/fitnah.\n\nKirim laporan?");
        if (!confirmReport) return;

        const data = new FormData();
        data.append('nim_sengketa', formData.nim_sengketa);
        data.append('email_pelapor', formData.email_pelapor);
        data.append('foto_ktm', formData.ktm);

        setLoading(true);
        const toastId = toast.loading("Mengunggah berkas laporan ke server KPU...");

        try {
            await api.post('/pemilih/sengketa', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("LAPORAN DITERIMA: Akun terlapor telah dibekukan sementara untuk investigasi.", { id: toastId });
            setFormData({ nim_sengketa: '', email_pelapor: '', ktm: null });
        } catch (err) {
            toast.error(`GAGAL: ${err.response?.data?.error || "Sistem menolak laporan Anda."}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">

                {/* Judul Raksasa */}
                <h1
                    className="text-5xl md:text-7xl font-black text-center text-white mb-8 uppercase transform -rotate-2 z-10 leading-tight"
                    style={{ WebkitTextStroke: '3px black', textShadow: '6px 6px 0px black' }}
                >
                    LAPOR <br /> MASALAH!
                </h1>

                {/* Form Brutalist */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-lg bg-white border-[6px] border-black p-6 md:p-8 shadow-[12px_12px_0px_black] transform rotate-1 z-10 transition-transform hover:rotate-0"
                >
                    {/* Stiker Warning */}
                    <div className="mb-6 bg-red-500 border-[4px] border-black p-3 transform -rotate-1 shadow-[4px_4px_0px_black]">
                        <p className="font-black text-sm uppercase text-white text-center tracking-wider">
                            🚨 AWAS! Laporan palsu bisa bikin akun kamu yang dibanned!
                        </p>
                    </div>

                    <div className="space-y-5">
                        <input
                            type="text"
                            placeholder="MASUKKAN NIM YANG MAU DILAPORKAN..."
                            className="w-full border-[4px] border-black p-4 font-black text-lg md:text-xl uppercase placeholder-gray-500 focus:outline-none focus:bg-yellow-50 transition-colors"
                            value={formData.nim_sengketa}
                            onChange={e => setFormData({ ...formData, nim_sengketa: e.target.value })}
                            disabled={loading}
                        />

                        <input
                            type="email"
                            placeholder="EMAIL (BUAT KONFIRMASI)..."
                            className="w-full border-[4px] border-black p-4 font-black text-lg md:text-xl uppercase placeholder-gray-500 focus:outline-none focus:bg-yellow-50 transition-colors"
                            value={formData.email_pelapor}
                            onChange={e => setFormData({ ...formData, email_pelapor: e.target.value })}
                            disabled={loading}
                        />

                        {/* Upload File Area (Lebih Asik) */}
                        <div className="relative border-[4px] border-dashed border-black p-6 text-center bg-yellow-100 hover:bg-yellow-300 transition-colors cursor-pointer transform rotate-1">
                            <label className="font-black text-lg cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                {formData.ktm ? (
                                    <span className="text-green-700 bg-white px-2 border-2 border-black rotate-[-2deg]">
                                        ✅ {formData.ktm.name}
                                    </span>
                                ) : (
                                    <span className="text-black uppercase">
                                        📸 UPLOAD FOTO KTM
                                    </span>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={e => setFormData({ ...formData, ktm: e.target.files[0] })}
                                    disabled={loading}
                                />
                            </label>
                        </div>

                        {/* Tombol Submit Super Gede */}
                        <button
                            disabled={loading}
                            className={`w-full mt-4 ${loading ? 'bg-gray-400' : 'bg-red-600'} text-white py-4 font-black text-xl md:text-2xl uppercase tracking-widest border-[5px] border-black shadow-[6px_6px_0px_black] hover:-translate-y-1 hover:shadow-[8px_8px_0px_black] active:translate-y-2 active:shadow-none transition-all`}
                        >
                            {loading ? "PROSES..." : "KIRIM LAPORAN 💥"}
                        </button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
}