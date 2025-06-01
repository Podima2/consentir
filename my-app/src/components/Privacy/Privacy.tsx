"use client";

import React, { useState, useCallback } from "react";
import { Home, Settings as SettingsIcon, Image, Shield, Camera, AlertCircle, Loader2, Video, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import AddFace from '@/components/AddFace';
import CameraView from './components/CameraView';
import FaceDetection from './components/FaceDetection';
import PaymentDialog from './components/PaymentDialog';
import SettingsPanel from './components/SettingsPanel';
import type { Tab, RecordingState, CaptureMode, DetectedFace, Settings } from './components/types';

const Privacy: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [gallery, setGallery] = useState<string[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>("photo");
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelLoadProgress, setModelLoadProgress] = useState<string>('');
  const [cameraMode, setCameraMode] = useState<"environment" | "user">("environment");
  const [settings, setSettings] = useState<Settings>({
    autoBlur: false,
    requirePayment: false,
    price: "",
    privacyLevel: "high",
    allowDataSharing: false,
    dataRetentionDays: "30"
  });
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);

  const startCamera = useCallback(() => {
    setError(null);
    setIsCameraOpen(true);
  }, []);

  const stopCamera = useCallback(() => {
    setIsCameraOpen(false);
    if (recordingState === "recording") {
      setRecordingState("idle");
    }
  }, [recordingState]);

  const toggleCamera = useCallback(() => {
    setCameraMode(prev => prev === "environment" ? "user" : "environment");
  }, []);

  const handleCapture = useCallback(async (imageSrc: string) => {
    if (settings.requirePayment) {
      setPendingPhoto(imageSrc);
      setShowPaymentDialog(true);
      return;
    }

    setCapturedImage(imageSrc);
    setGallery(prev => [...prev, imageSrc]);
  }, [settings.requirePayment]);

  const handlePaymentConfirm = useCallback(() => {
    if (pendingPhoto) {
      setCapturedImage(pendingPhoto);
      setGallery(prev => [...prev, pendingPhoto]);
    }
    setShowPaymentDialog(false);
    setPendingPhoto(null);
  }, [pendingPhoto]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isLoadingModels && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{modelLoadProgress || 'Loading face detection models...'}</span>
                </div>
              </div>
            )}

            {!isCameraOpen && !capturedImage && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Privacy Camera</h2>
                <p className="text-gray-600">Capture photos or record videos with automatic face blurring</p>
                
                {/* Mode Selection */}
                <div className="flex gap-2 p-2 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setCaptureMode("photo")}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                      captureMode === "photo" 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-gray-600"
                    }`}
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  <button
                    onClick={() => setCaptureMode("video")}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                      captureMode === "video" 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-gray-600"
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-medium">Video</span>
                  </button>
                </div>

                <button
                  onClick={startCamera}
                  className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-black/90 transition-colors flex items-center justify-center gap-2 text-base font-medium"
                >
                  <Camera className="w-5 h-5" />
                  Open Camera
                </button>
              </div>
            )}

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Captured ${index + 1}`}
                    className="rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        );
      case "gallery":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Gallery</h2>
            {gallery.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No content yet. Start capturing in the Home tab!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((item: string, index: number) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                    {item.startsWith("data:image") ? (
                      <img
                        src={item}
                        alt={`Gallery item ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={item}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "add-face":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Add Face</h2>
            <AddFace />
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Privacy Settings</h2>
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-4 pb-24">
          {renderTabContent()}
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex-1 py-4 flex flex-col items-center gap-1 ${
                activeTab === "home" ? "text-primary" : "text-gray-500"
              }`}
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs font-medium">Capture</span>
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex-1 py-4 flex flex-col items-center gap-1 ${
                activeTab === "gallery" ? "text-primary" : "text-gray-500"
              }`}
            >
              <Image className="w-6 h-6" />
              <span className="text-xs font-medium">Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab("add-face")}
              className={`flex-1 py-4 flex flex-col items-center gap-1 ${
                activeTab === "add-face" ? "text-primary" : "text-gray-500"
              }`}
            >
              <Shield className="w-6 h-6" />
              <span className="text-xs font-medium">Add Face</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-4 flex flex-col items-center gap-1 ${
                activeTab === "settings" ? "text-primary" : "text-gray-500"
              }`}
            >
              <SettingsIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        <LogOut className="w-5 h-5 text-gray-600" />
      </button>

      <CameraView
        isCameraOpen={isCameraOpen}
        cameraMode={cameraMode}
        captureMode={captureMode}
        recordingState={recordingState}
        detectedFaces={detectedFaces}
        onCapture={handleCapture}
        onStopCamera={stopCamera}
        onToggleCamera={toggleCamera}
      />

      <PaymentDialog
        isOpen={showPaymentDialog}
        price={settings.price}
        onClose={() => setShowPaymentDialog(false)}
        onConfirm={handlePaymentConfirm}
      />

      <FaceDetection
        modelsLoaded={modelsLoaded}
        onFacesDetected={setDetectedFaces}
        onFaceDetected={setIsFaceDetected}
        onModelLoadProgress={setModelLoadProgress}
        onModelsLoaded={setModelsLoaded}
        onError={setError}
      />
    </div>
  );
};

export default Privacy;

