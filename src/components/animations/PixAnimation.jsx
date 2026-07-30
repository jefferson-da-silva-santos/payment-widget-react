// ARQUIVO: src/components/animations/PixAnimation.jsx
// Radar de sinal: anéis concêntricos saindo de um núcleo pulsante,
// remetendo à transferência instantânea. `active` acelera o ciclo.
import Box from '@mui/material/Box';

export default function PixAnimation({ active }) {
  const duration = active ? 1.1 : 2.4;

  return (
    <Box className="pw-anim-stage" style={{ '--pw-pix-duration': `${duration}s` }}>
      {[0, 1, 2].map((i) => (
        <Box key={i} className="pw-pix-ring" style={{ animationDelay: `${(i * duration) / 3}s` }} />
      ))}
      <Box className="pw-pix-core">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="9.3" y="9.3" width="5.4" height="5.4" rx="1.4" transform="rotate(45 12 12)" fill="#fff" />
        </svg>
      </Box>
    </Box>
  );
}
