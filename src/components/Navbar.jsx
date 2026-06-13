import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    // State buat ngatur menu mobile buka/tutup
    const [isOpen, setIsOpen] = useState(false);

    // Ambil data user dari localStorage (Sesuai sistem kita)
    const userData = JSON.parse(localStorage.getItem('user'));

    // Kalau belum login, nggak usah nampilin Navbar
    if (!userData) return null;

    const role = userData.role;

    // Cari dan ganti fungsi ini:
    const handleLogout = async () => {
        // Bahasa resmi KPU
        const confirmLogout = window.confirm("KONFIRMASI SISTEM:\n\nApakah Anda yakin ingin mengakhiri sesi dan keluar dari sistem PEMIRA?");
        if (!confirmLogout) return;

        try {
            localStorage.removeItem('user');
            toast.success("Sesi Anda telah berakhir dengan aman.");
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error("KESALAHAN: Gagal mengakhiri sesi. Silakan coba lagi.");
        }
    };

    // ... (scroll ke bawah bagian tombol logout mobile) ...
    // Ganti teks "LOGOUT CUY 🚪" menjadi:
    // KELUAR SISTEM 🚪

    // Fungsi biar menu nutup sendiri abis kita nge-klik link di HP
    const closeMenu = () => setIsOpen(false);

    // Styling dasar untuk semua tombol menu
    const baseLinkClass = "w-full md:w-auto px-4 py-2 border-[3px] md:border-[4px] border-black rounded-xl font-black uppercase transition-all tracking-wide text-sm md:text-base text-center";

    // Kalau aktif: Tombol neken ke dalam (warna hitam teks kuning)
    const activeClass = `${baseLinkClass} bg-black text-[#FFD500] translate-y-1 translate-x-1 shadow-[0px_0px_0px_black]`;

    // Kalau belum aktif: Tombol putih pop-up
    const inactiveClass = `${baseLinkClass} bg-white text-black shadow-[4px_4px_0px_black] hover:-translate-y-1 hover:shadow-[6px_6px_0px_black] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_black]`;

    return (
        <nav className="sticky top-0 z-50 bg-[#FFD500] border-b-[4px] border-black shadow-[0_6px_0_black] flex flex-col md:flex-row md:justify-between md:items-center">

            {/* Area Kiri: Logo & Tombol Hamburger */}
            <div className="flex justify-between items-center px-4 py-4 md:px-8 w-full md:w-auto">
                <Link
                    to={role === 'admin' ? '/admin' : '/voter'}
                    onClick={closeMenu}
                    className="flex items-center gap-3 bg-white text-black px-4 py-2 border-[3px] md:border-[4px] border-black rounded-xl shadow-[4px_4px_0px_black] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_black] transition-all group"
                >
                    {/* Logo (Bisa diganti image lu, kasih fallback huruf 'P' kalau error) */}
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-[#00E676] border-2 border-black rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <span className="font-black text-white leading-none">
                            <img src="/images/logo.png" alt="HIMPUNAN MAHASISWA REKAYASA PERANGKAT LUNA" />
                        </span>
                    </div>
                    <span className="text-lg md:text-xl font-black uppercase tracking-wider">
                        PEMIRA HIMA-RPL
                    </span>
                </Link>

                {/* Tombol Hamburger (Cuma Muncul di Mobile) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden bg-white text-black px-3 py-2 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_black] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_black] transition-all flex items-center justify-center"
                >
                    {/* Ikon Baris 3 (Hamburger) atau Silang (X) */}
                    <span className="text-2xl font-black leading-none">
                        {isOpen ? "✖" : "☰"}
                    </span>
                </button>
            </div>

            {/* Area Kanan: Links */}
            <div className={`
                ${isOpen ? 'flex' : 'hidden'} 
                md:flex flex-col md:flex-row 
                w-full md:w-auto 
                px-4 pb-6 md:py-4 md:px-8 
                gap-4 md:gap-4 
                justify-center items-center
            `}>

                {/* MENU VOTER */}
                {role !== 'admin' && (
                    <>
                        <Link to="/voter" onClick={closeMenu} className={location.pathname === "/voter" ? activeClass : inactiveClass}>
                            Pilih Paslon
                        </Link>
                        <Link to="/voter/results" onClick={closeMenu} className={location.pathname === "/voter/results" ? activeClass : inactiveClass}>
                            Hasil Suara
                        </Link>
                        <Link to="/voter/sengketa" onClick={closeMenu} className={location.pathname === "/voter/sengketa" ? activeClass : inactiveClass}>
                            Lapor Sengketa
                        </Link>
                    </>
                )}

                {/* MENU ADMIN */}
                {role === "admin" && (
                    <>
                        <Link to="/admin" onClick={closeMenu} className={location.pathname === "/admin" ? activeClass : inactiveClass}>
                            Stats
                        </Link>
                        <Link to="/admin/disputes" onClick={closeMenu} className={location.pathname === "/admin/disputes" ? activeClass : inactiveClass}>
                            Sengketa Masuk
                        </Link>
                        <Link to="/admin/candidates" onClick={closeMenu} className={location.pathname === "/admin/candidates" ? activeClass : inactiveClass}>
                            Kandidat
                        </Link>
                        <Link to="/admin/audit" onClick={closeMenu} className={location.pathname === "/admin/audit" ? activeClass : inactiveClass}>
                            Audit
                        </Link>
                        <Link to="/admin/recalculate" onClick={closeMenu} className={location.pathname === "/admin/recalculate" ? activeClass : inactiveClass}>
                            Rekap Suara
                        </Link>
                    </>
                )}

                {/* Tombol Logout */}
                <button
                    onClick={() => {
                        closeMenu();
                        handleLogout();
                    }}
                    className="w-full md:w-auto px-6 py-2 bg-[#FF1744] text-white font-black uppercase text-sm md:text-base rounded-xl border-[3px] md:border-[4px] border-black shadow-[4px_4px_0px_black] hover:-translate-y-1 hover:shadow-[6px_6px_0px_black] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_black] transition-all tracking-wide text-center"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}