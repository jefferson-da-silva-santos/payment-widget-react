// ARQUIVO: src/components/animations/WalletAnimation.jsx
// Moeda orbitando/caindo numa carteira, com pulso de saldo - comunica
// "saldo disponível na conta" de forma tangível.
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export default function WalletAnimation({ active }) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const duration = active ? 0.9 : 1.8;

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
        '@keyframes pwCoinDrop': {
          '0%': { transform: 'translateY(-22px) rotate(0deg)', opacity: 0 },
          '30%': { opacity: 1 },
          '70%': { transform: 'translateY(4px) rotate(200deg)', opacity: 1 },
          '100%': { transform: 'translateY(4px) rotate(220deg)', opacity: 0 },
        },
        '@keyframes pwWalletPulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      }}
    >
      <Box sx={{ position: 'relative', animation: `pwWalletPulse ${duration * 1.6}s ease-in-out infinite` }}>
        <svg width="56" height="46" viewBox="0 0 56 46">
          <rect x="1" y="10" width="54" height="34" rx="8" fill="#262a34" />
          <rect x="1" y="10" width="54" height="10" rx="8" fill="#3a3f4c" />
          <rect x="34" y="20" width="18" height="14" rx="4" fill={accent} />
          <circle cx="43" cy="27" r="2.6" fill="#1c1e26" />
        </svg>
        {[0, 1].map((i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: -18,
              left: '50%',
              width: 16,
              height: 16,
              marginLeft: '-8px',
              borderRadius: '50%',
              bgcolor: accent,
              border: '2px solid #8a6f00',
              boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
              animation: `pwCoinDrop ${duration * 2}s ease-in infinite`,
              animationDelay: `${i * duration}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
