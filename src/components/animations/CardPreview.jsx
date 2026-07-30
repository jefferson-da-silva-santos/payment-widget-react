// ARQUIVO: src/components/animations/CardPreview.jsx
// Cartão SVG realista: relevo metálico, chip com glint periódico,
// sheen contínuo, verso com tarja + CVV. Usa classes de payment-widget.css.
import Box from '@mui/material/Box';

const BRAND_TEXT = { visa: 'VISA', mastercard: 'MASTERCARD', amex: 'AMEX', elo: 'ELO', hipercard: 'HIPERCARD', diners: 'DINERS' };

function paddedNumber(masked, brand) {
  const digits = String(masked ?? '').replace(/\D/g, '');
  const total = brand?.length || 16;
  const gaps = brand?.gaps || [4, 8, 12];
  const filled = digits.padEnd(total, '\u2022').slice(0, total);
  let out = '';
  for (let i = 0; i < filled.length; i += 1) {
    if (gaps.includes(i)) out += ' ';
    out += filled[i];
  }
  return out;
}

export default function CardPreview({ cardNumber, cardholderName, expiry, cvv, brand, flipped }) {
  const numberDisplay = paddedNumber(cardNumber, brand);
  const nameDisplay = cardholderName ? cardholderName.toUpperCase() : 'SEU NOME AQUI';
  const expiryDigits = String(expiry ?? '').replace(/\D/g, '');
  const expiryDisplay = expiryDigits
    ? `${expiryDigits.slice(0, 2).padEnd(2, '\u2022')}/${expiryDigits.slice(2, 4).padEnd(2, '\u2022')}`
    : 'MM/AA';
  const cvvDisplay = (cvv || '').padEnd(3, '\u2022');
  const brandText = brand && brand.id !== 'unknown' ? BRAND_TEXT[brand.id] ?? brand.id.toUpperCase() : 'CARTÃO';

  return (
    <Box className="pw-card-scene" sx={{ mb: 0.5 }}>
      <Box className={`pw-card${flipped ? ' is-flipped' : ''}`}>
        <Box className="pw-card-face pw-card-face--front">
          <Box className="pw-card-sheen" />

          <Box className="pw-card-row">
            <svg width="38" height="28" viewBox="0 0 40 30" className="pw-chip-shine">
              <defs>
                <linearGradient id="pwChipGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f6ecc0" />
                  <stop offset="0.5" stopColor="#cfa93a" />
                  <stop offset="1" stopColor="#7a5e14" />
                </linearGradient>
              </defs>
              <rect x="0.5" y="0.5" width="39" height="29" rx="5" fill="url(#pwChipGrad)" />
              <rect x="6" y="6" width="28" height="18" rx="3" fill="none" stroke="#5b4a12" strokeWidth="0.8" opacity="0.55" />
              <line x1="0.5" y1="10" x2="14" y2="10" stroke="#5b4a12" strokeWidth="0.8" opacity="0.55" />
              <line x1="0.5" y1="20" x2="14" y2="20" stroke="#5b4a12" strokeWidth="0.8" opacity="0.55" />
              <line x1="26" y1="10" x2="39.5" y2="10" stroke="#5b4a12" strokeWidth="0.8" opacity="0.55" />
              <line x1="26" y1="20" x2="39.5" y2="20" stroke="#5b4a12" strokeWidth="0.8" opacity="0.55" />
            </svg>
            <Box className="pw-card-brand pw-display">{brandText}</Box>
          </Box>

          <Box className="pw-card-number pw-mono">{numberDisplay}</Box>

          <Box className="pw-card-row" sx={{ alignItems: 'flex-end' }}>
            <Box sx={{ minWidth: 0 }}>
              <p className="pw-card-label">TITULAR</p>
              <p className="pw-card-value">{nameDisplay}</p>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <p className="pw-card-label">VALIDADE</p>
              <p className="pw-card-value">{expiryDisplay}</p>
            </Box>
            <svg width="34" height="22" viewBox="0 0 36 24" style={{ flexShrink: 0 }}>
              <circle cx="13" cy="12" r="12" fill="#eb5222" />
              <circle cx="23" cy="12" r="12" fill="#f6a70e" />
              <path d="M18 3.4a12 12 0 010 17.2 12 12 0 010-17.2z" fill="#f07a1e" />
            </svg>
          </Box>
        </Box>

        <Box className="pw-card-face pw-card-face--back">
          <Box className="pw-card-stripe" />
          <Box sx={{ p: 1.75, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
              <Box className="pw-card-cvv-strip" />
              <Box className="pw-card-cvv-box pw-mono">{cvvDisplay}</Box>
            </Box>
            <p style={{ margin: '4px 0 0', fontSize: 8.5, color: 'rgba(244,242,232,0.4)', textAlign: 'right' }}>Código de segurança</p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
