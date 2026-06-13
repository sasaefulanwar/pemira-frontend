export default function CandidateCard({ candidate, onVote }) {
    return (
        <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0px_black] hover:shadow-[12px_12px_0px_black] transition-all transform hover:-translate-y-2">
            {/* Nomor Urut (Stiker Brutalist) */}
            <div className="bg-[#FF8A00] w-16 h-16 flex items-center justify-center border-[3px] border-black font-black text-3xl mb-4 shadow-[4px_4px_0px_black]">
                {candidate.candidate_number}
            </div>

            {/* Foto Kandidat */}
            <div className="w-full h-64 bg-gray-200 border-[3px] border-black mb-4 overflow-hidden">
                <img
                    src={`http://localhost:8080${candidate.photo_url}`}
                    alt="Paslon"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Nama Kandidat */}
            <h2 className="text-2xl font-black uppercase mb-2">{candidate.chairman_name} & {candidate.vice_chairman_name}</h2>

            {/* Visi Singkat */}
            <p className="text-sm font-bold text-gray-700 mb-6 h-20 overflow-y-auto">{candidate.vision}</p>

            {/* Tombol Pilih */}
            <button
                onClick={() => onVote(candidate.id)}
                className="w-full bg-black text-white font-black py-4 hover:bg-[#b517ce] transition-all"
            >
                COBLOS PASLON INI
            </button>
        </div>
    );
}