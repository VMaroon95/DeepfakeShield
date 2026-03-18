// Material You Dark Theme tokens
export const Colors = {
  surface: '#1C1B1F',
  surfaceVar: '#2B2930',
  surfaceHigh: '#36343B',
  surfaceHighest: '#49454F',
  primary: '#D0BCFF',
  primaryDark: '#6750A4',
  primaryContainer: '#4F378B',
  secondary: '#CCC2DC',
  tertiary: '#EFB8C8',
  error: '#F2B8B5',
  errorDark: '#B3261E',
  onSurface: '#E6E1E5',
  onSurfaceVar: '#CAC4D0',
  outline: '#938F99',
  // Verdict
  safe: '#A8DAB5',
  safeBg: '#1B3726',
  warning: '#FFD599',
  warningBg: '#3D2E14',
  danger: '#FFB4AB',
  dangerBg: '#3B1B1B',
};

export const getVerdictColor = (score) => {
  if (score <= 30) return { color: Colors.safe, bg: Colors.safeBg, label: '✅ Likely Real' };
  if (score <= 65) return { color: Colors.warning, bg: Colors.warningBg, label: '⚠️ Suspicious' };
  return { color: Colors.danger, bg: Colors.dangerBg, label: '🔴 Likely Synthetic' };
};
