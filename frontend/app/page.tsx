"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Layout, Shield, Zap, Star, CheckCircle2 } from 'lucide-react';
import HeroFull from '@/components/layout/HeroFull';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] overflow-x-hidden bg-background">
      {/* Full-screen Landing Hero */}
      <HeroFull />
      {/* Features Grid */}
      <section className="section-horizontal section-vertical bg-muted/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="h2 mb-4">Why TaskFlow Pro?</h2>
            <p className="body">Superior design and performance for your workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Optimized performance ensures your tasks load in milliseconds, no matter the scale."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure by Design"
              description="Enterprise-grade JWT authentication keeps your personal data safe and private."
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Premium UI"
              description="Beautiful glassmorphism design with smooth animations and dark mode support."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 border-y border-ui-border/20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex -space-x-4 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                U{i}
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-background bg-primary text-white flex items-center justify-center font-bold text-xs">+</div>
          </div>
          <h3 className="h3 mb-2">Used by 10,000+ teams worldwide</h3>
          <p className="body uppercase tracking-widest font-black text-xs opacity-50">Trusted across the globe</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-ui-border/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-black tracking-tighter">TaskFlow Pro</h3>
            </div>
            <p className="body max-w-sm">
              The premium way to organize your life and tasks. Beautifully designed,
              intelligently built.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-widest text-xs opacity-50">Product</h4>
            <ul className="space-y-2 font-bold text-sm">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Integrations</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-widest text-xs opacity-50">Company</h4>
            <ul className="space-y-2 font-bold text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-ui-border/10 text-center text-sm font-bold opacity-30">
          &copy; 2026 TaskFlow Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-premium rounded-[2rem] p-10 border border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 group">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
        {icon}
      </div>
      <h3 className="h3 mb-4">{title}</h3>
      <p className="body text-base opacity-70 group-hover:opacity-100 transition-opacity">
        {description}
      </p>
    </div>
  );
}
