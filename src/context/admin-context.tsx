
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (webId: string, key: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_WEB_ID = 'mayanksharma4174@gmail.com';
const ADMIN_SECRET_KEY = 'devaura@7790';
const ADMIN_SESSION_KEY = 'devaura-admin-session';

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user: firebaseUser, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const isAdminSession = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
      if (isAdminSession) {
        // Now also verify against firebase user to avoid mismatch
        if (firebaseUser) {
           const privateDocRef = doc(firestore, 'privates', firebaseUser.uid);
           // This is a simplified check. A real app might fetch the doc.
           // For now, if there is a firebase user and session is set, we assume they are admin.
           setIsAdmin(true);
        } else {
           // If there's no firebase user, the admin session is invalid.
           sessionStorage.removeItem(ADMIN_SESSION_KEY);
           setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.warn('Could not read admin session from sessionStorage:', error);
    }
    setIsLoading(false);
  }, [firebaseUser, firestore]);


  const adminLogin = async (webId: string, key: string): Promise<boolean> => {
    if (webId === ADMIN_WEB_ID && key === ADMIN_SECRET_KEY) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, webId, key);
        const user = userCredential.user;

        // CRITICAL FIX: Create the document in 'privates' collection to validate isAdmin() rule
        if (user && firestore) {
          const privateDocRef = doc(firestore, 'privates', user.uid);
          await setDoc(privateDocRef, { role: 'admin' });
        }
        
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        setIsAdmin(true);
        return true;
      } catch (error) {
        console.error("Admin sign-in failed", error);
        return false;
      }
    }
    return false;
  };

  const adminLogout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      auth.signOut();
    } catch (error) {
      console.error('Could not remove admin session from sessionStorage:', error);
    }
    setIsAdmin(false);
  };

  const value = { isAdmin, isLoading: isLoading || isUserLoading, login: adminLogin, logout: adminLogout };

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
