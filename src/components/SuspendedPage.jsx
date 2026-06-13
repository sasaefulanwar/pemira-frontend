export default function SuspendedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-600 text-white p-8 text-center">
            <h1 className="text-6xl font-black uppercase mb-4 tracking-tighter">AKUN KAMU DIBEKUKAN!</h1>
            <p className="text-2xl font-bold bg-white text-red-600 px-4 py-2 border-4 border-black">
                Terdeteksi sengketa pada akun kamu. Akses dibatasi sampai admin selesai memeriksa laporan.
            </p>
            <button
                onClick={() => {
                    localStorage.removeItem('user');
                    window.location.href = '/';
                }}
                className="mt-8 bg-black text-white px-8 py-4 font-black uppercase border-4 border-white hover:bg-white hover:text-black transition-all"
            >
                LOGOUT & HUBUNGI ADMIN
            </button>
        </div>
    );
}