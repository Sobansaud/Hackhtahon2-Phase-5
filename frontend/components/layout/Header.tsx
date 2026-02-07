"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserMenu } from '@/components/ui/UserMenu';
import { cn } from '@/lib/utils';
import { Layout, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  // Hide header on auth pages for a cleaner focus on the forms
  if (isAuthPage) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 glass w-full',
        'border-b border-ui-border/20',
        'transition-all duration-500 ease-in-out',
        'backdrop-blur-xl bg-background/60'
      )}
    >
      <div className="section-horizontal py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:rotate-6 transition-all duration-500">
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-foreground leading-none">
                TaskFlow <span className="text-primary italic">Pro</span>
              </h1>
            </Link>

            {/* Main Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300",
                  pathname === '/' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300",
                  pathname === '/dashboard' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1.5 rounded-[1.25rem] bg-muted/30 border border-ui-border/20 shadow-inner">
              <ThemeToggle position="header" />
              <div className="w-px h-5 bg-ui-border/30 mx-1" />
              <UserMenu />
            </div>

            {!pathname?.includes('/dashboard') && (
              <Link href="/dashboard" className="hidden sm:block">
                <button className="px-5 py-2.5 bg-foreground text-background text-sm font-black rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-foreground/10">
                  Go to Workspace
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
