// ARQUIVO: src/components/animations/CardPreview.jsx
// Pré-visualização animada do cartão: espelha o que o pagador digita
// em tempo real e vira em 3D pra mostrar o CVV quando o campo está focado.
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
    <Box sx={{ perspective: 1200, mb: 0.5 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.586',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(.4,.2,.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* frente */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 3,
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(160deg,#3a3f4c 0%,#262a34 45%,#14161c 100%)',
            boxShadow: '0 14px 32px rgba(20,20,30,0.32), inset 0 0 0 1px rgba(255,255,255,0.06)',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            color: '#fff',
            '@keyframes pwCardShine': {
              '0%': { transform: 'translateX(-120%) rotate(8deg)' },
              '100%': { transform: 'translateX(220%) rotate(8deg)' },
            },
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 8%, rgba(255,255,255,0.10), transparent 45%)' }} />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '-40%',
              width: '55%',
              height: '100%',
              background: 'linear-gradient(75deg, transparent, rgba(255,255,255,0.10), transparent)',
              animation: 'pwCardShine 6s ease-in-out infinite',
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 1 }}>
            <svg width="38" height="28" viewBox="0 0 40 30">
              <defs>
                <linearGradient id="pwChipGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f4e6a8" />
                  <stop offset="0.5" stopColor="#d8b400" />
                  <stop offset="1" stopColor="#8a6f00" />
                </linearGradient>
              </defs>
              <rect x="0.5" y="0.5" width="39" height="29" rx="5" fill="url(#pwChipGrad)" />
              <rect x="6" y="6" width="28" height="18" rx="3" fill="none" stroke="#5b4a00" strokeWidth="0.8" opacity="0.55" />
              <line x1="0.5" y1="10" x2="14" y2="10" stroke="#5b4a00" strokeWidth="0.8" opacity="0.55" />
              <line x1="0.5" y1="20" x2="14" y2="20" stroke="#5b4a00" strokeWidth="0.8" opacity="0.55" />
              <line x1="26" y1="10" x2="39.5" y2="10" stroke="#5b4a00" strokeWidth="0.8" opacity="0.55" />
              <line x1="26" y1="20" x2="39.5" y2="20" stroke="#5b4a00" strokeWidth="0.8" opacity="0.55" />
            </svg>
            <Box component="span" sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)' }}>
              {brandText}
            </Box>
          </Box>

          <Box
            sx={{
              fontFamily: "'Courier New', ui-monospace, SFMono-Regular, monospace",
              fontSize: { xs: 15, sm: 18 },
              letterSpacing: '0.09em',
              fontWeight: 700,
              color: '#f3f1e8',
              textShadow: '0 1px 0 rgba(255,255,255,0.12), 0 2px 3px rgba(0,0,0,0.55)',
              zIndex: 1,
            }}
          >
            {numberDisplay}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1, zIndex: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Box component="p" sx={{ m: 0, fontSize: 7.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>TITULAR</Box>
              <Box component="p" sx={{ m: 0, fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nameDisplay}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Box component="p" sx={{ m: 0, fontSize: 7.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>VALIDADE</Box>
              <Box component="p" sx={{ m: 0, fontSize: 12, fontWeight: 600 }}>{expiryDisplay}</Box>
            </Box>
            <svg width="32" height="21" viewBox="0 0 36 24" style={{ flexShrink: 0 }}>
              <circle cx="13" cy="12" r="12" fill="#eb5222" />
              <circle cx="23" cy="12" r="12" fill="#f6a70e" />
              <path d="M18 3.4a12 12 0 010 17.2 12 12 0 010-17.2z" fill="#f07a1e" />
            </svg>
          </Box>
        </Box>

        {/* verso */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 3,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(160deg,#3a3f4c 0%,#262a34 45%,#14161c 100%)',
            boxShadow: '0 14px 32px rgba(20,20,30,0.32)',
            color: '#fff',
          }}
        >
          <Box sx={{ width: '100%', height: 28, bgcolor: '#101116', mt: 2 }} />
          <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
              <Box sx={{ flex: 1, height: 24, borderRadius: 0.5, background: 'repeating-linear-gradient(45deg,#eceef2,#eceef2 4px,#dfe1e7 4px,#dfe1e7 8px)' }} />
              <Box sx={{ bgcolor: '#fff', color: '#181a20', fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 700, px: 1, py: 0.5, borderRadius: 0.5, minWidth: 32, textAlign: 'center' }}>
                {cvvDisplay}
              </Box>
            </Box>
            <Box component="p" sx={{ m: 0, fontSize: 8.5, color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>Código de segurança</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
