// ARQUIVO: src/components/animations/PixAnimation.jsx
// Logo oficial do Pix se montando SEGUINDO A DIVISÃO QUE O PRÓPRIO SVG
// JÁ TEM: a faixa central que entrelaça as duas setas fica parada, e
// as duas pontas de seta (uma em cada canto) entram deslizando pela
// própria diagonal até encaixar no lugar. `active` acelera o ciclo
// durante o envio do pagamento.
import Box from '@mui/material/Box';

// Ponta de seta inferior-direita (1º subpath do path original)
const TIP_BOTTOM_RIGHT = 'M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253z';
// Ponta de seta superior-esquerda (2º subpath do path original)
const TIP_TOP_LEFT = 'M4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z';
// Faixa central entrelaçada (path original inteiro, fica parada)
const CORE_BAND = 'm14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z';

export default function PixAnimation({ active }) {
  const duration = active ? 1.4 : 3.2;

  return (
    <Box className="pw-anim-stage" style={{ '--pw-pix-duration': `${duration}s` }}>
      <Box className="pw-pix-mark">
        <svg viewBox="0 0 16 16" className="pw-pix-logo">
          <defs>
            <linearGradient id="pwPixGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6BEBD8" />
              <stop offset="1" stopColor="#0C7267" />
            </linearGradient>
          </defs>
          <path d={CORE_BAND} fill="url(#pwPixGrad)" className="pw-pix-core" />
          <path d={TIP_BOTTOM_RIGHT} fill="url(#pwPixGrad)" className="pw-pix-tip pw-pix-tip--br" />
          <path d={TIP_TOP_LEFT} fill="url(#pwPixGrad)" className="pw-pix-tip pw-pix-tip--tl" />
        </svg>
      </Box>
    </Box>
  );
}
