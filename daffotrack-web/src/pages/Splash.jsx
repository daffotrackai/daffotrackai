import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate('/login'), 2500);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brandDark text-white">
            <h1 className="text-5xl font-bold text-brandTeal animate-pulse mb-2">Metamorph X</h1>
            <h2 className="text-2xl text-gray-300 tracking-widest">DaffoTrack AI</h2>
        </div>
    );
}