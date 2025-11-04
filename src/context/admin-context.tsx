
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, key: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admindevaura22@gmail.com';
const ADMIN_SESSION_KEY = 'dev-aura-admin-session';

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user: firebaseUser, isUserLoading } = useUser();
  const auth = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!isUserLoading) {
      const sessionIsAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
      const userIsAdmin = firebaseUser?.email === ADMIN_EMAIL;
      
      if (sessionIsAdmin && userIsAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, [firebaseUser, isUserLoading]);

  const login = async (email: string, key: string): Promise<boolean> => {
    if (email !== ADMIN_EMAIL) {
      return false;
    }

    try {
      await signInWithEmailAndPassword(auth, email, key);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error('Admin login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setIsAdmin(false);
    } catch (error) {
       console.error('Admin logout failed:', error);
    }
  };

  const value = { isAdmin, isLoading, login, logout };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
