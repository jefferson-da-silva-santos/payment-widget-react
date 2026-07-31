// ARQUIVO: src/components/AmountHeader.jsx
// ==========================================================
// Mostra o valor a ser pago no topo do componente. Componente
// totalmente controlado - quem decide o valor (fixo ou editável) é
// o PaymentWidget, aqui só renderiza. Isso evita atualizar estado do
// pai durante o render (anti-padrão do React).
// ==========================================================
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";

function ShieldIcon(props) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m8.5 12 2.4 2.4L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AmountHeader({
  display,
  description,
  editable,
  inputProps,
}) {
  const spaceIndex = display.indexOf(" ");
  const currencyPrefix = spaceIndex > -1 ? display.slice(0, spaceIndex) : "";
  const figure = spaceIndex > -1 ? display.slice(spaceIndex + 1) : display;

  return (
    <Box className="pw-amount-header">
      <Stack direction="row" alignItems="center" spacing={0.75} className="pw-amount-eyebrow">
        <Box className="pw-amount-eyebrow-icon">
          <ShieldIcon />
        </Box>
        <Typography variant="caption" className="pw-amount-label">
          Valor a pagar
        </Typography>
      </Stack>

      {editable ? (
        <InputBase {...inputProps} value={display} className="pw-amount-value pw-mono" fullWidth />
      ) : (
        <Typography component="p" className="pw-amount-value pw-mono">
          {currencyPrefix && <span className="pw-amount-currency">{currencyPrefix}</span>}
          <span className="pw-amount-figure">{figure}</span>
        </Typography>
      )}

      {description && (
        <Typography variant="body2" className="pw-amount-desc">
          {description}
        </Typography>
      )}
    </Box>
  );
}
