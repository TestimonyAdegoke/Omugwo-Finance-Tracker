
import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, Info, Users, Repeat, PlusCircle } from 'lucide-react';
import { Category, TransactionType, Partner, Transaction } from '../types';
import { PAYMENT_METHODS } from '../constants';

interface TransactionFormProps {
  categories: Category[];
  partners: Partner[];
  initialData?: Transaction;
  onSubmit: (t: any, recurring?: { frequency: string }) => void;
  onClose: () => void;
  onAddPartner: (p: Omit<Partner, 'id'>) => Partner;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, partners, initialData, onSubmit, onClose, onAddPartner }) => {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'INCOME');
  const [isRecurring, setIsRecurring] = useState(!!initialData?.recurringId);
  const [frequency, setFrequency] = useState('MONTHLY');
  const [showQuickPartner, setShowQuickPartner] = useState(false);
  const [quickPartnerName, setQuickPartnerName] = useState('');
  
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    amount: initialData?.amount?.toString() || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    categoryId: initialData?.categoryId || '',
    partnerId: initialData?.partnerId || '',
    paymentMethod: initialData?.paymentMethod || 'Transfer',
    description: initialData?.description || '',
    source: initialData?.source || '',
  });

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId || !formData.description) {
      alert('Please fill in required fields');
      return;
    }
    const data = { ...formData, amount: parseFloat(formData.amount), type };
    if (!initialData) {
      delete (data as any).id;
    }
    onSubmit(
      data,
      isRecurring ? { frequency } : undefined
    );
  };

  const handleCreateQuickPartner = () => {
    if (!quickPartnerName) return;
    const newPartner = onAddPartner({
      name: quickPartnerName,
      type: type === 'INCOME' ? 'CUSTOMER' : 'VENDOR',
    });
    setFormData({ ...formData, partnerId: newPartner.id });
    setQuickPartnerName('');
    setShowQuickPartner(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Transaction' : 'New Financial Entry'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button type="button" onClick={() => setType('INCOME')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Income</button>
            <button type="button" onClick={() => setType('EXPENSE')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Expense</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Amount ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="number" step="0.01" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Category</label>
              <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Partner (Customer/Vendor)</label>
                <button 
                  type="button" 
                  onClick={() => setShowQuickPartner(!showQuickPartner)}
                  className="text-blue-600 text-[10px] font-bold uppercase flex items-center gap-1 hover:underline"
                >
                  <PlusCircle size={12} /> Quick Add
                </button>
              </div>
              
              {showQuickPartner ? (
                <div className="flex gap-2 mb-2 animate-in slide-in-from-top-1">
                  <input 
                    type="text" 
                    value={quickPartnerName} 
                    onChange={e => setQuickPartnerName(e.target.value)} 
                    placeholder="New Partner Name" 
                    className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={handleCreateQuickPartner}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                  >
                    Create
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select value={formData.partnerId} onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">No Partner Linked</option>
                    {partners.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Method</label>
              <select required value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {!initialData && (
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Recurring</label>
                <div className="flex items-center gap-2 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <input type="checkbox" id="recurring" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                  <label htmlFor="recurring" className="text-sm text-slate-600 font-medium">Auto-repeat</label>
                </div>
              </div>
            )}

            {isRecurring && !initialData && (
              <div className="col-span-2 animate-in slide-in-from-top-2 duration-200">
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Repeat Every</label>
                <div className="flex gap-2">
                  {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map(f => (
                    <button key={f} type="button" onClick={() => setFrequency(f)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${frequency === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Description</label>
              <textarea required rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What is this for?" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className={`flex-1 px-6 py-3 text-white font-bold rounded-2xl transition-all shadow-lg ${type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
              {initialData ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
