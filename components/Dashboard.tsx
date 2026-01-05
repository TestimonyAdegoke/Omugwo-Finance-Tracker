
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Transaction, Category, FinancialSummary } from '../types';

interface DashboardProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ summary, transactions, categories }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayIncome = transactions
      .filter(t => t.date === dateStr && t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const dayExpense = transactions
      .filter(t => t.date === dateStr && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return { 
      name: d.toLocaleDateString('en-US', { weekday: 'short' }), 
      income: dayIncome, 
      expense: dayExpense 
    };
  });

  const categoryData = categories
    .filter(c => transactions.some(t => t.categoryId === c.id))
    .map(cat => {
      const total = transactions
        .filter(t => t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: cat.name, value: total, color: cat.color };
    });

  const KpiCard = ({ title, value, icon: Icon, color, trend, info }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} text-white`}>
          <Icon size={20} />
        </div>
        {info && (
          <div className="relative">
            <Info size={16} className="text-slate-300 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {info}
            </div>
          </div>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold font-mono">{typeof value === 'number' ? `$${value.toLocaleString()}` : value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Income" value={summary.totalIncome} icon={TrendingUp} color="bg-emerald-500" />
        <KpiCard title="Total Expenses" value={summary.totalExpense} icon={TrendingDown} color="bg-rose-500" />
        <KpiCard title="Net Profit" value={summary.netProfit} icon={DollarSign} color="bg-blue-600" />
        <KpiCard 
          title="Operational Efficiency" 
          value={`${summary.totalIncome > 0 ? Math.round((summary.netProfit / summary.totalIncome) * 100) : 0}%`} 
          icon={Activity} 
          color="bg-slate-700" 
          info="Calculated as (Net Profit / Total Income) * 100. This represents the Academy's profitability margin."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-6">Weekly Revenue Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}} />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-6">Expense Categories</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
