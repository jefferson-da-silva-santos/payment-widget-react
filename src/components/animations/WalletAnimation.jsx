// ARQUIVO: src/components/animations/WalletAnimation.jsx
// Moedas caindo em loop dentro de uma carteira com brilho pulsante -
// comunica "saldo disponível" de forma tangível.
import Box from '@mui/material/Box';

export default function WalletAnimation({ active }) {
  const duration = active ? 1.6 : 3.6;

  return (
    <Box className="pw-anim-stage">
      <Box className="pw-wallet" style={{ '--pw-wallet-duration': `${duration * 0.8}s` }}>
        <Box className="pw-wallet-glow" />
        <svg width="58" height="48" viewBox="0 0 56 46" style={{ position: 'relative' }}>
          <defs>
            <linearGradient id="pwWalletBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#33384a" />
              <stop offset="1" stopColor="#1b1e27" />
            </linearGradient>
          </defs>
          <rect x="1" y="10" width="54" height="34" rx="8" fill="url(#pwWalletBody)" />
          <rect x="1" y="10" width="54" height="10" rx="8" fill="#454b60" />
          <rect x="33" y="19" width="20" height="16" rx="4" fill="currentColor" style={{ color: 'var(--pw-accent, #6d5ef8)' }} />
          <circle cx="43" cy="27" r="2.6" fill="#14161c" />
        </svg>
        {[0, 1].map((i) => (
          <Box key={i} className="pw-coin" style={{ '--pw-coin-duration': `${duration}s`, animationDelay: `${i * (duration / 2)}s` }} />
        ))}
      </Box>
    </Box>
  );
}
