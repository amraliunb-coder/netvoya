import React from 'react';
import { Plane, Hotel, Map, Globe, Compass, Briefcase } from 'lucide-react';

const TrustSignals: React.FC = () => {
  const logos = [
    { Icon: Plane, name: "AeroTrip" },
    { Icon: Hotel, name: "LuxStay" },
    { Icon: Map, name: "NaviGo" },
    { Icon: Globe, name: "WorldWide" },
    { Icon: Compass, name: "TrueNorth" },
    { Icon: Briefcase, name: "CorpConnect" },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
         <span className="font-mono text-xs text-slate-500 uppercase tracking-[0.2em]">Trusted by Leading Travel Brands</span>
      </div>
      
      <div className="relative w-full max-w-[100vw] overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
        
        <div className="flex w-max animate-marquee space-x-24">
          {/* Double the list for seamless loop */}
          {[...logos, ...logos, ...logos, ...logos].map((logo, idx) => (
            <div key={idx} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-300">
              <logo.Icon size={32} className="text-slate-200" />
              <span className="font-display font-bold text-xl text-slate-200">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;