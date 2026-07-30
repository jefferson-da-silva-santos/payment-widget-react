// ARQUIVO: src/components/AmountHeader.jsx
// ==========================================================
// Mostra o valor a ser pago no topo do componente. Componente
// totalmente controlado - quem decide o valor (fixo ou editável) é
// o PaymentWidget, aqui só renderiza. Isso evita atualizar estado do
// pai durante o render (anti-padrão do React).
// ==========================================================
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";

export default function AmountHeader({
  display,
  description,
  editable,
  inputProps,
}) {
  return (
    <Box className="pw-amount-header">
      <Typography variant="caption" color="text.secondary" className="pw-amount-label">
        Valor a pagar
      </Typography>

      {editable ? (
        <InputBase {...inputProps} value={display} className="pw-amount-value pw-mono" fullWidth />
      ) : (
        <Typography component="p" className="pw-amount-value pw-mono">
          {display}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" className="pw-amount-desc">
          {description}
        </Typography>
      )}
    </Box>
  );
}
