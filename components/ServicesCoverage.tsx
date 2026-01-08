import React, { useState } from 'react';
import Reveal from './ui/Reveal';
import { Check, Globe2, MapPin } from 'lucide-react';

const ServicesCoverage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const coverageItems = [
    { title: "The Global Pass", desc: "Access 130+ primary destinations with a single eSIM profile.", icon: <Globe2 size={20} /> },
    { title: "Regional Bundles", desc: "Europe, Asia-Pacific, North America, Latin America.", icon: <MapPin size={20} /> },
    { title: "Single Country", desc: "High-data, destination-specific plans for deep travel.", icon: <MapPin size={20} /> }
  ];

  return (
    <section id="coverage" className="py-24 bg-background relative">
      {/* Subtle blue gradient at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Interactive Map Visualization (Abstract) */}
          <Reveal>
            <div className="relative aspect-square md:aspect-video lg:aspect-square bg-surface rounded-2xl overflow-hidden border border-white/10 group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Added a blue filter to the map image */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-blue-900/20 mix-blend-color"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              
              {/* Animated Dots/Pins */}
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#00D4FF]"
                  style={{
                    top: `${Math.random() * 60 + 20}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                >
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                </div>
              ))}

              <div className="absolute bottom-8 left-8">
                <div className="font-display font-bold text-3xl text-white">190+</div>
                <div className="text-slate-400 text-sm">Countries Covered</div>
              </div>
            </div>
          </Reveal>

          {/* Right: Content */}
          <div>
            <Reveal delay={0.2}>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-8">
                Global Coverage,<br />
                <span className="text-slate-500">Flexible Packages</span>
              </h2>
            </Reveal>

            <div className="space-y-6">
              {coverageItems.map((item, idx) => (
                <Reveal key={idx} delay={0.3 + (idx * 0.1)}>
                  <div 
                    className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${activeTab === idx ? 'bg-white/5 border-primary/50 shadow-[0_0_20px_rgba(0,212,255,0.05)]' : 'bg-transparent border-white/10 hover:border-white/30'}`}
                    onClick={() => setActiveTab(idx)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-lg ${activeTab === idx ? 'bg-primary text-black font-bold' : 'bg-white/5 text-slate-400'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className={`font-display font-semibold text-xl mb-2 ${activeTab === idx ? 'text-white' : 'text-slate-300'}`}>{item.title}</h3>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.6}>
              <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold flex items-center gap-2"><Check size={14} className="text-primary"/> Wholesale Access</span>
                  <span className="text-xs text-slate-500">Reduced net rates</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold flex items-center gap-2"><Check size={14} className="text-primary"/> Volume Tiering</span>
                  <span className="text-xs text-slate-500">Scale for better margins</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold flex items-center gap-2"><Check size={14} className="text-primary"/> API Integration</span>
                  <span className="text-xs text-slate-500">Automated issuance</span>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesCoverage;