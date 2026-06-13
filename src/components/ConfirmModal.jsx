export default function ConfirmModal({ isOpen, onClose, onConfirm, candidateName, candidateNumber }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">

            {/* KOTAK MODAL BRUTALISM */}
            <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_black] max-w-lg w-full transform -rotate-1 relative">

                {/* Pita Atas */}
                <div className="bg-[#FF1744] border-b-[6px] border-black p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest" style={{ WebkitTextStroke: '1px black' }}>
                        TUNGGU DULU CUY!
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-black bg-white border-[3px] border-black rounded-full w-10 h-10 flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_black] hover:bg-yellow-400 active:translate-y-1 active:shadow-none transition-all"
                    >
                        &times;
                    </button>
                </div>

                {/* Konten Modal */}
                <div className="p-8 text-center">
                    <p className="text-xl font-bold text-black mb-4">
                        Yakin mau menjatuhkan pilihan ke:
                    </p>

                    {/* Highlight Paslon */}
                    <div className="bg-[#FFDE00] border-[4px] border-black p-4 inline-block transform rotate-2 shadow-[6px_6px_0px_black] mb-8">
                        <span className="block text-sm font-black uppercase mb-1">PASLON NO. {candidateNumber}</span>
                        <h3 className="text-3xl font-black uppercase text-black">{candidateName}</h3>
                    </div>

                    <p className="text-red-600 font-black uppercase tracking-wider text-sm mb-8 bg-red-100 border-[3px] border-black p-2 transform -rotate-1">
                        Pilihan yang sudah masuk tidak bisa diubah!
                    </p>

                    {/* Tombol Aksi */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-200 text-black border-[4px] border-black font-black text-lg uppercase tracking-wider shadow-[6px_6px_0px_black] hover:bg-slate-300 active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
                        >
                            Gak Jadi
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-4 bg-[#00E676] text-black border-[4px] border-black font-black text-lg uppercase tracking-wider shadow-[6px_6px_0px_black] hover:bg-[#00c968] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
                        >
                            Yakin, GAS!
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}