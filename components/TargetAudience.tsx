import React from 'react';
import Card from './ui/Card';
import Reveal from './ui/Reveal';
import { Building2, Users, Briefcase } from 'lucide-react';

const TargetAudience: React.FC = () => {
  const audiences = [
    {
      icon: <Building2 className="text-white" size={32} />,
      title: "Travel Agencies",
      sub: "OTAs & Brick-and-Mortar",
      description: "Enhance your booking packages with essential digital add-ons. Increase average order value (AOV) and improve client satisfaction by ensuring they are connected upon arrival."
    },
    {
      icon: <Users className="text-white" size={32} />,
      title: "Tour Operators",
      sub: "Group Travel Specialists",
      description: "Manage connectivity for entire groups effortlessly. Ensure guides and guests stay synchronized, safe, and connected during multi-country itineraries."
    },
    {
      icon: <Briefcase className="text-white" size={32} />,
      title: "Corporate Travel",
      sub: "Travel Managers",
      description: "Eliminate unpredictable roaming bills. Provide your team with secure, cost-effective, and compliant data access for international business trips."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Reveal className="mb-16 text-center">
          <span className="font-mono text-primary text-xs uppercase tracking-widest mb-3 block">WHO WE SERVE</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">Built for Travel Industry Leaders</h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audiences.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.2} className="h-full">
              <Card className="h-full p-8 bg-gradient-to-b from-white/5 to-transparent border-white/10 hover:border-primary/40 group">
                <div className="mb-6 p-4 bg-white/5 rounded-lg w-fit group-hover:bg-primary/20 transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-1">{item.title}</h3>
                <p className="font-mono text-xs text-primary uppercase tracking-wider mb-4">{item.sub}</p>
                <p className="text-slate-400 font-sans leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;