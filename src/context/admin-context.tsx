
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from '@/firebase';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (id: string, key: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_ID = 'MAYANK90LM8';
const ADMIN_KEY = 'devaura@7790';
const ADMIN_SESSION_KEY = 'dev-aura-admin-session';

export function AdminProvider({ children }: { children: ReactNode }) {
  const { isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const sessionValue = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionValue === 'true') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.warn('Could not read admin session from sessionStorage:', error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = (id: string, key: string): boolean => {
    if (id === ADMIN_ID && key === ADMIN_KEY) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        setIsAdmin(true);
        return true;
      } catch (error) {
        console.error('Could not save admin session to sessionStorage:', error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setIsAdmin(false);
    } catch (error) {
       console.error('Could not remove admin session from sessionStorage:', error);
    }
  };

  const value = { isAdmin, isLoading: isLoading || isUserLoading, login, logout };

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
