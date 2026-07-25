// ARQUIVO: src/hooks/useDraft.js
// ==========================================================
// Salva o progresso do formulário no localStorage, com debounce.
// Escopo do storage: cada draftKey é isolado - use uma chave
// diferente por contexto de checkout se precisar (ex: por pedido).
// ==========================================================

import { useState, useEffect, useRef, useCallback } from 'react';

const DEBOUNCE_MS = 400;

/**
 * @param {string} draftKey
 * @param {object} initialValue
 * @param {boolean} [enabled=true]
 */
export function useDraft(draftKey, initialValue, enabled = true) {
  const [value, setValue] = useState(() => {
    if (!enabled || typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(draftKey);
      return raw ? { ...initialValue, ...JSON.parse(raw) } : initialValue;
    } catch {
      return initialValue;
    }
  });

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(draftKey, JSON.stringify(value));
      } catch {
        // localStorage indisponível (modo anônimo estrito, cota cheia) - não é crítico
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutRef.current);
  }, [value, draftKey, enabled]);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      /* noop */
    }
    setValue(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  return [value, setValue, clearDraft];
}
