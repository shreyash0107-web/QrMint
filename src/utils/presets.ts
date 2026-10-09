import type { QRPreset } from '../types';

export const PRESETS: QRPreset[] = [
  {
    name: 'Classic Monochrome',
    settings: {
      dotsOptions: { color: '#000000', type: 'square' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { type: 'square', color: '#000000' },
      qrOptions: { errorCorrectionLevel: 'M' }
    }
  },
  {
    name: 'Corporate Navy',
    settings: {
      dotsOptions: { color: '#000080', type: 'rounded' },
      backgroundOptions: { color: '#f0f4f8' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#000080' },
      qrOptions: { errorCorrectionLevel: 'Q' }
    }
  },
  {
    name: 'Neon Cyberpunk',
    settings: {
      dotsOptions: { color: '#ff00ff', type: 'classy' },
      backgroundOptions: { color: '#000000' },
      cornersSquareOptions: { type: 'dot', color: '#00ffff' },
      qrOptions: { errorCorrectionLevel: 'H' }
    }
  },
  {
    name: 'Warm Sunset',
    settings: {
      dotsOptions: { 
        color: '#ff4500', 
        type: 'dots',
      },
      backgroundOptions: { color: '#fff0e6' },
      cornersSquareOptions: { type: 'dot', color: '#ff8c00' },
      qrOptions: { errorCorrectionLevel: 'Q' }
    }
  }
];
