import { supabase } from './supabase';
import type { 
  Transaction, 
  Category, 
  Partner, 
  Budget, 
  User, 
  Invite, 
  RecurringSchedule 
} from '../types';

// ==================== CATEGORIES ====================

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return (data || []).map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      color: c.color
    }));
  },

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        type: category.type,
        color: category.color
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      color: data.color
    };
  },

  async update(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        type: updates.type,
        color: updates.color,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      color: data.color
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ==================== TRANSACTIONS ====================

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(t => ({
      id: t.id,
      amount: t.amount,
      date: t.date,
      categoryId: t.category_id,
      type: t.type,
      paymentMethod: t.payment_method,
      source: t.source || undefined,
      description: t.description || '',
      partnerId: t.partner_id || undefined,
      recurringId: t.recurring_id || undefined,
      tags: t.tags || undefined,
      attachment: t.attachment || undefined,
      currencyCode: t.currency_code,
      originalAmount: t.original_amount ?? undefined,
      exchangeRate: t.exchange_rate ?? undefined
    }));
  },

  async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        amount: transaction.amount,
        date: transaction.date,
        category_id: transaction.categoryId,
        type: transaction.type,
        payment_method: transaction.paymentMethod,
        source: transaction.source || null,
        description: transaction.description || null,
        partner_id: transaction.partnerId || null,
        recurring_id: transaction.recurringId || null,
        tags: transaction.tags || null,
        attachment: transaction.attachment || null,
        currency_code: transaction.currencyCode || 'NGN',
        original_amount: transaction.originalAmount ?? null,
        exchange_rate: transaction.exchangeRate ?? null
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      amount: data.amount,
      date: data.date,
      categoryId: data.category_id,
      type: data.type,
      paymentMethod: data.payment_method,
      source: data.source || undefined,
      description: data.description || '',
      partnerId: data.partner_id || undefined,
      recurringId: data.recurring_id || undefined,
      tags: data.tags || undefined,
      attachment: data.attachment || undefined,
      currencyCode: data.currency_code,
      originalAmount: data.original_amount ?? undefined,
      exchangeRate: data.exchange_rate ?? undefined
    };
  },

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };
    
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
    if (updates.source !== undefined) updateData.source = updates.source || null;
    if (updates.description !== undefined) updateData.description = updates.description || null;
    if (updates.partnerId !== undefined) updateData.partner_id = updates.partnerId || null;
    if (updates.tags !== undefined) updateData.tags = updates.tags || null;
    if (updates.attachment !== undefined) updateData.attachment = updates.attachment || null;
    if (updates.currencyCode !== undefined) updateData.currency_code = updates.currencyCode;
    if (updates.originalAmount !== undefined) updateData.original_amount = updates.originalAmount ?? null;
    if (updates.exchangeRate !== undefined) updateData.exchange_rate = updates.exchangeRate ?? null;

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      amount: data.amount,
      date: data.date,
      categoryId: data.category_id,
      type: data.type,
      paymentMethod: data.payment_method,
      source: data.source || undefined,
      description: data.description || '',
      partnerId: data.partner_id || undefined,
      recurringId: data.recurring_id || undefined,
      tags: data.tags || undefined,
      attachment: data.attachment || undefined,
      currencyCode: data.currency_code,
      originalAmount: data.original_amount ?? undefined,
      exchangeRate: data.exchange_rate ?? undefined
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ==================== PARTNERS ====================

export const partnerService = {
  async getAll(): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      email: p.email || undefined,
      phone: p.phone || undefined,
      address: p.address || undefined,
      website: p.website || undefined,
      notes: p.notes || undefined
    }));
  },

  async create(partner: Omit<Partner, 'id'>): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .insert({
        name: partner.name,
        type: partner.type,
        email: partner.email || null,
        phone: partner.phone || null,
        address: partner.address || null,
        website: partner.website || null,
        notes: partner.notes || null
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      website: data.website || undefined,
      notes: data.notes || undefined
    };
  },

  async update(id: string, updates: Partial<Partner>): Promise<Partner> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.email !== undefined) updateData.email = updates.email || null;
    if (updates.phone !== undefined) updateData.phone = updates.phone || null;
    if (updates.address !== undefined) updateData.address = updates.address || null;
    if (updates.website !== undefined) updateData.website = updates.website || null;
    if (updates.notes !== undefined) updateData.notes = updates.notes || null;

    const { data, error } = await supabase
      .from('partners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      website: data.website || undefined,
      notes: data.notes || undefined
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ==================== BUDGETS ====================

export const budgetService = {
  async getAll(month?: string): Promise<Budget[]> {
    let query = supabase.from('budgets').select('*');
    
    if (month) {
      query = query.eq('month', month);
    }
    
    const { data, error } = await query.order('created_at');
    
    if (error) throw error;
    return (data || []).map(b => ({
      categoryId: b.category_id,
      monthlyLimit: b.monthly_limit
    }));
  },

  async upsert(budgets: Budget[], month: string): Promise<Budget[]> {
    // Delete existing budgets for the month first
    await supabase.from('budgets').delete().eq('month', month);
    
    if (budgets.length === 0) return [];
    
    const { data, error } = await supabase
      .from('budgets')
      .insert(budgets.map(b => ({
        category_id: b.categoryId,
        monthly_limit: b.monthlyLimit,
        month: month
      })))
      .select();
    
    if (error) throw error;
    return (data || []).map(b => ({
      categoryId: b.category_id,
      monthlyLimit: b.monthly_limit
    }));
  },

  async delete(categoryId: string, month: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('category_id', categoryId)
      .eq('month', month);
    
    if (error) throw error;
  }
};

// ==================== RECURRING SCHEDULES ====================

export const recurringService = {
  async getAll(): Promise<RecurringSchedule[]> {
    const { data, error } = await supabase
      .from('recurring_schedules')
      .select('*')
      .order('created_at');
    
    if (error) throw error;
    return (data || []).map(r => ({
      id: r.id,
      templateTransactionId: r.template_transaction_id,
      frequency: r.frequency,
      startDate: r.start_date,
      nextOccurrence: r.next_occurrence,
      isActive: r.is_active
    }));
  },

  async create(schedule: Omit<RecurringSchedule, 'id'>): Promise<RecurringSchedule> {
    const { data, error } = await supabase
      .from('recurring_schedules')
      .insert({
        template_transaction_id: schedule.templateTransactionId,
        frequency: schedule.frequency,
        start_date: schedule.startDate,
        next_occurrence: schedule.nextOccurrence,
        is_active: schedule.isActive
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      templateTransactionId: data.template_transaction_id,
      frequency: data.frequency,
      startDate: data.start_date,
      nextOccurrence: data.next_occurrence,
      isActive: data.is_active
    };
  },

  async update(id: string, updates: Partial<RecurringSchedule>): Promise<RecurringSchedule> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };
    
    if (updates.nextOccurrence !== undefined) updateData.next_occurrence = updates.nextOccurrence;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.frequency !== undefined) updateData.frequency = updates.frequency;

    const { data, error } = await supabase
      .from('recurring_schedules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      templateTransactionId: data.template_transaction_id,
      frequency: data.frequency,
      startDate: data.start_date,
      nextOccurrence: data.next_occurrence,
      isActive: data.is_active
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('recurring_schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ==================== USERS ====================

export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      joinedAt: u.joined_at
    }));
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        joined_at: user.joinedAt
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      joinedAt: data.joined_at
    };
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      joinedAt: data.joined_at
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ==================== INVITES ====================

export const inviteService = {
  async getAll(): Promise<Invite[]> {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .is('accepted_at', null)
      .order('sent_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(i => ({
      id: i.id,
      email: i.email,
      role: i.role,
      sentAt: i.sent_at
    }));
  },

  async create(invite: Omit<Invite, 'id'>): Promise<Invite> {
    const { data, error } = await supabase
      .from('invites')
      .insert({
        email: invite.email,
        role: invite.role,
        sent_at: invite.sentAt
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      email: data.email,
      role: data.role,
      sentAt: data.sent_at
    };
  },

  async accept(id: string): Promise<void> {
    const { error } = await supabase
      .from('invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('invites')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ==================== APP SETTINGS ====================

export const appSettingsService = {
  async get(): Promise<{ defaultCurrency: string }> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1);

    if (error) throw error;
    const row = data && data.length > 0 ? data[0] : null;
    return {
      defaultCurrency: row?.default_currency || 'NGN'
    };
  },

  async updateDefaultCurrency(defaultCurrency: string): Promise<{ defaultCurrency: string }> {
    const { data, error } = await supabase
      .from('app_settings')
      .upsert({ id: 1, default_currency: defaultCurrency }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return {
      defaultCurrency: data.default_currency
    };
  }
};

// ==================== AUTH ====================

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
