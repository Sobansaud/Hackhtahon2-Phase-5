"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  userName?: string;
  pending?: number;
  onPrimaryAction?: () => void;
}

export default function Hero({ userName = 'User', pending = 0, onPrimaryAction }: HeroProps) {
  return (
    <section className="mb-12 relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xs font-black text-primary tracking-[0.2em] uppercase">Control Center</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-4 text-foreground">
            Welcome back, <span className="text-gradient italic">{userName}</span>
            <span className="ml-2 inline-block text-lg font-medium align-middle opacity-60">—</span>
          </h1>

          <p className="text-lg opacity-70 font-medium mb-6">
            You have <span className="font-black text-foreground">{pending}</span> pending initiatives. Activate the mission control to deploy your next objective.
          </p>

          <div className="flex items-center gap-4">
            <Button variant="primary" size="lg" onClick={onPrimaryAction} className="neon h-14 rounded-2xl font-black">
              Launch Task
            </Button>
            <Button variant="ghost" size="md" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="h-12 rounded-xl">
              Explore Dashboard
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="w-full lg:w-96"
        >
          {/* Decorative animated SVG card */}
          <div className="glass-premium rounded-2xl p-6 border border-white/10 shadow-xl">
            <svg viewBox="0 0 320 180" className="w-full h-36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#g1)" rx="16" ry="16" opacity="0.12" />
              <g fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1">
                <path d="M10 140 Q80 20 160 140 T310 140" strokeOpacity="0.5" />
              </g>
            </svg>

            <div className="mt-3">
              <h4 className="text-lg font-black">TaskFlow Snapshot</h4>
              <p className="text-sm opacity-70">Trends, completion velocity, and quick actions — condensed into one glance.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
