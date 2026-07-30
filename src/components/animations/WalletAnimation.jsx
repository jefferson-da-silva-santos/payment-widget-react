// ARQUIVO: src/components/animations/WalletAnimation.jsx
// Cartão de saldo com barra de confirmação animada + selo de check -
// comunica "verificando saldo disponível" de forma limpa e profissional.
import Box from '@mui/material/Box';

export default function WalletAnimation({ active }) {
  const duration = active ? 1.4 : 2.8;

  return (
    <Box className="pw-anim-stage">
      <Box className="pw-wallet-stage" style={{ '--pw-wallet-duration': `${duration}s` }}>
        <Box className="pw-wallet-glow" />
        <Box className="pw-wallet-card">
          <svg width="30" height="24" viewBox="0 0 34 26" className="pw-wallet-icon">
            <rect x="1" y="1" width="32" height="24" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.6" />
            <rect x="20" y="10" width="13" height="9" rx="2.5" fill="currentColor" />
            <circle cx="26.5" cy="14.5" r="1.4" fill="#14161c" />
          </svg>

          <Box className="pw-wallet-track">
            <Box className="pw-wallet-fill" />
          </Box>

          <Box className="pw-wallet-check">
            <svg width="12" height="12" viewBox="0 0 14 14">
              <path d="M2.5 7.2 L5.6 10.3 L11.5 3.8" fill="none" stroke="#0f2620" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
