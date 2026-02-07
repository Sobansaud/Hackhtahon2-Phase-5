import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/api';

/**
 * UserMenu Component
 * Displays "Welcome, [Name]" and a Logout button.
 * Uses localStorage to retrieve the user's name.
 */
export function UserMenu() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const storedName = localStorage.getItem('user_name');
            setIsAuthenticated(!!token);
            setUserName(storedName);
        };

        checkAuth();
        // Add event listener for storage changes to sync across tabs/components
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            localStorage.removeItem('user_name');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUserName(null);
            router.push('/auth/sign-in');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
            localStorage.removeItem('user_name');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUserName(null);
            router.push('/auth/sign-in');
            router.refresh();
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="flex items-center gap-4">
            {userName && (
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                        Welcome back
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        {userName}
                    </span>
                </div>
            )}

            <button
                onClick={handleLogout}
                className={cn(
                    "relative group overflow-hidden px-4 py-2 rounded-xl",
                    "bg-white dark:bg-slate-800",
                    "border border-slate-200 dark:border-slate-700",
                    "text-sm font-semibold text-slate-700 dark:text-slate-200",
                    "hover:border-rose-200 dark:hover:border-rose-900",
                    "hover:text-rose-600 dark:hover:text-rose-400",
                    "transition-all duration-300 ease-out-cubic",
                    "shadow-sm hover:shadow-md"
                )}
            >
                <span className="relative z-10 flex items-center gap-2">
                    <span>Logout</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </span>
            </button>
        </div>
    );
}
