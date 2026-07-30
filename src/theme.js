// ARQUIVO: src/theme.js
// ==========================================================
// Fábrica de tema do MUI. Cria um tema ISOLADO (não usamos
// <CssBaseline>, de propósito - isso resetaria estilos globais de
// html/body do app hospedeiro, o que uma biblioteca embutida nunca
// deve fazer). O tema é aplicado só dentro do <ThemeProvider> deste
// componente, via Context do React - por isso não sofre o problema
// de herança que tínhamos com CSS variables + portal.
// ==========================================================
import { createTheme } from '@mui/material/styles';

const RADIUS = 10;

export function createWidgetTheme(mode = 'dark', accentColor) {
  const isDark = mode === 'light' ? false : true;

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: accentColor || '#6d5ef8' },
      success: { main: isDark ? '#22c58b' : '#0f9d58' },
      error: { main: isDark ? '#f2545b' : '#d13438' },
      warning: { main: isDark ? '#f5a623' : '#b6790a' },
      background: {
        default: isDark ? '#151822' : '#ffffff',
        paper: isDark ? '#1c202c' : '#f0f1f5',
      },
      text: {
        primary: isDark ? '#f2f3f7' : '#14161c',
        secondary: isDark ? '#9aa1b5' : '#565a68',
      },
      divider: isDark ? '#2a2f3d' : '#e2e4ea',
    },
    shape: { borderRadius: RADIUS },
    typography: {
      fontFamily: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h5: { fontFamily: '"Sora", "Manrope", sans-serif' },
      subtitle1: { fontFamily: '"Sora", "Manrope", sans-serif', letterSpacing: '-0.01em' },
      button: { textTransform: 'none', fontWeight: 650 },
    },
    components: {
      MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: RADIUS, fontWeight: 650 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' }, // MUI aplica um overlay de elevação em dark mode por padrão - não queremos isso aqui
        },
      },
    },
  });
}
