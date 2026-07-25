// ARQUIVO: src/hooks/useMercadoPagoSdk.js
import { useState, useEffect, useRef } from 'react';

function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.MercadoPago) return resolve(window.MercadoPago);

    const existing = document.querySelector('script[data-pw-mp-sdk]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.MercadoPago));
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar o SDK do Mercado Pago.')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.dataset.pwMpSdk = 'true';
    script.onload = () => resolve(window.MercadoPago);
    script.onerror = () => reject(new Error('Falha ao carregar o SDK do Mercado Pago.'));
    document.head.appendChild(script);
  });
}

/**
 * @param {string|null} publicKey
 * @param {boolean} shouldLoad - só carrega quando necessário (ex: aba de cartão ativa)
 */
export function useMercadoPagoSdk(publicKey, shouldLoad) {
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);
  const mpRef = useRef(null);

  useEffect(() => {
    if (!publicKey || !shouldLoad || mpRef.current) return;

    let cancelled = false;
    setStatus('loading');

    loadScript()
      .then((MercadoPago) => {
        if (cancelled) return;
        mpRef.current = new MercadoPago(publicKey, { locale: 'pt-BR' });
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [publicKey, shouldLoad]);

  return { mp: mpRef.current, status, error, isReady: status === 'ready' };
}
