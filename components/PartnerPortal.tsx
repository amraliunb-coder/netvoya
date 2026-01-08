import React from 'react';
import Button from './ui/Button';
import Reveal from './ui/Reveal';
import { ArrowRight } from 'lucide-react';

const PartnerPortal: React.FC = () => {
  const features = [
    "Real-time Analytics",
    "Instant Issuance", 
    "Automated Top-ups",
    "Revenue Dashboard"
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">The Partner Portal</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16">Everything you need to manage, monitor, and monetize your eSIM operations.</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative mx-auto max-w-5xl">
            {/* Dashboard Mockup - Using a high quality placeholder */}
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 bg-surface">
              <img 
                src="https://picsum.photos/id/10/1600/900" 
                alt="NetVoya Partner Dashboard" 
                className="w-full h-auto opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              {/* Overlay to darken and tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
            </div>

            {/* Floating Features */}
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className={`hidden md:flex absolute items-center gap-2 px-4 py-2 bg-surface/80 backdrop-blur-md border border-white/20 rounded-full text-xs font-mono text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-bounce`}
                style={{
                  top: `${20 + (idx * 15)}%`,
                  left: idx % 2 === 0 ? '-20px' : 'auto',
                  right: idx % 2 !== 0 ? '-20px' : 'auto',
                  animationDuration: `${3 + idx}s`,
                  animationDelay: `${idx * 0.5}s`
                }}
              >
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#00D4FF]"></div>
                {feature}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-16">
            <Button variant="primary" icon={<ArrowRight size={18}/>}>
              See Platform Demo
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default PartnerPortal;