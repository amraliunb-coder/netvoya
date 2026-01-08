import React from 'react';
import { 
  Search, 
  Filter, 
  Smartphone, 
  Signal,
  MoreVertical
} from 'lucide-react';

const PartnerESIMs: React.FC = () => {
  return (
    <div className="space-y-6 animate-in-view">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">My eSIMs</h2>
          <p className="text-slate-500 text-sm">Track live usage and status of your issued profiles.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search by ICCID, Alias or Country..." 
            className="w-full bg-[#171717] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-[#171717] border border-white/10 text-slate-300 rounded-lg text-sm hover:bg-white/5 transition-colors">
          <Filter size={16} />
          Filter Status
        </button>
      </div>

      {/* eSIM Grid/List */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400 font-mono uppercase text-xs">
            <tr>
              <th className="px-6 py-4">eSIM Profile</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 w-1/3">Live Quota Usage</th>
              <th className="px-6 py-4">Activation Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5, 6].map((item, i) => {
              const usage = Math.random() * 5; // Random usage between 0-5 GB
              const total = 5;
              const percentage = (usage / total) * 100;
              
              return (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg text-orange-500">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-white">Europe Regional</div>
                        <div className="text-xs text-slate-500 font-mono">89000...493{i}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300">{usage.toFixed(2)} GB</span>
                        <span className="text-slate-500">{total}.00 GB</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percentage > 90 ? 'bg-red-500' : 'bg-orange-500'}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    Oct {10 + i}, 2024
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-white p-2">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerESIMs;