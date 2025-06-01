"use client";

import React, { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import type { Settings } from "./types";
import { MiniKit } from "@worldcoin/minikit-js";

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof Settings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const updateSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Starting settings update with:', settings);
      
      // Convert price to wei if it's a number
      const priceInWei = settings.price ? (parseFloat(settings.price) * 1e18).toString() : "0";
      console.log('Price in wei:', priceInWei);

      // Convert data retention days to number
      const retentionDays = parseInt(settings.dataRetentionDays) || 30;
      console.log('Retention days:', retentionDays);

      const transaction = {
        address: '0x7FD7D4781690E5FC90910B83De93887B6EF84eA5',
        abi: [
          {
            "inputs": [
              { "internalType": "bool", "name": "_autoBlur", "type": "bool" },
              { "internalType": "bool", "name": "_requirePayment", "type": "bool" },
              { "internalType": "uint256", "name": "_price", "type": "uint256" },
              { "internalType": "string", "name": "_privacyLevel", "type": "string" },
              { "internalType": "bool", "name": "_allowDataSharing", "type": "bool" },
              { "internalType": "uint256", "name": "_dataRetentionDays", "type": "uint256" }
            ],
            "name": "updatePrivacySettings",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'updatePrivacySettings',
        args: [
          settings.autoBlur,
          settings.requirePayment,
          priceInWei,
          settings.privacyLevel,
          settings.allowDataSharing,
          retentionDays
        ],
      };

      console.log('Sending transaction with args:', transaction.args);

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [transaction],
      });

      console.log('Transaction sent:', finalPayload);
      
      // Wait for transaction to be mined
      if (finalPayload && 'transactionHash' in finalPayload) {
        console.log('Waiting for transaction to be mined:', finalPayload.transactionHash);
        // You might want to add a way to check transaction status here
      }

      alert('Settings update transaction sent! Check your wallet for confirmation.');
    } catch (error) {
      console.error('Error updating settings:', error);
      let errorMessage = 'Failed to update settings';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Handle specific error cases
        if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by user';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for transaction';
        }
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm flex items-start gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Auto Blur */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Auto Blur</h3>
            <p className="text-sm text-gray-500">Automatically blur faces in captured media</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBlur}
              onChange={(e) => handleChange("autoBlur", e.target.checked)}
              className="sr-only peer"
              disabled={isLoading}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">Require Payment</h3>
            <p className="text-sm text-gray-500">Charge users for accessing captured media</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requirePayment}
              onChange={(e) => handleChange("requirePayment", e.target.checked)}
              className="sr-only peer"
              disabled={isLoading}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {settings.requirePayment && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={settings.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="block w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      {/* Privacy Level */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Privacy Level</h3>
          <p className="text-sm text-gray-500">Set the level of privacy protection</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleChange("privacyLevel", "low")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                settings.privacyLevel === "low"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={isLoading}
            >
              Low
            </button>
            <button
              onClick={() => handleChange("privacyLevel", "medium")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                settings.privacyLevel === "medium"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={isLoading}
            >
              Medium
            </button>
            <button
              onClick={() => handleChange("privacyLevel", "high")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                settings.privacyLevel === "high"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={isLoading}
            >
              High
            </button>
          </div>
        </div>
      </div>

      {/* Data Settings */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">Allow Data Sharing</h3>
            <p className="text-sm text-gray-500">Share anonymized data for research</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowDataSharing}
              onChange={(e) => handleChange("allowDataSharing", e.target.checked)}
              className="sr-only peer"
              disabled={isLoading}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Data Retention (days)</label>
          <div className="relative">
            <input
              type="number"
              value={settings.dataRetentionDays}
              onChange={(e) => handleChange("dataRetentionDays", e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="30"
              min="1"
              max="365"
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">days</span>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <button
        onClick={updateSettings}
        disabled={isLoading}
        className="w-full bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Updating Settings...</span>
          </>
        ) : (
          <span>Update Privacy Settings</span>
        )}
      </button>
    </div>
  );
};

export default SettingsPanel;