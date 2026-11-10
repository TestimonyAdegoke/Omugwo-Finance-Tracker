import React, { useState } from 'react';
import { UserPlus, Mail, Shield, Trash2, Clock, UserCheck, X, Send, Copy, ExternalLink, Check, Loader2 } from 'lucide-react';
import { User, Invite, UserRole } from '../types';
import { userService, inviteService } from '../lib/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('VIEWER');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'PENDING' | 'INACTIVE'>('ACTIVE');

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsLoading(true);
    setError(null);
    try {
      let newInvite: Invite;
      if (isSupabaseConfigured) {
        newInvite = await inviteService.create({
          email: inviteEmail,
          role: inviteRole,
          sentAt: new Date().toISOString().split('T')[0]
        });
      } else {
        newInvite = {
          id: Math.random().toString(36).substr(2, 9),
          email: inviteEmail,
          role: inviteRole,
          sentAt: new Date().toISOString().split('T')[0]
        };
      }
      setInvites([...invites, newInvite]);
      setLastInviteLink(`https://omugwo.academy/invite/${newInvite.id}`);
      setInviteEmail('');
      setIsInviting(false);
    } catch (err) {
      console.error('Error sending invite:', err);
      setError('Failed to send invite');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditUser = (u: User) => {
    setEditingUserId(u.id);
    setEditRole(u.role);
    setEditStatus(u.status);
  };

  const saveUserEdits = async () => {
    if (!editingUserId) return;
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        const updated = await userService.update(editingUserId, { role: editRole, status: editStatus });
        setUsers(users.map(u => u.id === editingUserId ? updated : u));
      } else {
        setUsers(users.map(u => u.id === editingUserId ? { ...u, role: editRole, status: editStatus } : u));
      }
      setEditingUserId(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        await userService.delete(id);
      }
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelInvite = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        await inviteService.delete(id);
      }
      setInvites(invites.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error cancelling invite:', err);
      setError('Failed to cancel invite');
    } finally {
      setIsLoading(false);
    }
  };

  const markInviteAccepted = async (invite: Invite) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        await inviteService.accept(invite.id);
        const newUser = await userService.create({
          name: invite.email.split('@')[0],
          email: invite.email,
          role: invite.role,
          status: 'ACTIVE',
          joinedAt: new Date().toISOString().split('T')[0]
        });
        setUsers([...users, newUser]);
      } else {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: invite.email.split('@')[0],
          email: invite.email,
          role: invite.role,
          status: 'ACTIVE',
          joinedAt: new Date().toISOString().split('T')[0]
        };
        setUsers([...users, newUser]);
      }
      setInvites(invites.filter(i => i.id !== invite.id));
    } catch (err) {
      console.error('Error marking invite accepted:', err);
      setError('Failed to mark invite as accepted');
    } finally {
      setIsLoading(false);
    }
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
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-sm text-slate-500">{u.email}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Joined {u.joinedAt}</p>
                    </div>
                  </div>
                  {editingUserId === u.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editRole}
                        onChange={e => setEditRole(e.target.value as UserRole)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs"
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="FINANCE">Finance</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as any)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING">Pending</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                      <button onClick={saveUserEdits} className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white">Save</button>
                      <button onClick={() => setEditingUserId(null)} className="px-2 py-1 text-xs text-slate-400">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</div>
                      <button onClick={() => startEditUser(u)} className="text-slate-300 hover:text-blue-600 text-xs">Edit</button>
                      <button onClick={() => deleteUser(u.id)} className="text-slate-300 hover:text-rose-600 text-xs">Remove</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {error && (
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-900"><Clock size={18} /> Pending Invites</h3>
            {invites.length === 0 ? (
              <p className="text-sm text-slate-500">No outstanding invitations.</p>
            ) : (
              <div className="space-y-4">
                {invites.map(invite => (
                  <div key={invite.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{invite.email}</p>
                      <p className="text-[10px] uppercase text-slate-400">Role: {invite.role}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <button onClick={() => markInviteAccepted(invite)} className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">Mark Joined</button>
                      <button onClick={() => cancelInvite(invite.id)} className="px-2 py-1 rounded-full bg-rose-50 text-rose-600 font-bold">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
