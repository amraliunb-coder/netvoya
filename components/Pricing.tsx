import React from 'react';
import Reveal from './ui/Reveal';
import Button from './ui/Button';
import { Check, ArrowRight, Phone, Zap, Globe, Shield } from 'lucide-react';

interface PricingProps {
  onActionClick?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onActionClick }) => {
  const plans = [
    {
      name: "Business Starter",
      data: "5 GB",
      price: "$30",
      period: "/ user",
      description: "Perfect for employees with occasional travel needs.",
      features: [
        "Global eSIM Coverage (190+ Countries)",
        "4G/5G High Speed Data",
        "Instant QR Code Delivery",
        "Standard Email Support",
        "Valid for 30 Days"
      ],
      cta: "Get Started",
      popular: false,
      badge: "Special Launch Offer"
    },
    {
      name: "Business Pro",
      data: "10 GB",
      price: "$50",
      period: "/ user",
      description: "Ideal for frequent travelers and heavy data users.",
      features: [
        "Global eSIM Coverage (190+ Countries)",
        "Uncapped 4G/5G Speeds",
        "Hotspot / Tethering Allowed",
        "Priority 24/7 Support",
        "Valid for 30 Days",
        "API Access for Automation"
      ],
      cta: "Get Started",
      popular: true,
      badge: "Best Value"
    },
    {
      name: "Enterprise",
      data: "Custom",
      price: "Call for price",
      period: "",
      description: "For large organizations with specific compliance needs.",
      features: [
        "Tailor-made Data Packages",
        "Centralized Management Dashboard",
        "Post-paid & Centralized Invoicing",
        "Dedicated Account Manager",
        "SSO & Custom Security Policies",
        "Volume Discounts"
      ],
      cta: "Book a Demo",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 relative overflow-hidden font-sans">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal className="text-center mb-16">
                <span className="font-mono text-orange-500 text-xs uppercase tracking-widest mb-3 block">Flexible Plans</span>
                <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">Simple, Transparent Pricing</h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose the connectivity package that fits your business travel frequency and data requirements.</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, idx) => (
                    <Reveal key={idx} delay={idx * 0.1} className="h-full">
                        <div className={`h-full flex flex-col p-8 rounded-2xl border transition-all duration-300 relative group ${plan.popular ? 'bg-[#171717] border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.1)] transform md:-translate-y-4' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                            
                            {/* Badges */}
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full border border-black shadow-lg z-10">
                                    {plan.badge}
                                </div>
                            )}
                             {!plan.popular && plan.badge && idx === 0 && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full border border-black shadow-lg z-10">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-8 text-center border-b border-white/5 pb-8">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mb-6 flex items-center justify-center border border-white/10 shadow-inner">
                                    {idx === 0 && <Globe className="text-orange-400" size={32} />}
                                    {idx === 1 && <Zap className="text-orange-400" size={32} />}
                                    {idx === 2 && <Shield className="text-orange-400" size={32} />}
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-slate-400 min-h-[40px] px-2">{plan.description}</p>
                            </div>

                            <div className="mb-8 text-center">
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-xs text-slate-500 font-mono self-end mb-1.5">{plan.period}</span>}
                                </div>
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 font-bold text-sm">
                                    {plan.data} Data
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3 text-sm text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                                            <Check size={12} />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Button 
                                variant={plan.popular ? 'primary' : 'outline'} 
                                className="w-full justify-center group"
                                onClick={onActionClick}
                            >
                                {plan.cta} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={0.4} className="mt-20">
                <div className="bg-[#171717] border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2">Not sure which plan is right for you?</h3>
                        <p className="text-slate-400">Our team can analyze your travel patterns and recommend the most cost-effective solution.</p>
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                         <button 
                            onClick={onActionClick}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                         >
                            <Phone size={18} /> Contact Sales
                         </button>
                    </div>
                </div>
            </Reveal>
        </div>
    </div>
  );
};

export default Pricing;