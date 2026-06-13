// src/components/GlobalLoading.jsx
import { useContext } from 'react';
import { LoadingContext } from '../context/LoadingContext';

export default function GlobalLoading() {
    const { isLoading } = useContext(LoadingContext);
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="animate-bounce text-4xl">🚀</div>
            <p className="ml-4 font-black text-white text-xl">LOADING...</p>
        </div>
    );
}