"use client";

import { useEffect } from "react";
import * as faceapi from 'face-api.js';
import type { DetectedFace } from "./types";

interface FaceDetectionProps {
  modelsLoaded: boolean;
  onFacesDetected: (faces: DetectedFace[]) => void;
  onFaceDetected: (detected: boolean) => void;
  onModelLoadProgress: (progress: string) => void;
  onModelsLoaded: (loaded: boolean) => void;
  onError: (error: string) => void;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({
  modelsLoaded,
  onFacesDetected,
  onFaceDetected,
  onModelLoadProgress,
  onModelsLoaded,
  onError,
}) => {
  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      try {
        onModelLoadProgress('Initializing...');

        const options = new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 416,
          scoreThreshold: 0.5 
        });

        try {
          onModelLoadProgress('Loading face detector...');
          await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector');
          if (!isMounted) return;

          onModelLoadProgress('Loading face landmarks...');
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68');
          if (!isMounted) return;

          onModelLoadProgress('Loading face recognition...');
          await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition');
          if (!isMounted) return;

          onModelLoadProgress('Models loaded successfully');
          onModelsLoaded(true);
        } catch (modelError) {
          console.error('Model loading error:', modelError);
          throw modelError;
        }
      } catch (error) {
        console.error('Error in model loading:', error);
        if (isMounted) {
          onError(
            error instanceof Error 
              ? `Model loading failed: ${error.message}`
              : 'Failed to load face detection models. Please refresh the page.'
          );
          onModelsLoaded(false);
        }
      }
    };

    loadModels();

    return () => {
      isMounted = false;
    };
  }, [onModelLoadProgress, onModelsLoaded, onError]);

  const detectFaces = async (imageElement: HTMLImageElement) => {
    if (!modelsLoaded || !imageElement) {
      console.log('Models not loaded or image element not available');
      return;
    }

    try {
      const options = new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 416,
        scoreThreshold: 0.5 
      });

      const detections = await faceapi.detectAllFaces(imageElement, options);

      if (detections.length === 0) {
        onFacesDetected([]);
        onFaceDetected(false);
        return;
      }

      const faces: DetectedFace[] = await Promise.all(
        detections.map(async (detection) => {
          try {
            const faceData = await faceapi.computeFaceDescriptor(imageElement);
            const response = await fetch('/api/check-face', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ faceData: Array.from(faceData as Float32Array) })
            });
            
            if (!response.ok) {
              throw new Error('Failed to check face recognition');
            }
            
            const { recognized } = await response.json();

            return {
              x: detection.box.x,
              y: detection.box.y,
              width: detection.box.width,
              height: detection.box.height,
              recognized
            };
          } catch (error) {
            console.error('Error processing face:', error);
            return {
              x: detection.box.x,
              y: detection.box.y,
              width: detection.box.width,
              height: detection.box.height,
              recognized: false
            };
          }
        })
      );

      onFacesDetected(faces);
      onFaceDetected(faces.length > 0);
    } catch (error) {
      console.error('Error detecting faces:', error);
      onFacesDetected([]);
      onFaceDetected(false);
    }
  };

  return null; // This is a logic-only component
};

export default FaceDetection; 