import React, { useState, useEffect } from 'react';
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
import ClientPortal from './components/ClientPortal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard' | 'installation' | 'pricing' | 'onboarding' | 'compatible-devices' | 'client-portal'>('landing');
  const [userRole, setUserRole] = useState<'admin' | 'partner'>('admin');
  const [agencyRef, setAgencyRef] = useState<string>('partner');

  useEffect(() => {
    // Detect referral query params: ?ref=AGENCY_NAME or ?agency=AGENCY_NAME or ?view=client
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('agency') || urlParams.get('affiliate');
    const viewParam = urlParams.get('view');

    if (ref || viewParam === 'client') {
      if (ref) setAgencyRef(ref);
      setCurrentView('client-portal');
    }
  }, []);

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

  if (currentView === 'client-portal') {
    return <ClientPortal agencyRef={agencyRef} onBackToMain={goToLanding} />;
  }

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
        onClientPortalClick={() => setCurrentView('client-portal')}
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
            <Hero onActionClick={goToOnboarding} onClientStoreClick={() => setCurrentView('client-portal')} />
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