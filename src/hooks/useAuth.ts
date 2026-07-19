"use client";

import { createContext, useContext } from "react";

export type AuthState = {
  configured: boolean;
  ready: boolean;
  authenticated: boolean;
  user: any;
  solanaAddress: string | undefined;
  solanaWallet: any;
  login: () => void;
  logout: () => void;
};

export const defaultAuth: AuthState = {
  configured: false,
  ready: true,
  authenticated: false,
  user: null,
  solanaAddress: undefined,
  solanaWallet: undefined,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthState>(defaultAuth);

/** Read auth state anywhere in the tree — safe even when Privy is not configured. */
export function useAuth(): AuthState {
  return useContext(AuthContext);
}
