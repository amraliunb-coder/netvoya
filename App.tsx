import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ValueProps from './components/ValueProps';
import TargetAudience from './components/TargetAudience';
import ServicesCoverage from './components/ServicesCoverage';
import PartnerPortal from './components/PartnerPortal';
import Testimonials from './components/Testimonials';
import TrustSignals from './components/TrustSignals';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InstallationGuide from './components/InstallationGuide';
import Pricing from './components/Pricing';
import PartnerOnboarding from './components/PartnerOnboarding';
import CompatibleDevices from './components/CompatibleDevices';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard' | 'installation' | 'pricing' | 'onboarding' | 'compatible-devices'>('landing');
  const [userRole, setUserRole] = useState<'admin' | 'partner'>('admin');

  const handleLogin = (role: 'admin' | 'partner') => {
    setUserRole(role);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setUserRole('admin'); // Reset to default
  };

  const goToLogin = () => {
    setCurrentView('login');
  };

  const goToLanding = () => {
    setCurrentView('landing');
  };

  const goToInstallation = () => {
    setCurrentView('installation');
    window.scrollTo(0, 0);
  };

  const goToPricing = () => {
    setCurrentView('pricing');
    window.scrollTo(0, 0);
  };

  const goToOnboarding = () => {
    setCurrentView('onboarding');
    window.scrollTo(0, 0);
  };

  const goToCompatibleDevices = () => {
    setCurrentView('compatible-devices');
    window.scrollTo(0, 0);
  };

  const handleNavigation = (page: string) => {
    if (page === 'landing') {
      goToLanding();
    }
  };

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onBack={goToLanding} />;
  }

  if (currentView === 'onboarding') {
    return <PartnerOnboarding onBack={goToLanding} onComplete={() => handleLogin('partner')} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onLogout={handleLogout} role={userRole} />;
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 selection:text-white">
      <Navbar
        onLoginClick={goToLogin}
        onInstallationClick={goToInstallation}
        onPricingClick={goToPricing}
        onPartnerClick={goToOnboarding}
        onNavigate={handleNavigation}
      />
      <main>
        {currentView === 'installation' ? (
          <InstallationGuide onCheckCompatibility={goToCompatibleDevices} />
        ) : currentView === 'compatible-devices' ? (
          <CompatibleDevices onBack={goToInstallation} />
        ) : currentView === 'pricing' ? (
          <Pricing onActionClick={goToOnboarding} />
        ) : (
          <>
            <Hero onActionClick={goToOnboarding} />
            <ValueProps />
            <TargetAudience />
            <ServicesCoverage />
            <PartnerPortal />
            <Testimonials />
            <TrustSignals />
            <CTASection onActionClick={goToOnboarding} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;