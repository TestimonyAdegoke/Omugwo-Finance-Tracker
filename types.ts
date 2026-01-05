
export type TransactionType = 'INCOME' | 'EXPENSE';
export type PartnerType = 'CUSTOMER' | 'VENDOR' | 'SPONSOR' | 'OTHER';
export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type UserRole = 'ADMIN' | 'FINANCE' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
}

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  sentAt: string;
}

export interface RecurringSchedule {
  id: string;
  templateTransactionId: string;
  frequency: RecurringFrequency;
  startDate: string;
  nextOccurrence: string;
  isActive: boolean;
}

export interface Budget {
  categoryId: string;
  monthlyLimit: number;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionType;
  paymentMethod: string;
  source?: string;
  description: string;
  partnerId?: string;
  recurringId?: string;
  tags?: string[];
  attachment?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export enum ViewType {
  DASHBOARD = 'dashboard',
  TRANSACTIONS = 'transactions',
  REPORTS = 'reports',
  PARTNERS = 'partners',
  BUDGETS = 'budgets',
  USERS = 'users',
  SETTINGS = 'settings'
}
