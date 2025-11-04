
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from '@/firebase';
import { signOut, getAuth } from 'firebase/auth';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admindevaura22@gmail.com';

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We are loading as long as the user auth state is loading.
    setIsLoading(isUserLoading);
    if (!isUserLoading) {
      // Once user auth state is resolved, check if the logged-in user is the admin.
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [user, isUserLoading]);

  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setIsAdmin(false);
    });
  };

  const value = { isAdmin, isLoading, logout };

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
