// ARQUIVO: src/index.js
// Ponto de entrada público da biblioteca.
export { default as PaymentWidget } from './PaymentWidget.jsx';
export { createWidgetTheme } from './theme.js';

// Exportado também pra quem quiser montar a própria UI usando só a lógica.
export * from './masks/currency.js';
export * from './masks/document.js';
export * from './masks/card.js';
export { useCurrencyInput } from './hooks/useCurrencyInput.js';
export { useDraft } from './hooks/useDraft.js';
export { useRecentAddresses } from './hooks/useRecentAddresses.js';
export { createApiClient } from './utils/api.js';
