import React from 'react';
import Button from './ui/Button';
import Reveal from './ui/Reveal';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onActionClick?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onActionClick }) => {
  return (
    <section className="py-24 relative overflow-hidden bg-grid-pattern bg-[length:40px_40px]">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none"></div>
      
      {/* Abstract Glow Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <Reveal>
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-6">
            Ready to Transform How<br/>You Connect Travelers?
          </h2>
        </Reveal>
        
        <Reveal delay={0.2}>
          <div className="flex flex-col items-center gap-8 mt-12">
            
            {/* Primary B2B CTA */}
            <div className="w-full max-w-md">
              <Button 
                variant="primary" 
                className="w-full py-5 text-lg" 
                icon={<ArrowRight size={20}/>}
                onClick={onActionClick}
              >
                Become a Partner
              </Button>
              <p className="mt-3 text-sm text-slate-500">Request wholesale pricing & platform access</p>
            </div>

            {/* Divider */}
            <div className="w-24 h-px bg-white/10"></div>

            {/* Secondary B2C CTA */}
            <a href="#" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <span className="text-sm border-b border-transparent group-hover:border-primary/50 pb-0.5">Buying for personal travel? Shop eSIMs here</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>

          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTASection;