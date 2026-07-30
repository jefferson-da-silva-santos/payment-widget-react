// ARQUIVO: src/components/animations/BoletoAnimation.jsx
// Barras de código de barras entrando com atraso escalonado + linha
// de laser que varre continuamente, como um leitor de boleto real.
import Box from '@mui/material/Box';

const BAR_WIDTHS = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 1, 2, 2, 1, 4, 1, 2];

export default function BoletoAnimation({ active }) {
  const duration = active ? 1.2 : 2.4;

  return (
    <Box className="pw-anim-stage" style={{ '--pw-scan-duration': `${duration}s` }}>
      <Box className="pw-barcode">
        {BAR_WIDTHS.map((w, i) => (
          <Box
            key={i}
            className="pw-barcode-bar"
            sx={{ width: w * 4 }}
            style={{ animationDelay: `${i * 0.025}s` }}
          />
        ))}
        <Box className="pw-scan-line" />
      </Box>
    </Box>
  );
}
