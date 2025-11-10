
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

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
    
    // An admin is identified SOLELY by their email address matching the hardcoded one.
    // This works because the firestore.rules also use this same logic.
    if (firebaseUser && firebaseUser.email === ADMIN_WEB_ID) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);

  }, [firebaseUser, isUserLoading]);


  const adminLogin = async (webId: string, key: string): Promise<boolean> => {
    // IMPORTANT: This is a placeholder for a more secure admin verification.
    // It simply checks if the provided credentials match the hardcoded values.
    // It does NOT perform a Firebase sign-in. For the Firestore rules to work,
    // the person logging in as admin MUST ALREADY BE SIGNED IN to Firebase
    // with the email 'mayanksharma4174@gmail.com' via a standard method (e.g., Google).
    if (webId.toLowerCase() === ADMIN_WEB_ID && key === ADMIN_SECRET_KEY) {
        // We don't sign in here. We just verify the user is logged in with the correct email.
        if (auth.currentUser && auth.currentUser.email === ADMIN_WEB_ID) {
            setIsAdmin(true);
            return true;
        } else {
            // This case means the secret key was right, but they aren't logged in with the admin email.
            // For simplicity, we just fail the login. A better UX would guide them to log in with Google first.
            return false;
        }
    }
    return false;
  };

  const adminLogout = () => {
    // Since admin status is tied to the Firebase user, logging out the Firebase user
    // will automatically revoke admin status.
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
