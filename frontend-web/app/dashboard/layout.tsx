'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-800">SPMS</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome, {user.name}</p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                        {user.role.toUpperCase()}
                    </span>
                </div>
                <nav className="mt-6">
                    <a href={`/dashboard/${user.role}`} className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                        Dashboard
                    </a>
                    <a href="/profile" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                        Profile
                    </a>
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
