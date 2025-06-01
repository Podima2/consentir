"use client";

import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, X, RotateCcw, Video, Image as ImageIcon } from "lucide-react";
import type { CaptureMode, DetectedFace } from "./types";

interface CameraViewProps {
  isCameraOpen: boolean;
  cameraMode: "environment" | "user";
  captureMode: CaptureMode;
  recordingState: "idle" | "recording" | "processing";
  detectedFaces: DetectedFace[];
  onCapture: (imageSrc: string) => void;
  onStopCamera: () => void;
  onToggleCamera: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  isCameraOpen,
  cameraMode,
  captureMode,
  recordingState,
  detectedFaces,
  onCapture,
  onStopCamera,
  onToggleCamera,
}) => {
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: cameraMode
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  if (!isCameraOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative h-full">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />
        
        {/* Face detection boxes */}
        {detectedFaces.map((face, index) => (
          <div
            key={index}
            className="absolute border-2 border-green-500"
            style={{
              left: face.x,
              top: face.y,
              width: face.width,
              height: face.height,
            }}
          />
        ))}

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={onStopCamera}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={24} />
          </button>
          <button
            onClick={onToggleCamera}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-md mx-auto px-4">
            <div className="flex justify-center gap-8">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                {captureMode === "photo" ? (
                  <ImageIcon className="w-8 h-8 text-gray-900" />
                ) : (
                  <Video className="w-8 h-8 text-gray-900" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView; 