export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function adjustColorBrightness(hex: string, percent: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const R = Math.min(255, Math.max(0, rgb.r + (rgb.r * percent) / 100));
  const G = Math.min(255, Math.max(0, rgb.g + (rgb.g * percent) / 100));
  const B = Math.min(255, Math.max(0, rgb.b + (rgb.b * percent) / 100));
  
  const rHex = Math.round(R).toString(16).padStart(2, '0');
  const gHex = Math.round(G).toString(16).padStart(2, '0');
  const bHex = Math.round(B).toString(16).padStart(2, '0');
  
  return `#${rHex}${gHex}${bHex}`;
}
