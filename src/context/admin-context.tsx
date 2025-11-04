
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (webId: string, key: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_WEB_ID = 'admindevaura22@gmail.com';
const ADMIN_SECRET_KEY = 'devaura@7790';
const ADMIN_SESSION_KEY = 'dev-aura-admin-session';

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!isUserLoading) {
      try {
        const sessionIsAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
        if (sessionIsAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      }
    }
    setIsLoading(false);
  }, [isUserLoading, user]);

  const login = async (webId: string, key: string): Promise<boolean> => {
    if (webId === ADMIN_WEB_ID && key === ADMIN_SECRET_KEY) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        setIsAdmin(true);
        return true;
      } catch (error) {
        console.error("Admin login failed: Could not set session storage.", error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      if (auth.currentUser?.email === ADMIN_WEB_ID) {
          auth.signOut();
      }
    } catch (error) {
       console.error('Could not remove admin session from sessionStorage:', error);
    }
    setIsAdmin(false);
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
