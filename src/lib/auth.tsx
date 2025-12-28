import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(user: SupabaseUser, profile: { name: string; role: UserRole }): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    name: profile.name,
    role: profile.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (mounted && session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(mapSupabaseUser(session.user, profile));
        }
      }
      if (mounted) setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(mapSupabaseUser(session.user, profile));
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(mapSupabaseUser(session.user, profile));
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (authUser: AuthUser) => {
    setUser(authUser);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth service functions
export class AuthService {
  static mapUser(user: SupabaseUser, profile: { name: string; role: UserRole }): AuthUser {
    return mapSupabaseUser(user, profile);
  }

  static async sendOtp(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  }

  static async register(
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) {
    // Create user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      role,
    });
    if (profileError) throw profileError;

    return { user: data.user, profile: { name, role } };
  }

  static async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) throw profileError;

    return { user: data.user, profile };
  }
}
