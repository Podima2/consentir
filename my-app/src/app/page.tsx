"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { WalletAuthButton } from "@/components/wallet-auth-button";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from "viem";
import { worldchain } from "@/lib/chains";

declare module "next-auth" {
  interface Session {
    user?: {
      address?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export default function Page() {
  const { data: session, status } = useSession();
  const [walletConnected, setWalletConnected] = useState(false);

  // Initialize Viem client
  const client = createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  });

    useEffect(() => {
      if (status === "authenticated" && session?.user?.address) {
        setWalletConnected(true);
        console.log("User authenticated:", session.user);
      }
    }, [session, status]);


  // Handle wallet connection success
  const handleWalletConnected = () => {
    setWalletConnected(true);
    console.log("Wallet connected");
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white safe-area-inset">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
        {!walletConnected ?   <WalletAuthButton onSuccess={handleWalletConnected} /> :
         <>
         hello
        </>}
      </div>
    </div>
  );
}
