// ARQUIVO: src/PaymentWidget.jsx
import { useState, useMemo, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { createWidgetTheme } from './theme.js';
import MethodSelector from './components/MethodSelector.jsx';
import PixSession from './components/sessions/PixSession.jsx';
import CardSession from './components/sessions/CardSession.jsx';
import BoletoSession from './components/sessions/BoletoSession.jsx';
import AccountMoneySession from './components/sessions/AccountMoneySession.jsx';
import { createApiClient } from './utils/api.js';
import { useDraft } from './hooks/useDraft.js';

const ALL_METHODS = ['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO', 'ACCOUNT_MONEY'];

const DEFAULT_PAYER = { email: '', firstName: '', lastName: '', document: '' };
const DEFAULT_ADDRESS = { zipCode: '', streetName: '', streetNumber: '', neighborhood: '', city: '', federalUnit: '' };

/**
 * @param {object} props
 * @param {string} props.apiBaseUrl - backend do SEU projeto (nunca o payment-system-mp direto)
 * @param {string} props.publicKey - public key do Mercado Pago
 * @param {number} props.amount
 * @param {string} [props.description]
 * @param {string} [props.externalReference]
 * @param {string[]} [props.methods] - default: todos
 * @param {object} [props.payer]
 * @param {object[]} [props.savedCards]
 * @param {boolean} [props.allowSaveCard=true]
 * @param {(card: object) => void} [props.onSaveCardRequested]
 * @param {boolean} [props.persistDraft=true]
 * @param {string} [props.draftKey='pw-draft']
 * @param {(payment: object) => void} [props.onPaymentCreated]
 * @param {(payment: object) => void} [props.onPaymentApproved]
 * @param {(error: Error) => void} [props.onError]
 * @param {string} [props.accentColor]
 * @param {'dark'|'light'} [props.theme='dark']
 */
export default function PaymentWidget({
  apiBaseUrl,
  publicKey,
  amount,
  description,
  externalReference,
  methods = ALL_METHODS,
  payer: payerOverride,
  savedCards,
  allowSaveCard = true,
  onSaveCardRequested,
  persistDraft = true,
  draftKey = 'pw-draft',
  onPaymentCreated,
  onPaymentApproved,
  onError,
  accentColor,
  theme = 'dark',
}) {
  const apiClient = useMemo(() => createApiClient(apiBaseUrl), [apiBaseUrl]);
  const muiTheme = useMemo(() => createWidgetTheme(theme, accentColor), [theme, accentColor]);

  const [activeMethod, setActiveMethod] = useState(methods[0]);
  const [payer, setPayer] = useDraft(`${draftKey}:payer`, { ...DEFAULT_PAYER, ...payerOverride }, persistDraft);
  const [address, setAddress] = useDraft(`${draftKey}:address`, DEFAULT_ADDRESS, persistDraft);

  const [paymentsByMethod, setPaymentsByMethod] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitPayment = useCallback(
    async (extraFields) => {
      setSubmitting(true);
      setError(null);

      try {
        const body = {
          method: activeMethod,
          amount,
          description,
          externalReference,
          payerEmail: payer.email,
          payerFirstName: payer.firstName,
          payerLastName: payer.lastName,
          payerDocument: payer.document?.replace(/\D/g, ''),
          ...extraFields,
        };

        const { data } = await apiClient.createPayment(body);
        setPaymentsByMethod((prev) => ({ ...prev, [activeMethod]: data }));
        onPaymentCreated?.(data);
        if (data.status === 'APPROVED') onPaymentApproved?.(data);
      } catch (err) {
        setError(err.message);
        onError?.(err);
      } finally {
        setSubmitting(false);
      }
    },
    [activeMethod, amount, description, externalReference, payer, apiClient, onPaymentCreated, onPaymentApproved, onError],
  );

  const sharedProps = {
    payer,
    onPayerChange: setPayer,
    submitting,
    error,
    payment: paymentsByMethod[activeMethod] ?? null,
    apiClient,
    onApproved: onPaymentApproved,
    onSubmit: submitPayment,
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <MethodSelector methods={methods} active={activeMethod} onChange={setActiveMethod} />

        {activeMethod === 'PIX' && <PixSession {...sharedProps} />}

        {(activeMethod === 'CREDIT_CARD' || activeMethod === 'DEBIT_CARD') && (
          <CardSession
            {...sharedProps}
            publicKey={publicKey}
            isActive={activeMethod === 'CREDIT_CARD' || activeMethod === 'DEBIT_CARD'}
            savedCards={savedCards}
            allowSaveCard={allowSaveCard}
            onSaveCardRequested={onSaveCardRequested}
          />
        )}

        {activeMethod === 'BOLETO' && (
          <BoletoSession
            {...sharedProps}
            address={address}
            onAddressChange={setAddress}
            addressStorageKey={`${draftKey}:recent-addresses`}
          />
        )}

        {activeMethod === 'ACCOUNT_MONEY' && <AccountMoneySession {...sharedProps} />}
      </Paper>
    </ThemeProvider>
  );
}
