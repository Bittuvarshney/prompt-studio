import {
  GeneratedPromptPackage,
  MembershipPlanConfig,
  PaymentInvoice,
  User,
} from '../types';
import {
  INITIAL_INVOICES,
  INITIAL_PLANS,
  INITIAL_USER,
  SAMPLE_GENERATED_PACKAGES,
} from './mockData';

const KEYS = {
  USER: 'promptcraft_user_v2',
  PLANS: 'promptcraft_plans_v2',
  PACKAGES: 'promptcraft_packages_v2',
  INVOICES: 'promptcraft_invoices_v2',
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading user from localStorage', e);
  }
  return null;
};

export const saveStoredUser = (user: User): void => {
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed saving user', e);
  }
};

export const clearStoredUser = (): void => {
  try {
    localStorage.removeItem(KEYS.USER);
  } catch (e) {
    console.error('Failed clearing user', e);
  }
};

export const getStoredPlans = (): MembershipPlanConfig[] => {
  try {
    const raw = localStorage.getItem(KEYS.PLANS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading plans from localStorage', e);
  }
  return INITIAL_PLANS;
};

export const saveStoredPlans = (plans: MembershipPlanConfig[]): void => {
  try {
    localStorage.setItem(KEYS.PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed saving plans', e);
  }
};

export const getStoredPackages = (): GeneratedPromptPackage[] => {
  try {
    const raw = localStorage.getItem(KEYS.PACKAGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading packages from localStorage', e);
  }
  return SAMPLE_GENERATED_PACKAGES;
};

export const saveStoredPackage = (pkg: GeneratedPromptPackage): GeneratedPromptPackage[] => {
  const current = getStoredPackages();
  const updated = [pkg, ...current.filter((p) => p.id !== pkg.id)];
  try {
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed saving package', e);
  }
  return updated;
};

export const deleteStoredPackage = (id: string): GeneratedPromptPackage[] => {
  const current = getStoredPackages();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed deleting package', e);
  }
  return updated;
};

export const getStoredInvoices = (): PaymentInvoice[] => {
  try {
    const raw = localStorage.getItem(KEYS.INVOICES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading invoices from localStorage', e);
  }
  return INITIAL_INVOICES;
};

export const addStoredInvoice = (invoice: PaymentInvoice): PaymentInvoice[] => {
  const current = getStoredInvoices();
  const updated = [invoice, ...current];
  try {
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed saving invoice', e);
  }
  return updated;
};
