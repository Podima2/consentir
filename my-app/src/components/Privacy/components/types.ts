export type Tab = "home" | "gallery" | "add-face" | "settings";
export type RecordingState = "idle" | "recording" | "processing";
export type CaptureMode = "photo" | "video";

export type DetectedFace = {
  x: number;
  y: number;
  width: number;
  height: number;
  recognized: boolean;
};

export type Settings = {
  autoBlur: boolean;
  requirePayment: boolean;
  price: string;
  privacyLevel: string;
  allowDataSharing: boolean;
  dataRetentionDays: string;
}; 