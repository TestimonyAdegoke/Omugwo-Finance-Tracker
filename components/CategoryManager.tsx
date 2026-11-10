import React, { useState } from 'react';
import { Plus, Trash2, Tag, Edit2, Save, X, Loader2 } from 'lucide-react';
import { Category, TransactionType } from '../types';
import { categoryService } from '../lib/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

interface CategoryManagerProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onUpdateCategory: (c: Category) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, setCategories, onUpdateCategory }) => {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<TransactionType>('INCOME');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', color: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCategory = async () => {
    if (!newName) return;
    setIsLoading(true);
    setError(null);
    try {
      let newCategory: Category;
      if (isSupabaseConfigured) {
        newCategory = await categoryService.create({ name: newName, type: newType, color: newColor });
      } else {
        newCategory = { id: Math.random().toString(36).substr(2, 9), name: newName, type: newType, color: newColor };
      }
      setCategories([...categories, newCategory]);
      setNewName('');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (confirm('Delete this category? Transactions will remain but lose category link.')) {
      setIsLoading(true);
      setError(null);
      try {
        if (isSupabaseConfigured) {
          await categoryService.delete(id);
        }
        setCategories(categories.filter(c => c.id !== id));
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('Failed to delete category');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, color: cat.color });
  };

  const saveEdit = async (cat: Category) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = { ...cat, name: editForm.name, color: editForm.color };
      if (isSupabaseConfigured) {
        await categoryService.update(cat.id, updated);
      }
      setCategories(categories.map(c => c.id === cat.id ? updated : c));
      setEditingId(null);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  const CategorySection = ({ type, title, colorClass }: { type: TransactionType, title: string, colorClass: string }) => (
    <div className="space-y-4">
      <h3 className={`text-lg font-bold ${colorClass}`}>{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.filter(c => c.type === type).map(cat => (
          <div key={cat.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            {editingId === cat.id ? (
              <div className="space-y-3">
                <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" />
                <div className="flex items-center gap-2">
                  <input type="color" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} className="h-6 w-12" />
                  <button onClick={() => saveEdit(cat)} className="ml-auto p-1 text-emerald-600"><Save size={16}/></button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-slate-400"><X size={16}/></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-medium text-slate-700">{cat.name}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(cat)} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 size={14}/></button>
                  <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 size={14}/></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900"><Tag size={20} className="text-blue-600"/> Create Category</h2>
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Category Name</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Workshop Fees" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Type</label>
            <select value={newType} onChange={(e) => setNewType(e.target.value as any)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Color Tag</label>
            <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="h-10 w-16 block cursor-pointer border-none bg-transparent" />
          </div>
          <button onClick={addCategory} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Add Category</button>
        </div>
      </div>
      <CategorySection type="INCOME" title="Income Sources" colorClass="text-emerald-700" />
      <CategorySection type="EXPENSE" title="Expense Streams" colorClass="text-rose-700" />
    </div>
  );
};

export default CategoryManager;
