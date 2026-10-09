// Calculates relative luminance of a color (WCAG)
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val /= 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getContrastRatio = (color1: string, color2: string): number => {
  if (color2.toLowerCase() === 'transparent') color2 = '#ffffff'; // Default transparent bg to white for contrast purposes
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
};

export const isContrastValid = (foreground: string, background: string): boolean => {
  return getContrastRatio(foreground, background) >= 3;
};

export const isInverted = (foreground: string, background: string): boolean => {
  if (background.toLowerCase() === 'transparent') background = '#ffffff';
  return getLuminance(foreground) > getLuminance(background);
};

