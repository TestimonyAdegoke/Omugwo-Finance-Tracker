export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          type: 'INCOME' | 'EXPENSE'
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'INCOME' | 'EXPENSE'
          color: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'INCOME' | 'EXPENSE'
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          amount: number
          date: string
          category_id: string
          type: 'INCOME' | 'EXPENSE'
          payment_method: string
          source: string | null
          description: string | null
          partner_id: string | null
          recurring_id: string | null
          tags: string[] | null
          attachment: string | null
          currency_code: string
          original_amount: number | null
          exchange_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          date: string
          category_id: string
          type: 'INCOME' | 'EXPENSE'
          payment_method: string
          source?: string | null
          description?: string | null
          partner_id?: string | null
          recurring_id?: string | null
          tags?: string[] | null
          attachment?: string | null
          currency_code?: string
          original_amount?: number | null
          exchange_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          date?: string
          category_id?: string
          type?: 'INCOME' | 'EXPENSE'
          payment_method?: string
          source?: string | null
          description?: string | null
          partner_id?: string | null
          recurring_id?: string | null
          tags?: string[] | null
          attachment?: string | null
          currency_code?: string
          original_amount?: number | null
          exchange_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          name: string
          type: 'CUSTOMER' | 'VENDOR' | 'SPONSOR' | 'OTHER'
          email: string | null
          phone: string | null
          address: string | null
          website: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'CUSTOMER' | 'VENDOR' | 'SPONSOR' | 'OTHER'
          email?: string | null
          phone?: string | null
          address?: string | null
          website?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'CUSTOMER' | 'VENDOR' | 'SPONSOR' | 'OTHER'
          email?: string | null
          phone?: string | null
          address?: string | null
          website?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          category_id: string
          monthly_limit: number
          month: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          monthly_limit: number
          month: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          monthly_limit?: number
          month?: string
          created_at?: string
          updated_at?: string
        }
      }
      recurring_schedules: {
        Row: {
          id: string
          template_transaction_id: string
          frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          start_date: string
          next_occurrence: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template_transaction_id: string
          frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          start_date: string
          next_occurrence: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_transaction_id?: string
          frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          start_date?: string
          next_occurrence?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          auth_id: string | null
          name: string
          email: string
          role: 'ADMIN' | 'FINANCE' | 'VIEWER'
          status: 'ACTIVE' | 'PENDING' | 'INACTIVE'
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          name: string
          email: string
          role?: 'ADMIN' | 'FINANCE' | 'VIEWER'
          status?: 'ACTIVE' | 'PENDING' | 'INACTIVE'
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          name?: string
          email?: string
          role?: 'ADMIN' | 'FINANCE' | 'VIEWER'
          status?: 'ACTIVE' | 'PENDING' | 'INACTIVE'
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      invites: {
        Row: {
          id: string
          email: string
          role: 'ADMIN' | 'FINANCE' | 'VIEWER'
          sent_at: string
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'ADMIN' | 'FINANCE' | 'VIEWER'
          sent_at?: string
          accepted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'ADMIN' | 'FINANCE' | 'VIEWER'
          sent_at?: string
          accepted_at?: string | null
          created_at?: string
        }
      }
      app_settings: {
        Row: {
          id: number
          default_currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      transaction_type: 'INCOME' | 'EXPENSE'
      partner_type: 'CUSTOMER' | 'VENDOR' | 'SPONSOR' | 'OTHER'
      recurring_frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
      user_role: 'ADMIN' | 'FINANCE' | 'VIEWER'
      user_status: 'ACTIVE' | 'PENDING' | 'INACTIVE'
    }
  }
}
