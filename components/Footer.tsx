import React from 'react';
import { Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img 
                src="https://res.cloudinary.com/drzid08rg/image/upload/d91fcd24-8cf6-4adf-b9df-7312622185a8_ihpxqo.png" 
                alt="NetVoya" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-slate-500 text-sm">Powering Global Connectivity for the modern travel industry.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-display font-bold text-white mb-6">Solutions</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Partner Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Integration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coverage Map</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wholesale Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-white mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Technical Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">About NetVoya</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-mono">
          <div>&copy; 2024 NetVoya. All rights reserved.</div>
          <div className="hidden md:block">The evolution of Alex Esim - Built for scale.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;