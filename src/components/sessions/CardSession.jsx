// ARQUIVO: src/components/sessions/CardSession.jsx
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import PayerFields from '../PayerFields.jsx';
import PaymentResultPanel from '../PaymentResultPanel.jsx';
import SavedCardsPicker from '../SavedCardsPicker.jsx';
import SessionTabs from '../SessionTabs.jsx';
import CardPreview from '../animations/CardPreview.jsx';
import { useMercadoPagoSdk } from '../../hooks/useMercadoPagoSdk.js';
import { maskCardNumber, maskExpiry, maskCvv, parseExpiry, detectCardBrand } from '../../masks/card.js';
import { documentType, onlyDigits } from '../../masks/document.js';

const INSTALLMENT_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const BRAND_LABEL = { visa: 'Visa', mastercard: 'Master', amex: 'Amex', elo: 'Elo', hipercard: 'Hiper', diners: 'Diners' };

export default function CardSession({
  payer,
  onPayerChange,
  submitting,
  error,
  payment,
  apiClient,
  onApproved,
  onRejected,
  onCancelled,
  onStatusChange,
  onSubmit,
  publicKey,
  isActive,
  savedCards,
  onSaveCardRequested,
  allowSaveCard = true,
}) {
  const { mp, status: sdkStatus, isReady } = useMercadoPagoSdk(publicKey, isActive);

  const [selectedSavedCard, setSelectedSavedCard] = useState(savedCards?.length ? savedCards[0].id : 'new');
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState(1);
  const [saveCard, setSaveCard] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  if (payment) {
    return <PaymentResultPanel payment={payment} apiClient={apiClient} onApproved={onApproved} onRejected={onRejected} onCancelled={onCancelled} onStatusChange={onStatusChange} />;
  }

  const usingSavedCard = selectedSavedCard && selectedSavedCard !== 'new';
  const brand = detectCardBrand(cardNumber);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);

    if (usingSavedCard) {
      onSubmit({ savedCardId: selectedSavedCard, installments });
      return;
    }

    if (!mp || !isReady) {
      setLocalError('SDK do Mercado Pago ainda não carregou. Aguarde um instante.');
      return;
    }

    try {
      const { month, year } = parseExpiry(expiry);
      const documentDigits = onlyDigits(payer.document);

      const token = await mp.createCardToken({
        cardNumber: onlyDigits(cardNumber),
        cardholderName,
        cardExpirationMonth: month,
        cardExpirationYear: year,
        securityCode: cvv,
        identificationType: documentType(documentDigits),
        identificationNumber: documentDigits,
      });

      if (saveCard) {
        onSaveCardRequested?.({ cardToken: token.id, brand: brand.id, lastFourDigits: cardNumber.slice(-4) });
      }

      onSubmit({ cardToken: token.id, paymentMethodId: brand.payment_method_id, installments });
    } catch (err) {
      setLocalError(err.message || 'Não foi possível processar o cartão.');
    }
  }

  return (
    <Stack component="form" spacing={2.5} sx={{ p: 2.5 }} onSubmit={handleSubmit}>
      <Stack spacing={0.25}>
        <Typography variant="subtitle1" fontWeight={700} className="pw-display">Pagar com cartão</Typography>
        {isActive && !isReady && (
          <Typography variant="caption" color="text.secondary">Carregando SDK do Mercado Pago…</Typography>
        )}
      </Stack>

      <SessionTabs
        paymentLabel="Cartão"
        paymentPane={
          <>
            {!usingSavedCard && (
              <CardPreview
                cardNumber={cardNumber}
                cardholderName={cardholderName}
                expiry={expiry}
                cvv={cvv}
                brand={brand}
                flipped={focusedField === 'cvv'}
              />
            )}

            <SavedCardsPicker savedCards={savedCards} selected={selectedSavedCard} onSelect={setSelectedSavedCard} />

            {!usingSavedCard && (
              <>
                <TextField
                  label="Número do cartão"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  InputProps={{
                    endAdornment: brand.id !== 'unknown' && (
                      <InputAdornment position="end">
                        <Typography variant="caption" fontWeight={700} textTransform="uppercase" color="text.secondary">
                          {BRAND_LABEL[brand.id]}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Nome impresso no cartão"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                  placeholder="COMO ESTÁ NO CARTÃO"
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <TextField label="Validade" value={expiry} onChange={(e) => setExpiry(maskExpiry(e.target.value))} placeholder="MM/AA" inputMode="numeric" />
                  <TextField
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(maskCvv(e.target.value, cardNumber))}
                    onFocus={() => setFocusedField('cvv')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={brand.cvvLength === 4 ? '0000' : '000'}
                    inputMode="numeric"
                  />
                </Box>

                {allowSaveCard && (
                  <FormControlLabel
                    control={<Checkbox size="small" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} />}
                    label={<Typography variant="body2">Salvar este cartão para próximas compras</Typography>}
                  />
                )}
              </>
            )}

            <FormControl fullWidth size="small">
              <InputLabel id="pw-installments-label">Parcelas</InputLabel>
              <Select
                labelId="pw-installments-label"
                label="Parcelas"
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
              >
                {INSTALLMENT_OPTIONS.map((n) => (
                  <MenuItem key={n} value={n}>{n}x</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        }
        dataPane={<PayerFields payer={payer} onChange={onPayerChange} />}
      />

      {(error || localError) && <Alert severity="error">{error || localError}</Alert>}

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={submitting || (!usingSavedCard && isActive && !isReady && sdkStatus !== 'idle')}
        startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {submitting ? 'Processando…' : 'Pagar'}
      </Button>
    </Stack>
  );
}