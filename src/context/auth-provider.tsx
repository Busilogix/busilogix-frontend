"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useHasAccessToken } from "@/hooks/use-has-access-token";
import { authService } from "@/lib/api/auth.service";
import { isApiError } from "@/lib/api/errors";
import { storeService } from "@/lib/api/store.service";
import { subscribeToAuthChanges } from "@/lib/api/token-storage";

const USER_EMAIL_KEY = "busilogix_user_email";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getStoredUserEmail(): string | null {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem(USER_EMAIL_KEY);
}

function setStoredUserEmail(email: string): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(USER_EMAIL_KEY, email);
}

function clearStoredUserEmail(): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.removeItem(USER_EMAIL_KEY);
}

type AuthContextValue = {
  isAuthenticated: boolean;
  userEmail: string | null;
  setUserEmail: (email: string) => void;
  logout: () => void;
  hasStore: boolean | null;
  isCheckingStore: boolean;
  setHasStore: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmailState] = useState<string | null>(null);
  const isAuthenticated = useHasAccessToken();
  const [hasStore, setHasStoreState] = useState<boolean | null>(null);
  const [isCheckingStore, setIsCheckingStore] = useState(true);

  useEffect(() => {
    setUserEmailState(getStoredUserEmail());

    return subscribeToAuthChanges(() => {
      setUserEmailState(getStoredUserEmail());
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setHasStoreState(null);
      setIsCheckingStore(false);
      return;
    }

    let active = true;
    async function checkStore() {
      setIsCheckingStore(true);
      try {
        await storeService.getMe();
        if (active) {
          setHasStoreState(true);
        }
      } catch (error) {
        if (active) {
          if (isApiError(error) && error.statusCode === 404) {
            setHasStoreState(false);
          } else {
            setHasStoreState(false);
          }
        }
      } finally {
        if (active) {
          setIsCheckingStore(false);
        }
      }
    }

    void checkStore();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const setUserEmail = useCallback((email: string) => {
    setStoredUserEmail(email);
    setUserEmailState(email);
  }, []);

  const setHasStore = useCallback((value: boolean) => {
    setHasStoreState(value);
  }, []);

  const logout = useCallback(() => {
    clearStoredUserEmail();
    setUserEmailState(null);
    setHasStoreState(null);
    setIsCheckingStore(true);
    authService.logout();

    const loginPath = `${window.location.origin}/login`;
    window.location.href = loginPath;
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      userEmail,
      setUserEmail,
      logout,
      hasStore,
      isCheckingStore,
      setHasStore,
    }),
    [
      isAuthenticated,
      userEmail,
      setUserEmail,
      logout,
      hasStore,
      isCheckingStore,
      setHasStore,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

