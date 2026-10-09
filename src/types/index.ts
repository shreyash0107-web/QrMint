export type QRDataType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export interface QRData {
  type: QRDataType;
  url?: string;
  text?: string;
  email?: { to: string; subject: string; body: string };
  phone?: string;
  wifi?: { ssid: string; password?: string; encryption: 'WPA' | 'WEP' | 'nopass'; hidden: boolean };
}

export interface QRSettings {
  width: number;
  height: number;
  data: string; // The formatted string
  image?: string; // Logo
  dotsOptions: {
    color: string;
    type: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
    gradient?: {
      type: 'linear' | 'radial';
      colorStops: { offset: number; color: string }[];
    };
  };
  backgroundOptions: {
    color: string;
    transparent?: boolean;
  };
  cornersSquareOptions?: {
    type: 'dot' | 'square' | 'extra-rounded';
    color?: string;
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin: string;
  };
  qrOptions: {
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
  margin: number;
}

export interface QRPreset {
  name: string;
  settings: Partial<QRSettings>;
}

export interface QRHistoryItem {
  id: string;
  timestamp: number;
  qrData: QRData;
  settings: QRSettings;
}
