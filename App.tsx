import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Target,
  FileText,
  Settings,
  Plus,
  Menu,
  X,
  Sparkles,
  UserCog,
  LogOut,
  Loader2,
  ChevronRight,
  PieChart,
  UserPlus
} from 'lucide-react';
import { ViewType, Transaction, Category, Partner, Budget, User, Invite, RecurringSchedule } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import CategoryManager from './components/CategoryManager';
import PartnerManager from './components/PartnerManager';
import BudgetTracker from './components/BudgetTracker';
import Reports from './components/Reports';
import UserManager from './components/UserManager';
import { useAuth, AuthProvider } from './components/AuthProvider';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';

// Placeholder for AI service
const getFinancialAdvice = async (transactions: Transaction[], categories: Category[]): Promise<string> => {
  return "AI Advisor feature requires Gemini API key configuration.";
};
import {
  categoryService,
  transactionService,
  partnerService,
  budgetService,
  recurringService,
  userService,
  inviteService,
  appSettingsService
} from './lib/supabaseService';

import {
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_EXPENSE_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_PARTNERS,
  INITIAL_BUDGETS,
  INITIAL_USERS
} from './constants';
import { isSupabaseConfigured } from './lib/supabase';

const MainApp: React.FC = () => {
  const user_profile = useAuth();
  const { user, signOut, isDemo } = user_profile;
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringSchedule[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('NGN');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Load data from localStorage (demo mode) or Supabase
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      // Demo mode - load from localStorage
      const savedTransactions = localStorage.getItem('omugwo_transactions');
      const savedCategories = localStorage.getItem('omugwo_categories');
      const savedPartners = localStorage.getItem('omugwo_partners');
      const savedBudgets = localStorage.getItem('omugwo_budgets');
      const savedUsers = localStorage.getItem('omugwo_users');
      const savedInvites = localStorage.getItem('omugwo_invites');
      const savedRecurring = localStorage.getItem('omugwo_recurring');
      const savedCurrency = localStorage.getItem('omugwo_default_currency') || 'NGN';

      setTransactions(savedTransactions ? JSON.parse(savedTransactions) : INITIAL_TRANSACTIONS);
      setCategories(savedCategories ? JSON.parse(savedCategories) : [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES]);
      setPartners(savedPartners ? JSON.parse(savedPartners) : INITIAL_PARTNERS);
      setBudgets(savedBudgets ? JSON.parse(savedBudgets) : INITIAL_BUDGETS);
      setUsers(savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS);
      setInvites(savedInvites ? JSON.parse(savedInvites) : []);
      setRecurringSchedules(savedRecurring ? JSON.parse(savedRecurring) : []);
      setDefaultCurrency(savedCurrency);
      setIsLoading(false);
      return;
    }

    try {
      const [
        appSettings,
        categoriesData,
        transactionsData,
        partnersData,
        budgetsData,
        usersData,
        invitesData,
        recurringData
      ] = await Promise.all([
        appSettingsService.get(),
        categoryService.getAll(),
        transactionService.getAll(),
        partnerService.getAll(),
        budgetService.getAll(),
        userService.getAll(),
        inviteService.getAll(),
        recurringService.getAll()
      ]);

      setDefaultCurrency(appSettings.defaultCurrency || 'NGN');
      setCategories(categoriesData);
      setTransactions(transactionsData);
      setPartners(partnersData);
      setBudgets(budgetsData);
      setUsers(usersData);
      setInvites(invitesData);
      setRecurringSchedules(recurringData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please check your Supabase configuration.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Persist to localStorage in demo mode
  useEffect(() => {
    if (!isSupabaseConfigured && transactions.length > 0) {
      localStorage.setItem('omugwo_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const handleUpdateDefaultCurrency = async (currency: string) => {
    setIsSavingSettings(true);
    setSettingsError(null);
    try {
      if (isSupabaseConfigured) {
        const updated = await appSettingsService.updateDefaultCurrency(currency);
        setDefaultCurrency(updated.defaultCurrency);
      } else {
        setDefaultCurrency(currency);
      }
    } catch (err) {
      console.error('Error updating default currency:', err);
      setSettingsError('Failed to update default currency');
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured && categories.length > 0) {
      localStorage.setItem('omugwo_categories', JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (!isSupabaseConfigured && partners.length > 0) {
      localStorage.setItem('omugwo_partners', JSON.stringify(partners));
    }
  }, [partners]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('omugwo_budgets', JSON.stringify(budgets));
    }
  }, [budgets]);

  useEffect(() => {
    if (!isSupabaseConfigured && users.length > 0) {
      localStorage.setItem('omugwo_users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('omugwo_invites', JSON.stringify(invites));
    }
  }, [invites]);

  useEffect(() => {
    if (!isSupabaseConfigured && defaultCurrency) {
      localStorage.setItem('omugwo_default_currency', defaultCurrency);
    }
  }, [defaultCurrency]);

  // Handle window resize to auto-close/open sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Recurring Logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let newTransactions: Transaction[] = [];
    const updatedSchedules = recurringSchedules.map(schedule => {
      if (!schedule.isActive) return schedule;
      let tempNext = new Date(schedule.nextOccurrence);
      const todayDate = new Date(today);
      while (tempNext <= todayDate) {
        const template = transactions.find(t => t.id === schedule.templateTransactionId);
        if (template) {
          newTransactions.push({
            ...template,
            id: Math.random().toString(36).substr(2, 9),
            date: tempNext.toISOString().split('T')[0],
            recurringId: schedule.id
          });
        }
        if (schedule.frequency === 'DAILY') tempNext.setDate(tempNext.getDate() + 1);
        else if (schedule.frequency === 'WEEKLY') tempNext.setDate(tempNext.getDate() + 7);
        else if (schedule.frequency === 'MONTHLY') tempNext.setMonth(tempNext.getMonth() + 1);
        else if (schedule.frequency === 'YEARLY') tempNext.setFullYear(tempNext.getFullYear() + 1);
      }
      return { ...schedule, nextOccurrence: tempNext.toISOString().split('T')[0] };
    });
    if (newTransactions.length > 0) {
      setTransactions(prev => [...newTransactions, ...prev]);
      setRecurringSchedules(updatedSchedules);
    }
  }, []);

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((a, c) => a + c.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((a, c) => a + c.amount, 0);
    return { totalIncome: income, totalExpense: expense, netProfit: income - expense };
  }, [transactions]);

  const addTransaction = async (t: Omit<Transaction, 'id'>, recurring?: { frequency: string }) => {
    try {
      let newTransaction: Transaction;

      if (!isSupabaseConfigured) {
        // Demo mode - create locally
        const transId = Math.random().toString(36).substr(2, 9);
        newTransaction = { ...t, id: transId } as Transaction;
      } else {
        newTransaction = await transactionService.create(t);
      }

      setTransactions([newTransaction, ...transactions]);

      if (recurring) {
        const nextDate = new Date(t.date);
        if (recurring.frequency === 'DAILY') nextDate.setDate(nextDate.getDate() + 1);
        else if (recurring.frequency === 'WEEKLY') nextDate.setDate(nextDate.getDate() + 7);
        else if (recurring.frequency === 'MONTHLY') nextDate.setMonth(nextDate.getMonth() + 1);
        else if (recurring.frequency === 'YEARLY') nextDate.setFullYear(nextDate.getFullYear() + 1);

        const newSchedule: RecurringSchedule = {
          id: Math.random().toString(36).substr(2, 9),
          templateTransactionId: newTransaction.id,
          frequency: recurring.frequency as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
          startDate: t.date,
          nextOccurrence: nextDate.toISOString().split('T')[0],
          isActive: true
        };

        if (isSupabaseConfigured) {
          await recurringService.create(newSchedule);
        }
        setRecurringSchedules([...recurringSchedules, newSchedule]);
      }
      setShowTransactionModal(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction');
    }
  };

  const handleUpdateTransaction = async (t: Transaction) => {
    try {
      if (isSupabaseConfigured) {
        await transactionService.update(t.id, t);
      }
      setTransactions(transactions.map(item => item.id === t.id ? t : item));
      setEditingTransaction(null);
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        await transactionService.delete(id);
      }
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
    }
  };

  const addNewPartner = async (p: Omit<Partner, 'id'>): Promise<Partner> => {
    try {
      let newPartner: Partner;
      if (!isSupabaseConfigured) {
        newPartner = { ...p, id: Math.random().toString(36).substr(2, 9) };
      } else {
        newPartner = await partnerService.create(p);
      }
      setPartners([...partners, newPartner]);
      return newPartner;
    } catch (err) {
      console.error('Error adding partner:', err);
      throw err;
    }
  };

  const handleUpdateCategory = async (updated: Category) => {
    try {
      if (isSupabaseConfigured) {
        await categoryService.update(updated.id, updated);
      }
      setCategories(categories.map(c => c.id === updated.id ? updated : c));
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${currentView === view
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
          : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {currentView === view && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">O</div>
              <div>
                <h1 className="font-bold text-lg leading-tight">Omugwo</h1>
                <p className="text-xs text-slate-500">Academy</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            <NavItem view={ViewType.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={ViewType.TRANSACTIONS} icon={Receipt} label="Transactions" />
            <NavItem view={ViewType.PARTNERS} icon={Users} label="Partners" />
            <NavItem view={ViewType.BUDGETS} icon={Target} label="Budgets" />
            <NavItem view={ViewType.REPORTS} icon={PieChart} label="Reports" />
            <NavItem view={ViewType.USERS} icon={UserPlus} label="Team" />
            <NavItem view={ViewType.SETTINGS} icon={Settings} label="Settings" />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
            <div className="p-4 bg-slate-900 rounded-2xl text-white">
              <p className="text-[10px] opacity-60 mb-1 uppercase tracking-widest font-bold">Total Balance ({defaultCurrency})</p>
              <p className="text-xl font-bold font-mono">{defaultCurrency} {summary.netProfit.toLocaleString()}</p>
            </div>
            {/* Staff Identity Card */}
            {user_profile?.staffProfile && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Staff ID</p>
                <p className="font-mono font-bold text-blue-700 text-sm">{user_profile.staffProfile.staff_id}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full font-bold ${user_profile.staffProfile.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    user_profile.staffProfile.role === 'FINANCE' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                  }`}>{user_profile.staffProfile.role}</span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all ${isSidebarOpen ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={async () => { setIsAiLoading(true); setAiInsight(await getFinancialAdvice(transactions, categories)); setIsAiLoading(false); }}
              disabled={isAiLoading}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-xs md:text-sm font-medium"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">{isAiLoading ? 'Analyzing...' : 'AI Advisor'}</span>
              <span className="sm:hidden">{isAiLoading ? '...' : 'AI'}</span>
            </button>
            <button
              onClick={() => { setEditingTransaction(null); setShowTransactionModal(true); }}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-xs md:text-sm font-medium"
            >
              <Plus size={16} />
              <span>Entry</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {aiInsight && (
            <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-purple-900 font-bold flex items-center gap-2"><Sparkles size={18} />AI Analysis</h3>
                <button onClick={() => setAiInsight(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>
              <div className="text-slate-700 prose max-w-none prose-sm whitespace-pre-wrap">{aiInsight}</div>
            </div>
          )}

          {currentView === ViewType.DASHBOARD && <Dashboard summary={summary} transactions={transactions} categories={categories} defaultCurrency={defaultCurrency} />}
          {currentView === ViewType.TRANSACTIONS && <TransactionList transactions={transactions} categories={categories} partners={partners} onDelete={handleDeleteTransaction} onEdit={(t) => setEditingTransaction(t)} defaultCurrency={defaultCurrency} />}
          {currentView === ViewType.PARTNERS && <PartnerManager partners={partners} setPartners={setPartners} transactions={transactions} categories={categories} />}
          {currentView === ViewType.BUDGETS && <BudgetTracker budgets={budgets} setBudgets={setBudgets} transactions={transactions} categories={categories} defaultCurrency={defaultCurrency} />}
          {currentView === ViewType.REPORTS && <Reports transactions={transactions} categories={categories} partners={partners} defaultCurrency={defaultCurrency} />}
          {currentView === ViewType.USERS && <UserManager users={users} setUsers={setUsers} invites={invites} setInvites={setInvites} />}
          {currentView === ViewType.SETTINGS && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Project Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Default Currency</label>
                    <select
                      value={defaultCurrency}
                      onChange={e => handleUpdateDefaultCurrency(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      disabled={isSavingSettings}
                    >
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                  <div className="text-xs text-slate-500 md:col-span-2">
                    This currency is used for all dashboards, reports, and budgets. Foreign currency transactions will be converted into this currency using the exchange rate you provide.
                  </div>
                </div>
                {settingsError && (
                  <p className="mt-3 text-xs text-rose-600 font-medium">{settingsError}</p>
                )}
              </div>
              <CategoryManager categories={categories} setCategories={setCategories} onUpdateCategory={handleUpdateCategory} />
            </div>
          )}
        </div>
      </main>

      {showTransactionModal && (
        <TransactionForm partners={partners} categories={categories} onSubmit={addTransaction} onClose={() => setShowTransactionModal(false)} onAddPartner={addNewPartner} defaultCurrency={defaultCurrency} />
      )}

      {editingTransaction && (
        <TransactionForm partners={partners} categories={categories} initialData={editingTransaction} onSubmit={handleUpdateTransaction} onClose={() => setEditingTransaction(null)} onAddPartner={addNewPartner} defaultCurrency={defaultCurrency} />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200] flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading your financial data...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl shadow-lg z-[200] max-w-md">
          <p className="font-bold mb-1">Connection Error</p>
          <p className="text-sm">{error}</p>
          <button onClick={loadData} className="mt-2 text-sm font-bold text-rose-600 hover:underline">Retry</button>
        </div>
      )}
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isStaff } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Verifying staff access...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Non-staff user – show access denied
  if (!isStaff) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCog size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Staff Access Only</h2>
          <p className="text-slate-500 mb-6">
            This application is restricted to Omugwo staff members. Your account has not been granted tracker access.
            Please contact your administrator to get access.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
