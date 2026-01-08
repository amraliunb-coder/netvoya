import React from 'react';
import Card from './ui/Card';
import Reveal from './ui/Reveal';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* B2B Review */}
          <Reveal delay={0}>
            <Card className="p-8 h-full bg-surface border-white/10">
              <Quote className="text-primary/50 mb-6" size={40} />
              <p className="text-lg md:text-xl text-white mb-8 leading-relaxed font-light">
                "Integrating NetVoya has been a game-changer for our agency. It used to be a hassle advising clients on SIM cards; now it's an automated, profitable part of our booking process. The support team is incredible."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden">
                   <img src="https://picsum.photos/id/64/200/200" alt="Sarah Jenkins" className="w-full h-full object-cover grayscale" />
                </div>
                <div>
                  <div className="font-display font-bold text-white">Sarah Jenkins</div>
                  <div className="text-sm text-slate-400">Director, Apex Travel Solutions</div>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-primary text-primary" />)}
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* B2C Review */}
          <Reveal delay={0.2}>
            <Card className="p-8 h-full bg-surface border-white/10">
              <Quote className="text-slate-700 mb-6" size={40} />
              <p className="text-lg md:text-xl text-white mb-8 leading-relaxed font-light">
                "Used the Europe regional pass for a 3-week trip. Landed in London, scanned the QR code, and had perfect 5G before I even got off the plane. Flawless in 4 different countries."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden text-white flex items-center justify-center font-bold text-xl border border-white/5">
                    M
                </div>
                <div>
                  <div className="font-display font-bold text-white flex items-center gap-2">
                    Mark D.
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border border-primary/20">Verified</span>
                  </div>
                  <div className="text-sm text-slate-400">Traveler</div>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-primary text-primary" />)}
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;