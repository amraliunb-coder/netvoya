import React from 'react';
import Card from './ui/Card';
import Reveal from './ui/Reveal';
import { LayoutDashboard, Zap, Globe, MessageSquare } from 'lucide-react';

const ValueProps: React.FC = () => {
  const features = [
    {
      icon: <LayoutDashboard className="text-primary" size={24} />,
      title: "Centralized Management Command",
      description: "A powerful dashboard designed for agencies. Issue eSIMs instantly, track usage in real-time, manage top-ups, and view earnings all in one place."
    },
    {
      icon: <Zap className="text-primary" size={24} />,
      title: "From Booking to Browsing in Seconds",
      description: "Deliver connectivity immediately via QR code upon booking confirmation. No shipping logistics, no physical inventory to manage."
    },
    {
      icon: <Globe className="text-primary" size={24} />,
      title: "Enterprise-Grade Reliability",
      description: "We partner with top-tier local carriers globally to ensure your clients get the fastest available speeds (4G/5G) wherever they land."
    },
    {
      icon: <MessageSquare className="text-primary" size={24} />,
      title: "We're Awake When Your Clients Are",
      description: "Travel doesn't keep office hours. Our dedicated technical support team is available around the clock to handle end-user queries."
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-surface/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <Card className="h-full p-8 bg-surface/50 border-white/5 hover:border-primary/30">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-primary shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-2xl text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-sans">{feature.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;