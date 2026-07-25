// ARQUIVO: src/components/sessions/BoletoSession.jsx
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import PayerFields from '../PayerFields.jsx';
import AddressFields from '../AddressFields.jsx';
import PaymentResultPanel from '../PaymentResultPanel.jsx';
import { useRecentAddresses } from '../../hooks/useRecentAddresses.js';

export default function BoletoSession({
  payer,
  onPayerChange,
  address,
  onAddressChange,
  submitting,
  error,
  payment,
  apiClient,
  onApproved,
  onSubmit,
  addressStorageKey,
}) {
  const { recentAddresses, saveAddress } = useRecentAddresses(addressStorageKey);

  if (payment) {
    return <PaymentResultPanel payment={payment} apiClient={apiClient} onApproved={onApproved} />;
  }

  return (
    <Stack
      component="form"
      spacing={2.5}
      sx={{ p: 2.5 }}
      onSubmit={(e) => {
        e.preventDefault();
        saveAddress(address);
        onSubmit({ payerAddress: address });
      }}
    >
      <Stack spacing={0.25}>
        <Typography variant="subtitle1" fontWeight={650}>Pagar com boleto</Typography>
        <Typography variant="caption" color="text.secondary">Compensação em até 2 dias úteis após o pagamento.</Typography>
      </Stack>

      <PayerFields payer={payer} onChange={onPayerChange} />
      <AddressFields address={address} onChange={onAddressChange} recentAddresses={recentAddresses} />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" size="large" disabled={submitting} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}>
        {submitting ? 'Gerando boleto…' : 'Gerar boleto'}
      </Button>
    </Stack>
  );
}
