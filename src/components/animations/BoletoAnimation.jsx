// ARQUIVO: src/components/animations/BoletoAnimation.jsx
// Barras de código de barras "desenhando" com atraso escalonado +
// uma linha de leitura que varre continuamente, como um scanner real.
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const BAR_WIDTHS = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 1, 2, 2, 1, 4, 1, 2];

export default function BoletoAnimation({ active }) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const sweepDuration = active ? 1.1 : 2.4;

  return (
    <Box
      sx={{
        position: 'relative',
        height: 108,
        borderRadius: 3,
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        px: 3,
        '@keyframes pwBarcodeGrow': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        '@keyframes pwScanSweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'stretch', gap: '2px', height: 56, width: '100%', maxWidth: 260 }}>
        {BAR_WIDTHS.map((w, i) => (
          <Box
            key={i}
            sx={{
              width: w * 2,
              bgcolor: 'text.primary',
              transformOrigin: 'center',
              animation: 'pwBarcodeGrow 0.5s cubic-bezier(.2,.8,.3,1) both',
              animationDelay: `${i * 0.025}s`,
            }}
          />
        ))}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
            width: '40%',
            animation: `pwScanSweep ${sweepDuration}s ease-in-out infinite`,
          }}
        />
      </Box>
    </Box>
  );
}
