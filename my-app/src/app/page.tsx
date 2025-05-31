"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { WalletAuthButton } from "@/components/wallet-auth-button";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from "viem";
import { worldchain } from "@/lib/chains";

export default function Page() {
  const { data: session, status } = useSession();
  const [walletConnected, setWalletConnected] = useState(false);
  const [verified, setVerified] = useState(false);
  const [tuteClaimed, setTuteClaimed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [claimCount, setClaimCount] = useState(0);
  const [transactionId, setTransactionId] = useState<string>("");


  // Initialize Viem client
  const client = createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  });

  // Track transaction status
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      client,
      appConfig: {
        app_id: process.env.NEXT_PUBLIC_WLD_APP_ID || "",
      },
      transactionId,
    });

  // Check if user is authenticated when session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user?.address) {
      setWalletConnected(true);
      console.log("User authenticated:", session.user);
    }
  }, [session, status]);


  return (
    <div className="flex flex-col h-[100dvh] bg-white safe-area-inset">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
        <h1 className="text-3xl font-bold text-purple-600">TUTE App</h1>

      </div>
    </div>
  );
}
