"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";
import { LogIn, Shield } from "lucide-react";

interface WalletAuthButtonProps {
  onSuccess?: () => void;
}

export function WalletAuthButton({ onSuccess }: WalletAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletAuth = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/nonce");
      const { nonce } = await res.json();
      console.log("nonce", nonce);
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        expirationTime: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
        statement: "Sign in with your World ID wallet",
      });

      if (finalPayload.status === "error") {
        throw new Error(finalPayload.error_code);
      }

      const verifyRes = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      });
      console.log("verifyRes", verifyRes);
      const verification = await verifyRes.json();
      console.log("verification", verification);

      if (verification.isValid) {
        await signIn("worldcoin-wallet", {
          message: finalPayload.message,
          signature: finalPayload.signature,
          address: finalPayload.address,
          nonce,
          redirect: false,
        });

        // Call onSuccess if provided
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Wallet auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-lg space-y-10">
      {/* Header Badge */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm shadow-sm">
          <Shield className="w-5 h-5" />
          Privacy-First Camera
        </div>
  
        {/* Heading & Description */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
              Secure Capture
            </span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your privacy matters. Sign in to access our secure camera with automatic face blurring and privacy controls.
          </p>
        </div>
      </div>
  
      {/* Main Card */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl opacity-50"></div>
        <div className="relative z-10 bg-white border rounded-3xl shadow-lg p-8 space-y-8">
          
          {/* Feature Card */}
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 space-y-3">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Privacy-First Features
                </h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside pt-2">
                  <li>Automatic face blurring</li>
                  <li>Secure media storage</li>
                  <li>Privacy controls</li>
                  <li>No data sharing</li>
                </ul>
              </div>
            </div>
          </div>
  
          {/* Auth Button */}
          <button
            onClick={handleWalletAuth}
            disabled={isLoading}
            className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-base shadow-md hover:shadow-xl group disabled:opacity-50"
          >
            <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            Sign In
          </button>
  
          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our Privacy Policy and Terms of Service.
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}
