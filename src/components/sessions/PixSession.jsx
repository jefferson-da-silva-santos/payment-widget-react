// ARQUIVO: src/components/sessions/PixSession.jsx
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import PayerFields from '../PayerFields.jsx';
import PaymentResultPanel from '../PaymentResultPanel.jsx';
import PixAnimation from '../animations/PixAnimation.jsx';

export default function PixSession({ payer, onPayerChange, submitting, error, payment, apiClient, onApproved, onRejected, onCancelled, onStatusChange, onSubmit }) {
  if (payment) {
    return <PaymentResultPanel payment={payment} apiClient={apiClient} onApproved={onApproved} onRejected={onRejected} onCancelled={onCancelled} onStatusChange={onStatusChange} />;
  }

  return (
    <Stack
      component="form"
      spacing={2.5}
      className="pw-session"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({});
      }}
    >
      <Stack spacing={0.25}>
        <Typography variant="subtitle1" fontWeight={700} className="pw-display">Pagar com Pix</Typography>
        <Typography variant="caption" color="text.secondary">Aprovação em segundos após o pagamento.</Typography>
      </Stack>

      <PixAnimation active={submitting} />

      <PayerFields payer={payer} onChange={onPayerChange} />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" size="large" disabled={submitting} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}>
        {submitting ? 'Gerando Pix…' : 'Gerar Pix'}
      </Button>
    </Stack>
  );
}