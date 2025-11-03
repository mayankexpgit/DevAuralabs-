
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from '@/firebase';
import { signOut, getAuth } from 'firebase/auth';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admindevaura22@gmail.com';
const ADMIN_SESSION_KEY = 'devaura-admin-session';

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isUserLoading);
    if (!isUserLoading) {
      try {
        const sessionIsAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
        if (sessionIsAdmin) {
          setIsAdmin(true);
        } else {
          // Fallback to check if a logged-in Firebase user is the admin
          if (user && user.email === ADMIN_EMAIL) {
            setIsAdmin(true);
            sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
          } else {
            setIsAdmin(false);
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
          }
        }
      } catch (error) {
        console.warn('Could not access sessionStorage:', error);
        setIsAdmin(false);
      }
    }
  }, [user, isUserLoading]);

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
      // Also sign out firebase user if they happen to be the admin
      if (user && user.email === ADMIN_EMAIL) {
          const auth = getAuth();
          signOut(auth);
      }
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
