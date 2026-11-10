import React, { useState } from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle2, ListChecks, ArrowRight, Save, X, Loader2 } from 'lucide-react';
import { Budget, Category, Transaction } from '../types';
import { budgetService } from '../lib/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

const currencySymbols: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const getCurrencySymbol = (code: string) => currencySymbols[code] || code;

interface BudgetTrackerProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  transactions: Transaction[];
  categories: Category[];
  defaultCurrency: string;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budgets, setBudgets, transactions, categories, defaultCurrency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localBudgets, setLocalBudgets] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentMonth = new Date().toISOString().substring(0, 7); 
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  const startEditing = () => {
    const map: { [key: string]: string } = {};
    budgets.forEach(b => map[b.categoryId] = b.monthlyLimit.toString());
    setLocalBudgets(map);
    setIsEditing(true);
  };

  const saveBudgets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newBudgets: Budget[] = (Object.entries(localBudgets) as [string, string][])
        .filter(([_, amount]) => amount && !isNaN(parseFloat(amount)))
        .map(([catId, amount]) => ({
          categoryId: catId,
          monthlyLimit: parseFloat(amount)
        }));
      
      if (isSupabaseConfigured) {
        await budgetService.upsert(newBudgets, currentMonth);
      }
      setBudgets(newBudgets);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving budgets:', err);
      setError('Failed to save budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const getSpendingForCategory = (catId: string) => {
    return transactions
      .filter(t => t.categoryId === catId && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getSpendingForCategory(b.categoryId), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Budgeting & Goals</h2>
          <p className="text-slate-500 mt-1">Planning for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        {!isEditing && (
          <button 
            onClick={startEditing}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
          >
            <ListChecks size={20} /> Bulk Update Budget
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-top-4">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-xl font-bold">Multiline Budget Editor</h3>
              <p className="text-sm text-slate-500 mt-1">Set monthly limits for all expense categories at once.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
              <button onClick={saveBudgets} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"><Save size={18} /> Save All</button>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expenseCategories.map(cat => (
                <div key={cat.id} className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cat.name}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      {getCurrencySymbol(defaultCurrency)}
                    </span>
                    <input 
                      type="number"
                      value={localBudgets[cat.id] || ''}
                      onChange={e => setLocalBudgets({ ...localBudgets, [cat.id]: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-sm font-bold text-slate-400 uppercase mb-2">Monthly Budget Cap ({defaultCurrency})</p>
              <p className="text-3xl font-bold text-slate-900 font-mono">{defaultCurrency} {totalBudgeted.toLocaleString()}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-sm font-bold text-slate-400 uppercase mb-2">Current Spend ({defaultCurrency})</p>
              <p className={`text-3xl font-bold font-mono ${totalSpent > totalBudgeted ? 'text-rose-600' : 'text-emerald-600'}`}>{defaultCurrency} {totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase mb-2">Budget Health</p>
                <p className="text-3xl font-bold text-slate-900">{totalBudgeted > 0 ? Math.round((totalSpent/totalBudgeted)*100) : 0}%</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center relative">
                 <div className={`absolute inset-0 rounded-full border-4 border-transparent transition-all duration-1000 ${totalSpent > totalBudgeted ? 'border-rose-500' : 'border-emerald-500'}`} style={{ clipPath: `inset(0 0 ${100 - Math.min(100, (totalSpent/totalBudgeted)*100)}% 0)` }} />
                 <Target className={totalSpent > totalBudgeted ? 'text-rose-500' : 'text-emerald-500'} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {budgets.map(budget => {
              const category = categories.find(c => c.id === budget.categoryId);
              if (!category) return null;
              const actual = getSpendingForCategory(budget.categoryId);
              const percent = Math.min((actual / budget.monthlyLimit) * 100, 100);
              const isOver = actual > budget.monthlyLimit;

              return (
                <div key={budget.categoryId} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                  {isOver && <div className="absolute top-0 right-0 p-4"><AlertCircle className="text-rose-500 animate-pulse" /></div>}
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: category.color }}>
                        {category.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Monthly Limit: {defaultCurrency} {budget.monthlyLimit.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-500 uppercase">Usage</span>
                      <span className={isOver ? 'text-rose-600' : 'text-slate-900'}>{defaultCurrency} {actual.toLocaleString()} ({Math.round((actual / budget.monthlyLimit) * 100)}%)</span>
                    </div>
                    <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${isOver ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                      {isOver ? (
                        <><AlertCircle size={18} /> Budget exceeded by {defaultCurrency} {(actual - budget.monthlyLimit).toLocaleString()}</>
                      ) : (
                        <><CheckCircle2 size={18} /> Healthy! {defaultCurrency} {(budget.monthlyLimit - actual).toLocaleString()} safe for this month</>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {budgets.length === 0 && (
              <div className="lg:col-span-2 p-20 text-center bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center">
                <Target size={48} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No active budgets</h3>
                <p className="text-slate-500 mt-2 max-w-sm">Setup budgets to track your spending limits across different expense categories.</p>
                <button onClick={startEditing} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">Start Planning</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetTracker;
