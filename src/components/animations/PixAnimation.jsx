// ARQUIVO: src/components/animations/PixAnimation.jsx
// Marca se montando: a peça central (esquerda + direita) permanece
// parada enquanto as peças de cima e de baixo caem/sobem até encaixar,
// formando o losango completo, e se desfazem em loop.
// `active` acelera o ciclo durante o envio do pagamento.
import Box from '@mui/material/Box';

const PETAL_D = 'M50,50 C32,46 24,28 50,6 C76,28 68,46 50,50 Z';

export default function PixAnimation({ active }) {
  const duration = active ? 1.5 : 3.4;

  return (
    <Box className="pw-anim-stage" style={{ '--pw-pix-duration': `${duration}s` }}>
      <Box className="pw-pix-mark">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="pwPixTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5FE6D2" />
              <stop offset="1" stopColor="#1FA593" />
            </linearGradient>
            <linearGradient id="pwPixMid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#39C8B4" />
              <stop offset="1" stopColor="#0E7C6E" />
            </linearGradient>
            <linearGradient id="pwPixBottom" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#4FDCC6" />
              <stop offset="1" stopColor="#189485" />
            </linearGradient>
          </defs>

          <g className="pw-pix-piece pw-pix-piece--middle">
            <path d={PETAL_D} fill="url(#pwPixMid)" transform="rotate(270 50 50)" />
            <path d={PETAL_D} fill="url(#pwPixMid)" transform="rotate(90 50 50)" />
          </g>

          <g className="pw-pix-piece pw-pix-piece--top">
            <path d={PETAL_D} fill="url(#pwPixTop)" />
          </g>

          <g className="pw-pix-piece pw-pix-piece--bottom">
            <path d={PETAL_D} fill="url(#pwPixBottom)" transform="rotate(180 50 50)" />
          </g>
        </svg>
      </Box>
    </Box>
  );
}
