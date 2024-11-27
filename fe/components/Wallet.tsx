'use client'

import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletError } from '@solana/wallet-adapter-base'
import { useCallback, useMemo } from "react"
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from "next/dynamic";

function Wallet({ children } : Readonly<{children: React.ReactNode;}>){

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    const onError = useCallback((error: WalletError) => {
      console.error(error)
    }, [])

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
        <WalletProvider wallets={wallets} onError={onError} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
  )
}

export default Wallet

export const WalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
  ssr: false,
})
