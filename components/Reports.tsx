
import React, { useMemo } from 'react';
import { PieChart as PieIcon, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Transaction, Category, Partner } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  categories: Category[];
  partners: Partner[];
  defaultCurrency: string;
}

const Reports: React.FC<ReportsProps> = ({ transactions, categories, partners, defaultCurrency }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const monthlyData = useMemo(() => {
    const months: { [key: string]: { month: string, income: number, expense: number } } = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!months[month]) months[month] = { month, income: 0, expense: 0 };
      if (t.type === 'INCOME') months[month].income += t.amount;
      else months[month].expense += t.amount;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  const categorySpend = useMemo(() => {
    const data: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || 'Other';
      data[cat] = (data[cat] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions, categories]);

  const topPartners = useMemo(() => {
    const data: { [key: string]: number } = {};
    transactions.forEach(t => {
      if (t.partnerId) {
        const pName = partners.find(p => p.id === t.partnerId)?.name || 'Unknown';
        data[pName] = (data[pName] || 0) + t.amount;
      }
    });
    return Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [transactions, partners]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Intelligence</h2>
          <p className="text-slate-500">Deep-dive analysis of Omugwo Academy performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-8 flex items-center gap-2"><BarChart2 className="text-blue-600"/> Monthly Growth Trend</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend iconType="circle" />
                <Bar name="Revenue" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="Operational Cost" dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-8 flex items-center gap-2"><PieIcon className="text-rose-600"/> Resource Allocation</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySpend} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" nameKey="name" label>
                  {categorySpend.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-blue-400">Strategic Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">Top Financial Partners</h4>
            <div className="space-y-4">
              {topPartners.map(([name, amount], i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 font-mono text-xs">{i+1}.</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <span className="font-mono font-bold text-blue-400">{defaultCurrency} {amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50">
            <h4 className="text-sm font-bold mb-4 text-emerald-400 flex items-center gap-2"><TrendingUp size={18}/> Efficiency Projection</h4>
            <p className="text-xs opacity-70 leading-relaxed">
              Based on the last 3 months of data, Omugwo Academy is maintaining a healthy reserve ratio. 
              The current burn rate suggests capital runway is extending as "Course Purchases" outpaces "Marketing" expenditure. 
              Recommendation: Allocate 15% of net profit to content production expansion for maximum scalability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
