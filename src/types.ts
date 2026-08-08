export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: UserPlan;
  isAdmin: boolean;
  tokensLeft: number;
  tokensMax: number;
  apiKeyCustom?: string;
  createdAt: string;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mode: 'dark' | 'light';
  fontPairing: string;
}

export interface SiteLayoutData {
  navbar: {
    logoText: string;
    links: string[];
    actionBtnText: string;
  };
  hero: {
    badge?: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    metrics?: Array<{
      value: string;
      label: string;
    }>;
  };
  features: Array<{
    title: string;
    description: string;
    iconName: string;
    tag?: string;
  }>;
  showcase?: {
    sectionTitle: string;
    subtitle?: string;
    items: Array<{
      title: string;
      category: string;
      description: string;
      stats?: string;
    }>;
  };
  interactiveSection?: {
    title: string;
    description: string;
    type: string;
    fields?: Array<{
      label: string;
      defaultValue: string;
    }>;
  };
  pricing?: {
    sectionTitle: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      isPopular?: boolean;
      features: string[];
    }>;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
}

export interface GeneratedPromptPackage {
  id: string;
  title: string;
  category: string;
  prompt: string;
  explanation: string;
  theme: ThemeConfig;
  siteData: SiteLayoutData;
  generatedHtmlCode: string;
  generatedReactCode: string;
  createdAt: string;
  userQuery: string;
}

export interface PaymentInvoice {
  id: string;
  date: string;
  planName: string;
  planTier: UserPlan;
  amount: number;
  currency: string;
  status: 'Paid' | 'Processing' | 'Refunded';
  paymentMethod: string;
  transactionRef: string;
}

export interface MembershipPlanConfig {
  id: UserPlan;
  title: string;
  priceMonthly: number;
  priceAnnual: number;
  tokenLimit: number;
  badge?: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isVoice?: boolean;
}

export type ActiveTab =
  | 'home'
  | 'generator'
  | 'tester'
  | 'dashboard'
  | 'membership'
  | 'profile'
  | 'bills'
  | 'helpdesk'
  | 'auth';
