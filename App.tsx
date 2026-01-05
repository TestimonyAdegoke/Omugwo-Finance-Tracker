
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings, 
  Plus, 
  Users, 
  Target,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { Transaction, Category, ViewType, FinancialSummary, Partner, Budget, RecurringSchedule, User, Invite } from './types';
import { 
  DEFAULT_INCOME_CATEGORIES, 
  DEFAULT_EXPENSE_CATEGORIES, 
  INITIAL_TRANSACTIONS,
  INITIAL_PARTNERS,
  INITIAL_BUDGETS,
  INITIAL_USERS
} from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import CategoryManager from './components/CategoryManager';
import TransactionForm from './components/TransactionForm';
import PartnerManager from './components/PartnerManager';
import BudgetTracker from './components/BudgetTracker';
import UserManager from './components/UserManager';
import Reports from './components/Reports';
import { getFinancialAdvice } from './geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('omugwo_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('omugwo_categories');
    return saved ? JSON.parse(saved) : [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES];
  });
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('omugwo_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('omugwo_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('omugwo_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [invites, setInvites] = useState<Invite[]>(() => {
    const saved = localStorage.getItem('omugwo_invites');
    return saved ? JSON.parse(saved) : [];
  });
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringSchedule[]>(() => {
    const saved = localStorage.getItem('omugwo_recurring');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Persistence
  useEffect(() => localStorage.setItem('omugwo_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('omugwo_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('omugwo_partners', JSON.stringify(partners)), [partners]);
  useEffect(() => localStorage.setItem('omugwo_budgets', JSON.stringify(budgets)), [budgets]);
  useEffect(() => localStorage.setItem('omugwo_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('omugwo_invites', JSON.stringify(invites)), [invites]);
  useEffect(() => localStorage.setItem('omugwo_recurring', JSON.stringify(recurringSchedules)), [recurringSchedules]);

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

  const addTransaction = (t: Omit<Transaction, 'id'>, recurring?: { frequency: string }) => {
    const transId = Math.random().toString(36).substr(2, 9);
    setTransactions([{ ...t, id: transId }, ...transactions]);
    if (recurring) {
      const nextDate = new Date(t.date);
      if (recurring.frequency === 'DAILY') nextDate.setDate(nextDate.getDate() + 1);
      else if (recurring.frequency === 'WEEKLY') nextDate.setDate(nextDate.getDate() + 7);
      else if (recurring.frequency === 'MONTHLY') nextDate.setMonth(nextDate.getMonth() + 1);
      else if (recurring.frequency === 'YEARLY') nextDate.setFullYear(nextDate.getFullYear() + 1);
      setRecurringSchedules([...recurringSchedules, {
        id: Math.random().toString(36).substr(2, 9),
        templateTransactionId: transId,
        frequency: recurring.frequency as any,
        startDate: t.date,
        nextOccurrence: nextDate.toISOString().split('T')[0],
        isActive: true
      }]);
    }
    setShowTransactionModal(false);
  };

  const handleUpdateTransaction = (t: Transaction) => {
    setTransactions(transactions.map(item => item.id === t.id ? t : item));
    setEditingTransaction(null);
  };

  const addNewPartner = (p: Omit<Partner, 'id'>) => {
    const newP = { ...p, id: Math.random().toString(36).substr(2, 9) };
    setPartners([...partners, newP]);
    return newP;
  };

  const handleUpdateCategory = (updated: Category) => {
    setCategories(categories.map(c => c.id === updated.id ? updated : c));
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
        currentView === view 
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

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-900 rounded-2xl text-white">
              <p className="text-[10px] opacity-60 mb-1 uppercase tracking-widest font-bold">Total Balance</p>
              <p className="text-xl font-bold font-mono">${summary.netProfit.toLocaleString()}</p>
            </div>
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

          {currentView === ViewType.DASHBOARD && <Dashboard summary={summary} transactions={transactions} categories={categories} />}
          {currentView === ViewType.TRANSACTIONS && <TransactionList transactions={transactions} categories={categories} partners={partners} onDelete={(id) => setTransactions(transactions.filter(t => t.id !== id))} onEdit={(t) => setEditingTransaction(t)} />}
          {currentView === ViewType.PARTNERS && <PartnerManager partners={partners} setPartners={setPartners} transactions={transactions} categories={categories} />}
          {currentView === ViewType.BUDGETS && <BudgetTracker budgets={budgets} setBudgets={setBudgets} transactions={transactions} categories={categories} />}
          {currentView === ViewType.REPORTS && <Reports transactions={transactions} categories={categories} partners={partners} />}
          {currentView === ViewType.USERS && <UserManager users={users} setUsers={setUsers} invites={invites} setInvites={setInvites} />}
          {currentView === ViewType.SETTINGS && <CategoryManager categories={categories} setCategories={setCategories} onUpdateCategory={handleUpdateCategory} />}
        </div>
      </main>

      {showTransactionModal && (
        <TransactionForm partners={partners} categories={categories} onSubmit={addTransaction} onClose={() => setShowTransactionModal(false)} onAddPartner={addNewPartner} />
      )}

      {editingTransaction && (
        <TransactionForm partners={partners} categories={categories} initialData={editingTransaction} onSubmit={handleUpdateTransaction} onClose={() => setEditingTransaction(null)} onAddPartner={addNewPartner} />
      )}
    </div>
  );
};

export default App;
