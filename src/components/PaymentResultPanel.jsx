// ARQUIVO: src/components/PaymentResultPanel.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
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

const STATUS_DESCRIPTION = {
  PENDING: 'Assim que o pagamento cair, atualizamos aqui automaticamente.',
  IN_PROCESS: 'Estamos confirmando o pagamento com o emissor.',
  APPROVED: 'Pagamento confirmado com sucesso.',
  REJECTED: 'O pagamento não foi autorizado.',
  CANCELLED: 'Este pagamento foi cancelado.',
  REFUNDED: 'O valor foi devolvido ao pagador.',
  CHARGED_BACK: 'O pagamento sofreu contestação (chargeback).',
};

const POLLABLE = ['PENDING', 'IN_PROCESS'];
const POLL_INTERVAL_MS = 3000;

function statusColor(status) {
  if (status === 'APPROVED') return 'success';
  if (['REJECTED', 'CANCELLED', 'CHARGED_BACK'].includes(status)) return 'error';
  return 'warning';
}

function CheckIcon(props) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M2.5 7.2 5.6 10.3 11.5 3.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon(props) {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function StatusIcon({ status }) {
  if (POLLABLE.includes(status)) return <CircularProgress size={12} color="inherit" thickness={5} />;
  if (status === 'APPROVED') return <CheckIcon />;
  if (['REJECTED', 'CANCELLED', 'CHARGED_BACK'].includes(status)) return <CrossIcon />;
  return <CheckIcon />;
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

  const color = statusColor(current.status);

  return (
    <Stack spacing={2.5} className="pw-session">
      <Stack direction="row" spacing={1.5} alignItems="center" className={`pw-status pw-status--${color}`}>
        <Box className="pw-status-icon">
          <StatusIcon status={current.status} />
        </Box>
        <Stack spacing={0.15}>
          <Typography className="pw-status-label">{STATUS_LABEL[current.status] ?? current.status}</Typography>
          <Typography variant="caption" color="text.secondary">
            {STATUS_DESCRIPTION[current.status] ?? ''}
          </Typography>
        </Stack>
      </Stack>

      {current.pix?.qrCodeBase64 && (
        <Stack alignItems="center" spacing={1.5} className="pw-qr-card">
          <QrCodeModal
            qrCodeBase64={current.pix.qrCodeBase64}
            trigger={
              <Box
                component="img"
                src={`data:image/png;base64,${current.pix.qrCodeBase64}`}
                alt="QR Code Pix - clique para ampliar"
                className="pw-qr-image"
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