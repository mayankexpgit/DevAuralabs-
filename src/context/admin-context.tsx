
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (webId: string, key: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_WEB_ID = 'mayanksharma4174@gmail.com';
const ADMIN_SECRET_KEY = 'devaura@7790';

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user: firebaseUser, isUserLoading } = useUser();
  const auth = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      setIsLoading(true);
      return;
    }
    
    if (firebaseUser && firebaseUser.email === ADMIN_WEB_ID) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);
  }, [firebaseUser, isUserLoading]);


  const adminLogin = async (webId: string, key: string): Promise<boolean> => {
    if (webId.toLowerCase() !== ADMIN_WEB_ID || key !== ADMIN_SECRET_KEY) {
        return false;
    }
    
    try {
        await signInWithEmailAndPassword(auth, webId, key);
        return true;
    } catch (error) {
        console.error("Admin sign-in failed", error);
        return false;
    }
  };

  const adminLogout = () => {
    signOut(auth);
    setIsAdmin(false);
  };

  const value = { isAdmin, isLoading, login: adminLogin, logout: adminLogout };

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
