
import React, { useState } from 'react';
import { Plus, Trash2, Users, Mail, Phone, Tag, Globe, MapPin, Notebook, ArrowRight, ArrowLeft, Receipt, X, Edit2, Save } from 'lucide-react';
import { Partner, PartnerType, Transaction, Category } from '../types';

interface PartnerManagerProps {
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  transactions: Transaction[];
  categories: Category[];
}

const PartnerManager: React.FC<PartnerManagerProps> = ({ partners, setPartners, transactions, categories }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Partner, 'id'>>({
    name: '',
    type: 'CUSTOMER',
    email: '',
    phone: '',
    website: '',
    address: '',
    notes: ''
  });

  const [editFormData, setEditFormData] = useState<Partner | null>(null);

  const addPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setPartners([...partners, { ...formData, id: Math.random().toString(36).substr(2, 9) }]);
    resetAddForm();
    setIsAdding(false);
  };

  const resetAddForm = () => {
    setFormData({ name: '', type: 'CUSTOMER', email: '', phone: '', website: '', address: '', notes: '' });
  };

  const handleEditPartner = (p: Partner) => {
    setEditFormData(p);
    setEditingPartnerId(p.id);
  };

  const saveEditedPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;
    setPartners(partners.map(p => p.id === editFormData.id ? editFormData : p));
    setEditingPartnerId(null);
    setEditFormData(null);
  };

  const deletePartner = (id: string) => {
    if (confirm('Delete this partner? History will remain but unlinked.')) {
      setPartners(partners.filter(p => p.id !== id));
      if (selectedPartnerId === id) setSelectedPartnerId(null);
    }
  };

  const selectedPartner = partners.find(p => p.id === selectedPartnerId);
  const partnerTransactions = transactions.filter(t => t.partnerId === selectedPartnerId);

  if (selectedPartner) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedPartnerId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back to Partners
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <button 
                onClick={() => handleEditPartner(selectedPartner)}
                className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                title="Edit Partner"
              >
                <Edit2 size={16} />
              </button>

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 ${
                selectedPartner.type === 'VENDOR' ? 'bg-rose-100 text-rose-600' : 
                selectedPartner.type === 'CUSTOMER' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {selectedPartner.name[0]}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedPartner.name}</h2>
              <p className="text-slate-500 font-medium mb-6">{selectedPartner.type}</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <Mail size={16} className="mt-0.5 text-slate-400" />
                  <div><p className="font-semibold text-slate-400 text-[10px] uppercase">Email</p>{selectedPartner.email || 'Not provided'}</div>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <Phone size={16} className="mt-0.5 text-slate-400" />
                  <div><p className="font-semibold text-slate-400 text-[10px] uppercase">Phone</p>{selectedPartner.phone || 'Not provided'}</div>
                </div>
                {selectedPartner.website && (
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <Globe size={16} className="mt-0.5 text-slate-400" />
                    <div><p className="font-semibold text-slate-400 text-[10px] uppercase">Website</p><a href={selectedPartner.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{selectedPartner.website}</a></div>
                  </div>
                )}
                {selectedPartner.address && (
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin size={16} className="mt-0.5 text-slate-400" />
                    <div><p className="font-semibold text-slate-400 text-[10px] uppercase">Address</p>{selectedPartner.address}</div>
                  </div>
                )}
                {selectedPartner.notes && (
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <Notebook size={16} className="mt-0.5 text-slate-400" />
                    <div><p className="font-semibold text-slate-400 text-[10px] uppercase">Notes</p>{selectedPartner.notes}</div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => deletePartner(selectedPartner.id)}
                className="w-full mt-8 flex items-center justify-center gap-2 py-3 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 transition-colors text-sm font-bold"
              >
                <Trash2 size={16} /> Delete Partner
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><Receipt className="text-blue-600" /> Transaction History</h3>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full">{partnerTransactions.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {partnerTransactions.map(t => {
                      const cat = categories.find(c => c.id === t.categoryId);
                      return (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono">{t.date}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}>
                              {cat?.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">{t.description}</td>
                          <td className={`px-6 py-4 text-right font-mono font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                    {partnerTransactions.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No transactions recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {editingPartnerId && editFormData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Partner</h2>
                <button onClick={() => { setEditingPartnerId(null); setEditFormData(null); }} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={saveEditedPartner} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Partner Name</label>
                    <input required type="text" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Partner Type</label>
                    <select value={editFormData.type} onChange={e => setEditFormData({ ...editFormData, type: e.target.value as any })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="CUSTOMER">Customer / Student</option>
                      <option value="VENDOR">Vendor / Provider</option>
                      <option value="SPONSOR">Sponsor / Partner</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                    <input type="email" value={editFormData.email || ''} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Phone Number</label>
                    <input type="text" value={editFormData.phone || ''} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Website URL</label>
                    <input type="url" value={editFormData.website || ''} onChange={e => setEditFormData({ ...editFormData, website: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Physical Address</label>
                    <input type="text" value={editFormData.address || ''} onChange={e => setEditFormData({ ...editFormData, address: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Notes</label>
                    <textarea rows={3} value={editFormData.notes || ''} onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => { setEditingPartnerId(null); setEditFormData(null); }} className="flex-1 py-4 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"><Save size={18}/> Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Partners Directory</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> Add Partner
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Register New Partner</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={addPartner} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Partner Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Organization or Individual Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Partner Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="CUSTOMER">Customer / Student</option>
                    <option value="VENDOR">Vendor / Provider</option>
                    <option value="SPONSOR">Sponsor / Partner</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="partner@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Phone Number</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+234..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Website URL</label>
                  <input type="url" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Physical Address</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Office location..." />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Notes</label>
                  <textarea rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Internal notes about this partner..." />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map(p => (
          <div 
            key={p.id} 
            onClick={() => setSelectedPartnerId(p.id)}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${
              p.type === 'VENDOR' ? 'bg-rose-500' : p.type === 'CUSTOMER' ? 'bg-emerald-500' : 'bg-blue-500'
            }`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                p.type === 'CUSTOMER' ? 'bg-emerald-50 text-emerald-600' : 
                p.type === 'VENDOR' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {p.type}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleEditPartner(p); }}
                  className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Edit2 size={14} />
                </button>
                <ArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">{p.name}</h3>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2"><Mail size={14} className="text-slate-300" /> {p.email || 'No email'}</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-slate-300" /> {p.phone || 'No phone'}</div>
            </div>
          </div>
        ))}
      </div>

      {editingPartnerId && editFormData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Partner</h2>
              <button onClick={() => { setEditingPartnerId(null); setEditFormData(null); }} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={saveEditedPartner} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Partner Name</label>
                  <input required type="text" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Partner Type</label>
                  <select value={editFormData.type} onChange={e => setEditFormData({ ...editFormData, type: e.target.value as any })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="CUSTOMER">Customer / Student</option>
                    <option value="VENDOR">Vendor / Provider</option>
                    <option value="SPONSOR">Sponsor / Partner</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                  <input type="email" value={editFormData.email || ''} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Phone Number</label>
                  <input type="text" value={editFormData.phone || ''} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Website URL</label>
                  <input type="url" value={editFormData.website || ''} onChange={e => setEditFormData({ ...editFormData, website: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Physical Address</label>
                  <input type="text" value={editFormData.address || ''} onChange={e => setEditFormData({ ...editFormData, address: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Notes</label>
                  <textarea rows={3} value={editFormData.notes || ''} onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setEditingPartnerId(null); setEditFormData(null); }} className="flex-1 py-4 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"><Save size={18}/> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManager;
