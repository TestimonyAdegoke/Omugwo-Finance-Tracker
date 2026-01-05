
import { Category, Transaction, Partner, Budget, User } from './types';

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'inc-1', name: 'Course Purchases', type: 'INCOME', color: '#10b981' },
  { id: 'inc-2', name: 'Donations', type: 'INCOME', color: '#3b82f6' },
  { id: 'inc-3', name: 'Sponsorships', type: 'INCOME', color: '#8b5cf6' },
  { id: 'inc-4', name: 'Events/Workshops', type: 'INCOME', color: '#f59e0b' },
  { id: 'inc-5', name: 'Merchandise', type: 'INCOME', color: '#ec4899' },
  { id: 'inc-6', name: 'Other Income', type: 'INCOME', color: '#64748b' },
];

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'exp-1', name: 'Staff Salaries', type: 'EXPENSE', color: '#ef4444' },
  { id: 'exp-2', name: 'Content Production', type: 'EXPENSE', color: '#f97316' },
  { id: 'exp-3', name: 'Marketing', type: 'EXPENSE', color: '#eab308' },
  { id: 'exp-4', name: 'Technology', type: 'EXPENSE', color: '#06b6d4' },
  { id: 'exp-5', name: 'Office Ops', type: 'EXPENSE', color: '#6366f1' },
  { id: 'exp-6', name: 'Utilities', type: 'EXPENSE', color: '#d946ef' },
];

export const INITIAL_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Amazon Web Services', type: 'VENDOR', email: 'billing@aws.com', website: 'https://aws.amazon.com', address: 'Seattle, WA' },
  { id: 'p2', name: 'Jane Doe (Student)', type: 'CUSTOMER', email: 'jane@example.com', phone: '+234 801 234 5678' },
  { id: 'p3', name: 'Nigerian Tech Hub', type: 'SPONSOR', website: 'https://techhub.ng' }
];

export const INITIAL_BUDGETS: Budget[] = [
  { categoryId: 'exp-4', monthlyLimit: 500 },
  { categoryId: 'exp-1', monthlyLimit: 2000 }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Main Admin',
    email: 'admin@omugwo.academy',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinedAt: '2023-01-01'
  },
  {
    id: 'u2',
    name: 'Finance Manager',
    email: 'finance@omugwo.academy',
    role: 'FINANCE',
    status: 'ACTIVE',
    joinedAt: '2023-06-15'
  }
];

export const PAYMENT_METHODS = ['Cash', 'Transfer', 'Card', 'Online'];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    amount: 5000,
    date: new Date().toISOString().split('T')[0],
    categoryId: 'inc-1',
    type: 'INCOME',
    paymentMethod: 'Online',
    description: 'February Cohort Enrollments',
    partnerId: 'p2',
    tags: ['Cohort 2024']
  },
  {
    id: 't2',
    amount: 1200,
    date: new Date().toISOString().split('T')[0],
    categoryId: 'exp-1',
    type: 'EXPENSE',
    paymentMethod: 'Transfer',
    description: 'Facilitator Honorarium',
    tags: ['Staff']
  }
];
