import React from 'react';
import { 
  Plus, 
  Upload, 
  Code, 
  Search, 
  Filter, 
  Download,
  Smartphone,
  Signal
} from 'lucide-react';

const ESIMManagement: React.FC = () => {
  return (
    <div className="space-y-8 animate-in-view">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">eSIM Management</h2>
          <p className="text-slate-500 text-sm">Manage inventory, issue profiles, and track usage.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-orange-500/20 transition-all">
          <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <Plus size={80} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Plus size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1">Issue New eSIM</h3>
            <p className="text-orange-100 text-sm">Single profile generation</p>
          </div>
        </div>

        <div className="bg-[#171717] border border-white/5 rounded-xl p-6 group cursor-pointer hover:border-orange-500/30 transition-all">
          <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-orange-500 group-hover:bg-orange-500/10 transition-colors">
            <Upload size={24} />
          </div>
          <h3 className="font-bold text-lg text-white mb-1">Bulk Issue (CSV)</h3>
          <p className="text-slate-500 text-sm">Generate multiple profiles at once</p>
        </div>

        <div className="bg-[#171717] border border-white/5 rounded-xl p-6 group cursor-pointer hover:border-orange-500/30 transition-all">
          <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-orange-500 group-hover:bg-orange-500/10 transition-colors">
            <Code size={24} />
          </div>
          <h3 className="font-bold text-lg text-white mb-1">API Integration</h3>
          <p className="text-slate-500 text-sm">Connect your own platform</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#171717] border border-white/5 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search ICCID or Client..." 
              className="bg-black/30 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 text-slate-300 rounded-lg text-sm hover:bg-white/10 transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 text-slate-300 rounded-lg text-sm hover:bg-white/10 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Empty State / List */}
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map((item, i) => (
            <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${i % 3 === 0 ? 'bg-green-400/10 text-green-400' : 'bg-blue-400/10 text-blue-400'}`}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <div className="text-white font-medium flex items-center gap-2">
                    Global 5GB Plan
                    <span className="text-xs font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">8934...293{i}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">Issued to: <span className="text-slate-300">Travel Corp {i}</span> • {i * 2 + 1} days ago</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                 <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-slate-300">
                     <Signal size={14} className={i % 3 === 0 ? "text-green-400" : "text-yellow-400"} />
                     {i % 3 === 0 ? "Online" : "Idle"}
                   </div>
                   <div className="text-slate-500 text-xs">{(i * 0.5 + 0.2).toFixed(1)}GB / 5.0GB</div>
                 </div>
                 <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(i * 10) + 10}%` }}></div>
                 </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/5 text-center">
            <button className="text-sm text-slate-400 hover:text-white transition-colors">Load More Records</button>
        </div>
      </div>

    </div>
  );
};

export default ESIMManagement;