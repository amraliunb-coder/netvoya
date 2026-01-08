import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onLoginClick?: () => void;
  onInstallationClick?: () => void;
  onPricingClick?: () => void;
  onPartnerClick?: () => void;
  onNavigate?: (page: string) => void;
  darkMode?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onLoginClick, 
  onInstallationClick, 
  onPricingClick,
  onPartnerClick,
  onNavigate
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Coverage', href: '#coverage' },
    { name: 'Pricing', action: 'pricing' },
    { name: 'eSIM Installation', action: 'installation' },
    { name: 'Partners', href: '#partners' },
    { name: 'Support', href: '#support' },
  ];

  const handleLinkClick = (link: any) => {
    if (link.action === 'installation' && onInstallationClick) {
      onInstallationClick();
    } else if (link.action === 'pricing' && onPricingClick) {
      onPricingClick();
    } else if (onNavigate && link.href) {
      onNavigate('landing');
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-background/80 backdrop-blur-md border-white/10' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => onNavigate && onNavigate('landing')}
          >
            <img 
              src="https://res.cloudinary.com/drzid08rg/image/upload/d91fcd24-8cf6-4adf-b9df-7312622185a8_ihpxqo.png" 
              alt="NetVoya" 
              className="h-28 w-auto object-contain"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => handleLinkClick(link)}
                className="text-sm font-medium text-slate-400 hover:text-primary transition-colors focus:outline-none"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA & Login */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <User size={16} />
              Log In
            </button>
            <Button 
              variant="primary" 
              className="!py-2 !px-4 text-xs"
              onClick={onPartnerClick}
            >
              Become a Partner
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 absolute w-full top-32">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link)}
                className="block w-full text-left px-3 py-4 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLoginClick) onLoginClick();
                }}
                className="w-full py-3 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                Log In
              </button>
              <Button 
                variant="primary" 
                className="w-full justify-center"
                onClick={() => {
                   setMobileMenuOpen(false);
                   if(onPartnerClick) onPartnerClick();
                }}
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;