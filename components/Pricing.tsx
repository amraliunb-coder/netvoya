import React, { useState } from 'react';
import Reveal from './ui/Reveal';
import Button from './ui/Button';
import { Check, ArrowRight, Globe, Zap, Shield, Phone, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';

interface Plan {
    data: string;
    price: string;
}

interface CountryPackages {
    [key: string]: Plan[];
}

interface RegionData {
    [regionName: string]: CountryPackages;
}

const PRICING_DATA: RegionData = {
    "Popular Bundles": {
        "Hello Africa": [{ data: "Flexible", price: "$30" }],
        "Eurolink": [{ data: "15GB", price: "$15" }, { data: "30GB", price: "$30" }],
        "Americanmex": [{ data: "10GB", price: "$10" }, { data: "20GB", price: "$20" }],
        "Burj Mobile": [{ data: "10GB", price: "$10" }, { data: "15GB", price: "$15" }, { data: "25GB", price: "$25" }]
    },
    "Regional Plans": {
        "World Wide": [{ data: "5GB", price: "$50" }],
        "Sri Lanka": [{ data: "1GB", price: "$10" }],
        "DR Congo": [{ data: "1GB", price: "$10" }],
        "Hello Africa (Reg)": [{ data: "1GB", price: "$15" }]
    },
    "Middle East & North Africa": {
        "Algeria": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$8.5" }, { data: "5GB", price: "$13.5" }, { data: "10GB", price: "$20" }, { data: "20GB", price: "$38.5" }],
        "Bahrain": [{ data: "1GB", price: "$4.5" }, { data: "3GB", price: "$12" }, { data: "5GB", price: "$16" }, { data: "10GB", price: "$25.5" }, { data: "20GB", price: "$39.5" }],
        "Egypt": [{ data: "1GB", price: "$5" }, { data: "3GB", price: "$14" }, { data: "5GB", price: "$22.5" }, { data: "10GB", price: "$38" }, { data: "20GB", price: "$48.5" }],
        "Iraq": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$11" }, { data: "5GB", price: "$16.5" }, { data: "10GB", price: "$29" }, { data: "20GB", price: "$48.5" }],
        "Jordan": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$11.5" }, { data: "5GB", price: "$17.5" }, { data: "10GB", price: "$29.5" }, { data: "20GB", price: "$48.5" }],
        "Kuwait": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$9" }, { data: "5GB", price: "$14" }, { data: "10GB", price: "$24" }, { data: "20GB", price: "$37.5" }],
        "Morocco": [{ data: "1GB", price: "$6" }, { data: "3GB", price: "$17.5" }, { data: "5GB", price: "$27.5" }, { data: "10GB", price: "$41.5" }, { data: "20GB", price: "$59.5" }],
        "Oman": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$9" }, { data: "5GB", price: "$13.5" }, { data: "10GB", price: "$23.5" }, { data: "20GB", price: "$37.5" }],
        "Qatar": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$9.5" }, { data: "5GB", price: "$14.5" }, { data: "10GB", price: "$26" }, { data: "20GB", price: "$42.5" }],
        "Saudi Arabia": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$9.5" }, { data: "5GB", price: "$14.5" }, { data: "10GB", price: "$25" }, { data: "20GB", price: "$41.5" }],
        "Tunisia": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$8" }, { data: "5GB", price: "$11.5" }, { data: "10GB", price: "$19.5" }, { data: "20GB", price: "$31" }],
        "United Arab Emirates": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$8.5" }, { data: "5GB", price: "$11.5" }, { data: "10GB", price: "$19.5" }, { data: "20GB", price: "$33.5" }]
    },
    "Europe": {
        "Austria": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$6" }, { data: "5GB", price: "$7.5" }, { data: "10GB", price: "$10.5" }, { data: "20GB", price: "$11.5" }],
        "Belgium": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$10.5" }, { data: "10GB", price: "$17.5" }, { data: "20GB", price: "$26" }],
        "Bulgaria": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$5" }, { data: "5GB", price: "$7" }, { data: "10GB", price: "$12.5" }, { data: "20GB", price: "$19.5" }],
        "Croatia": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7" }, { data: "5GB", price: "$10" }, { data: "10GB", price: "$16.5" }, { data: "20GB", price: "$25" }],
        "Cyprus": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7" }, { data: "5GB", price: "$9" }, { data: "10GB", price: "$15.5" }, { data: "20GB", price: "$18.5" }],
        "Czech Republic": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$4.5" }, { data: "5GB", price: "$7.5" }, { data: "10GB", price: "$14.5" }, { data: "20GB", price: "$23.5" }],
        "Denmark": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$10.5" }, { data: "10GB", price: "$17.5" }, { data: "20GB", price: "$27.5" }],
        "Estonia": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7" }, { data: "5GB", price: "$10" }, { data: "10GB", price: "$17" }, { data: "20GB", price: "$27" }],
        "Finland": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$6" }, { data: "5GB", price: "$9.5" }, { data: "10GB", price: "$15" }, { data: "20GB", price: "$21.5" }],
        "France": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$6.5" }, { data: "5GB", price: "$9.5" }, { data: "10GB", price: "$15.5" }, { data: "20GB", price: "$23" }],
        "Germany": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$11" }, { data: "10GB", price: "$15.5" }, { data: "20GB", price: "$23" }],
        "Gibraltar": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$10.5" }, { data: "5GB", price: "$15.5" }, { data: "10GB", price: "$26.5" }, { data: "20GB", price: "$26.5" }],
        "Hungary": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$11.5" }, { data: "10GB", price: "$18.5" }, { data: "20GB", price: "$31.5" }],
        "Iceland": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$11.5" }, { data: "10GB", price: "$19" }, { data: "20GB", price: "$30" }],
        "Ireland": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7" }, { data: "5GB", price: "$10.5" }, { data: "10GB", price: "$18.5" }, { data: "20GB", price: "$27.5" }],
        "Italy": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$9.5" }, { data: "5GB", price: "$14" }, { data: "10GB", price: "$23.5" }, { data: "20GB", price: "$32.5" }],
        "Latvia": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$10.5" }, { data: "10GB", price: "$18" }, { data: "20GB", price: "$27.5" }],
        "Liechtenstein": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7" }, { data: "5GB", price: "$10.5" }, { data: "10GB", price: "$17.5" }, { data: "20GB", price: "$26.5" }],
        "Lithuania": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$11.5" }, { data: "10GB", price: "$18.5" }, { data: "20GB", price: "$29.5" }],
        "Luxembourg": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$11" }, { data: "10GB", price: "$18.5" }, { data: "20GB", price: "$29" }],
        "Malta": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$8.5" }, { data: "5GB", price: "$12.5" }, { data: "10GB", price: "$19.5" }, { data: "20GB", price: "$27.5" }],
        "Netherlands": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7" }, { data: "5GB", price: "$9.5" }, { data: "10GB", price: "$17.5" }, { data: "20GB", price: "$26.5" }],
        "Norway": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7" }, { data: "5GB", price: "$10" }, { data: "10GB", price: "$16.5" }, { data: "20GB", price: "$25" }],
        "Poland": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$6" }, { data: "5GB", price: "$7.5" }, { data: "10GB", price: "$11" }, { data: "20GB", price: "$14.5" }],
        "Portugal": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$6.5" }, { data: "5GB", price: "$7" }, { data: "10GB", price: "$10" }, { data: "20GB", price: "$18.5" }],
        "Romania": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$10.5" }, { data: "10GB", price: "$17.5" }, { data: "20GB", price: "$27.5" }],
        "Slovakia": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7" }, { data: "5GB", price: "$10" }, { data: "10GB", price: "$15.5" }, { data: "20GB", price: "$23.5" }],
        "Spain": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$8" }, { data: "5GB", price: "$11" }, { data: "10GB", price: "$17.5" }, { data: "20GB", price: "$25.5" }],
        "Sweden": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$6.5" }, { data: "5GB", price: "$9.5" }, { data: "10GB", price: "$15.5" }, { data: "20GB", price: "$26.5" }],
        "Switzerland": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$9" }, { data: "5GB", price: "$13.5" }, { data: "10GB", price: "$22.5" }, { data: "20GB", price: "$35.5" }],
        "Turkey": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$7.5" }, { data: "5GB", price: "$11.5" }, { data: "10GB", price: "$17.5" }, { data: "20GB", price: "$25.5" }],
        "United Kingdom": [{ data: "1GB", price: "$4" }, { data: "3GB", price: "$8.5" }, { data: "5GB", price: "$14.5" }, { data: "10GB", price: "$22" }, { data: "20GB", price: "$35.5" }]
    }
};

interface PricingProps {
    onActionClick?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onActionClick }) => {
    const regions = Object.keys(PRICING_DATA);
    const [selectedRegion, setSelectedRegion] = useState(regions[0]);
    const countries = Object.keys(PRICING_DATA[selectedRegion]);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const handleRegionChange = (region: string) => {
        setSelectedRegion(region);
        const firstCountry = Object.keys(PRICING_DATA[region])[0];
        setSelectedCountry(firstCountry);
    };

    const activePlans = PRICING_DATA[selectedRegion][selectedCountry] || [];

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal className="text-center mb-16">
                    <span className="font-mono text-orange-500 text-xs uppercase tracking-widest mb-3 block">Travel Connectivity</span>
                    <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">Global eSIM Pricing</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">Select your destination to view available high-speed data packages tailored for your trip.</p>
                </Reveal>

                {/* Region Selector */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {regions.map((region) => (
                        <button
                            key={region}
                            onClick={() => handleRegionChange(region)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${selectedRegion === region
                                ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                }`}
                        >
                            {region}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Country Selection Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Reveal delay={0.1}>
                            <div className="bg-[#171717]/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-6 text-white pb-6 border-b border-white/5">
                                    <MapPin className="text-orange-500" size={24} />
                                    <h3 className="text-xl font-bold">Select Destination</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {countries.map((country) => (
                                        <button
                                            key={country}
                                            onClick={() => setSelectedCountry(country)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${selectedCountry === country
                                                ? 'bg-white/10 text-white border border-white/10'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <span className="font-medium">{country}</span>
                                            {selectedCountry === country && <ArrowRight size={16} className="text-orange-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-3 text-orange-400">
                                    <Zap size={20} />
                                    <span className="font-bold uppercase text-xs tracking-wider">Instant Activation</span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    All plans include immediate QR code delivery. High-speed 4G/5G data starts as soon as you land.
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    {/* Plans Display Column */}
                    <div className="lg:col-span-8">
                        <Reveal delay={0.3}>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm min-h-[500px]">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <h2 className="text-3xl font-display font-bold text-white mb-2">{selectedCountry}</h2>
                                        <p className="text-slate-400">Available data packages for your selected region.</p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                                        <CheckCircle2 size={16} />
                                        In Stock
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activePlans.map((plan, idx) => (
                                        <div
                                            key={idx}
                                            className="group p-6 rounded-2xl bg-[#171717] border border-white/5 hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Globe className="text-orange-500/20" size={60} />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="text-orange-500 font-mono text-sm font-bold mb-1 uppercase tracking-tighter">Data Package</div>
                                                <div className="text-4xl font-display font-bold text-white mb-4">{plan.data}</div>

                                                <div className="flex items-baseline gap-1 mb-6">
                                                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                                                    <span className="text-slate-500 text-xs">/ package</span>
                                                </div>

                                                <ul className="space-y-3 mb-8">
                                                    <li className="flex items-center gap-2 text-sm text-slate-400">
                                                        <Check size={14} className="text-orange-500" />
                                                        Valid for 30 days
                                                    </li>
                                                    <li className="flex items-center gap-2 text-sm text-slate-400">
                                                        <Check size={14} className="text-orange-500" />
                                                        Local 4G/5G Network
                                                    </li>
                                                </ul>

                                                <Button
                                                    variant="primary"
                                                    className="w-full justify-center group/btn"
                                                    onClick={onActionClick}
                                                >
                                                    Select Plan <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {activePlans.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <Globe className="text-slate-700 mb-4" size={48} />
                                        <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                                        <p className="text-slate-400 max-w-xs">We are currently expanding our coverage in this region. Please contact support for custom requests.</p>
                                    </div>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Help/Contact Section */}
                <Reveal delay={0.4} className="mt-16">
                    <div className="bg-[#171717] border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">Need a Custom Enterprise Solution?</h3>
                            <p className="text-slate-400">We offer specialized corporate rates and bulk management for businesses traveling globally.</p>
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onActionClick}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all font-bold"
                            >
                                <Phone size={18} /> Contact Sales
                            </button>
                        </div>
                    </div>
                </Reveal>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.4);
        }
      `}} />
        </div>
    );
};

export default Pricing;