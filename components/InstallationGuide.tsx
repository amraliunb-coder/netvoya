import React, { useState } from 'react';
import Reveal from './ui/Reveal';
import ESimFAQ from './ESimFAQ';
import {
  Smartphone,
  QrCode,
  AlertCircle,
  Check,
  ChevronRight,
  Apple,
  Wifi,
  Signal,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Battery
} from 'lucide-react';

interface InstallationGuideProps {
  onCheckCompatibility?: () => void;
}

const InstallationGuide: React.FC<InstallationGuideProps> = ({ onCheckCompatibility }) => {
  const [deviceType, setDeviceType] = useState<'iphone' | 'android'>('iphone');
  const [installMethod, setInstallMethod] = useState<'qr' | 'manual'>('qr');
  const [activeStep, setActiveStep] = useState(0);

  // Dynamic content based on Device Type
  const getSteps = () => {
    const isIphone = deviceType === 'iphone';

    if (isIphone) {
      return [
        {
          id: 1,
          title: "Install",
          desc: "Scan the QR code provided in your email.",
          screenTitle: "Add Data Plan",
          screenContent: (
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in-view">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-56 h-56 bg-white p-3 rounded-xl shadow-2xl">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NetVoyaESIM" className="w-full h-full" alt="QR Code" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-center text-sm text-slate-400">Scan QR Code to start</p>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-1/2 animate-[marquee_1s_linear_infinite]"></div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 2,
          title: "Add eSIM",
          desc: "Wait for the configuration to complete and click 'Continue'.",
          screenTitle: "Cellular Setup",
          screenContent: (
            <div className="flex flex-col items-center justify-center h-full space-y-8 pt-10 animate-in-view">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 blur-[20px] opacity-20 animate-pulse"></div>
                <div className="w-20 h-20 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-orange-500 mb-2 relative z-10">
                  <Signal size={40} />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h4 className="text-2xl font-bold text-white">Setup Complete</h4>
                <p className="text-slate-400 text-sm">Your eSIM is active</p>
              </div>

              <div className="w-full max-w-[200px] space-y-3">
                <div className="w-full h-2 bg-[#2C2C2E] rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full animate-[width_1s_ease-out]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase">
                  <span>Verifying</span>
                  <span className="text-green-500">Done</span>
                </div>
              </div>

              <div className="mt-auto w-full px-6 pb-8">
                <button className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]">Done</button>
              </div>
            </div>
          )
        },
        {
          id: 3,
          title: "Labels",
          desc: "Label your new NetVoya plan as 'Secondary' or 'Travel'.",
          screenTitle: "Data Plan Labels",
          screenContent: (
            <div className="flex flex-col h-full pt-6 px-4 animate-in-view">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 pl-2">Primary Line</div>
              <div className="bg-[#1C1C1E] rounded-xl mb-6 flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 bg-slate-700 rounded text-[9px] flex items-center justify-center font-bold text-white shadow-sm">P</span>
                  <span className="text-base font-medium text-white">Primary</span>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </div>

              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 pl-2">New NetVoya Plan</div>
              <div className="bg-[#1C1C1E] rounded-xl border border-orange-500 p-4 flex justify-between items-center relative shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 bg-black border border-white/20 rounded text-[9px] flex items-center justify-center font-bold text-white shadow-sm">S</span>
                  <span className="text-base font-medium text-white">Secondary</span>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
                <div className="absolute -right-10 top-1/2 text-3xl animate-bounce-horizontal drop-shadow-lg filter">👈</div>
              </div>

              <div className="mt-auto pb-8">
                <button className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors">Continue</button>
              </div>
            </div>
          )
        },
        {
          id: 4,
          title: "Default Line",
          desc: "Select 'Primary' for your default line to keep your number active.",
          screenTitle: "Default Line",
          screenContent: (
            <div className="flex flex-col h-full pt-6 px-4 animate-in-view">
              <p className="text-xs text-slate-400 mb-8 text-center leading-relaxed">Select the "Primary" option to continue using your number to receive messages and calls.</p>

              <div className="bg-[#1C1C1E] rounded-xl border border-blue-500 p-4 flex justify-between items-center mb-3 relative shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 bg-slate-700 rounded text-[9px] flex items-center justify-center font-bold text-white">P</span>
                  <span className="text-base font-medium text-white">Primary</span>
                </div>
                <Check size={18} className="text-blue-500" />
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-3xl animate-bounce-horizontal-reverse drop-shadow-lg">👉</div>
              </div>

              <div className="bg-[#1C1C1E] rounded-xl p-4 flex justify-between items-center opacity-50">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 bg-black border border-white/20 rounded text-[9px] flex items-center justify-center font-bold text-white">S</span>
                  <span className="text-base font-medium text-white">Secondary</span>
                </div>
              </div>

              <div className="mt-auto pb-8">
                <button className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors">Continue</button>
              </div>
            </div>
          )
        },
        {
          id: 5,
          title: "iMessage",
          desc: "Keep 'Primary' selected for iMessage & FaceTime.",
          screenTitle: "iMessage & FaceTime",
          screenContent: (
            <div className="flex flex-col h-full pt-10 px-4 items-center animate-in-view">
              <div className="w-16 h-16 bg-[#2C2C2E] rounded-2xl flex items-center justify-center text-green-500 mb-6 shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
              </div>

              <div className="w-full bg-[#1C1C1E] rounded-xl border border-blue-500 p-4 flex justify-between items-center mb-3 relative shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 bg-slate-700 rounded text-[9px] flex items-center justify-center font-bold text-white">P</span>
                  <div>
                    <span className="text-base font-medium text-white block">Primary</span>
                    <span className="text-[10px] text-slate-500">+1 (555) 000-0000</span>
                  </div>
                </div>
                <Check size={18} className="text-blue-500" />
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-3xl animate-bounce-horizontal-reverse drop-shadow-lg">👉</div>
              </div>

              <div className="mt-auto pb-8 w-full">
                <button className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors">Continue</button>
              </div>
            </div>
          )
        },
        {
          id: 6,
          title: "Mobile Data",
          desc: "Select 'Secondary' for Mobile Data. Important: Turn OFF switching.",
          screenTitle: "Mobile Data",
          screenContent: (
            <div className="flex flex-col h-full pt-6 px-4 animate-in-view">
              <div className="bg-[#1C1C1E] rounded-xl p-4 flex justify-between items-center mb-3 opacity-50">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 bg-slate-700 rounded text-[9px] flex items-center justify-center font-bold text-white">P</span>
                  <span className="text-base font-medium text-white">Primary</span>
                </div>
              </div>

              <div className="bg-[#1C1C1E] rounded-xl border border-orange-500 p-4 flex justify-between items-center mb-8 relative shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 bg-black border border-white/20 rounded text-[9px] flex items-center justify-center font-bold text-white">S</span>
                  <span className="text-base font-medium text-white">Secondary</span>
                </div>
                <Check size={18} className="text-orange-500" />
                <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-3xl animate-bounce-horizontal drop-shadow-lg">👈</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1C1C1E] rounded-xl">
                <span className="text-sm font-medium text-white">Allow Mobile Data Switching</span>
                <div className="w-12 h-7 bg-[#39393D] rounded-full relative transition-colors">
                  <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 left-0.5 shadow-md"></div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 px-2 text-center">
                <span className="text-orange-500 font-bold">IMPORTANT:</span> Turn this OFF to avoid roaming charges.
              </p>

              <div className="mt-auto pb-8">
                <button className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors">Done</button>
              </div>
            </div>
          )
        }
      ];
    } else {
      // ANDROID STEPS
      return [
        {
          id: 1,
          title: "Scan QR",
          desc: "Go to Settings > Network > SIMs > Add SIM > Download a SIM",
          screenTitle: "Scan QR Code",
          screenContent: (
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in-view">
              <div className="relative group p-4 border-2 border-orange-500/50 rounded-xl">
                {/* Android Style Viewfinder corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500"></div>

                <div className="relative w-56 h-56 bg-white p-2">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NetVoyaESIM" className="w-full h-full" alt="QR Code" />
                </div>
              </div>
              <p className="text-center text-sm text-slate-400 max-w-[200px]">Position the QR code within the frame to download your SIM</p>
            </div>
          )
        },
        {
          id: 2,
          title: "Download",
          desc: "Confirm download of your NetVoya eSIM profile.",
          screenTitle: "Download eSIM?",
          screenContent: (
            <div className="flex flex-col h-full pt-10 px-6 animate-in-view">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">N</div>
                <div>
                  <h4 className="font-medium text-white text-lg">NetVoya Global</h4>
                  <p className="text-sm text-slate-400">10GB Data Plan</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                This will download the eSIM profile to your device. You can manage this SIM in Settings anytime.
              </p>

              <div className="mt-auto pb-8 space-y-3">
                <button className="w-full py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-500 transition-colors shadow-lg">Download</button>
                <button className="w-full py-3 text-slate-400 font-medium hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          )
        },
        {
          id: 3,
          title: "Enable SIM",
          desc: "Go to Settings > Network > SIMs and toggle NetVoya ON.",
          screenTitle: "NetVoya eSIM",
          screenContent: (
            <div className="flex flex-col h-full pt-6 px-4 animate-in-view">
              <div className="bg-[#202124] rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-lg">Use SIM</span>
                  {/* Android Toggle ON */}
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0 shadow-md"></div>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Enable this SIM for mobile data</p>

                {/* Hand Pointer */}
                <div className="absolute right-8 top-28 text-3xl animate-bounce-horizontal drop-shadow-lg">👈</div>
              </div>

              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-base">Mobile data</span>
                  <span className="text-blue-400 text-sm">NetVoya</span>
                </div>
                <div className="flex flex-col gap-1 opacity-50">
                  <span className="text-white text-base">Calls preference</span>
                  <span className="text-slate-400 text-sm">Primary</span>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 4,
          title: "Mobile Data",
          desc: "Select NetVoya for Mobile Data in Network settings.",
          screenTitle: "Network Preference",
          screenContent: (
            <div className="flex flex-col h-full pt-6 px-4 animate-in-view">
              <h4 className="text-sm text-blue-400 uppercase font-medium mb-4">Preferred SIM for</h4>

              <div className="space-y-1 mb-6">
                <div className="p-4 rounded bg-[#202124] flex items-center justify-between border border-blue-500/50">
                  <div className="flex flex-col">
                    <span className="text-white">Mobile data</span>
                    <span className="text-blue-400 text-sm">NetVoya</span>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                <div className="p-4 rounded bg-[#202124] flex items-center justify-between opacity-60">
                  <div className="flex flex-col">
                    <span className="text-white">Calls & SMS</span>
                    <span className="text-slate-400 text-sm">Primary</span>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-500"></div>
                </div>
              </div>

              {/* Hand Pointer */}
              <div className="absolute right-8 top-32 text-3xl animate-bounce-horizontal drop-shadow-lg">👈</div>

              <div className="mt-auto pb-8">
                <button className="w-full py-3 bg-blue-600 text-white rounded-full font-medium">Done</button>
              </div>
            </div>
          )
        },
        {
          id: 5,
          title: "Roaming",
          desc: "Ensure Roaming is ON for NetVoya to connect abroad.",
          screenTitle: "NetVoya Settings",
          screenContent: (
            <div className="flex flex-col h-full pt-6 px-4 animate-in-view">
              <div className="bg-[#202124] rounded-lg p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white block text-lg">Roaming</span>
                    <span className="text-xs text-slate-400">Connect to data services when roaming</span>
                  </div>
                  {/* Android Toggle ON */}
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0 shadow-md"></div>
                  </div>
                </div>

                {/* Hand Pointer */}
                <div className="absolute right-8 top-32 text-3xl animate-bounce-horizontal drop-shadow-lg">👈</div>
              </div>

              <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-orange-400 text-sm flex gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  For NetVoya travel plans, roaming must be enabled to connect to local networks.
                </p>
              </div>

              <div className="mt-auto pb-8">
                <button className="w-full py-3 bg-blue-600 text-white rounded-full font-medium">Finish</button>
              </div>
            </div>
          )
        }
      ];
    }
  };

  const steps = getSteps();

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 font-sans text-white relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-orange-500/30 bg-orange-500/5 rounded-full backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400 font-bold">Setup Wizard</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">eSIM Installation Guide</h1>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">Select your device and preferred installation method below to get connected in minutes.</p>

          {/* Device Toggle */}
          <div className="inline-flex bg-white/5 p-1.5 rounded-full border border-white/10 shadow-lg backdrop-blur-md mb-8 relative">
            <button
              onClick={() => setDeviceType('iphone')}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${deviceType === 'iphone' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Apple size={18} className={deviceType === 'iphone' ? 'fill-current' : ''} /> iPhone
            </button>
            <button
              onClick={() => setDeviceType('android')}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${deviceType === 'android' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Smartphone size={18} /> Android
            </button>

            {/* Sliding Background */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/10 rounded-full border border-white/10 shadow-inner transition-transform duration-300 ease-out ${deviceType === 'android' ? 'translate-x-full' : 'translate-x-0'}`}
            ></div>
          </div>
        </Reveal>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Method Selection & Warning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <Reveal delay={0.1}>
              <div className="bg-[#171717]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 transition-all shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Installation Method
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setInstallMethod('qr')}
                    className={`flex-1 p-5 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 group ${installMethod === 'qr' ? 'bg-orange-500/10 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    <div className={`p-3 rounded-full ${installMethod === 'qr' ? 'bg-orange-500 text-white' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      <QrCode size={24} />
                    </div>
                    <span className="font-semibold">QR Code</span>
                  </button>
                  <button
                    onClick={() => setInstallMethod('manual')}
                    className={`flex-1 p-5 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 group ${installMethod === 'manual' ? 'bg-orange-500/10 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    <div className={`p-3 rounded-full ${installMethod === 'manual' ? 'bg-orange-500 text-white' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      <Smartphone size={24} />
                    </div>
                    <span className="font-semibold">Manual Input</span>
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { num: "01", title: "Open Email", sub: "Find the QR code sent to you" },
                    { num: "02", title: "Scan Code", sub: "Use camera to scan & add" },
                    { num: "03", title: "Configure", sub: "Follow the steps below" }
                  ].map((step, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="w-8 h-8 bg-white/10 text-orange-400 rounded-lg flex items-center justify-center font-mono font-bold mb-3 border border-white/5">{step.num}</div>
                      <h4 className="text-white font-bold mb-1">{step.title}</h4>
                      <p className="text-xs text-slate-500">{step.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-1">
            <Reveal delay={0.2}>
              <div className="bg-gradient-to-b from-[#171717] to-black border border-white/10 rounded-2xl p-8 h-full flex flex-col justify-center relative overflow-hidden group">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500"></div>

                <div className="flex items-center gap-3 mb-6 text-orange-500 relative z-10">
                  <AlertCircle size={24} />
                  <span className="font-mono font-bold uppercase tracking-wider text-xs border border-orange-500/30 px-2 py-1 rounded bg-orange-500/10">Important</span>
                </div>
                <ul className="space-y-6 text-sm text-slate-300 font-medium relative z-10">
                  <li className="flex gap-4 items-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0 shadow-[0_0_5px_rgba(249,115,22,1)]"></span>
                    <span>Ensure you have a stable WiFi connection during installation.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0 shadow-[0_0_5px_rgba(249,115,22,1)]"></span>
                    <span>Do NOT remove the eSIM once installed or it cannot be used again.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0 shadow-[0_0_5px_rgba(249,115,22,1)]"></span>
                    <span>The QR code can only be scanned once.</span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Interactive Step Guide */}
        <Reveal delay={0.3}>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

            {/* Left: Stepper */}
            <div className="flex-1 w-full lg:w-auto space-y-3">
              <h2 className="font-display font-bold text-3xl text-white mb-8">Activation Steps</h2>

              {steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`group cursor-pointer p-6 rounded-xl border transition-all duration-500 flex items-start gap-6 relative overflow-hidden ${activeStep === index ? 'bg-white/5 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  {/* Active Indicator Bar */}
                  {activeStep === index && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                  )}

                  <div className={`text-sm font-mono font-bold pt-1 transition-colors ${activeStep === index ? 'text-orange-500' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    0{step.id}
                  </div>
                  <div className="relative z-10">
                    <h3 className={`font-bold text-lg mb-1 transition-colors ${activeStep === index ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm max-w-xs transition-colors duration-300 ${activeStep === index ? 'text-slate-300' : 'text-slate-600'}`}>
                      {step.desc}
                    </p>
                  </div>

                  {activeStep === index && (
                    <ArrowRight className="ml-auto text-orange-500 animate-pulse" size={20} />
                  )}
                </div>
              ))}
            </div>

            {/* Right: Phone Mockup - Sticky */}
            <div className="hidden lg:block w-[350px] flex-shrink-0 sticky top-32">
              {/* Phone Frame */}
              <div className={`relative w-full h-[700px] bg-[#0c0c0c] border-8 border-[#1a1a1a] shadow-2xl overflow-hidden ring-1 ring-white/10 shadow-orange-500/5 transition-all duration-500 ${deviceType === 'iphone' ? 'rounded-[3rem]' : 'rounded-[2rem]'}`}>

                {/* iPhone Notch */}
                {deviceType === 'iphone' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#1a1a1a] rounded-b-2xl z-20 transition-all duration-500"></div>
                )}

                {/* Android Punch-hole Camera */}
                {deviceType === 'android' && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1a1a1a] rounded-full z-20 transition-all duration-500"></div>
                )}

                {/* Status Bar */}
                <div className={`absolute top-2 w-full px-8 flex justify-between text-white text-[10px] z-10 font-bold opacity-80 ${deviceType === 'android' ? 'pt-2' : ''}`}>
                  {deviceType === 'iphone' ? (
                    <>
                      <span>9:41</span>
                      <div className="flex gap-1.5 items-center">
                        <Signal size={12} fill="currentColor" />
                        <Wifi size={12} />
                        <div className="w-4 h-2.5 bg-white rounded-[2px] relative border border-white">
                          <div className="absolute top-0.5 right-0.5 w-0.5 h-1.5 bg-black"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>9:41</span>
                      <div className="flex gap-2 items-center">
                        <Wifi size={14} />
                        <Signal size={14} fill="currentColor" />
                        <Battery size={14} fill="currentColor" className="rotate-90" />
                      </div>
                    </>
                  )}
                </div>

                {/* Screen Content */}
                <div className={`w-full h-full bg-[#000000] pt-12 text-white font-sans relative ${deviceType === 'android' ? 'font-sans' : ''}`}>

                  {/* Navigation Bar */}
                  <div className={`flex items-center px-4 mb-4 relative z-10 ${deviceType === 'iphone' ? 'text-blue-500' : 'text-white'}`}>
                    {deviceType === 'iphone' ? (
                      <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                        <ChevronRight className="rotate-180" size={24} />
                        <span className="text-[17px] font-semibold">Back</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity pl-2">
                        <ArrowLeft size={24} />
                        {/* Android Title often in navbar or just below */}
                      </div>
                    )}
                  </div>

                  {/* Header */}
                  <div className="px-6 mb-8 relative z-10">
                    <h2 className={`${deviceType === 'iphone' ? 'text-3xl font-bold tracking-tight' : 'text-2xl font-normal tracking-normal'}`}>
                      {steps[activeStep].screenTitle}
                    </h2>
                  </div>

                  {/* Dynamic Screen Body with Animation Key */}
                  <div key={`${deviceType}-${activeStep}`} className="absolute inset-0 top-32 bg-[#000000] animate-[slideUpFade_0.5s_ease-out_forwards]">
                    {steps[activeStep].screenContent}
                  </div>

                  {/* Android Navigation Bar (Bottom) */}
                  {deviceType === 'android' && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
                  )}
                  {/* iPhone Home Indicator */}
                  {deviceType === 'iphone' && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </Reveal>

        {/* FAQ Section */}
        <ESimFAQ onCheckCompatibility={onCheckCompatibility} />

      </div>

      {/* Mobile-only Sticky Footer */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 px-6 pointer-events-none z-50">
        <div className="bg-[#171717]/90 backdrop-blur-md text-white p-4 rounded-full flex items-center justify-between pointer-events-auto border border-white/10 shadow-2xl">
          <span className="text-sm font-bold ml-2 text-slate-300">Step {activeStep + 1} of 6</span>
          <button
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          >
            Next
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
        }
        @keyframes bounce-horizontal-reverse {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(25%); }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1.5s infinite;
        }
        .animate-bounce-horizontal-reverse {
          animation: bounce-horizontal-reverse 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default InstallationGuide;