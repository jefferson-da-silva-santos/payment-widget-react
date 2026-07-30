// ARQUIVO: src/components/animations/PixAnimation.jsx
// Animação de "pulso instantâneo": ondas concêntricas saindo de um
// glifo central, comunicando a transferência em tempo real do Pix.
// `active` acelera o pulso durante o envio do pagamento.
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export default function PixAnimation({ active }) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const duration = active ? 1.1 : 2.2;

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
        '@keyframes pwPixPing': {
          '0%': { transform: 'scale(0.4)', opacity: 0.7 },
          '100%': { transform: 'scale(2.6)', opacity: 0 },
        },
        '@keyframes pwPixGlow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 8px currentColor)' },
        },
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 46,
            height: 46,
            borderRadius: '50%',
            border: `1.5px solid ${accent}`,
            animation: `pwPixPing ${duration}s ease-out infinite`,
            animationDelay: `${i * (duration / 3)}s`,
          }}
        />
      ))}
      <Box sx={{ position: 'relative', zIndex: 1, color: accent, animation: `pwPixGlow ${duration}s ease-in-out infinite` }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.5 3.5c1.2-1.2 3-1.2 4.2 0l2.5 2.5c.4.4 1 .6 1.6.6h1a2 2 0 012 2v1c0 .6.2 1.2.6 1.6l2.4-2.4"
            stroke="none"
          />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
          <rect x="7.5" y="7.5" width="9" height="9" rx="2.6" transform="rotate(45 12 12)" fill="currentColor" opacity="0.15" />
          <rect x="9.3" y="9.3" width="5.4" height="5.4" rx="1.4" transform="rotate(45 12 12)" fill="currentColor" />
        </svg>
      </Box>
    </Box>
  );
}
