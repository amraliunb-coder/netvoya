import React, { useState } from 'react';
import Reveal from './ui/Reveal';
import { Smartphone, Apple, ExternalLink, ChevronRight, Check } from 'lucide-react';

interface ESimFAQProps {
    onCheckCompatibility?: () => void;
}

const ESimFAQ: React.FC<ESimFAQProps> = ({ onCheckCompatibility }) => {
    const [settingsDevice, setSettingsDevice] = useState<'iphone' | 'android'>('iphone');

    return (
        <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
            {/* Background elements to match InstallationGuide */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal>
                    <div className="text-center mb-16">
                        <span className="text-orange-500 font-mono text-sm tracking-wider uppercase mb-2 block">Compatibility Check</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Is My Phone eSIM Compatible?</h2>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                            Discover how eSIM is transforming the way travelers stay connected.
                            Follow these simple steps to check if your device supports eSIM technology.
                        </p>
                    </div>
                </Reveal>

                <div className="space-y-12">
                    {/* Method 1: *#06# Code */}
                    <Reveal delay={0.1}>
                        <div className="bg-[#171717]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all shadow-xl">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-sm">1</span>
                                        <h3 className="text-xl font-bold text-white">Check via *#06# Code</h3>
                                    </div>
                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        Dialing the <span className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">*#06#</span> code is a simple, universal method.
                                        When you dial this code, it will show your device’s EID number.
                                        If the <strong>EID</strong> is displayed, your phone is likely eSIM compatible.
                                    </p>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                                            <Check size={16} className="text-green-500" /> Open your Phone app
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                                            <Check size={16} className="text-green-500" /> Dial *#06#
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                                            <Check size={16} className="text-green-500" /> Look for "EID" in the list
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-black/50 rounded-xl p-4 border border-white/5 flex justify-center">
                                    <img
                                        src="/images/check-esim-dial.png"
                                        alt="Dial *#06# to check EID"
                                        className="max-w-full h-auto rounded-lg shadow-lg"
                                        style={{ maxHeight: '400px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Method 2: Settings Check */}
                    <Reveal delay={0.2}>
                        <div className="bg-[#171717]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all shadow-xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-sm">2</span>
                                    <h3 className="text-xl font-bold text-white">Check in Settings</h3>
                                </div>

                                {/* Toggle */}
                                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                                    <button
                                        onClick={() => setSettingsDevice('iphone')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${settingsDevice === 'iphone' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <Apple size={16} /> iPhone
                                    </button>
                                    <button
                                        onClick={() => setSettingsDevice('android')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${settingsDevice === 'android' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <Smartphone size={16} /> Android
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="order-2 md:order-1 bg-black/50 rounded-xl p-4 border border-white/5 flex justify-center">
                                    {settingsDevice === 'iphone' ? (
                                        <img
                                            src="/images/iphone-esim-settings.png"
                                            alt="iPhone Settings Add eSIM"
                                            className="max-w-full h-auto rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    ) : (
                                        <img
                                            src="/images/android-esim-settings.png"
                                            alt="Android Settings Add eSIM"
                                            className="max-w-full h-auto rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    )}
                                </div>
                                <div className="order-1 md:order-2">
                                    {settingsDevice === 'iphone' ? (
                                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                            <h4 className="text-lg font-bold text-white mb-4">iPhone / iPad</h4>
                                            <p className="text-slate-400 mb-6">
                                                Go to <strong>Settings</strong> → Tap on <strong>Cellular</strong> or <strong>Mobile Data</strong>.
                                                <br /><br />
                                                If you see the <span className="text-blue-400 font-medium">"Add eSIM"</span> option, your device is compatible.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                            <h4 className="text-lg font-bold text-white mb-4">Android (Samsung, Pixel, etc)</h4>
                                            <p className="text-slate-400 mb-6">
                                                Go to <strong>Settings</strong> → Choose <strong>Connections</strong> → Select <strong>SIM Manager</strong>.
                                                <br /><br />
                                                If the <span className="text-blue-400 font-medium">"Add eSIM"</span> option is available, your phone is compatible.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Method 3: Official List */}
                    <Reveal delay={0.3}>
                        <div className="bg-gradient-to-r from-orange-500/10 to-blue-600/10 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all text-center">
                            <h3 className="text-xl font-bold text-white mb-4">Still not sure?</h3>
                            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                                You can consult the updated list of eSIM compatible phones on Holafly's website or check your device manufacturer's specifications.
                            </p>
                            <button
                                onClick={onCheckCompatibility}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors"
                            >
                                Check Compatibility List <ChevronRight size={16} />
                            </button>
                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
};

export default ESimFAQ;
