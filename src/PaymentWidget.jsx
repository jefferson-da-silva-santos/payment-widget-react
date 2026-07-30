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
import { useCurrencyInput } from './hooks/useCurrencyInput.js';
import AmountHeader from './components/AmountHeader.jsx';
import './styles/payment-widget.css';

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
 * @param {(payment: object) => void} [props.onPaymentRejected] - status REJECTED ou CHARGED_BACK
 * @param {(payment: object) => void} [props.onPaymentCancelled] - status CANCELLED
 * @param {(payment: object) => void} [props.onStatusChange] - dispara em QUALQUER mudança de status (inclusive PENDING -> IN_PROCESS), inclusive na criação - use se os callbacks específicos não cobrirem seu caso
 * @param {(error: Error) => void} [props.onError]
 * @param {string} [props.accentColor]
 * @param {'dark'|'light'} [props.theme='dark']
 * @param {boolean} [props.allowAmountEdit=false] - se true, o valor exibido no topo vira editável (com a máscara de dinheiro)
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
  onPaymentRejected,
  onPaymentCancelled,
  onStatusChange,
  onError,
  accentColor,
  theme = 'dark',
  allowAmountEdit = false,
}) {
  const apiClient = useMemo(() => createApiClient(apiBaseUrl), [apiBaseUrl]);
  const muiTheme = useMemo(() => createWidgetTheme(theme, accentColor), [theme, accentColor]);
  const currency = useCurrencyInput({ initialAmount: amount });
  const effectiveAmount = allowAmountEdit ? currency.amount : amount;

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
          amount: effectiveAmount,
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
        onStatusChange?.(data);
        if (data.status === 'APPROVED') onPaymentApproved?.(data);
        if (data.status === 'REJECTED' || data.status === 'CHARGED_BACK') onPaymentRejected?.(data);
        if (data.status === 'CANCELLED') onPaymentCancelled?.(data);
      } catch (err) {
        setError(err.message);
        onError?.(err);
      } finally {
        setSubmitting(false);
      }
    },
    [
      activeMethod,
      effectiveAmount,
      description,
      externalReference,
      payer,
      apiClient,
      onPaymentCreated,
      onPaymentApproved,
      onPaymentRejected,
      onPaymentCancelled,
      onStatusChange,
      onError,
    ],
  );

  const sharedProps = {
    payer,
    onPayerChange: setPayer,
    submitting,
    error,
    payment: paymentsByMethod[activeMethod] ?? null,
    apiClient,
    onApproved: onPaymentApproved,
    onRejected: onPaymentRejected,
    onCancelled: onPaymentCancelled,
    onStatusChange,
    onSubmit: submitPayment,
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Paper
        className="pw-root"
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          '--pw-accent': muiTheme.palette.primary.main,
        }}
      >
        <AmountHeader
          display={currency.display}
          description={description}
          editable={allowAmountEdit}
          inputProps={currency.inputProps}
        />

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