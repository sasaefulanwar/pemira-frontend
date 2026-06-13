import { useState } from 'react';

export default function CandidateCard({ candidate, onVote }) {
    // State buat nampilin teks misi yang panjang (Read More)
    const [showFullMission, setShowFullMission] = useState(false);

    return (
        <div className="relative flex flex-col items-center group mb-12 w-full max-w-sm mx-auto transition-transform hover:-translate-y-2 duration-300">

            {/* FOTO PASLON */}
            {/* Pakai aspect-ratio biar tinggi foto selalu konsisten walaupun layar ngecil */}
            <div className="w-full aspect-[4/5] bg-slate-800 rounded-t-3xl border-[5px] border-black border-b-0 overflow-hidden relative z-10 shadow-[8px_0px_0px_black]">
                <img
                    src={candidate.photo_url || "https://via.placeholder.com/400x500?text=FOTO+PASLON"}
                    alt="Foto Paslon"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay Nomor Urut Gede di pojok foto */}
                <div className="absolute top-4 left-4 bg-white border-[4px] border-black rounded-full w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_black] transform -rotate-6">
                    <span className="font-black text-3xl">{candidate.candidate_number}</span>
                </div>
            </div>

            {/* AREA NAMA (Kapsul Ungu) */}
            <div className="flex w-[105%] z-30 -mt-6 gap-2 px-2">
                <div className="flex-1 bg-[#D500F9] text-white border-[4px] border-black rounded-full py-2 px-2 text-center shadow-[4px_4px_0px_black] transform -rotate-2 flex items-center justify-center transition-transform group-hover:rotate-0">
                    <p className="font-black text-sm md:text-base leading-tight uppercase tracking-wider" style={{ WebkitTextStroke: '1px black' }}>
                        {candidate.chairman_name}
                    </p>
                </div>
                <div className="flex-1 bg-[#D500F9] text-white border-[4px] border-black rounded-full py-2 px-2 text-center shadow-[4px_4px_0px_black] transform rotate-2 flex items-center justify-center transition-transform group-hover:rotate-0">
                    <p className="font-black text-sm md:text-base leading-tight uppercase tracking-wider" style={{ WebkitTextStroke: '1px black' }}>
                        {candidate.vice_chairman_name}
                    </p>
                </div>
            </div>

            {/* AREA JABATAN (Kotak Oranye) */}
            {/* Dibikin z-20 biar ada di atas kotak putih tapi di bawah kapsul nama */}
            <div className="flex w-full bg-[#FF8A00] border-[5px] border-black mt-[-15px] z-20 overflow-hidden shadow-[8px_8px_0px_black]">
                <div className="flex-1 p-3 md:p-5 text-center border-r-[5px] border-black flex flex-col justify-center">
                    <p className="font-black text-black text-[10px] md:text-xs leading-tight uppercase">
                        Calon Ketua <br /> Himpunan RPL
                    </p>
                </div>
                <div className="flex-1 p-3 md:p-5 text-center flex flex-col justify-center">
                    <p className="font-black text-black text-[10px] md:text-xs leading-tight uppercase">
                        Calon Wakil <br /> Himpunan RPL
                    </p>
                </div>
            </div>

            {/* AREA VISI & MISI (Kotak Putih Bawah) */}
            {/* z-10 biar masuk ke bawah kotak oranye dengan rapi */}
            <div className="w-full bg-white border-[5px] border-black border-t-0 rounded-b-[40px] shadow-[8px_8px_0px_black] p-6 z-10 flex flex-col gap-5 text-left mt-[-5px]">

                {/* VISI */}
                <div>
                    <span className="bg-yellow-400 text-black border-[3px] border-black px-3 py-1 font-black text-xs uppercase tracking-widest inline-block mb-2 transform -rotate-2 shadow-[2px_2px_0px_black]">
                        VISI
                    </span>
                    <p className="text-sm md:text-base font-bold leading-snug text-slate-800 bg-gray-100 p-3 border-l-[4px] border-black italic">
                        "{candidate.vision || 'Belum ada visi yang diinput.'}"
                    </p>
                </div>

                {/* MISI */}
                <div>
                    <span className="bg-blue-500 text-white border-[3px] border-black px-3 py-1 font-black text-xs uppercase tracking-widest inline-block mb-2 transform rotate-1 shadow-[2px_2px_0px_black]">
                        MISI
                    </span>
                    <p className={`text-sm md:text-base font-bold leading-snug text-slate-800 whitespace-pre-wrap ${!showFullMission && 'line-clamp-3'}`}>
                        {candidate.mission || 'Belum ada misi yang diinput.'}
                    </p>

                    {/* Tombol Baca Selengkapnya */}
                    {candidate.mission && candidate.mission.length > 100 && (
                        <button
                            onClick={() => setShowFullMission(!showFullMission)}
                            className="text-xs font-black text-blue-600 mt-2 uppercase hover:underline flex items-center gap-1"
                        >
                            {showFullMission ? 'Tutup Misi ▲' : 'Baca Selengkapnya ▼'}
                        </button>
                    )}
                </div>
            </div>

            {/* TOMBOL COBLOS */}
            <button
                onClick={onVote}
                className="mt-8 bg-[#00E676] text-black font-black uppercase tracking-widest text-xl py-4 px-10 md:px-12 border-[5px] border-black rounded-full shadow-[8px_8px_0px_black] hover:-translate-y-2 hover:shadow-[12px_12px_0px_black] active:translate-y-2 active:translate-x-2 active:shadow-[0px_0px_0px_black] transition-all z-30"
            >
                COBLOS NO. {candidate.candidate_number}
            </button>

        </div>
    );
}