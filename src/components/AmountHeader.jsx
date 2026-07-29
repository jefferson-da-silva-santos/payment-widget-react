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
    <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Valor a pagar
      </Typography>

      {editable ? (
        <InputBase
          {...inputProps}
          value={display}
          sx={{
            display: "block",
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
          }}
        />
      ) : (
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
        >
          {display}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
