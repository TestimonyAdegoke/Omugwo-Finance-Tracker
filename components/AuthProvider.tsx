import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface TrackerStaff {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'FINANCE' | 'VIEWER';
  staff_id: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  staffProfile: TrackerStaff | null;
  loading: boolean;
  isDemo: boolean;
  /** True if the user has been verified as an Omugwo staff member */
  isStaff: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@omugwo.academy',
  user_metadata: { name: 'Demo User' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString()
} as unknown as User;

const DEMO_STAFF: TrackerStaff = {
  id: 'demo-staff-id',
  auth_id: 'demo-user-id',
  name: 'Demo Admin',
  email: 'demo@omugwo.academy',
  role: 'ADMIN',
  staff_id: 'OMS-00001',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [staffProfile, setStaffProfile] = useState<TrackerStaff | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isSupabaseConfigured;

  /** Fetch the tracker staff profile for the authenticated Supabase user */
  const fetchStaffProfile = async (authUser: User): Promise<TrackerStaff | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();

    if (error || !data) return null;
    return data as TrackerStaff;
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode
      const demoSession = localStorage.getItem('omugwo_demo_session');
      if (demoSession) {
        setUser(DEMO_USER);
        setStaffProfile(DEMO_STAFF);
      }
      setLoading(false);
      return;
    }

    // Real Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const staff = await fetchStaffProfile(session.user);
        setStaffProfile(staff);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const staff = await fetchStaffProfile(session.user);
        setStaffProfile(staff);
      } else {
        setStaffProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('omugwo_demo_session', 'true');
      setUser(DEMO_USER);
      setStaffProfile(DEMO_STAFF);
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Verify the user is tracker staff
    if (data.user) {
      const staff = await fetchStaffProfile(data.user);
      if (!staff) {
        // Not a tracker staff member – sign them out and throw
        await supabase.auth.signOut();
        throw new Error('STAFF_ACCESS_ONLY');
      }
      setStaffProfile(staff);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('omugwo_demo_session', 'true');
      setUser(DEMO_USER);
      setStaffProfile(DEMO_STAFF);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw error;
    // Note: signUp alone doesn't grant tracker access. An ADMIN must add the user
    // to the tracker's users table via Supabase dashboard or the UserManager.
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('omugwo_demo_session');
      setUser(null);
      setStaffProfile(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setStaffProfile(null);
  };

  const isStaff = isDemo || !!staffProfile;

  return (
    <AuthContext.Provider value={{ user, session, staffProfile, loading, isDemo, isStaff, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
