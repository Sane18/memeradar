"use client";

import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { brand } from "@/lib/brand";
import { AuthContext, type AuthState } from "@/hooks/useAuth";
import type { ReactNode } from "react";

/**
 * Reads live Privy state and injects it into AuthContext.
 * Only rendered when a PrivyProvider is present — safe to call Privy hooks here.
 */
function PrivyAuthBridge({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useSolanaWallets();
  const solanaWallet = wallets?.[0];

  const auth: AuthState = {
    configured: true,
    ready,
    authenticated,
    user,
    solanaAddress: solanaWallet?.address,
    solanaWallet,
    login,
    logout,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Wraps the app in Privy for Google/email sign-in + embedded Solana wallets.
 * If NEXT_PUBLIC_PRIVY_APP_ID is missing, children render with default auth state
 * (configured: false, authenticated: false) — no crash, no blank panels.
 */
export function Providers({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC;

  if (!appId) {
    // AuthContext defaults apply — all useAuth() calls return safe no-op values.
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        ...(rpc
          ? { solanaClusters: [{ name: "mainnet-beta", rpcUrl: rpc }] }
          : {}),
        loginMethods: ["google", "email"],
        appearance: {
          theme: "dark",
          accentColor: brand.colors.primary,
          logo: brand.logo,
          walletChainType: "solana-only",
        },
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
          createOnLogin: "off",
        },
      }}
    >
      <PrivyAuthBridge>{children}</PrivyAuthBridge>
    </PrivyProvider>
  );
}
