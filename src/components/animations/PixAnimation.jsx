// ARQUIVO: src/components/animations/PixAnimation.jsx
// Logo se montando: 4 pétalas entram de fora para dentro e formam o
// losango central, permanecem montadas e se desfazem em loop.
// `active` acelera o ciclo durante o envio do pagamento.
import Box from '@mui/material/Box';

const PETAL_ROTATIONS = [0, 90, 180, 270];

export default function PixAnimation({ active }) {
  const duration = active ? 1.5 : 3.2;

  return (
    <Box className="pw-anim-stage" style={{ '--pw-pix-duration': `${duration}s` }}>
      <Box className="pw-pix-flower">
        {PETAL_ROTATIONS.map((deg, i) => (
          <Box key={deg} className="pw-pix-petal" style={{ transform: `rotate(${deg}deg)` }}>
            <Box className="pw-pix-petal-inner" style={{ animationDelay: `${i * (duration / 10)}s` }}>
              <svg viewBox="0 0 34 52" width="100%" height="100%">
                <path
                  d="M17 1 C24 11 29 20 29 27 C29 38 24 46 17 51 C10 46 5 38 5 27 C5 20 10 11 17 1 Z"
                  fill="currentColor"
                />
              </svg>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
