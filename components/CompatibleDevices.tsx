import React from 'react';
import Reveal from './ui/Reveal';
import {
    Smartphone,
    Apple,
    MonitorSmartphone,
    Search,
    AlertCircle,
    ChevronLeft,
    Check,
    Globe,
    Info
} from 'lucide-react';

interface CompatibleDevicesProps {
    onBack: () => void;
}

interface BrandSection {
    name: string;
    icon: React.ReactNode;
    models: string[];
    note?: string;
    color: string;
}

const CompatibleDevices: React.FC<CompatibleDevicesProps> = ({ onBack }) => {
    const brands: BrandSection[] = [
        {
            name: "Apple",
            icon: <Apple className="w-8 h-8" />,
            color: "from-gray-700 to-gray-900",
            models: [
                "iPhone XR / XS / XS Max",
                "iPhone 11 / 12 / 13 / 14 / 15 / 16 series",
                "iPhone SE (2nd & 3rd gen)"
            ],
            note: "Some China, Hong Kong & Macao models may not support eSIM."
        },
        {
            name: "Google Pixel",
            icon: <Smartphone className="w-8 h-8" />,
            color: "from-blue-600 to-blue-800",
            models: [
                "Pixel 4 series and newer (including 4a/4a 5G, 5, 6, 7, 8, 9)",
                "Pixel Fold",
                "Pixel 10 series (eSIM-only in some markets)"
            ]
        },
        {
            name: "Samsung",
            icon: <Smartphone className="w-8 h-8" />, // Generic for now, could find specific logo if SVG available
            color: "from-blue-700 to-indigo-900",
            models: [
                "Galaxy S series (S20, S21, S22, S23, S24, S25)",
                "Galaxy Z series (Z Flip & Z Fold models)",
                "Select Galaxy A series like A35/A54/A55 (region-dependent)"
            ],
            note: "eSIM availability may vary by region or carrier."
        },
        {
            name: "Motorola",
            icon: <Smartphone className="w-8 h-8" />,
            color: "from-sky-600 to-cyan-800",
            models: [
                "Motorola Razr series (2019 and later)",
                "Motorola Edge series (Edge, Edge 40, Edge 50)",
                "Moto G series (e.g., G54, G85)"
            ]
        },
        {
            name: "HONOR",
            icon: <Smartphone className="w-8 h-8" />,
            color: "from-purple-600 to-fuchsia-800",
            models: [
                "HONOR 90 / 200 / 400 series",
                "Magic series: Magic4 Pro, Magic5 Pro, Magic6 Pro / Ultimate / RSR"
            ],
            note: "Some variations are regional and carrier-dependent."
        },
        {
            name: "Huawei",
            icon: <Smartphone className="w-8 h-8" />,
            color: "from-red-600 to-rose-800",
            models: [
                "Huawei P40 / P40 Pro / P40 4G",
                "Huawei Mate 40 / Mate 40 Pro",
                "Huawei Pura 70 Pro"
            ],
            note: "Model support varies by market."
        },
        {
            name: "OPPO",
            icon: <Smartphone className="w-8 h-8" />,
            color: "from-green-600 to-emerald-800",
            models: [
                "OPPO Reno and Find series (e.g., Reno5 A, Find X series)",
                "Some foldables (Find N2/N3 Flip)"
            ],
            note: "Availability varies by region/carrier."
        },
        {
            name: "Sony Xperia",
            icon: <Smartphone className="w-8 h-8" />,
            color: "from-indigo-600 to-violet-800",
            models: [
                "Xperia 1 IV/V, Xperia 5 IV/V",
                "Xperia 10 III Lite / 10 IV / 10 V"
            ],
            note: "Regional differences apply."
        },
        {
            name: "Xiaomi / Redmi",
            icon: <Smartphone className="w-8 h-8" />,
            color: "from-orange-600 to-red-600",
            models: [
                "Xiaomi 14 / 14 Pro / 14T / 14T Pro",
                "Xiaomi 13 / 13T / 13T Pro / 13 Lite",
                "Xiaomi 12T Pro"
            ],
            note: "Check regional specs — eSIM may not be enabled everywhere."
        },
        {
            name: "OnePlus",
            icon: <Smartphone className="w-8 h-8" />,
            color: "from-red-500 to-red-700",
            models: [
                "OnePlus 11 / 12 series",
                "OnePlus Open foldable"
            ],
            note: "Verify compatibility in your country."
        }
    ];

    const otherBrands = [
        { name: "Fairphone", models: "Fairphone 4, 5" },
        { name: "Rakuten", models: "Rakuten Mini, Big, Hand series" },
        { name: "TCL", models: "Select NxtPaper & 5G models" },
        { name: "Nokia", models: "XR21, X30, G60 5G (regional)" },
        { name: "Vivo", models: "V40 / V40 Lite / X90 Pro (region-dependent)" },
        { name: "Others", models: "Nuu Mobile, Sharp, OUKITEL, Gemini PDA, etc." }
    ];

    return (
        <div className="min-h-screen bg-[#020617] pt-24 pb-16 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-dotted-pattern o-05 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <Reveal>
                    <div className="mb-12">
                        <button
                            onClick={onBack}
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
                        >
                            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-colors">
                                <ChevronLeft size={20} />
                            </div>
                            <span className="font-medium">Back to Installation Guide</span>
                        </button>

                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                            Supported <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Devices</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl">
                            Check if your smartphone supports eSIM technology. Most modern flagship devices from major manufacturers are compatible.
                        </p>
                    </div>
                </Reveal>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {brands.map((brand, idx) => (
                        <Reveal key={brand.name} delay={idx * 0.05}>
                            <div className="group h-full bg-[#0F172A]/50 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                                <div className={`h-2 w-full bg-gradient-to-r ${brand.color}`}></div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white/5 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                                            {brand.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{brand.name}</h3>
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {brand.models.map((model, mIdx) => (
                                            <li key={mIdx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                                                <Check size={16} className="mt-0.5 text-blue-500 flex-shrink-0" />
                                                <span>{model}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {brand.note && (
                                        <div className="mt-auto pt-4 border-t border-white/5">
                                            <p className="text-xs text-slate-500 italic flex gap-2">
                                                <Info size={14} className="flex-shrink-0 mt-0.5" />
                                                {brand.note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Other Brands Section */}
                <Reveal delay={0.4}>
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4 inline-block">Other Manufacturers</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {otherBrands.map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                                    <span className="font-bold text-white text-lg">{item.name}</span>
                                    <span className="text-slate-400 text-sm">{item.models}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Important Notes */}
                <Reveal delay={0.5}>
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <AlertCircle className="text-blue-400" size={28} />
                            <h3 className="text-2xl font-bold text-white">Important Notes</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3">
                                <h4 className="text-white font-bold flex items-center gap-2">
                                    <Globe size={18} className="text-slate-400" /> Carrier & Region Restrictions
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Even if your phone model is listed above, eSIM capabilities might be restricted by certain carriers or in specific regions (e.g., devices bought in China often lack eSIM). Always verify your specific device settings before purchasing.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-white font-bold flex items-center gap-2">
                                    <MonitorSmartphone size={18} className="text-slate-400" /> Multiple eSIM Profiles
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Most modern devices allow you to store multiple eSIM profiles simultaneously (e.g., one for home, one for travel), though usually only one or two can be active at the same time depending on the device.
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>

            </div>
        </div>
    );
};

export default CompatibleDevices;
