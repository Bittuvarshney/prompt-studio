import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PromptGeneratorView } from './components/PromptGeneratorView';
import { PromptTesterSandbox } from './components/PromptTesterSandbox';
import { DashboardView } from './components/DashboardView';
import { MembershipView } from './components/MembershipView';
import { ProfileView } from './components/ProfileView';
import { PaymentBillsView } from './components/PaymentBillsView';
import { HelpDeskAgent } from './components/HelpDeskAgent';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { AuthModal } from './components/AuthModal';
import { AuthGatewayView } from './components/AuthGatewayView';
import { GroqApiKeyModal } from './components/GroqApiKeyModal';
import { getStoredGroqKey } from './lib/groqStorage';

import {
  ActiveTab,
  GeneratedPromptPackage,
  MembershipPlanConfig,
  PaymentInvoice,
  User,
  UserPlan,
} from './types';
import {
  addStoredInvoice,
  clearStoredUser,
  deleteStoredPackage,
  getStoredInvoices,
  getStoredPlans,
  getStoredPackages,
  saveStoredPlans,
  saveStoredPackage,
  saveStoredUser,
} from './data/storage';

const defaultGuestUser: User = {
  id: 'guest',
  name: 'Guest Creator',
  email: 'guest@studio.design',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  plan: 'free',
  isAdmin: false,
  tokensLeft: 20,
  tokensMax: 20,
  createdAt: 'Today',
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<MembershipPlanConfig[]>(() => getStoredPlans());
  const [packages, setPackages] = useState<GeneratedPromptPackage[]>(() => getStoredPackages());
  const [invoices, setInvoices] = useState<PaymentInvoice[]>(() => getStoredInvoices());

  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [activeSandboxPackage, setActiveSandboxPackage] = useState<GeneratedPromptPackage>(
    () => packages[0]
  );

  const [checkoutPlan, setCheckoutPlan] = useState<{
    plan: MembershipPlanConfig;
    isAnnual: boolean;
  } | null>(null);

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showGroqModal, setShowGroqModal] = useState<boolean>(false);
  const [groqKey, setGroqKey] = useState<string>(() => getStoredGroqKey());

  // Sync state changes with localStorage
  useEffect(() => {
    if (user) {
      saveStoredUser(user);
    }
  }, [user]);

  useEffect(() => {
    saveStoredPlans(plans);
  }, [plans]);

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
  };

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setShowAuthModal(false);
    setActiveTab('generator');
  };

  const handleSavePackage = (newPkg: GeneratedPromptPackage) => {
    const updated = saveStoredPackage(newPkg);
    setPackages(updated);
    setActiveSandboxPackage(newPkg);
  };

  const handleDeletePackage = (id: string) => {
    const updated = deleteStoredPackage(id);
    setPackages(updated);
    if (activeSandboxPackage.id === id && updated.length > 0) {
      setActiveSandboxPackage(updated[0]);
    }
  };

  const handleDeductToken = () => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      tokensLeft: Math.max(0, user.tokensLeft - 1),
    };
    setUser(updatedUser);
  };

  const handlePaymentSuccess = (newTier: UserPlan, newInvoice: PaymentInvoice) => {
    if (!user) return;

    // Upgrade user tier and reset tokens to plan limit
    const targetPlan = plans.find((p) => p.id === newTier);
    const newTokenMax = targetPlan ? targetPlan.tokenLimit : 500;

    const updatedUser: User = {
      ...user,
      plan: newTier,
      tokensLeft: newTokenMax,
      tokensMax: newTokenMax,
    };

    setUser(updatedUser);

    const updatedInvoices = addStoredInvoice(newInvoice);
    setInvoices(updatedInvoices);

    setCheckoutPlan(null);
    setActiveTab('bills');
  };

  if (!user) {
    return (
      <AuthGatewayView onLoginSuccess={handleAuthSuccess} />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Primary Navigation Bar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenGroqModal={() => setShowGroqModal(true)}
        hasGroqKey={!!groqKey}
      />

      {/* Main View Container */}
      <main className="pb-16">
        {activeTab === 'generator' && (
          <PromptGeneratorView
            user={user}
            onSavePackage={handleSavePackage}
            onSendToSandbox={(pkg) => {
              setActiveSandboxPackage(pkg);
              setActiveTab('tester');
            }}
            onDeductToken={handleDeductToken}
            onOpenAuth={() => setShowAuthModal(true)}
            latestPackage={packages[0] || null}
          />
        )}

        {activeTab === 'tester' && (
          <PromptTesterSandbox
            activePackage={activeSandboxPackage}
            allPackages={packages}
            onSelectPackage={setActiveSandboxPackage}
            onUpdatePackage={handleSavePackage}
            user={user}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={user || defaultGuestUser}
            packages={packages}
            onSelectPackageForSandbox={(pkg) => {
              setActiveSandboxPackage(pkg);
              setActiveTab('tester');
            }}
            onDeletePackage={handleDeletePackage}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'membership' && (
          <MembershipView
            plans={plans}
            user={user}
            onSelectPlanForCheckout={(plan, isAnnual) =>
              setCheckoutPlan({ plan, isAnnual })
            }
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {activeTab === 'bills' && (
          <PaymentBillsView
            invoices={invoices}
            user={user}
            onNavigateMembership={() => setActiveTab('membership')}
          />
        )}

        {activeTab === 'profile' && user && (
          <ProfileView
            user={user}
            onUpdateUser={setUser}
            onNavigateMembership={() => setActiveTab('membership')}
          />
        )}

        {activeTab === 'helpdesk' && <HelpDeskAgent user={user} />}
      </main>

      {/* Payment Gateway Modal */}
      {checkoutPlan && user && (
        <PaymentGatewayModal
          plan={checkoutPlan.plan}
          isAnnual={checkoutPlan.isAnnual}
          user={user}
          onSuccess={handlePaymentSuccess}
          onClose={() => setCheckoutPlan(null)}
        />
      )}

      {/* Login & Signup Modal */}
      {showAuthModal && (
        <AuthModal
          onLoginSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Groq API Key Configuration Modal */}
      <GroqApiKeyModal
        isOpen={showGroqModal}
        onClose={() => setShowGroqModal(false)}
        onKeySaved={(newKey) => setGroqKey(newKey)}
      />
    </div>
  );
}
