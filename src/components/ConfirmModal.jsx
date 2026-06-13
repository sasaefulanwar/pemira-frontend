export default function ConfirmModal({ isOpen, onClose, onConfirm, candidateName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-[4px] border-black p-8 max-w-sm w-full shadow-[10px_10px_0px_black]">
                <h2 className="text-2xl font-black uppercase mb-4">Yakin?</h2>
                <p className="mb-6 font-bold">Kamu bakal milih<span className="text-[#b517ce]">{candidateName}</span>. Pilihan lu gak bisa diubah ya!</p>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 border-[3px] border-black font-black uppercase">Batal</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-[#00E676] border-[3px] border-black font-black uppercase shadow-[4px_4px_0px_black] active:shadow-none">Gas, Pilih!</button>
                </div>
            </div>
        </div>
    );
}