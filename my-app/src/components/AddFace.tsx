import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Camera, RotateCcw } from 'lucide-react';

export default function AddFace() {
  const [name, setName] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraMode, setCameraMode] = useState<"environment" | "user">("user");
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: cameraMode
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      setMessage('Loading face detection models...');
      
      // Load face-api models with specific paths
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition');
      
      setModelsLoaded(true);
      setMessage('');
    } catch (error) {
      console.error('Error starting camera:', error);
      setMessage('Error loading face detection models. Please refresh the page and try again.');
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    setIsCameraOpen(false);
  };

  const captureAndAddFace = async () => {
    if (!webcamRef.current || !modelsLoaded) {
      setMessage('Camera or face detection models not ready. Please try again.');
      return;
    }

    try {
      setIsProcessing(true);
      setMessage('Processing...');

      // Capture image
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      // Create image element
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load captured image'));
      });

      // Detect face with lower threshold for better detection
      const detections = await faceapi.detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 416,
          scoreThreshold: 0.3 
        })
      ).withFaceLandmarks().withFaceDescriptor();

      if (!detections) {
        throw new Error('No face detected. Please try again with better lighting and positioning.');
      }

      // Add face to database
      const response = await fetch('/api/add-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faceData: Array.from(detections.descriptor),
          name: name.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add face');
      }

      setMessage('Face added successfully!');
      setName('');
      stopCamera();
    } catch (error) {
      console.error('Error adding face:', error);
      setMessage(error instanceof Error ? error.message : 'Error adding face');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Face to Database</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Name (optional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-xl"
          placeholder="Enter name for the face"
        />
      </div>

      {!isCameraOpen ? (
        <button
          onClick={startCamera}
          className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-black/90 transition-colors flex items-center justify-center gap-2 text-base font-medium"
        >
          <Camera className="w-5 h-5" />
          Open Camera
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover rounded"
              videoConstraints={videoConstraints}
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setCameraMode(prev => prev === "environment" ? "user" : "environment")}
                className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={captureAndAddFace}
              disabled={isProcessing || !modelsLoaded}
              className="flex-1 bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Capture & Add Face'}
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 bg-red-500 text-white p-2 rounded-xl hover:bg-red-600"
            >
              Close Camera
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-2 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
} 