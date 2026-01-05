
import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Edit2,
  Eye,
  Calendar,
  Wallet,
  Tag,
  Users,
  X,
  Filter,
  RefreshCcw,
  DollarSign
} from 'lucide-react';
import { Transaction, Category, Partner } from '../types';
import { PAYMENT_METHODS } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  partners: Partner[];
  onDelete: (id: string) => void;
  onEdit: (t: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, partners, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const getCategory = (id: string) => categories.find(c => c.id === id);
  const getPartner = (id: string) => partners.find(p => p.id === id);

  const filteredTransactions = transactions.filter(t => {
    const cat = getCategory(t.categoryId);
    const partner = getPartner(t.partnerId || '');
    
    // Search Filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      t.description.toLowerCase().includes(searchLower) || 
      (t.source && t.source.toLowerCase().includes(searchLower)) ||
      (partner && partner.name.toLowerCase().includes(searchLower)) ||
      (cat && cat.name.toLowerCase().includes(searchLower));
    
    // Type Filter
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    
    // Category Filter
    const matchesCategory = categoryFilter === 'ALL' || t.categoryId === categoryFilter;
    
    // Method Filter
    const matchesMethod = methodFilter === 'ALL' || t.paymentMethod === methodFilter;
    
    // Date Filter
    const matchesDate = (!startDate || t.date >= startDate) && (!endDate || t.date <= endDate);

    // Amount Filter
    const amt = t.amount;
    const min = minAmount !== '' ? parseFloat(minAmount) : -Infinity;
    const max = maxAmount !== '' ? parseFloat(maxAmount) : Infinity;
    const matchesAmount = amt >= min && amt <= max;

    return matchesSearch && matchesType && matchesCategory && matchesMethod && matchesDate && matchesAmount;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setMethodFilter('ALL');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
  };

  const exportToCsv = () => {
    const headers = ['Date', 'Type', 'Category', 'Partner', 'Amount', 'Description', 'Method'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.type,
      getCategory(t.categoryId)?.name || 'Unknown',
      getPartner(t.partnerId || '')?.name || 'N/A',
      t.amount,
      t.description.replace(/,/g, ' '),
      t.paymentMethod
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "omugwo_academy_transactions.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Financial Records</h2>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${showFilters ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Advanced Filters</span>
              {(startDate || endDate || minAmount || maxAmount) && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
            <button 
              onClick={exportToCsv}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title="Export Report"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search description, partner..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="lg:col-span-2">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expense Only</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="lg:col-span-3 flex gap-2">
            <select 
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Methods</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button 
              onClick={resetFilters}
              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Reset Filters"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in slide-in-from-top-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-blue-600 uppercase px-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-blue-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-blue-600 uppercase px-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-blue-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-blue-600 uppercase px-1">Min Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                  <input 
                    type="number" 
                    placeholder="0"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-blue-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-blue-600 uppercase px-1">Max Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                  <input 
                    type="number" 
                    placeholder="Any"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-blue-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Transaction</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold hidden md:table-cell">Method</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map((t) => {
              const cat = getCategory(t.categoryId);
              const partner = getPartner(t.partnerId || '');
              return (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {t.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 line-clamp-1">{t.description}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {partner ? partner.name : (t.source || 'Direct Entry')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap"
                      style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}
                    >
                      {cat?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 hidden md:table-cell">
                    {t.paymentMethod}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1 font-mono font-bold ${
                      t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {t.type === 'INCOME' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setSelectedTransaction(t)}
                        className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onEdit(t)}
                        className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-bold text-slate-600">No matching records</p>
                    <p className="text-sm">Try adjusting your filters or search keywords.</p>
                    <button onClick={resetFilters} className="mt-4 text-blue-600 text-sm font-bold hover:underline">Clear all filters</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Transaction Details</h2>
              <button onClick={() => setSelectedTransaction(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className={`p-4 rounded-3xl ${selectedTransaction.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {selectedTransaction.type === 'INCOME' ? <ArrowUpRight size={40} /> : <ArrowDownRight size={40} />}
                </div>
                <h3 className="text-3xl font-mono font-bold text-slate-900">
                  {selectedTransaction.type === 'INCOME' ? '+' : '-'}${selectedTransaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{selectedTransaction.type}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400"><Calendar size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction Date</p>
                    <p className="text-sm font-semibold text-slate-700">{selectedTransaction.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400"><Tag size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
                    <p className="text-sm font-semibold text-slate-700">{getCategory(selectedTransaction.categoryId)?.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400"><Wallet size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Method</p>
                    <p className="text-sm font-semibold text-slate-700">{selectedTransaction.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 mt-1"><Users size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entity (Partner/Source)</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {getPartner(selectedTransaction.partnerId || '')?.name || selectedTransaction.source || 'None'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">{selectedTransaction.description}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { onEdit(selectedTransaction); setSelectedTransaction(null); }}
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} /> Edit Record
                </button>
                <button 
                  onClick={() => { onDelete(selectedTransaction.id); setSelectedTransaction(null); }}
                  className="flex-1 py-4 border border-rose-100 text-rose-500 font-bold rounded-2xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
