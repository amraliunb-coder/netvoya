import React from 'react';
import { Package, Check, ArrowRight } from 'lucide-react';
import Button from '../../ui/Button';

const RequestInventory: React.FC = () => {
  const packages = [
    { name: "Starter Pack", tokens: 100, price: "$450", perToken: "$4.50" },
    { name: "Agency Pack", tokens: 1000, price: "$4,000", perToken: "$4.00", popular: true },
    { name: "Enterprise Pack", tokens: 5000, price: "$17,500", perToken: "$3.50" },
  ];

  return (
    <div className="space-y-8 animate-in-view">
      <div>
        <h2 className="text-2xl font-display font-bold text-white">Request Inventory</h2>
        <p className="text-slate-500 text-sm">Purchase additional tokens to issue more eSIMs to your clients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, i) => (
          <div key={i} className={`relative bg-[#171717] rounded-2xl p-8 border transition-all duration-300 flex flex-col ${pkg.popular ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.1)] transform scale-105 z-10' : 'border-white/10 hover:border-white/30'}`}>
            
            {pkg.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full border border-black">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-2">{pkg.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold text-white">{pkg.price}</span>
              </div>
              <div className="text-sm text-slate-500 mt-1">{pkg.perToken} / token</div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-orange-500">
                  <Package size={12} />
                </div>
                {pkg.tokens.toLocaleString()} eSIM Tokens
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-orange-500">
                  <Check size={12} />
                </div>
                Instant Credit
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-orange-500">
                  <Check size={12} />
                </div>
                No Expiry
              </div>
            </div>

            <Button variant={pkg.popular ? 'primary' : 'secondary'} className="w-full justify-center">
              Purchase Now
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h4 className="text-white font-medium mb-1">Need a custom volume?</h4>
           <p className="text-sm text-slate-400">For orders over 10,000 tokens, contact our wholesale team for special rates.</p>
        </div>
        <button className="flex items-center gap-2 text-white font-medium hover:text-orange-500 transition-colors">
          Contact Sales <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
};

export default RequestInventory;