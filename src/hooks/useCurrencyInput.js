// ARQUIVO: src/hooks/useCurrencyInput.js
import { useState, useCallback } from 'react';
import { formatCentsToCurrency, reduceCurrencyKeydown, centsFromPastedText, centsToAmount } from '../masks/currency.js';

/**
 * @param {object} [options]
 * @param {number} [options.initialAmount=0] - valor decimal inicial (ex: 25.00)
 * @param {string} [options.locale='pt-BR']
 * @param {string} [options.currency='BRL']
 */
export function useCurrencyInput({ initialAmount = 0, locale = 'pt-BR', currency = 'BRL' } = {}) {
  const [cents, setCents] = useState(() => Math.round(initialAmount * 100));

  const handleKeyDown = useCallback((event) => {
    const next = reduceCurrencyKeydown(event.key, cents);
    if (next === null) return; // deixa o navegador tratar (Tab, setas, etc.)
    event.preventDefault();
    setCents(next);
  }, [cents]);

  const handlePaste = useCallback((event) => {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    setCents(centsFromPastedText(pasted));
  }, []);

  const setAmount = useCallback((amount) => {
    setCents(Math.round((Number(amount) || 0) * 100));
  }, []);

  return {
    cents,
    amount: centsToAmount(cents),
    display: formatCentsToCurrency(cents, locale, currency),
    inputProps: {
      value: formatCentsToCurrency(cents, locale, currency),
      onKeyDown: handleKeyDown,
      onPaste: handlePaste,
      onChange: () => {}, // controlado só via onKeyDown/onPaste - evita edição direta do texto formatado
      inputMode: 'numeric',
    },
    setAmount,
  };
}
