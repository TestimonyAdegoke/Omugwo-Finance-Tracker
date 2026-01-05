
import React, { useState } from 'react';
import { UserPlus, Mail, Shield, Trash2, Clock, UserCheck, X, Send, Copy, ExternalLink, Check } from 'lucide-react';
import { User, Invite, UserRole } from '../types';

interface UserManagerProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  invites: Invite[];
  setInvites: React.Dispatch<React.SetStateAction<Invite[]>>;
}

const UserManager: React.FC<UserManagerProps> = ({ users, setUsers, invites, setInvites }) => {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('VIEWER');
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const inviteId = Math.random().toString(36).substr(2, 9);
    const newInvite: Invite = {
      id: inviteId,
      email: inviteEmail,
      role: inviteRole,
      sentAt: new Date().toISOString().split('T')[0]
    };
    setInvites([...invites, newInvite]);
    setLastInviteLink(`https://omugwo.academy/invite/${inviteId}`);
    setInviteEmail('');
    setIsInviting(false);
  };

  const copyLink = () => {
    if (lastInviteLink) {
      navigator.clipboard.writeText(lastInviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team Management</h2>
          <p className="text-slate-500 mt-1">Control access roles for the Academy finance system.</p>
        </div>
        <button onClick={() => setIsInviting(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"><UserPlus size={20} /> Add Member</button>
      </div>

      {lastInviteLink && (
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2"><Check size={18}/> Invitation Sent Successfully!</h3>
            <button onClick={() => setLastInviteLink(null)}><X size={16}/></button>
          </div>
          <p className="text-sm text-emerald-700 mb-4 italic">Note: In this preview environment, emails are simulated. Share the link below with your team member manually.</p>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-200">
            <input readOnly value={lastInviteLink} className="flex-1 bg-transparent text-xs font-mono text-emerald-600 outline-none" />
            <button onClick={copyLink} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-2 text-xs font-bold">
              {copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {isInviting && (
        <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-blue-900"><Mail /> New Invite</h3>
            <button onClick={() => setIsInviting(false)}><X size={24} /></button>
          </div>
          <form onSubmit={sendInvite} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Email Address</label>
              <input required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@omugwo.academy" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Role</label>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value as any)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="VIEWER">Viewer</option>
                <option value="FINANCE">Finance staff</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <button type="submit" className="py-3.5 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"><Send size={18} /> Send Invite</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50"><h3 className="font-bold flex items-center gap-2 text-emerald-600"><UserCheck size={18} /> Active Members</h3></div>
            <div className="divide-y divide-slate-100">
              {users.map(u => (
                <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">{u.name[0]}</div>
                    <div><p className="font-bold text-slate-900">{u.name}</p><p className="text-sm text-slate-500">{u.email}</p></div>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h3 className="font-bold text-blue-400 flex items-center gap-2 mb-4"><Shield size={18} /> Permissions Matrix</h3>
            <div className="space-y-6">
              <div><p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Admin</p><p className="text-[10px] opacity-60">Full CRUD for categories, partners, budgets, and users.</p></div>
              <div><p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Finance</p><p className="text-[10px] opacity-60">CRUD for transactions and partners. Can set budgets.</p></div>
              <div><p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Viewer</p><p className="text-[10px] opacity-60">Read-only access to Dashboards and Reports.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
