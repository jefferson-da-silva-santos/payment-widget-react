// ARQUIVO: src/components/PaymentResultPanel.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import QrCodeModal from './QrCodeModal.jsx';

const STATUS_LABEL = {
  PENDING: 'Aguardando pagamento',
  IN_PROCESS: 'Processando',
  APPROVED: 'Aprovado',
  REJECTED: 'Recusado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Estornado',
  CHARGED_BACK: 'Chargeback',
};

const POLLABLE = ['PENDING', 'IN_PROCESS'];
const POLL_INTERVAL_MS = 3000;

function statusColor(status) {
  if (status === 'APPROVED') return 'success';
  if (['REJECTED', 'CANCELLED', 'CHARGED_BACK'].includes(status)) return 'error';
  return 'warning';
}

export default function PaymentResultPanel({ payment, apiClient, onApproved, onRejected, onCancelled, onStatusChange }) {
  const [current, setCurrent] = useState(payment);
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  }, []);

  useEffect(() => {
    setCurrent(payment);
    stopPolling();

    if (!payment || !POLLABLE.includes(payment.status)) return undefined;

    pollRef.current = setInterval(async () => {
      try {
        const { data } = await apiClient.getPayment(payment.id, { syncWithMp: true });
        setCurrent(data);
        onStatusChange?.(data);
        if (data.status === 'APPROVED') onApproved?.(data);
        if (data.status === 'REJECTED' || data.status === 'CHARGED_BACK') onRejected?.(data);
        if (data.status === 'CANCELLED') onCancelled?.(data);
        if (!POLLABLE.includes(data.status)) stopPolling();
      } catch {
        // falha pontual de rede não derruba o polling
      }
    }, POLL_INTERVAL_MS);

    return stopPolling;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment]);

  if (!current) return null;

  return (
    <Stack spacing={2} sx={{ p: 2.5 }}>
      <Chip
        size="small"
        color={statusColor(current.status)}
        icon={POLLABLE.includes(current.status) ? <CircularProgress size={10} color="inherit" /> : undefined}
        label={STATUS_LABEL[current.status] ?? current.status}
        sx={{ alignSelf: 'flex-start', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}
      />

      {current.pix?.qrCodeBase64 && (
        <Stack alignItems="center" spacing={1} sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
          <QrCodeModal
            qrCodeBase64={current.pix.qrCodeBase64}
            trigger={
              <Box
                component="img"
                src={`data:image/png;base64,${current.pix.qrCodeBase64}`}
                alt="QR Code Pix - clique para ampliar"
                sx={{ width: 176, height: 176, bgcolor: '#fff', borderRadius: 1.5, p: 1, cursor: 'zoom-in' }}
              />
            }
          />
          <Typography variant="caption" color="text.secondary">
            Clique no QR Code para ampliar
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigator.clipboard?.writeText(current.pix.qrCode)}
          >
            Copiar código Pix
          </Button>
        </Stack>
      )}

      {current.ticketUrl && (
        <Button variant="outlined" href={current.ticketUrl} target="_blank" rel="noreferrer">
          Abrir boleto
        </Button>
      )}

      {current.status === 'APPROVED' && (
        <Button variant="outlined" href={apiClient.getReceiptUrl(current.id)} target="_blank" rel="noreferrer">
          Baixar comprovante
        </Button>
      )}
    </Stack>
  );
}