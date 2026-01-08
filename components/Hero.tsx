import React from 'react';
import Button from './ui/Button';
import Reveal from './ui/Reveal';
import { ArrowRight, PlayCircle } from 'lucide-react';

interface HeroProps {
  onActionClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onActionClick }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:32px_32px] opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        
        {/* Label */}
        <Reveal delay={0}>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border-l-2 border-primary bg-white/5 backdrop-blur-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold shadow-[0_0_10px_rgba(0,212,255,0.3)]">[ ENTERPRISE ESIM PLATFORM ]</span>
          </div>
        </Reveal>

        {/* Main Headline */}
        <Reveal delay={0.1}>
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400">
            Powering Global <br />
            Connectivity
          </h1>
        </Reveal>

        {/* Subheadline */}
        <Reveal delay={0.2}>
          <p className="font-sans text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            NetVoya provides travel agencies, tour operators, and corporate partners with the infrastructure to offer instant, reliable global data to their clients.
          </p>
        </Reveal>

        {/* CTA Group */}
        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
            <Button variant="primary" icon={<ArrowRight size={18} />} onClick={onActionClick}>
              Request Wholesale Pricing
            </Button>
            <Button variant="secondary" icon={<PlayCircle size={18} />} onClick={onActionClick}>
              Book a Platform Demo
            </Button>
          </div>
        </Reveal>

        {/* Stats Bar */}
        <Reveal delay={0.5} width="100%">
          <div className="w-full max-w-4xl mx-auto border-y border-white/10 bg-background/60 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {[
                { label: 'Countries', value: '190+' },
                { label: 'Agency Partners', value: '50+' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Setup Time', value: '<2min' },
              ].map((stat, i) => (
                <div key={i} className="py-6 px-4 flex flex-col items-center">
                  <span className="font-display font-bold text-2xl md:text-3xl text-white mb-1">{stat.value}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        
        {/* Bottom Badge */}
        <Reveal delay={0.6}>
          <div className="mt-8 text-slate-500 text-sm flex items-center gap-2">
            <span className="text-primary">✓</span> The evolution of Alex Esim - Now serving B2B at scale
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default Hero;