// ARQUIVO: src/hooks/useRecentAddresses.js
// ==========================================================
// Sugestões de endereço a partir do HISTÓRICO LOCAL do navegador
// (localStorage) - funciona hoje, sem precisar de nenhum backend novo.
//
// Isso é DIFERENTE de "endereços salvos na conta do usuário" (que
// sincronizaria entre dispositivos) - para isso, o backend do
// payment-system-mp precisaria de um conceito de "cliente final" (não
// existe hoje, só existe o "Client" = o SaaS). Documentei essa
// limitação no README da biblioteca.
// ==========================================================

import { useState, useCallback } from 'react';

const MAX_RECENT = 5;

function readRecent(storageKey) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * @param {string} [storageKey='pw-recent-addresses']
 */
export function useRecentAddresses(storageKey = 'pw-recent-addresses') {
  const [recentAddresses, setRecentAddresses] = useState(() =>
    typeof window === 'undefined' ? [] : readRecent(storageKey),
  );

  const saveAddress = useCallback((address) => {
    setRecentAddresses((prev) => {
      const withoutDuplicate = prev.filter((a) => a.zipCode !== address.zipCode);
      const next = [address, ...withoutDuplicate].slice(0, MAX_RECENT);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, [storageKey]);

  return { recentAddresses, saveAddress };
}
