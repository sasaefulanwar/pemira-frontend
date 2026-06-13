export default function PageLayout({ children }) {
    return (
        // 1. Tambah overflow-x-hidden biar animasi/elemen absolut ga bikin layar bisa di-scroll ke samping
        // 2. Tambah z-0 sebagai base layering
        <div className="relative min-h-screen w-full flex flex-col pt-10 overflow-x-hidden z-0">

            {/* =========================================
                ELEMEN DEKORASI POP-ART / BRUTALISM
            ========================================= */}

            {/* Lingkaran Hijau di Kiri Atas (Tetap muncul di HP, tapi agak kecil) */}
            <div className="absolute top-20 left-4 md:left-10 w-12 h-12 md:w-16 md:h-16 bg-[#00E676] border-[4px] md:border-[5px] border-black rounded-full shadow-[4px_4px_0px_black] md:shadow-[6px_6px_0px_black] animate-bounce -z-10 opacity-90"></div>

            {/* Kotak Ungu Miring di Kanan Bawah */}
            <div className="absolute bottom-20 md:bottom-32 right-8 md:right-16 w-10 h-10 md:w-14 md:h-14 bg-[#D500F9] border-[4px] md:border-[5px] border-black shadow-[4px_4px_0px_black] md:shadow-[6px_6px_0px_black] transform rotate-45 -z-10 opacity-90 hidden md:block"></div>

            {/* Lingkaran Oranye Kecil di Kiri Bawah */}
            <div className="absolute bottom-32 left-10 md:bottom-40 md:left-20 w-8 h-8 md:w-10 md:h-10 bg-[#FF8A00] border-[4px] border-black rounded-full shadow-[4px_4px_0px_black] -z-10 opacity-90 animate-pulse hidden lg:block"></div>

            {/* Kotak Biru Miring di Kanan Atas */}
            <div className="absolute top-32 right-12 md:top-32 md:right-24 w-10 h-10 md:w-12 md:h-12 bg-[#2979FF] border-[4px] border-black shadow-[4px_4px_0px_black] transform -rotate-12 -z-10 opacity-90 hidden lg:block"></div>

            {/* =========================================
                KONTEN UTAMA (CHILDREN)
            ========================================= */}

            {/* PENTING: Tambah mx-auto biar ke tengah, flex-1 biar menu-menuhin layar, dan px-4 buat padding HP */}
            <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col px-4 md:px-8 pb-16 z-10">
                {children}
            </main>

        </div>
    );
}