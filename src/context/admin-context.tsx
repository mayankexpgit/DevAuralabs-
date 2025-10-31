
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'dev-aura-admin-session';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const login = () => {
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAdmin(true);
    } catch (error) {
      console.error('Could not save admin session to sessionStorage:', error);
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setIsAdmin(false);
    } catch (error) {
      console.error('Could not remove admin session from sessionStorage:', error);
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
